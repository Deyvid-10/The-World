import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import cookieParser from "cookie-parser";

import { commentValidation, loginValidation, signupValidation } from '../util/zodValidation.js';


export class Controller{
    constructor({ Model }){
        this.Model = Model
    }

    insertPost = async (req, res)=>{

        const token = req.cookies.tokenSocialSesion;

        if(!token){
            return res.send(false)
        }

        const {users_id: id} = jwt.verify(token, process.env.JWT_SECRET)
        
        let postData = []

        let file = null

        if(req.file){
            file =  `/img/posts/${req.file.filename}`           
        }
        
        postData.push(req.body.thought)
        postData.push(new Date())
        postData.push(file)
        postData.push(id)
        await this.Model.insertPost(postData)

        return res.json({message: "Poted successful"})
    }

    getMuchUsers = async (req, res) =>{

        const paramId = req.params.userId
        
        const token = req.cookies.tokenSocialSesion;
        
        if(!token){
            return res.send(false)
        }

        const {users_id: id} = jwt.verify(token, process.env.JWT_SECRET)
        
        let users = []
        
        if(req.query.search || req.query.search === ''){users = await this.Model.getMuchUsers(req.query.search, id)}
        else if(req.query.suggestion = "true") {users = await this.Model.getSuggestionsUsers(id)}
        
        if(users.length === 0){
            return res.send(false)
        }
        
        return res.json(users)
    }

    getUserProfile = async (req, res) =>{
        let userId
        const paramId = req.params.userId

        const token = req.cookies.tokenSocialSesion;

        if(!token){
            return res.send(false)
        }

        const {users_id: id} = jwt.verify(token, process.env.JWT_SECRET)

        if(paramId !== 'you'){
            userId = paramId
        }
        else{
            userId = id
        }

        const userData = await this.Model.getUserProfile(userId, id)
        const {userProfile, posts, postsQuantity, userFollowers, followersQuantity, userFollowed, followedsQuantity, isFollowed} = userData
        
        
        const {users_id, users_img, users_name, users_last_name, users_bio} = userProfile[0]
        let users_posts = []
        
        if(userProfile[0].posts_description !== null){
            users_posts = [...posts]
        }
        let followed = false

        if(isFollowed.length !== 0){
            followed = true
        }
        
        
        const newProfileUser = [{users_id, users_img, users_name, users_last_name, users_bio, followed,
                ...postsQuantity[0], users_posts, 
                ...followersQuantity[0], users_followers: userFollowers,
                ...followedsQuantity[0], users_followed: userFollowed,}] 
        
        return res.json(newProfileUser)
    }

    followUser = async (req, res) => {

        const token = req.cookies.tokenSocialSesion;
        
        
        if(!token){
            return res.send(false)
        }

        const {users_id: id} = jwt.verify(token, process.env.JWT_SECRET)

        const item = req.body
                        
        await this.Model.followUser(item.user, id)

        return res.send({message: "Your follow this user now"})
    }

    unfollowUser = async (req, res) => {

        const token = req.cookies.tokenSocialSesion;
        
        if(!token){
            return res.send(false)
        }

        const {users_id: id} = jwt.verify(token, process.env.JWT_SECRET)

        const item = req.body
        
        await this.Model.unfollowUser(item.user, id)

        return res.send({message: "Your unfollow this user now"})
    }

    like = async (req, res) => {

        const token = req.cookies.tokenSocialSesion;
        
        
        if(!token){
            return res.send(false)
        }

        const {users_id: id} = jwt.verify(token, process.env.JWT_SECRET)

        const postId = req.body.postId
        console.log(postId);
                    
        await this.Model.like(postId, id)

        return res.send({message: "You like this post now"})
    }

    disLike = async (req, res) => {

        const token = req.cookies.tokenSocialSesion;
        
        if(!token){
            return res.send(false)
        }

        const {users_id: id} = jwt.verify(token, process.env.JWT_SECRET)

        const postId = req.body.postId
        console.log(postId);          
        await this.Model.disLike(postId, id)

        return res.send({message: "You dislike this post now"})
    }

