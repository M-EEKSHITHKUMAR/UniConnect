import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute=({children})=>{
    const { userInfo }=useSelector((state)=>state.auth);
    return userInfo?children:<Navigate to="/login" replace />

};

export default ProtectedRoute;