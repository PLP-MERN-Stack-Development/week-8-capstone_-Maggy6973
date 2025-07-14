import React, { useEffect, useState } from 'react'
import axios from 'axios'
import DataTable from 'react-data-table-component'
import { columns } from '../../utils/LeaveHelper'
import { LeaveButtons } from '../../utils/LeaveHelper'


const Table = () => {
    const [leaves, setLeaves] = useState([])
    const [filteredLeaves, setFilteredLeaves] = useState([])

    const fetchLeaves = async () => {
  try {
    const response = await axios.get('https://mern-stack-project-backend-psi.vercel.app/api/leave', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    console.log("LEAVES RESPONSE:", response.data);
    if (response.data.success) {
      let sno = 1;
      const data = response.data.leaves.map((leave) => ({
        _id: leave._id,
        sno: sno++,
        employeeId: leave.employeeId?.employeeId || 'N/A',
        name: leave.employeeId?.userId?.name || 'Unknown',
        leaveType: leave.leaveType || 'Unspecified',
        department: leave.employeeId?.department?.dep_name || 'None',
        days:
          (new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24) + 1,
        status: leave.status || 'Pending',
        action: (<LeaveButtons _id={leave._id} />)
      }));
      setLeaves(data); 
      setFilteredLeaves(data);
    }
  } catch (error) {
    if(error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
  }
};
    useEffect(() => {
      fetchLeaves();
    }, [])

const filterByInput = (e) => {
  const data = leaves.filter(leave => leave.employeeId
  .toLowerCase()
  .includes(e.target.value.toLowerCase())
);
    setFilteredLeaves(data);
}

const filterByButton = (status) => {
  const data = leaves.filter(leave => leave.status
  .toLowerCase()
  .includes(status.toLowerCase())
);
    setFilteredLeaves(data);
}
    
  return (
    <>
    {filteredLeaves ? (
    <div className='p-6'>
     <div className='text-center'>
        <h3 className='text-2xl font-bold'>Manage Leaves</h3>
      </div>
      <div className='flex justify-between items-center '>
        <input type="text" placeholder="Search by Emp Id" className='px-4 py-0.5 border' onChange={filterByInput}  />
        <div className='space-x-3'>
        <button className='px-2 py-1 bg-teal-600 text-white hover:bg-teal-700'
        onClick={() => filterByButton('Pending')}
        >Pending</button>
        <button className='px-2 py-1 bg-teal-600 text-white hover:bg-teal-700'
         onClick={() => filterByButton('Approved')}
        >Approved</button>
        <button className='px-2 py-1 bg-teal-600 text-white hover:bg-teal-700'
         onClick={() => filterByButton('Rejected')}
        >Rejected</button>
        </div>
      </div>

     <div className='mt-3'>
      <DataTable
        columns={columns}
        data={filteredLeaves}
        pagination
      />
      </div>
    </div>
    ) : <div>Loading...</div>}
    </>
  )
}

export default Table
