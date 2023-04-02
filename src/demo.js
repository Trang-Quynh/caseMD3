const http = require('http');
const fs = require('fs');
const qs = require('qs');


const server = http.createServer((req, res)=>{
    let url = req.url;
    let arrPath = url.split('/');
    let path = arrPath[1];
    let chosenHandle;
    if(router[path] !== undefined){
        chosenHandle = router[path]
    }else{
        chosenHandle = handle.error
    }
    chosenHandle(req,res,arrPath[2])
})
server.listen(3000,'localhost', ()=>{
    console.log('server is running')
})

let handle = {};
handle.user = (req,res,id)=>{
    if(req.method === 'GET'){
        fs.readFile('./views/home.html', 'utf8', (err, dataHtml) => {
            let people = JSON.parse(fs.readFileSync('./data/data.json', 'utf8'));
            let html = '';
            for (let i = 0; i < people.length; i++) {
                html += `
                 <tr>
                    <th scope="row">${people[i].id}</th>
                    <td>${people[i].name}</td>
                    <td>${people[i].age}</td>
                    <td>${people[i].gender}</td>
                    <td>
                    <form method="POST">
                    <input name="idDelete" type="hidden" value='${people[i].id}'>
                    <button type="submit">Delete</button>
                    </form>
                    </td>
                    <td>
                    <form method="POST">
                    <input name="idUpdate" type="hidden" value='${people[i].id}'>
                    <button type="submit"><a href="/edit/${people[i].id}" style="text-decoration: none">Update</a></button>
                    </form>
                    </td>
                 </tr>
                `
            }
            dataHtml = dataHtml.replace('{people}', html);
            res.write(dataHtml);
            res.end();
        })
    }else{
        let data = ''
        req.on('data', (chunk) => {
            data = data + chunk;
        })
        req.on('end', () => {
            let user = qs.parse(data);
            let people = JSON.parse(fs.readFileSync('./data/data.json', 'utf8'));
            for (let i = 0; i < people.length; i++) {
                if(people[i].id === user.idDelete){
                    index = i;
                }
            }
            console.log(index)
            people.splice(index, 1);
            fs.writeFileSync('./data/data.json', JSON.stringify(people));
            res.writeHead(301, {location: '/user'});
            res.end()
        })
    }
}
handle.login = (req,res)=> {
    if (req.method === 'GET') {
        fs.readFile('./views/login.html', 'utf8', (err, data) => {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end()
        })
    } else {
        let data = ''
        req.on('data', (chunk) => {
            data = data + chunk;
        })
        req.on('end', () => {
            let user = qs.parse(data);
            let people = JSON.parse(fs.readFileSync('./data/data.json', 'utf8'));
            people.push(user)
            fs.writeFileSync('./data/data.json', JSON.stringify(people));
            res.writeHead(301, {location: '/user'})
            res.end()
        })
    }
}

handle.edit = (req, res, id) => {
    if(req.method === 'GET'){
        fs.readFile('./views/edit.html', 'utf8', (err, data) => {
            let people = JSON.parse(fs.readFileSync('./data/data.json', 'utf8'));
            let index = -1;
            for (let i = 0; i < people.length; i++) {
                if (people[i].id === id) {
                    index = i;
                }
            }
            data = data.replace('{editId}', people[index].id)
            data = data.replace('{editName}', people[index].name)
            data = data.replace('{editAge}', people[index].age)
            data = data.replace('{editGender}', people[index].gender);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end()
        })
    }else{
        console.log(id)
        let data = '';
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', () => {
            let user = qs.parse(data);
            console.log(user)
            let users = JSON.parse(fs.readFileSync('./data/data.json', 'utf-8'));
            let index = -1;
            for (let i = 0; i < users.length; i++) {
                if (users[i].id === id) {
                    index = i;
                }
            }
            console.log('index ' + index)
            users[index].name = user.editName;
            users[index].age = user.editAge;
            users[index].gender = user.editGender;
            fs.writeFileSync('./data/data.json', JSON.stringify(users));
            res.writeHead(301, {location: '/user'})
            res.end();
        })
    }
}

handle.error = (req,res)=>{
    fs.readFile('./views/error.html', 'utf8', (err, data)=>{
        res.writeHead(200,{'Content-Type':'text/html'});
        res.write(data);
        res.end();
    })
}
let router = {
    'user': handle.user,
    'login':handle.login,
    'edit': handle.edit
}