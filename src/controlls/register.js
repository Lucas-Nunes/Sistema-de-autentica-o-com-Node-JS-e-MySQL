const CryptoJS = require("crypto-js")
const bcrypt = require('bcrypt')
const MakeRandomID = require('../MakeRandomID.js')
const con = require('../database/db.js')
const logger = require('./../ErrorControll/logger.js')

module.exports = {

    async register(req, res, next){
        if(!(req.body.name && req.body.password && req.body.email && req.body.card)){
            return res.send({'err':'mandatory fields not filled'})
        }
        async function save(user){
            user.id =  MakeRandomID.Create()

            user.password = bcrypt.hashSync(req.body.password, 10)

            user.date = new Date().toLocaleString(), "yyyy-mm-dd HH:MM:ss"
            
            const card = await req.body.card
            user.card = CryptoJS.AES.encrypt(card, process.env.SECRET).toString()

            con.query('INSERT INTO users SET ?', user, (err)=> {
                if(err){
                    logger.log({
                        level: 'error',
                        message: err
                    })
                    return res.send({'err':'error when registering'})
                }
                else return res.send({'info':'registered successfully'})
            })
        }

        function CheckingTheEmail(){
            con.query(`SELECT * FROM users WHERE email like ?`, req.body.email, (err, result) => {
                if(err){
                    logger.log({
                        level: 'error',
                        message: err
                    })
                    return res.status(301).send({'err':'Internal server error '})
                }
                if(result[0] !== undefined) return res.send({'err':'email already registered'})
                else return save(req.body)
            })
        }
        
        con.query(`SELECT * FROM users WHERE name like "?"`, req.body.name, (err, result) => {
            if(err){
                logger.log({
                    level: 'error',
                    message: err
                })
                return res.status(301).send({'err':'Internal server error '})
            }
            if(result[0] !== undefined) return res.send({'err':'Username is already taken'})
            else return CheckingTheEmail()
        })
    }

}