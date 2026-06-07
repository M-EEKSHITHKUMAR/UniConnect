const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const path=require('path');
const connectDB=require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app=express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/uploads',express.static(path.join(__dirname,'uploads')));

app.use('/api/auth',require('./routes/authRoutes'));
app.use('/api/issues', require('./routes/issueRoutes'));
app.use('/api/clubs', require('./routes/clubRoutes'));
app.use('/api/alumni', require('./routes/alumniRoutes'));

app.get('/', (req, res) => res.json({ message: 'UniConnect API is running' }));

app.use(notFound);
app.use(errorHandler);

const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server running in port ${PORT}`));