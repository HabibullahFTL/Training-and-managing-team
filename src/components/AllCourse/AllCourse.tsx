import React, { useContext, useEffect, useState } from "react";
import "./AllCourse.css";
import thumbnail from "../../Assets/images/course-thumbnail.png";
import Course from "../Course/Course";
import db from "../Firebase/Firebase";
import { UserDataContext } from "../../Contexts/UserDataContext";

const AllCourse = () => {
  const { userData } = useContext(UserDataContext);
  const [courses, setCourses] = useState([] as object[]);


  useEffect(() => {
    db.collection("courses")
    .where('co_id', '==', userData.co_id)
    .get()
    .then((data: any) => setCourses(data.docs.map((doc: any) => ({...doc.data(),id:doc.id}))))
    .catch((error) => {
        console.log("Error getting document:", error);
    });
}, [userData.co_id]);

console.log(courses);


  return (
    <section className="all-courses">
      <div className="w-full">
        <h2 className="text-2xl text-center font-bold my-4">All Courses</h2>
      </div>
      <div className="flex flex-wrap">
         {
           courses.map((course: any) => (<Course key={course.id} course={course} thumbnail={thumbnail} />))
         }  
      </div>
    </section>
  );
};

export default AllCourse;
