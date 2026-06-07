import axios from "axios";
const API=axios.create({
    baseURL:import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

API.interceptors.request.use((config)=>{
    const userInfo=localStorage.getItem('userInfo');
    if(userInfo){
        const { token }=JSON.parse(userInfo);
        if(token){
            config.headers.Authorization=`Bearer ${token}`;
        }
    }
    return config;
});

export default API;