const express = require('express')
const User = require('../models/User')
const bycrypt = require('bcryptjs')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const transporter = require('../config/mailer')
const OTP = require('../models/otpModels')
const protect = require('../middleware/authmiddleware')
//const route = require('../routes/route')
//const { promises } = require('nodemailer/lib/xoauth2')


dotenv.config()



const app = express()
const router = express.Router()
// built in middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))

router.get('/register',(req,res)=>{
    res.render('userRegister')
})
router.get('/',(req,res)=>{
    res.render('home')
})
 router.get('/login',(req,res)=>{
    res.render('login')
 })
 router.get('/profile',protect,(req,res)=>{
     res.send("profile route")
 })
 
 router.get('/dashboard',protect,async(req,res)=>{
     console.log("req.user =", req.user);
    //  const id=req.user.id
     const user = req.user
    //  console.log("dashboard req id :",id)
    const data = await User.findById(user.id)
     console.log(data.phone)
     console.log(data.phone.number)
    if (user.role === "admin") {
        return res.render("admin/dashboard", { data });
    }

    if (user.role === "owner") {
        return res.render("owner/dashboard", { data });
    }

    return res.render("user/dashboard", { data });

    //  await User.findById(id).then((data)=>{
    //      console.log(data)
    //      console.log(data.name)
    //      console.log(data.email)
    //      res.render('dashboard',{ data })
    
    //  })
 }) 
 // login post
 router.post('/login',async(req,res)=>{
     const {email,password,role} = req.body
     console.log(req.body)
     const userfound = await User.findOne({email,role})
     console.log(userfound)
     if(!userfound){
         console.log("user not exit")
         return res.send("user not found or password ! ")
     }
     //const valid = await bcrypt.compare(password,user.password)
     const valid = await bycrypt.compare(password,userfound.password)
     if(!valid){
         console.log("password incorrect")
         return res.send("user not found or password ! ")
     }
     //res.render('profile')
     else {
         console.log("user valid")
         const token = jwt.sign(
             {
                id:userfound._id,
                role: userfound.role
             },
             process.env.JWT_SECRET,    
             {expiresIn:"15m"}
         )
         console.log(userfound._id)
         console.log("token : ",token)
         res.cookie("token",token)
         res.redirect('/dashboard')
     }
 })
 
 

router.post('/register',async(req,res)=>{
    const{name,email,password,number,role} = req.body
    console.log(req.body)
    const userexit =await User.findOne({email})
    console.log(userexit)
    if(userexit){
        return res.send("user already exit ")
    }
    else {
        const hashpassword = await bycrypt.hash(password,5)
        const user = await new User({
            name,
            email,
            role,
            phone:{
                number:number
            },
            password:hashpassword
        })
        console.log(number)
        console.log(user.phone)
        await user.save()
        const token = jwt.sign(
            {id:user._id},
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
    }
})


// get verify
router.get('/verify/:token',async(req,res)=>{
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


// get forgotPassword page
router.get('/forgotpassword',(req,res)=>{
    res.render('forgotPassword')
})
// router.get('/changepassword',(req,res)=>{
//     res.render('changePassword')
// })

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
router.post('/forgotpassword',async(req,res)=>{
    try{
    const {email }= req.body
    console.log("forgot password requested email:",email)
    const user = await User.findOne({email})
    if(!user){
        //res.send("Invalid email !")
        res.json({
            success:false,
            message:"Invalid email !"
        })
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
    //res.render('verifyotp',{'email':email})
    res.json({
        success:true,
        message:"OTP send successfully"
    })
    await sleep(time)
    await console.log("sleep function called")
    await OTP.findOneAndDelete({email})
} catch(error){
    console.error(error)
    return res.status(500).json({
        success:false,
        message:"Failed to send otp"
    })
}

})

// verify otp page
router.post('/verifyotp',async(req,res)=>{
    try{
    const {email,otp} =req.body
    // const id=req.user.id
    // console.log(id)
    const valid = await OTP.findOne({email})

    if(!valid){
        res.json({
            success:false,
            message:"Invalid email !"
        })
    }
    const otpvalid = await bycrypt.compare(otp,valid.otp)

    if(!otpvalid){
        res.json({
            success:false,
            message:"Invalid otp !"
        })
    }
    const resetToken=jwt.sign(
        {email:email,
         purpose: "password-reset"
        },
         process.env.JWT_SECRET,
        {expiresIn :"25m"})
     res.json({
        success:true,
        message:"otp verify successfully",
        resetToken:resetToken
     })   
    // res.render("changePassword",{email})
    const otpmodel= await OTP.findOneAndDelete({email})
    console.log("otp model delete successfully model: "+otpmodel)

} catch(error){
    console.error(error)
    return res.status(500).json({
        success:false,
        message:"Failed to send otp"
    })
}

})


// get route
router.get('/change-password',async(req,res)=>{
    try{
    const {token }=req.query;
    if(!token) res.status(404).send("page not found")
    const valid = jwt.verify(token,process.env.JWT_SECRET)
    if(!valid) res.status(404).send("page not found")
    const email=valid.email
    console.log(email)
    res.render('changepassword',{email})

    } catch(error){
    //     console.error(error)
     return res.status(404).send("page not found ")
    }
})
 
// post route
router.post('/changepassword',async(req,res)=>{
    try{
    const {email,password,repassword}=req.body;
    if(password!=repassword) 
        // res.send("Incorrect repassword")
        res.json({
            success:false,
            message:"don't match password and re-enter password"

        })
    const hashpassword = await bycrypt.hash(password,5)
    await User.findOneAndUpdate({email},{password:hashpassword})
    res.redirect('/login')

}catch(error){
    res.status(500).send("something error")
}
    
})

// logout get rout
router.get("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });

    res.redirect("/login");
});

module.exports = router
