import React, {useState, createContext, useContext, useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const userContext = createContext()

const AuthContext = ({children}) => {
    const[user, setUser] = useState(null);
    const[loading, setLoading] = useState(true);

    const navigate = useNavigate();
    
    useEffect(() => {
        const verifyUser = async () =>{
            try{
                const token = localStorage.getItem('token')
                if(token) {
                const response = await axios.get('https://mern-stack-project-backend-psi.vercel.app/api/auth/verify',{
                    headers: {
                        "Authorization" : `Bearer ${token}`
                    }

                })
                console.log(response)
                if(response.data.success) {
                    setUser(response.data.user);
                } 
                }else {
                    navigate('/login');
                    setLoading(false);
                }

            } catch(error){
                console.log(error);
                if(error.response && !error.response.data.error) {
                    navigate('/login');
                }
            }finally {
                setLoading(false);
            }
        }
        verifyUser();
    }, []);

    const login = (user) => {
        setUser(user)
    }
    const logout = () => {
        setUser(null)
        localStorage.removeItem('token');
    }
  return (
    <userContext.Provider value={{user, login, logout, loading}}>
      {children}
    </userContext.Provider>
  )
}

export const useAuth = () => useContext(userContext)
export default AuthContext

