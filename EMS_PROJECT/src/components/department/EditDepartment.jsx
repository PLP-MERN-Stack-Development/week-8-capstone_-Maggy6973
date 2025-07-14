import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditDepartment = () => {
    const{id} = useParams()
    const[department, setDepartment] = useState([]);
    const[deploading, setDepLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
    const fetchDepartments = async() =>{
        setDepLoading(true);
      try{
        const response = await axios.get(`https://mern-stack-project-backend-psi.vercel.app/api/department/${id}`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        })
       
        if(response.data.success){
          setDepartment(response.data.department);
        }
      }catch(error){
         if(error.response && !error.response.data.success){
                alert(error.response.data.error);
              }
      }finally{
        setDepLoading(false);
      }
    }
       
    fetchDepartments();
   }, [])

   const handleChange = (e) => {
        const { name, value } = e.target;
        setDepartment({
            ...department,
            [name]: value
        });
    }

    const handleSubmit = async (e) => {
            e.preventDefault()
            try{
                 const response = await axios.put(`https://mern-stack-project-backend-psi.vercel.app/api/department/${id}`, department, {
                    headers:{
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                 });
                 if(response.data.success){
                    navigate('/admin-dashboard/departments');
                 }
            }catch(error){
                if(error.response && !error.response.data.success){
                    alert(error.response.data.error);
                }
            }
            
    }

  return (
    <>{deploading ? <div>Loading ...</div> :
    <div className='max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96'>
        <h2 className='text-2xl font-bold mb-6'>Edit Department</h2>
        <form onSubmit={handleSubmit} >
            <div>
                <label htmlFor="dep_name" className='text-sm font-medium text-gray-700'>Department Name</label>
                <input type="text" name='dep_name' onChange={handleChange} value={department.dep_name} placeholder='Department Name' className='mt-1 w-full p-2 border border-gray-300 rounded-md' required />
            </div>
            <div>
                <label htmlFor="description" className='block text-sm font-medium text-gray-700'>Description</label>
                <textarea name="description" placeholder='Description' onChange={handleChange} value={department.description} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' rows="4"></textarea>
            </div>
            <button type='submit' 
            className='w-full mt-6 bg-teal-600 text-white font-bold py-2 px-4 rounded hover:bg-teal-700'
            >Edit Department</button>
        </form>
      
    </div>
    }</>
  )
}

export default EditDepartment
