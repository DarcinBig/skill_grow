import React, { createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { dummyCourses } from "../assets/assets"
import humanizeDuration from 'humanize-duration'
import { useAuth, useUser } from '@clerk/clerk-react'

export const AppContext = createContext()

export const AppContextProvider = (props) => {
  
  const currency = import.meta.env.VITE_CURRENCY
  const navigate = useNavigate()

  const {getToken} = useAuth()
  const {user} = useUser()

  const [allCourses, setAllCourses] = useState([])
  const [isEducator, setIsEducator] = useState(true)
  const [enrolledCourses, setEnrolledCourses] = useState([])

  // Fetch all courses
  const fetchAllCourses = async () => {
    setAllCourses(dummyCourses)
  }

  // Function to calculate average rating of course
  const calculateRating = (course) => {
    if(course.courseRatings.length === 0) return 0
    let totalRating = 0
    course.courseRatings.forEach(rating => {
      totalRating += rating.rating
    }) 
    return (totalRating / course.courseRatings.length)
  }

  // Function to calculate course chapter time
  const calculateChapterTime = (chapter) => {
    let time = 0
    chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)
    return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] })
  }

  // Function to calculate course duration
  const calculateCourseDuration =(course) => {
    let time = 0
    course.courseContent.map((chapter) => chapter.chapterContent.map((lecture) => time += lecture.lectureDuration))
    return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] })
  }

  // Function to calculate number of lectures in the course
  const calculateNumberOfLectures = (course) => {
    let totalLectures = 0
    course.courseContent.forEach(chapter => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length
      }
    })
    return totalLectures
  }

  // Fetch user enrolled courses
    const fetUserEnrolledCourses = async () => {
      setEnrolledCourses(dummyCourses)
    }

  useEffect(() => {
    fetchAllCourses()
    fetUserEnrolledCourses()
  }, []) 

  const logToken = async () => {
    console.log(await getToken())
  } 

  useEffect(() => {
    if (user) {
      logToken()
    }
  }, [user])

  const value = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNumberOfLectures,
    enrolledCourses,
    fetUserEnrolledCourses
  }

  return (
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
  );
};
