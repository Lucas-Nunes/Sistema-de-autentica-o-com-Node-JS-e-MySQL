const bcrypt = require('bcrypt')
const con = require('../database/db.js')
const jwt = require('jsonwebtoken')
const logger = require('./../ErrorControll/logger.js')

module.exports = {
    async authenticate(req, res, next){
        if (!(req.body.email && req.body.password)) return res.send({'err':'mandatory fields not filled'})
        function CheckingTheEmail(){
            con.query('SELECT * FROM users WHERE email like ?', req.body.email,(err, result) => {
                if(err){
                    logger.log({
                        level: 'error',
                        message: err
                    })
                    return res.status(301).send({'err':'Internal server error '})
                }
                if(result[0] === undefined) return res.send({'err':'unregistered user'})
                else return authenticate(result[0])
            })
        }
        function authenticate(user){
            if(user && bcrypt.compareSync(req.body.password, user.password)){
                const token = jwt.sign({ sub: user.id}, process.env.SECRET, {expiresIn: process.env.EXP})
                return res.cookie('x-access-token', token, { maxAge: 600000, httpOnly: true }).send({'info':'successfully authenticated'})
            }else return res.status(400).send({'err':'Username or password is incorrect'})
                
        }
        CheckingTheEmail()     
    }
}