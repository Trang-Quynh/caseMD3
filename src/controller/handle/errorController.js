const fs = require('fs');
class ErrorController{
    showNotFound = (req,res) =>{
        fs.readFile('./view/error/notFound.html', 'utf-8', (err,data)=>{
            res.write(data);
            res.end()
        })
    }
}
module.exports = new ErrorController();