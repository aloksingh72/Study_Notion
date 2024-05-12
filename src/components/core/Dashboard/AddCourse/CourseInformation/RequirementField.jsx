import React, { useEffect, useState } from 'react'
import {useSelector} from "react-redux"
const RequirementField=({
name,
label,
register,
errors,
setValue,getValue
})=> {
  
  const { editCourse, course } = useSelector((state) => state.course)
  const [requirement,setRequirement]=useState("");
  const [requirementList,setRequirementList] = useState([]);

  useEffect(() => {
    if (editCourse) {
      setRequirementList(course?.instructions)
    }
    register(name, { required: true, validate: (value) => value.length > 0 })
    
  }, [])
useEffect(()=>{
  setValue(name, requirementList)

}, [requirementList])


  const handleAddRequirement =() =>{
    if(requirement){
      setRequirementList([...requirementList,requirement]);
      setRequirement("");
    }
  }
  const handleRemoveRequirement =(index)=>{
    const updateRequirementList = [...requirementList];
    updateRequirementList.splice(index,1)
    setRequirementList(updateRequirementList)

  }


  return (
    <div className="flex flex-col space-y-2">
      <label  className="text-sm text-richblack-5" htmlFor={name}>
      {label} <sup className="text-pink-200">*</sup>
      </label>
      <div className="flex flex-col items-start space-y-2">
      <input
          type="text"
          id={name}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          className="form-style w-full"
        />
         <button
          type="button"
          onClick={handleAddRequirement}
          className="font-semibold text-yellow-50"
        >
          Add
        </button>
      </div>
      {
        // agar length grater than zero hai tabhi render hoga
        requirementList.length>0 && (
          <ul className="mt-2 list-inside list-disc">
            {requirementList.map((requirement,index) =>(
              <li key={index} className="flex items-center text-richblack-5">
                <span>{requirement}</span>
                <button
                type='button'
                className="ml-2 text-xs text-pure-greys-300 "
                onClick={() => handleRemoveRequirement(index)}
                >
                  Clear
                </button>
              </li>
            ))}
          </ul>
        )
      }
       {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}



    </div>
  )
}

export default RequirementField