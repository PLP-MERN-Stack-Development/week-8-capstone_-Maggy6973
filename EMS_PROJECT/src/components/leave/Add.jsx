import React from 'react'
import { useState } from 'react'
import { useAuth } from '../../context/authContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Add = () => {
    const {user} = useAuth()
    
    const [leave, setLeave] = useState({
        userId: user._id,
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: ''

    })

    const navigate = useNavigate();

    const handleChange =(e) => {
        const {name, value} = e.target;
        setLeave((prevState) => ({...prevState, [name]: value}))
    }

 const handleSubmit = async (e) => {
    e.preventDefault()

    try{
        const response = await axios.post('https://mern-stack-project-backend-psi.vercel.app/api/leave/add', leave,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
       
        if(response.data.success){
          navigate(`/employee-dashboard/leaves/${user._id}`);
        } else {
        alert(response.data.error || 'Failed to add leave')
        }
      }catch(error){
          alert(error.response?.data?.error || 'Server error')
    }

 }

  return (
    <div className='max-w-4xl mx-auto mt-10 p-8 bg-white shadow-md rounded-md'>
      <h2 className='text-2xl font-bold mb-6'>Request for Leave </h2>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col space-y-4'>
          
          <div>
            <label className='block text-sm font-medium text-gray-700'> Leave Type </label>
            <select 
                name="leaveType" 
                onChange={handleChange}
                className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
                required 
                >
                  <option value="">Select Department</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Annual Leave">Annual Leave</option>
                </select>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* from date */}
            <div>
                <label className='block text-sm font-medium text-gray-700'>From Date</label>
                <input 
                type="date" 
                name='startDate' 
                onChange={handleChange}
                placeholder='Insert Email' 
                className='mt-1 p-2 block w-full border border-gray-300 rounded-md'
                required 
                />
            </div>
            {/*to date */}
            <div>
                <label className='block text-sm font-medium text-gray-700'>to Date</label>
                <input 
                type="date" 
                name='endDate' 
                onChange={handleChange}
                placeholder='Employee ID' 
                className='mt-1 p-2 block w-full border border-gray-3000 rounded-md'
                required 
                />
            </div>
         </div>

            {/* description */}
            <div>
                <label className='block text-sm font-medium text-gray-700'>Description</label>
                <textarea 
                    name='reason' 
                    placeholder="Reason" 
                    onChange={handleChange}
                    className='w-full border border-gray-300'
                /> 
            </div>
        </div>
        <button 
        type='submit'
        className='w-full mt-6 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 font-bold'
        >
            Add Leave
        </button>
      </form>
    </div>
  )
}

export default Add
