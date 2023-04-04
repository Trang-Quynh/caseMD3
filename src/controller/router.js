const productController = require('./handle/productController')
const userController = require('./handle/userController')
const router = {
    'home': productController.showHome,
    'edit': productController.editProduct,
    'add': productController.addProduct,
    '': userController.login,
    'signup': userController.signup
}
module.exports = router
