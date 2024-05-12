import React, { useState } from "react";
import { Chart, registerables } from "chart.js/auto";
import { Pie } from "react-chartjs-2"



Chart.register(...registerables);

function InstructorChart({ courses }) {
  const [currChart, setCurrChart] = useState("students");

  // function to generate random color

  const getRandomColor = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const color = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(
        Math.random() * 256
      )},
        ${Math.floor(Math.random() * 256)})`;
      colors.push(color);
    }
    return colors;
  };
  // Data for the chart displaying student information
  const chartDataForStudents = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalStudentsEnrolled),
        backgroundColor: getRandomColor(courses.length),
      },
    ],
  };

  // Data for the chart displaying income information
  const chartIncomeData = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalAmountGenerated),
        backgroundColor: getRandomColor(courses.length),
      },
    ],
  };

  // Options for the chart
  const options = {
    maintainAspectRatio: false,
  };

  return (
    <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
      <p className="text-lg font-bold text-richblack-5">Visualize</p>
      <div className="space-x-4 font-semibold">
        {/* Button to switch to the "students" chart */}
        <button
          onClick={() => setCurrChart("students")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "students"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Students
        </button>
        {/* Button to switch to the "income" chart */}
        <button
          onClick={() => setCurrChart("income")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "income"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Income
        </button>
      </div>
      <div className="relative mx-auto aspect-square h-full w-full">
        {/* Render the Pie chart based on the selected chart */}
        <Pie
          data={
            currChart === "students" ? chartDataForStudents : chartIncomeData
          }
          options={options}
        />
      </div>
    </div>
  );
}

export default InstructorChart;


// background-color: #4158D0;
// background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
