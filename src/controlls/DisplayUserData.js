const CryptoJS = require("crypto-js")
const con = require('../database/db.js')
const logger = require('./../ErrorControll/logger.js')

module.exports = {
    async GetByID(req, res, next){
        const id =  req.body.id

        if(!(id)) return res.send({'err':'The user has not been authenticated'})
        
        function TakingUserData(){
            con.query('SELECT * FROM users WHERE id like ?', id, (err, result) => {
                if(err){
                    logger.log({
                        level: 'error',
                        message: err
                    })
                    return res.status(301).send({'err':'Internal server error '})
                }
                if(result[0] === undefined) return res.send({'err':'internal server error'})
                else return ShowUserData(result[0])
            })
        }
        async function ShowUserData(user){
            const cardDecrypt = CryptoJS.AES.decrypt(user.card, process.env.SECRET)
            let card = cardDecrypt.toString(CryptoJS.enc.Utf8)
            user.card = card

            delete user.id
            delete user.password
            delete user.date
            delete user.blacktoken

            return res.send(user)
        }
        TakingUserData()
    }
}