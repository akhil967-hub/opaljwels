const express = require('express')
const user_route = express()
const config = require('../config/config')
const { getHome,
    getLogin,
    getRegister,
    postRegister,
    postLogin,
    userLogout,
    getOtpPage,
    verifyOtp,
    getProductPage,
    resendOtp,
    getShopPage} = require('../controllers/userController')
const forgotController = require('../controllers/forgotController')

const session = require('express-session')
const auth = require('../middlewares/auth')

user_route.set('view engine','ejs')
user_route.set('views','./views/users')

user_route.use(session({
    secret:config.sessionSecret,
    saveUninitialized:true,
    resave:false,
    Cookie:{maxAge : 600000},
}))

user_route.use(express.json())
user_route.use(express.urlencoded({extended:true}))


// GET REQUESTS
// -------------------------
// user Controller
user_route.get('/',getHome)
user_route.get('/shop',getShopPage)
user_route.get('/login',auth.isLogout,getLogin)
user_route.get('/register',auth.isLogout,getRegister)
user_route.get('/user-logout',userLogout)
user_route.get('/otp-page',getOtpPage)
user_route.get('/product',getProductPage)
user_route.get('/resend-otp',resendOtp)





// FORGOT PASSWORD

user_route.get('/forgotpassword', auth.isLogout, forgotController.loadforgotpassword)
user_route.post('/forgotpassword', forgotController.verifymail)
user_route.get('/forgotpassword/otp', forgotController.loadforgototp)
user_route.post('/forgotpassword/otp', forgotController.verifyforgototp)
user_route.get('/restpassword', forgotController.loadresetpassword)
user_route.post('/restpassword', forgotController.resetpassword)

// POST REQUESTS
// -------------------------
// user Controller
user_route.post('/login',postLogin)
user_route.post('/register',postRegister)
user_route.post('/otp-page',verifyOtp)





module.exports = user_route
