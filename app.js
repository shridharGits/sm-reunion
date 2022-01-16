require("dotenv").config();
const express = require('express')
const app = express()
const path = require('path')
const pool = require('./connect')

const PORT = process.env.PORT || 3000;

// routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
app.use(express.json()) // req.body

app.use('/api', authRoutes);
app.use('/api', userRoutes);


// creating tables
app.get('/', (req, res)=>{
    try{
        res.json('welcome');
    }
    catch(e){
        res.status(400).json({
            error: e.message
        })
    }
})



app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})


