const pool = require('../connect')

exports.followUser = async(req,res)=>{
    try{
        const follower =  req.auth.user_id;
        const following =  req.params.user_id
        await pool.query(`UPDATE userDatabase SET followings = array_append(followings, $1) WHERE (user_id)=($2)`, [following, follower])
        await pool.query(`UPDATE userDatabase SET followers = array_append(followers, $1) WHERE (user_id)=($2)`, [follower, following])
        // const update = await pool.query('SELECT * FROM userDatabase WHERE (user_id) = ($1)', [req.auth.user_id])
        // console.log(update.rows[0]);

        res.status(200).json({
            message: 'User followed'
        })
    }
    catch(e){
        res.json({
            error: e.message
        })
    }
}


exports.unfollowUser = async (req, res)=>{
    try{
        const unfollower = req.auth.user_id
        const unfollowing = req.params.user_id
        await pool.query('UPDATE userDatabase SET followings = array_remove(followings, $1) WHERE (user_id) = ($2)', [unfollowing, unfollower])
        await pool.query('UPDATE userDatabase SET followers = array_remove(followers, $1) WHERE (user_id) = ($2)', [unfollower, unfollowing])

        res.json({
            message: 'unfollowed user'
        })
    }
    catch(e){
        res.json({
            error: e.message
        })
    }
}

exports.getUser = async (req, res)=>{
    try{
        const user_id = req.auth.user_id
        const user = await pool.query('SELECT * FROM userDatabase WHERE (user_id)=($1)', [user_id])
        // console.log(user.rows[0]);
        res.status(200).json({
            username: user.rows[0].username,
            followers: user.rows[0].followers ? user.rows[0].followers.length : 0,
            followings: user.rows[0].followings.length,
        })
    }
    catch(e){
        res.json({
            error: e.message
        })
    }
}

exports.createPost = async(req, res)=>{
    try{
        const {title, description} = req.body
        const user_id = req.auth.user_id

        const post = await pool.query('INSERT INTO postDatabase (title, description, user_id) VALUES ($1,$2,$3) RETURNING *', [title, description,user_id])
        const post_id= post.rows[0].post_id
        await pool.query('UPDATE userDatabase SET posts = array_append(posts, $1) WHERE (user_id)=($2)', [post_id, user_id])
        return res.json({
            post_id: post.rows[0].post_id,
            title: post.rows[0].title,
            description: post.rows[0].description,
            createdAt: post.rows[0].timestamp
        })
    }
    catch(e){
        res.json({
            error: e.message
        })
    }
}

exports.deletePost = async (req, res)=>{
    try{
        const post_id = req.params.post_id
        const user_id = req.auth.user_id

        await pool.query('UPDATE userDatabase SET posts = array_remove(posts, $1) WHERE (user_id)=($2)', [post_id, user_id])
        await pool.query('DELETE FROM postDatabase WHERE (post_id)=($1)', [post_id])

        res.status(200).json({
            message: 'Post deleted'
        })
    }
    catch(e){
        res.json({
            error: e.message
        })
    }
}

exports.likePost = async (req, res)=>{
    try{
        const user_id = req.auth.user_id
        const post_id = req.params.post_id

        await pool.query('UPDATE postDatabase SET likes = array_append(likes, $1) WHERE (post_id)= ($2)', [user_id, post_id])
        return res.json({
            message: 'Post liked'
        })
    }
    catch(e){
        res.json({
            error: e.message
        })
    }
}

exports.unlikePost = async (req, res)=>{
    try{
        const user_id = req.auth.user_id
        const post_id = req.params.post_id

        await pool.query('UPDATE postDatabase SET likes = array_remove(likes, $1) WHERE (post_id)= ($2)', [user_id, post_id])
        return res.json({
            message: 'Post Unliked'
        })
    }
    catch(e){
        res.json({
            error: e.message
        })
    }
}


// add a comment
exports.commentPost = async(req, res)=>{
    try{
        const user_id = req.auth.user_id
        const post_id = req.params.post_id
        const {comment} = req.body

        // added comment in commentDatabase
        const commentRecord = await pool.query('INSERT INTO commentDatabase (comment, post_id, user_id) VALUES ($1,$2,$3) RETURNING *', [comment, post_id, user_id])
        const comment_id = commentRecord.rows[0].comment_id

        // added comment_id in postDatabase
        await pool.query('UPDATE postDatabase SET comments = array_append(comments, $1) WHERE (post_id)= ($2)', [comment, post_id]) 
        res.status(200).json({
            comment: commentRecord.rows[0].comment,
            comment_id: commentRecord.rows[0].comment_id,
        })

    }
    catch(e){
        res.json({
            error: e.message
        })
    }
}

// get a post
exports.getPost = async (req, res)=>{
    try{
        const post_id = req.params.post_id;

        const post = await pool.query('SELECT * FROM postDatabase WHERE (post_id)=($1)', [post_id])
        res.status(200).json({
            post_id: post.rows[0].post_id,
            likes: post.rows[0].likes ? post.rows[0].likes.length : 0,
            comments: post.rows[0].comments ? post.rows[0].comments.length : 0,
        })
    }
    catch(e){
        res.json({
            error: e.message
        })
    }
}

exports.getAllPosts = async(req, res)=>{
    try{
        const user_id = req.auth.user_id
    
    const posts = await pool.query('SELECT * FROM postDatabase WHERE (user_id)=($1)', [user_id])
    
    // const array = {post_id, title, description, timestamp, comments, likes}
    // console.log(posts.rows[0].post_id);
    const result = []
    for(let i = 0; i<posts.rows.length; i++){
        let post_id;
        let title;
        let description;
        let timestamp;
        let comments;
        let likes;
        let array = {post_id, title, description, timestamp, comments, likes}
        array.title = posts.rows[i].title
        array.description = posts.rows[i].description
        array.timestamp = posts.rows[i].timestamp
        array.comments = posts.rows[i].comments
        array.likes = posts.rows[i].likes ? posts.rows[i].likes.length : 0

        result.push(array);
    }
        return res.status(200).json(result)
    }
    catch(e){
        res.json({
            error: e.message
        })
    }
}