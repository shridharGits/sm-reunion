require("dotenv").config();
const express = require('express')
const app = express()

const pool = require('./connect')
const PORT = process.env.PORT || 3000;

// routes
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
app.use(express.json()) // req.body

app.use('/api', authRoutes);
app.use('/api', userRoutes);


// creating tables
app.post('/', async(req, res)=>{
    try{
        await pool.query(`CREATE TABLE IF NOT EXISTS userDatabase(
            user_id uuid DEFAULT uuid_generate_v4(),
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(200) UNIQUE NOT NULL,
            password VARCHAR(50) NOT NULL,
            posts TEXT [],
            followers TEXT [],
            followings TEXT [],
            timestamp timestamp default current_timestamp,
            token VARCHAR (255),
            PRIMARY KEY (user_id)
            );`)

        await pool.query(`CREATE TABLE IF NOT EXISTS postDatabase(
            post_id uuid DEFAULT uuid_generate_v4(),
            user_id uuid,
            title VARCHAR(50) UNIQUE NOT NULL,
            description VARCHAR(255) NOT NULL,
            likes TEXT[],
            comments TEXT[],
            timestamp timestamp default current_timestamp,
            FOREIGN KEY (user_id) REFERENCES userDatabase (user_id),
            PRIMARY KEY (post_id)
            );`)


        await pool.query(`CREATE TABLE IF NOT EXISTS postDatabase(
            post_id uuid DEFAULT uuid_generate_v4(),
            user_id uuid,
            title VARCHAR(50) UNIQUE NOT NULL,
            description VARCHAR(255) NOT NULL,
            likes TEXT[],
            comments TEXT[],
            timestamp timestamp default current_timestamp,
            FOREIGN KEY (user_id) REFERENCES userDatabase (user_id),
            PRIMARY KEY (post_id)
            );`)

            res.json({
                message: 'Created all tables'
            })
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


