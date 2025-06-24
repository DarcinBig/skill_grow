import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";

const CourseDetails = () => {
  const { id } = useParams();

  const [courseData, setCourseData] = useState(null);

  const { allCourses } = useContext(AppContext);

  const fetchCourseDate = async () => {
    const findCourse = allCourses.find((course) => course._id === id);
    setCourseData(findCourse);
  };

  useEffect(() => {
    fetchCourseDate();
  }, []);

  return courseData ? (
    <>
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left">
        <div className="absolute top-0 left-0 w-full md:pt-125 pt-125 bg-gradient-to-b from-cyan-100/70"></div>
        {/* left column */}
        <div className='max-w-xl z-10 text-gray-500'>
          <h1 className='text-[1.625rem] md:text-[2.250rem] font-semibold text-gray-800'>{courseData.courseTitle}</h1>
          <p className='pt-4 md:text-base text-sm' dangerouslySetInnerHTML={{__html: courseData.courseDescription.slice(0,200)}}></p>

          {/* review and rating */}
          
        </div>
        {/* right column */}
        <div></div>
      </div>
    </>
  ) : <Loading />
};

export default CourseDetails;

// absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70
// absolute top-0 left-0 w-full md:pt-125 pt-20 px-7 md:px-0 space-y-7 bg-gradient-to-b from-cyan-100/70
// md:text-course-details-heading-large text-course-details-heading-small font-semibold text-gray-800
