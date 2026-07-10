const Redis=require('ioredis');

let redis;
const connectRedis=()=>{
    const redisUrl=process.env.REDIS_URL || 'redis://localhost:6379';

    redis=new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy(times){
            const delay=Math.min(times*500, 2000);
            return delay;
        },
        reconnectOnError(err){
            console.log('Redis reconnect on error:', err.message);
            return true;
        }
    });

    redis.on('connect',()=>{
        console.log('Redis Connected');
    })
    redis.on('error',(err)=>{
        console.error('Redis Error:', err.mesaage);
    })
    redis.on('reconnecting',()=>{
        console.log('Redis reconnecting..');
    })
    return redis;
};

const getRedis=()=>{
    if(!redis){
        throw new Error('Redis not initialized. Call connectRadius() first.');
    }
    return redis;
};

module.exports={connectRedis,getRedis};
