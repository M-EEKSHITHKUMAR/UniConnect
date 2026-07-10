const { getRedis } = require("../config/redis");

const OTP_EXPIRY=10*60;
const RATE_LIMIT_WINDOW=60;//60sec
const RATE_LIMIT_MAX=3;//3 req max

const storeOtp=async( email, otp)=>{
    const redis= getRedis();
    const key= `otp:${email}`;
    await redis.setex(key, OTP_EXPIRY, otp);
};

const getOtp=async(email)=>{
    const redis=getRedis();
    const key=`otp:${email}`;
    return await redis.get(key);
}

const deleteOtp=async(email)=>{
    const redis=getRedis();
    const key=`otp:${email}`;
    await redis.del(key);
}

const markEmailVerified= async(email)=>{
    const redis=getRedis();
    const key=`verified:${email}`;
    await redis.setex(key, 15*60, 'true');
}
const isEmailVerified=async(email)=>{
    const redis=getRedis();
    const key=`verified:${email}`;
    const val=await redis.get(key);
    return val==='true';
}
const clearVerifiedStatus=async(email)=>{
    const redis=getRedis();
    await redis.del(`verified:${email}`);
}

const checkOtpRateLimit=async(email)=>{
    const redis=getRedis();
    const key=`otp_rate:${email}`;
    const count =await redis.incr(key);

    if(count==1){
        await redis.expire(key, RATE_LIMIT_WINDOW);
    }
    if(count>RATE_LIMIT_MAX){
        const ttl=await redis.ttl(key);
        throw new Error(`Too many OTP requests. Please wait ${ttl} seconds before trying again.`);

    }
    return count;
}

const cacheSet=async(key, data, expirySeconds=300)=>{
    const redis=getRedis();
    await redis.setex(`cache:${key}`, expirySeconds, JSON.stringify(data));
}
const cacheGet=async(key)=>{
    const redis=getRedis();
    const data=await redis.get(`cache:${key}`);
    return data?JSON.parse(data):null;
}
const cacheDelete=async(key)=>{
    const redis=getRedis();
    await redis.del(`cache:${key}`);
};

module.exports={
    storeOtp,
    getOtp,
    deleteOtp,
    markEmailVerified,
    isEmailVerified,
    clearVerifiedStatus,
    checkOtpRateLimit,
    cacheSet,
    cacheGet,
    cacheDelete
};