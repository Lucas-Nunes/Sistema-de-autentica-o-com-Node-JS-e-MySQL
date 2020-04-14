const con = require('../database/db.js')
const logger = require('./../ErrorControll/logger.js')

module.exports = {
    async quit(req, res, next){
        const id = req.body.id
        const token = req.cookies['x-access-token']

        if(!(id)) return res.send({'err':'The user has not been authenticated'})
        
        function CheckingTheID(id){
            con.query('SELECT * FROM users WHERE id like  ?', id, (err, result) => {
                if(err){
                    logger.log({
                        level: 'error',
                        message: err
                    })
                    return res.status(301).send({'err':'Internal server error '})
                }
                if(result[0] === undefined) return res.send({'err':'unregistered user'})
                else return save(result[0],token)
            })
        }
        async function save(user,token){
            delete user.name
            delete user.email
            delete user.card
            delete user.password
            delete user.date
            let NowDate  = new Date()
            user.date = new Date(NowDate.getTime() + 15*60000)

            user.blacktoken = token
            
            con.query('INSERT INTO blacktokens SET ?', user, (err)=> {
                if(err){
                    logger.log({
                        level: 'error',
                        message: err
                    })
                    return res.send({'err':'error when logout'})
                }
                else return res.cookie('x-access-token', null ,{ maxAge: 1, httpOnly: true }).send({'info':'logout was successful'})
            })
        }
        CheckingTheID(id)
    }
}