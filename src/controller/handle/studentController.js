const fs = require('fs');
const qs = require('qs')
const studentService = require('../../service/studentService.js')
const classService = require('../../service/classService.js')
class StudentController {
    getHtmlStudents =  (students, indexHtml) =>{
       let studentsHtml = ''
        students.map((item, no) =>{
            studentsHtml += `
                    <tr>
                        <td scope="row" style="padding: 0 10px;">${no + 1}</td>
                        <td >${item.id}</td>
                        <td >${item.name}</td>
                        <td >${item.practical_grade}</td>
                        <td >${item.theory_grade}</td>
                        <td >${item.evaluate}</td>
                        <td >${item.description}</td>
                        <td ><a type="button" class="btn btn-outline-secondary" href="/edit/${item.id}">Update</a></td>
                        <td >
                        <form method="POST" onsubmit="return confirm ('Bạn có chắc chắn muốn xóa không?')">
                             <input name="idDelete" type="hidden" value='${item.id}'>
                             <button type="submit" class="btn btn-outline-dark">Delete</button>
                        </form>
                        </td>
                    </tr> 
            `
            no++;
        })
        indexHtml = indexHtml.replace('{student}', studentsHtml)
        return indexHtml
    }
    showHome = async (req,res) => {
        if (req.method === 'GET') {
            fs.readFile('./view/home.html', 'utf-8', async (err, indexHtml) => {
                let students = await studentService.findAll()

                indexHtml = this.getHtmlStudents(students, indexHtml)
                res.write(indexHtml);
                res.end()
            })
        } else {
                const buffers = [];
                for await (const chunk of req){
                    buffers.push(chunk)
                }
                const data = Buffer.concat(buffers).toString();
                const student = qs.parse(data);
            console.log(student)
                if(student.idDelete){
                    let id = student.idDelete
                    await studentService.deleteById(id)
                    res.writeHead(301, {location: '/home'})
                    res.end();
                }
            }
    }
    editStudent= async (req,res,id)=>{
        if (req.method === 'GET') {
        fs.readFile('./view/edit.html', 'utf-8', async (err, editHtml) => {
            let student = await studentService.findById(id)
            let classes = await classService.findAll()
            editHtml = editHtml.replace('{name}', student.name)
            editHtml = editHtml.replace('{practical_grade}', student.practical_grade)
            editHtml = editHtml.replace('{theory_grade}', student.theory_grade)
            editHtml = editHtml.replace('{evaluate}', student.evaluate)
            editHtml = editHtml.replace('{description}', student.description)
            let htmlClasses = ''
            classes.map(item => {
                htmlClasses += `
                  <option value="${item.class_id}">${item.class_name}</option>
            `
            })
            editHtml = editHtml.replace('{class}',  htmlClasses)
            res.write(editHtml);
            res.end()
        })
    }else{
            let data = ''
            req.on('data', (chunk) => {
                data = data + chunk;
            })
            console.log(data)
            req.on('end', async () => {
                let editStudent = qs.parse(data);
                await studentService.set(id,editStudent)
                res.writeHead(301, {location: '/home'})
                res.end();
            })

        }
    }

    addStudent= async (req,res)=>{
        if (req.method === 'GET') {
            fs.readFile('./view/addStudent.html', 'utf-8', async(err,addHtml)=>{
                let classes = await classService.findAll()
                let htmlClasses = ''
                classes.map(item => {
                    htmlClasses += `
                  <option value="${item.class_id}">${item.class_name}</option>
                  `
                })
                addHtml = addHtml.replace('{class}',htmlClasses)
                res.write(addHtml);
                res.end()
            })
        }else{
            let data = ''
            req.on('data', (chunk) => {
                data = data + chunk;
            })
            req.on('end', () => {
                let addStudent = qs.parse(data);
                console.log(addStudent)
                studentService.addStudentSql(addStudent)
                studentService.addStudentSql(addStudent)
                res.writeHead(301, {location: '/home'})
                res.end();
            })

        }
    }
}
module.exports = new StudentController