const mysql = require('mysql')
const logger = require('../ErrorControll/logger.js')

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_DATABASE,
    dateStrings: true
})

con.connect((err) =>  {
    if(err){
        logger.log({
            level: 'error',
            message: 'Unable to connect to the server. Please start the server. Error:', err
        })
        process.exit()
    }else{
        logger.log({
            level: 'info',
            message: 'Connected to Server successfully!'
          })
    }
})

module.exports = con