    viewMessages = async (req, res) => {

        const token = req.cookies.tokenSocialSesion;
        
        if(!token){
            return res.send(false)
        }
        
        
        const {users_id: id} = jwt.verify(token, process.env.JWT_SECRET)

        const user = req.body.user
                        
        await this.Model.viewMessages(id, user)

        return res.send({message: "Succesful"})
    }

    getPosts = async (req, res) =>{
        const token = req.cookies.tokenSocialSesion;
        
        if(!token){
            return res.send(false)
        }

        const {users_id: id} = jwt.verify(token, process.env.JWT_SECRET)
        
        const posts = await this.Model.getPosts(id)

        return res.json(posts)
    }
    
    logIn = async (req, res) => {
        
        const valitation = loginValidation(req.body)
        
        if(!valitation.success)
        {
            const listOfErrors = valitation.error.format()
            const errorsArray = Object.values(listOfErrors)
            .flatMap((err)=> err?._errors || [])
            
            return res.json({errors: true, errorsList: errorsArray})
        } 

        
        
        
        // For compare the password with the password saved
        const [credentials] = await this.Model.getLoginCredentials(req.body.email)
      
        if(!credentials){
            return res.json(({errors: true, errorsList: ['This email does not exist']})) 
        }
        
        
        async function verify(password, hashPassword) {
            const compare = await bcrypt.compare(password, hashPassword);
            
            return compare;
        }        

        const compare = await verify(req.body.password, credentials.users_password)
        
        if(!compare){
            return res.json(({errors: true, errorsList: ['Password incorrect']}))
        }       

        const token = jwt.sign({users_id: credentials.users_id}, process.env.JWT_SECRET, {expiresIn: '1h'})
         console.log(token);
        return res.cookie("tokenSocialSesion", token, {
            httpOnly: true, 
            secure: true,   
            maxAge: 1000 * 60 * 60,
            sameSite: "none"
        }).json({correct: "logged"})
    }

    signUp = async (req, res) => {
        const data = req.body

        let file = '/img/profiles/default_profile_photo.webp'
        
        if(req.file){
            file =  `/img/profiles/${req.file.filename}`           
        }
        
        const valitation = signupValidation(data)
        
        if(!valitation.success)
        {
            const listOfErrors = valitation.error.format()
            const errorsArray = Object.values(listOfErrors)
            .flatMap((err)=> err?._errors || [])

            return res.json({errors: true, errorsList: errorsArray})
        }  

        const [emaillValidation] = await this.Model.getLoginCredentials(req.body.email)
        
        if(emaillValidation){
            return res.json(({errors: true, errorsList: ['This email already exist']}))
        } 
        

        // For hash the password
        async function hashPassword(password) {
            const hashed = await bcrypt.hash(password, 10);
            
            return hashed;
        }

        const hashedPassword = await hashPassword(req.body.password)
        
        
        data.password = hashedPassword
        
        const data2 = {...data, file}

        delete data2['conf-password']

        await this.Model.insertSignupCredentials(data2)  
        
        const [{users_id}] = await this.Model.getLoginCredentials(req.body.email)
        
        const token = jwt.sign({users_id}, process.env.JWT_SECRET, {expiresIn: '1h'})
       
        
        return res.cookie("tokenSocialSesion", token, {
            httpOnly: true, 
            secure: true,   
            maxAge: 1000 * 60 * 60,
            sameSite: "none"
        }).json({correct: "signedup"})
    }

