const express=require('express')

const {register, login, refreshToken}=require('../controllers/User-controller')


const router=express.Router()


router.post('/register',register)
router.post('/login',login)
router.get('/refresh-token',refreshToken)

module.exports=router