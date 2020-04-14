module.exports = { 
    Create(){
        let RandomID = ""
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (let i = 0; i < 32 ; i++){
            RandomID += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return RandomID
    }
}