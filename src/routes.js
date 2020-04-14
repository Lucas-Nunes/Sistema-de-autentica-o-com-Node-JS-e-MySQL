const register = require('./controlls/register.js')
const authenticate = require('./controlls/authenticate')
const DisplayUserData = require('./controlls/DisplayUserData.js')
const CookieVerification = require('./controlls/CookieVerification.js')
const logout = require('./controlls/logout.js')
const DeleteAccount = require('./controlls/delete.js')
const update = require('./controlls/update.js')
const express = require('express')
const router = express.Router()

router.post('/authenticate',authenticate.authenticate)
router.post('/register',register.register)
router.get('/account',CookieVerification.verifyJWT, DisplayUserData.GetByID)
router.get('/logout',CookieVerification.verifyJWT, logout.quit)
router.delete('/delete/account',CookieVerification.verifyJWT, DeleteAccount.delete)
router.put('/account/update',CookieVerification.verifyJWT, update.UpdateUserData)

module.exports = router