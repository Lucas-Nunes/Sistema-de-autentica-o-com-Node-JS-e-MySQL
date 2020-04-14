const CryptoJS = require("crypto-js")
const con = require('../database/db.js')
const bcrypt = require('bcrypt')
const logger = require('./../ErrorControll/logger.js')

module.exports = {
    async UpdateUserData(req, res, next){
        const id = req.body.id
        let user = req.body
        const token = req.cookies['x-access-token']
        const userBlackToken = {}

        if(!(id)) return res.send({'err':'The user has not been authenticated'})

        function UpdateUserData(name){
            if(name !== null) user.name = name

            if (user.password != null && user.password !== "") {
                user.password = bcrypt.hashSync(user.password, 10)

                NowDate  = new Date()
                userBlackToken.date = new Date(NowDate.getTime() + 15*60000)
    
                userBlackToken.blacktoken = token
                userBlackToken.id = id
                con.query('INSERT INTO blacktokens SET ?', userBlackToken, (err)=> {
                    if(err){
                        logger.log({
                            level: 'error',
                            message: err
                        })
                        return res.send({'err':'error when logout'})
                    }
                })
                
            }else delete user.password

            if (user.email != null && user.email !== ""){
                const email = user.email
                user.email  = CryptoJS.AES.encrypt(email, process.env.SECRET).toString()
            }else delete user.email

            if (user.card != null && user.card !== ""){
                const card = user.card
                user.card  = CryptoJS.AES.encrypt(card, process.env.SECRET).toString()
            }else delete user.card

            delete user.id

            con.query('UPDATE users SET ? WHERE id = ?',[user, id], (err)=> {
                if(err){
                    logger.log({
                        level: 'error',
                        message: err
                    })
                    return res.send({'err':'error when updating'})
                }
                else return res.send({'info':'updated successfully'})
            })

        }
        if(user.name !== null && user.name !== "" || user.name != user.name){
            function TakingUserData(){
                con.query('SELECT * FROM users WHERE name like ?', user.name, (err, result) => {
                    if(err){
                        logger.log({
                            level: 'error',
                            message: err
                        })
                        return res.send({'err':'error when updating'})
                    }
                    if(result[0] !== undefined)  return res.send({'err':'name ' + user.name + ' is already taken'})
                    else return UpdateUserData(user.name)
                    
                })
            }
            TakingUserData()
        }else{
            delete user.name
            UpdateUserData()
        }
    }
    
}