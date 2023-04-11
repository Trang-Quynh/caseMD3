const studentController = require('./handle/studentController')
const router = {
    'home': studentController.showHome,
    'edit': studentController.editStudent,
    'add': studentController.addStudent
}
module.exports = router
