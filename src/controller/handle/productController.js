const fs = require('fs');
const qs = require('qs')
const productService = require('../../service/productService.js')
const categoryService = require('../../service/categoryService.js')
class ProductController{
    getHtmlProducts =  (products, indexHtml) =>{
       let productsHtml = ''
        products.map((item, no) =>{
            productsHtml += `
                    <tr>
                        <th scope="row">${no + 1}</th>
                        <td>${item.id}</td>
                        <td>${item.name_product}</td>
                        <td>${item.price}</td>
                        <td><img src="${item.image}" style="width:50px; height=50px"></td>
                        <td>${item.name_category}</td>
                        <td><a type="button" class="btn btn-outline-success" href="/edit/${item.id}">Update</a></td>
                        <td>
                        <form method="POST" onsubmit="return confirm ('Bạn có chắc chắn muốn xóa không?')">
                             <input name="idDelete" type="hidden" value='${item.id}'>
                             <button type="submit" class="btn btn-outline-warning">Delete</button>
                        </form>
                        </td>
                    </tr> 
            `
            no++;
        })
        indexHtml = indexHtml.replace('{products}', productsHtml)
        return indexHtml
    }
    showHome = async (req,res) =>{
        if(req.method === 'GET') {
            fs.readFile('./view/home.html', 'utf-8', async (err, indexHtml) => {
                let products = await productService.findAll()
                indexHtml = this.getHtmlProducts(products, indexHtml)
                res.write(indexHtml);
                res.end()
            })
        }else{
            const buffers = [];
            for await (const chunk of req){
                buffers.push(chunk)
            }
            const data = Buffer.concat(buffers).toString();
            const product = qs.parse(data);
            if(product.idDelete){
                let id = product.idDelete
                await productService.deleteById(id)
                res.writeHead(301, {location: '/home'})
                res.end();
            }
        }
    }
    editProduct = async (req,res,id)=>{
        if (req.method === 'GET') {
        fs.readFile('./view/edit.html', 'utf-8', async (err, editHtml) => {
            let product = await productService.findById(id)
            let categories = await categoryService.findAll()
            editHtml = editHtml.replace('{name}', product.name_product)
            editHtml = editHtml.replace('{price}', product.price)
            editHtml = editHtml.replace('{description}', product.description)
            let htmlCategories = ''
            categories.map(item => {
                htmlCategories += `
                  <option value="${item.id}">${item.name_category}</option>
            `
            })
            editHtml = editHtml.replace('{category}', htmlCategories)
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
                let editProduct = qs.parse(data);
                await productService.set(id,editProduct)
                res.writeHead(301, {location: '/home'})
                res.end();
            })


           // const buffers = [];
           // for (const chunk of req){
           //     buffers.push(chunk)
           // }
           // const data = Buffer.concat(buffers).toString();
           // const editProduct = qs.parse(data);
           // await productService.set(id,editProduct)
           //  res.writeHead(301, {location: '/home'})
           //  res.end();
        }
    }

    addProduct = async (req,res)=>{
        if (req.method === 'GET') {
            fs.readFile('./view/addProduct.html', 'utf-8', async(err,addHtml)=>{
                let categories = await categoryService.findAll()
                let htmlCategories = ''
                categories.map(item => {
                    htmlCategories += `
                  <option value="${item.id}">${item.name_category}</option>
                  `
                })
                addHtml = addHtml.replace('{category}', htmlCategories)
                res.write(addHtml);
                res.end()
            })
        }else{
            let data = ''
            req.on('data', (chunk) => {
                data = data + chunk;
            })
            req.on('end', () => {
                let addProduct = qs.parse(data);
                productService.addProductSql(addProduct)
                res.writeHead(301, {location: '/home'})
                res.end();
            })

            // const buffers = [];
            // console.log(req)
            // for await (const chunk of req){
            //     buffers.push(chunk)
            // }
            // const data = Buffer.concat(buffers).toString();
            // const addProduct = qs.parse(data);
            // await productService.addProductSql(addProduct)
            // res.writeHead(301, {location: '/home'})
            // res.end();
        }
    }
}
module.exports = new ProductController