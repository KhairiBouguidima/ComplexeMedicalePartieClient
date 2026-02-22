import { useNavigate, Outlet } from 'react-router-dom';

const ProtectRoute = () => {
    const token = localStorage.getItem('token'); // Or however you store your auth
    console.log(token)
    const navigate = useNavigate()
    // If no token, redirect to login
    if (!token){
        return navigate("/Login")
    }
    // If token exists, render the "Outlet" (the child routes)
    if (token){
        return navigate(<Outlet/>)
    }
};

export default ProtectRoute;