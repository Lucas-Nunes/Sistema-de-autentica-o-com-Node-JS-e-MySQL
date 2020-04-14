const con = require('../database/db.js')
const jwt = require('jsonwebtoken')
const logger = require('./../ErrorControll/logger.js')

module.exports = {
  async verifyJWT(req, res, next){

    const token = req.cookies['x-access-token']

    if (!token || token === " " || token === null) return res.status(301).send({'err':'user not logged in'})
    
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if(err){
        logger.log({
            level: 'error',
            message: err
        })
          return res.status(301).send({'err':'Invalid Token'})
        }
        const id= decoded.sub

        async function CheckingTheID(id){
            con.query('SELECT * FROM users WHERE id like ?', id, (err, result) => {
                if(err){
                    logger.log({
                        level: 'error',
                        message: err
                    })
                    return res.status(301).send({'err':'Internal server error '})
                }
                if(result[0] === undefined) return res.send({'err':'unregistered user'})
                else return findblacktoken(result[0],token)
            })
        }
        async function findblacktoken(user, token){
            if(!(user)) return res.status(301).send({'err':'Invalid Token'})
                con.query('SELECT * FROM blacktokens WHERE id like ?', id, (err, result) => {
                    if(err){
                        logger.log({
                            level: 'error',
                            message: err
                        })
                        return res.status(301).send({'err':'Internal server error '})
                    }
                    if(result[0] === undefined){
                        req.body.id = id
                        return next()
                    }else{
                        for(let i=0; i < result.length; i++){
                            if(result[i].blacktoken === token){
                                return res.status(301).send({'err':'user was logout'})
                                break
                            }
                        }
                        req.body.id = id
                        return next()
                    }
                })
        }
        CheckingTheID(id)  
    })
  }
}