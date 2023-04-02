const http = require('http')
const router = require('./controller/router')
const handleError = require('./controller/handle/errorController')
const server = http.createServer((req, res) => {
    let url = req.url;
    let arrPath = url.split('/')
    let path = ''
    let chosenHandle;
    let id = -1
    if(arrPath.length > 2){
        path = arrPath[1]
        id = arrPath[2]
    }
    if(arrPath.length <= 2){
        path = arrPath[1]
    }
    if (router[path] !== undefined) {
        chosenHandle = router[path];
    } else {
        chosenHandle = handleError.showNotFound
    }
    chosenHandle(req, res, id)

})
server.listen(8080, 'localhost', () => {
    console.log('server is running')
})