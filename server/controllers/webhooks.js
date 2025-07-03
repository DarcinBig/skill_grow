import { Webhook } from "svix";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import mongoose from "mongoose";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// Clerk Webhooks
export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };
        await User.create(userData);
        break;
      }
      case "user.updated": {
        const userData = {
          email: data.email_address[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        break;
      }
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        break;
      }
      default:
        break;
    }

    res.status(200).json({});
  } catch (error) {
    console.error("Clerk Webhook Error:", error);
    res.status(200).json({ received: true }); // Évite les retries même en cas d’erreur
  }
};

/** ================================================================================ */

// DEBUGGING

// Issue: Duplicate registrations for the same course

/** Cause:
 * 
 * When the webhook fails with a 500 error, Stripe, by design, retries to send
 * it several times. If the code manages to enroll the student in a course but
 * crashes before sending a 200 OK response, Stripe's next attempt will re-execute
 * the same logic, creating a duplicate. The idempotency checks 
 * (if (!courseData.enrolledStudents.includes(...)) were fine, but they didn't
 * protect against a crash in the middle of the operation.
 * 
 *
 */

// Solution: Usage of database transactions. A transaction ensures
// that all operations (update user, price and purchase) succeed together,
// or fail together (atomicity). If a single operation fails, all previous
// modifications are cancelled.

/** ================================================================================ */

// Stripe Webhooks
export const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  const session = await mongoose.startSession()

  try {
    event = Stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Stripe webhook signature error:", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        await session.withTransaction(async () => {
          const paymentIntent = event.data.object;
          const sessionList = await stripeInstance.checkout.sessions.list({
            payment_intent: paymentIntent.id,
          })

          const stripeSession = sessionList?.data?.[0];
          const purchaseId = stripeSession?.metadata?.purchaseId
          
          if (!purchaseId) throw new Error("Missing purchaseId in session metadata");

          const purchaseData = await Purchase.findById(purchaseId).session(session)
          if (!purchaseData) throw new Error("Purchase not found")

          if (purchaseData.status === 'completed') {
            console.log('Purchase already completed. Skipping.')
            return
          }

          const userData = await User.findById(purchaseData.userId).session(session)
          const courseData = await Course.findById(purchaseData.courseId).session(session)
          if (!userData || !courseData) throw new Error("User or course not found")

          const userIdStr = userData._id.toString()
          const courseIdStr = courseData._id.toString()

          if (!courseData.enrolledStudents.map(id => id.toString()).includes(userIdStr)) {
            courseData.enrolledStudents.push(userData._id)
          }

          if (!userData.enrolledCourses.map(id => id.toString()).includes(courseIdStr)) {
            userData.enrolledCourses.push(courseData._id)
          }

          purchaseData.status = "completed";
          
          await courseData.save({session})
          await userData.save({session})
          await purchaseData.save({session})
        })
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const sessionList = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });

        const session = sessionList?.data?.[0];
        const purchaseId = session?.metadata?.purchaseId;

        if (purchaseId) {
          const purchaseData = await Purchase.findById(purchaseId);
          if (purchaseData) {
            purchaseData.status = "failed";
            await purchaseData.save();
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Stripe Webhook Processing Error:", error);
    res.status(500).json({ error: error.message }); // Ne pas échouer pour éviter les retries
  }
};