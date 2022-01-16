if(process.env.NODE_ENV !== 'production'){
    require("dotenv").config();
}
const pool = require('../connect')
const { uuidv4 } = require('uuid')

// const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')   // for protecting routes

exports.signup = async(req, res)=>{
    try{
        const {username, email, password} = req.body
        const user = await pool.query('INSERT INTO userDatabase (username, email, password) VALUES ($1,$2,$3) RETURNING *', [username, email, password])
        res.json(user)
    }
    catch(e){
        res.json({
            error: e.message
        })
    }
}

exports.signin = async(req, res)=>{
    try{
        const {email, password} = req.body
        const user = await pool.query('SELECT * FROM userDatabase WHERE (email) LIKE ($1)', [email]);

        if(!user){
            return res.status(400).json({
                error: 'No user Found'
            })
        }
        if(user && password !== user.rows[0].password){
            return res.status(422).json({
                error: 'Invalid Email or Password'
            })
        }

        const token = jwt.sign({user_id: user.rows[0].user_id}, process.env.SECRET)
        
        res.cookie('token', token, {expire: new Date() + 9999});

        // send response to front end
        const {username, user_id} = user.rows[0];
        await pool.query('UPDATE userDatabase SET token = ($1) WHERE (user_id)=($2)', [token, user_id])
        // console.log(q);
        user.rows[0].username = undefined;
        user.rows[0].email = undefined;
        user.rows[0].password = undefined;
        user.rows[0].username = undefined;
        
        return res.json({token, user:{user_id, username, email}})
    }
    catch(e){
        res.json({
            error: e.message
        })
    }
}

exports.isSignedIn = expressJwt({
    secret : process.env.SECRET,
    userProperty: "auth",
    algorithms: ['HS256']
});


