import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'


const View = () => {
   const[salaries, setSalaries] = useState([])
   const[filteredSalaries, setFilteredSalaries] = useState([])
   const {id} = useParams()
   console.log("Employee ID from URL:", id);
   let sno = 1;

   const fetchSalaries = async() =>{
    try{
        const response = await axios.get(`https://mern-stack-project-backend-psi.vercel.app/api/salary/${id}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
        });
        console.log(response.data);
        if(response.data.success){
            setSalaries(response.data.salary);
            setFilteredSalaries(response.data.salary);
        }
    }catch(error){
        setSalaries([]);
    setFilteredSalaries([]);
    }
   };

    useEffect(() => {
     fetchSalaries();
    }, []);

const filterSalaries = (e) => {
    const q = e.target.value;
    const filteredRecords = salaries.filter((leave) => {
        const empId = typeof leave.employeeId === "object"
            ? leave.employeeId.employeeId
            : leave.employeeId;
        return empId && empId.toLocaleLowerCase().includes(q.toLocaleLowerCase());
    });
    setFilteredSalaries(filteredRecords); 
}

  return (
    <>
    {filteredSalaries === null ? (
        <div>Loading ...</div>
    ) : (
        <div className='overflow-x-auto p-5'>
            <div className='text-center'>
               <h2 className='text-2xl font-bold'>Salary History</h2>
            </div>
            <div className='flex justify-end my-3'>
               <input 
                 type='text'
                 placeholder='Search by Emp ID'
                 className='border px-2 rounded-md py-0.5 border-gray-300'
                 onChange={filterSalaries}
                 />
            </div>

            { filteredSalaries.length > 0 ? (
            <table className='w-full text-sm text-left text-gray-500'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50 border border-gray-200'>
                    <tr >
                        <th className='px-6 py-3'>SNo</th>
                        <th className='px-6 py-3'>Emp ID</th>
                        <th className='px-6 py-3'>Salary</th>
                        <th className='px-6 py-3'>Allowance</th>
                        <th className='px-6 py-3'>Deduction</th>
                        <th className='px-6 py-3'>Total</th>
                        <th className='px-6 py-3'>Pay Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSalaries.map((salary) => (
                        <tr key={salary._id}
                        className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
                        >
                            <td className='px-6 py-2'>{sno++}</td>
                            <td className='px-6 py-2'>{salary.employeeId?.employeeId || salary.employeeId || ""}</td>
                            <td className='px-6 py-2'>
                                {salary.basicSalary}
                            </td>
                            <td className='px-6 py-2'>
                                {salary.allowances}
                            </td>
                            <td className='px-6 py-2'>{salary.deductions}</td>
                            <td className='px-6 py-2'>{salary.netSalary}</td>
                            <td className='px-6 py-2'>
                                {salary.payDate ? new Date(salary.payDate).toLocaleDateString() : ""}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            ): <div>No Records </div>}
        
        </div>
    )}
    </>
  )
}

export default View
