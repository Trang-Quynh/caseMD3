const productController = require('./handle/productController')
const router = {
    'home': productController.showHome,
    'edit': productController.editProduct,
    'add': productController.addProduct
}
module.exports = router
