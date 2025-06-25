import React, { useContext } from "react"
import { AppContext } from "../../context/AppContext";

const MyEnrollments = () => {

  const { enrolledCourses, calculateCourseDuration } = useContext(AppContext);

  return (
    <>
      <div className='md:px-36 px-8 pt-10'>
        <h1 className='text-2xl font-semibold'>My Enrollments</h1>
        <table className='md:table-auto table-fixed w-full overflow-hidden border mt-10'>
          <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden'>
            <tr>
              <th className="px-4 py-3 font-semibold truncate">Course</th>
              <th className="px-4 py-3 font-semibold truncate">Duration</th>
              <th className="px-4 py-3 font-semibold truncate">Completed</th>
              <th className="px-4 py-3 font-semibold truncate">Status</th>
            </tr>
          </thead>
          <tbody className='text-gray-700'>
            {enrolledCourses.map((course, index) => (
              <tr key={index} className='border-b border-gray-500/20'>
                <td className='md:px-4 pl-2 md:pl-4 py-3 flx items-center space=x-3'>
                  <img src={course.courseThumbnail} alt="course thumbnail" className='w-14 sm:w-24 md:w-28' />
                  <div className='flex-1'>
                    <p className='mb-1 max-sm:text-sm'>{course.courseTitle}</p>
                  </div>
                </td>
                <td className='px-4 py-3 max-sm:hidden'>
                  {calculateCourseDuration(course)}
                </td>
                <td className='px-4 py-3 max-sm:hidden'>
                  4 /10 <span>Lectures</span>
                </td>
                <td className='px-4 py-3 max-sm:text-right'>
                  <button className='px-3 sm:px-5 py-1.5 sm:py-2 bg-blue-600 max-sm:txt-xs text-white rounded cursor-pointer'>On Going</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MyEnrollments;
