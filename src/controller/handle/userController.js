const fs = require('fs')
const qs = require('qs')
const userService = require('../../service/userService')
const cookie = require('cookie')


// sửa tên file thành login controller
// ở function login nếu user là admin thì chạy sang trang home/admin
class UserController {
    login = (req, res) => {
        if (req.method === 'GET') {
            fs.readFile('./view/login.html', 'utf-8', (err, loginHtml) => {
                res.write(loginHtml);
                res.end();
            })
        } else {
            let data = ''
            req.on('data', chunk => {
                data += chunk
            })
            req.on('end', async () => {
                let user = qs.parse(data);
                console.log(user)
                let account = await userService.getUser(user);
                if (account.length === 0) {
                    res.writeHead(301, {'location': '/'});
                    res.end()
                } else {
                    res.setHeader('Set-Cookie', cookie.serialize('user', JSON.stringify(account[0]), {
                        httpOnly: true,
                        maxAge: 60 * 60 * 24 * 7
                    }));
                    res.writeHead(301, {'location': '/home'});// // home/user/1 chỗ này thêm user id
                    res.end()
                }
            })
        }
    }


    signup = (req, res) => {
        if (req.method === 'GET') {
            fs.readFile('./view/signup.html', 'utf-8', (err, loginHtml) => {
                res.write(loginHtml);
                res.end();
            })
        } else {
            let data = ''
            req.on('data', chunk => {
                data += chunk
            })
            req.on('end', async () => {
                let user= qs.parse(data);
                console.log(user)
                let account = await userService.createUser(user);
                console.log(account)
                res.setHeader('Set-Cookie', cookie.serialize('user', JSON.stringify(account[0]), {
                    httpOnly: true,
                    maxAge: 60 * 60 * 24 * 7
                }));
                    res.writeHead(301, {'location': '/home'});// /home/user/1
                    res.end()
            })
        }
    }
}

module.exports = new UserController();
