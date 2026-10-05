const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const protect = require('../middleware/authmiddleware')
const otp = require('../routes/OTP')
const transporter = require('../config/mailer')
const app = express()
const route = express.Router()

app.use(express.json())
app.use(express.urlencoded({extended:true}))



route.get('/',(req,res)=>{
    res.render('home')
})
route.get('/userregister',(req,res)=>{
    res.render('userRegister')
})
// route.get('/dashboard',(req,res)=>{
//     res.render('dashboard')
// })
route.get('/login',(req,res)=>{
    res.render('login')
})
// get forgotPassword page
route.get('/forgotpassword',(req,res)=>{
    res.render('forgotPassword')
})


// post & logic
route.post('/userRegister',async(req,res)=>{
    console.log(req.body)
    const {name,email,password,role} = req.body
    const hashpassword = await bcrypt.hash(password,5)
    console.log("hashpassword : ",hashpassword)
    const userExit = await User.findOne({email})
    if(userExit){
        console.log("userExist = ",userExit)
        return res.send("user allready exist")
    }
    await User.create({
        name:name,
        email:email,
        password:hashpassword,
        role:role
    })
            const token = jwt.sign(
                {id:User._id},
                process.env.JWT_SECRET,
                {expiresIn :"20m"}
            )
            const url = `http://localhost:5000/verify/${token}`
            await transporter.sendMail({  // app passkey -> vbsg uumh fptt bdop
                to:email,
                subject:"verify your email",
                html:`<a href="${url}">click here to verify</a>`
            })
            res.send("verification mail send , click to verify")
            console.log(url)
            emailverificationtoken=token
            console.log("emailverifytoken :"+emailverificationtoken)
   // res.render('login')  
})

// login post
route.post('/login',async(req,res)=>{
    const {email,password,role} = req.body
    console.log(req.body)
    const userfound = await User.findOne({email,role})
    console.log(userfound)
    if(!userfound){
        console.log("user not exit")
        return res.send("user not found or password ! ")
    }
    //const valid = await bcrypt.compare(password,user.password)
    const valid = await bcrypt.compare(password,userfound.password)
    if(!valid){
        console.log("password incorrect")
        return res.send("user not found or password ! ")
    }
    //res.render('profile')
    else {
        console.log("user valid")
        const token = jwt.sign(
            {id:userfound._id},
            process.env.JWT_SECRET,
            {expiresIn:"15m"}
        )
        console.log(userfound._id)
        console.log("token : ",token)
        res.cookie("token",token)
        res.redirect('/dashboard')
    }
})

// protected get post route


route.get('/dashboard',protect,async(req,res)=>{
    console.log("req.user =", req.user);
    const id=req.user.id
    console.log("dashboard req id :",id)
    await User.findById(id).then((data)=>{
        console.log(data)
        console.log(data.name)
        console.log(data.email)
        res.render('dashboard',{ data })
   
    })
})

route.get('/profile',protect,(req,res)=>{
    res.send("profile route")
})

// otp generator function
const otpgenerator = ()=>{
    return Math.floor(100000+Math.random()*900000).toString()
}

// const sleep function
const time=1*1000*60
function sleep(time){
return new Promise(resolve=> setTimeout(resolve,time))
}
// end sleep function


// forgotpassword post
route.post('/forgotpassword',async(req,res)=>{
    const {email }= req.body
    console.log("forgot password requested email:",email)
    const user = await User.findOne({email})
    if(!user){
        res.send("Invalid email !")
    }
    const otp=otpgenerator()
    const otphash =await bycrypt.hash(otp,5)
    await OTP.findOneAndDelete({email})
    const otpmodel = await new OTP({email,otp:otphash,otpExpired:Date.now()}).save() 
    const token=jwt.sign(
        {id:otpmodel._id},
         process.env.JWT_SECRET,
        {expiresIn :"5m"}
    ) 
    console.log("email :"+email)
    await transporter.sendMail({
            to:email,
            subject:"verify otp",
            text:`you otp code ${otp}`
    })

    //res.send("otp send to your email !")
    res.render('verifyotp',{'email':email})
    await sleep(time)
    await console.log("sleep function called")
    await OTP.findOneAndDelete({email})

})

// verify otp page
route.post('/verifyotp',async(req,res)=>{
    const {email,otp} =req.body
    // const id=req.user.id
    // console.log(id)
    const valid = await OTP.findOne({email})
    if(!valid) res.send("something error to access id or not user exit")
    const otpvalid = await bycrypt.compare(otp,valid.otp)
    if(!otpvalid) res.send("Invalid otp")
    res.send("change password")
    const otpmodel= await OTP.findOneAndDelete({email})
    console.log("otp model delete successfully model: "+otpmodel)


})
// get verify
route.get('/verify/:token',async(req,res)=>{
    console.log("verifyurl successful found: ")
    try{
        const decoded = jwt.verify(req.params.token,process.env.JWT_SECRET)
        console.log("decoded id : "+decoded.id)
        console.log(decoded)
        const user =await User.findByIdAndUpdate(decoded.id,{emailVerified:true},{new:true})
        //user.emailVerified = true
        console.log(user.email)
        //await user.save()
        res.send("email verified successfully")
    } catch(err){
        res.send("Invalid or expire token")
    }

})


// export route
module.exports = route