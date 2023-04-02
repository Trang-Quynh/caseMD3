const connection = require('../entity/connection.js')
// connection la mot object dung de connect
class ProductService{
    connect;
    constructor(){
        connection.connectToMySQL();
        this.connect = connection.getConnection()
    }
    findById = (id)=>{
        return new Promise((resolve, reject)=>{
            this.connect.query(`select products.*, category.name_category from products inner join category on products.id_category = category.id where products.id = ${id}`,(err,products)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(products[0])
                }
            })
        })
    }

    findAll = () =>{
        return new Promise((resolve, reject)=>{
            this.connect.query('select products.*, c.name_category from products inner join category c on products.id_category = c.id',(err,products)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(products)
                }
            })
        })
    }

    set = (id, editProduct) =>{
        return new Promise((resolve, reject)=>{
            console.log(editProduct.name_product)
            this.connect.query(`update products set name_product = '${editProduct.name_product}', price = '${editProduct.price}', description = '${editProduct.description}', id_category = '${editProduct.id_category}' where id = ${id}`,(err,products)=>{
                if(err){
                    reject(err)
                }else{
                    resolve('set success')
                }
            })
        })
    }
    deleteById = (id) =>{
        return new Promise((resolve, reject)=>{
            this.connect.query(`delete from products where id = ${id}`,(err,products)=>{
                if(err){
                    reject(err)
                }else{
                    resolve('delete success')
                }
            })
        })
    }
    addProductSql = (addProduct) =>{
        return new Promise((resolve, reject)=>{
            console.log(addProduct.name_product)
            this.connect.query(`insert into products(name_product,price,description,id_category) values('${addProduct.name_product}','${addProduct.price}', '${addProduct.description}', '${addProduct.id_category}')`,(err,products)=>{
                if(err){
                    reject(err)
                }else{
                    resolve('Add success')
                }
            })
        })
    }
}
module.exports = new ProductService()