    editProfile = async (req, res) => {

        const token = req.cookies.tokenSocialSesion
        
        let file = '/img/profiles/default_profile_photo.webp'
        
        if(req.file){
            file =  `/img/profiles/${req.file.filename}`           
        }

        if(!token){
            return res.send({error: "You are not logged"})
        }

        const {users_id: id} = jwt.verify(token, process.env.JWT_SECRET)

        const data = req.body
        
        const valitation = signupValidation(data)

        if(!valitation.success)
        {
            const listOfErrors = valitation.error.format()
            const errorsArray = Object.values(listOfErrors)
            .flatMap((err)=> err?._errors || [])
          
            
            return res.json({errors: true, errorsList: errorsArray})
        }  

        const [emaillValidation] = await this.Model.getLoginCredentials(req.body.email)
        
        if(emaillValidation && id !== emaillValidation.users_id){
            return res.json(({errors: true, errorsList: ['This email already exist']}))
        } 

        // For hash the password
        async function hashPassword(password) {
            const hashed = await bcrypt.hash(password, 10);
            
            return hashed;
        }

        const hashedPassword = await hashPassword(req.body.password)

        data.password = hashedPassword
        
        const data2 = {...data, file}
        data2.users_id = id

        delete data2['conf-password']
        
        await this.Model.editProfile(data2)  
        
        return res.json({message: "Edited correctly"})
    }


    getUserInfo = async (req, res) => {

        const token = req.cookies.tokenSocialSesion;
        console.log(token);
        
        if(token === undefined){
            return res.send(false)
        }

        const {users_id: id} = jwt.verify(token, process.env.JWT_SECRET)
        
        

        const userData = await this.Model.getUserData(id)
        const {users_img, users_name, users_last_name, users_email, users_bio} = userData[0]
    
        return res.json([{users_img, users_name, users_last_name, users_email, users_bio}])
    
        
    }

    getMessages = async (req, res) => {
        const receiverId = Number(req.params.receiverId)    
        try {
            const token  = req.cookies.tokenSocialSesion; 
            if(!token){
                return res.send({error: "You are not logged"})
            }
        
            const {users_id: userTransmitter} = jwt.verify(token, process.env.JWT_SECRET)
        
            const messages = await this.Model.getMessages(userTransmitter, receiverId)  
            
            return res.json(messages);
        
        
        } catch (err) {
            console.log(err);
            
            res.status(500).json({ error: err.message });
        }
    };
    
    getUserMessages =  async (req, res) => {

        const receiverId = Number(req.params.receiverId)
        
      try {
        const token  = req.cookies.tokenSocialSesion; 
        if(!token){
            return res.send({error: "You are not logged"})
        }
    
        const {users_id: userTransmitter} = jwt.verify(token, process.env.JWT_SECRET)
        const userMessages = await this.Model.getUserMessages(userTransmitter, receiverId)
        res.json(userMessages);
      } catch (err) {
        console.log(err);
        
        res.status(500).json({ error: err.message });
      }
    }

    logOut = (req, res) => {
        
        return res.clearCookie("tokenSocialSesion").json({ message: "Logged Out" })
        
    }

    getComments = async (req, res) =>{
        const postId = req.params.postId
        const comments = await this.Model.getComments(postId)

        return res.json(comments)
    }

    insertComment = async (req, res) =>{

        let comment = { ...req.body };

        const token = req.cookies.tokenSocialSesion;
        if (!token) {
            return res.send(false);
        }

        const { users_id: id } = jwt.verify(token, process.env.JWT_SECRET);

        comment.date = new Date()
        comment.user = id
        
        const valitation = commentValidation(comment)
        
        if(!valitation.success)
        {             
            return res.json({errors: true, error: "You must write a commet"})
        } 
        
        await this.Model.insertComment(comment)

        
        

        return res.json({message: "Comment submited"})
    }

    chatNotViews = async (req, res) =>{
        const token = req.cookies.tokenSocialSesion; 
        if(!token){
            return res.send(false)
        }
        
        
        const {users_id: id} = jwt.verify(token, process.env.JWT_SECRET)

        const chatsQuatity = await this.Model.chatNotViews(id)
        
        return res.json(chatsQuatity)
    }
}