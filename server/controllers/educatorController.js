import { clerkClient } from '@clerk/express'
import Course from '../models/Course.js'
import User from '../models/User.js'
import { v2 as cloudinary } from 'cloudinary'
import { Purchase } from '../models/Purchase.js'

// Update role to educator
export const updateRoleToEducator = async (req, res) => {
    try {
        const {userId} = req.auth()
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            }
        })
        res.json({success: true, message: 'You can publish a course now'})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// Add new course
export const addCourse = async (req, res) => {
    try {
        const {courseData} = req.body
        const imageFile = req.file
        const {userId: educatorId} = req.auth()

        if (!imageFile) {
            return res.json({success: false, message: 'Thumbnail not attached'})
        }    
        const parsedCourseData = typeof courseData === 'string' ? await JSON.parse(courseData) : courseData
        parsedCourseData.educator = educatorId
        const newCourse = await Course.create(parsedCourseData)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail = imageUpload.secure_url
        await newCourse.save()

        res.json({success: true, message: 'Course added'})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// Get educator courses
export const getEducatorCourse = async (req, res) => {
    try {
        const {userId: educator} = req.auth()
        const courses = await Course.find({educator})
        res.json({success: true, courses})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// Get educator dashboard data (Total earning, enrolled students, No. of courses)
export const educatorDashboardData = async (req, res) => {
    try {
        const {userId: educator} = req.auth()
        const courses = await Course.find({educator})
        const totalCourses = courses.length

        const courseIds = courses.map(course => course._id)

        // Calculate total earnings from purchases
        const purchases = await Purchase.find({
            courseId: {$in: courseIds},
            status: 'completed'
        })
        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0)

        // Collect unique enrolled student IDs with their course titles
        const enrolledStudentsData = []
        for (const course of courses) {
            const students = await User.find({
                _id: {$in: course.enrolledStudents}
            }, 'name imageUrl')
            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                })
            })
        }
        res.json({success: true, dashboardData: {
            totalEarnings, enrolledStudentsData, totalCourses
        }})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

// Get enrolled students data with purchase data
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const {userId: educator} = req.auth()
        const courses = await Course.find({educator})
        const courseIds = courses.map(course => course._id)

        const purchases = await Purchase.find({
            courseId: {$in: courseIds},
            status: 'completed'
        })
        // .populate('userId', 'name', 'imageUrl').populate('courseId', 'courseTitle')
        const enrolledStudents = []

        for (const purchase of purchases) {
            const student = await User.findById(purchase.userId, 'name imageUrl')
            const course = await Course.findById(purchase.courseId, 'courseTitle')

            if (student && course) {
                enrolledStudents.push({
                    student,
                    courseTitle: course.courseTitle,
                    purchaseDate: purchase.createdAt
                })
            }
        }

        /**const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        })) */
        res.json({success: true, enrolledStudents})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}



