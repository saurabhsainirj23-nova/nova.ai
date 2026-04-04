const express = require('express')
const app = express()

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`)
  next()
})

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

let products = [
  { id: 1, name: "Laptop", price: 49999, category: "Electronics" },
  { id: 2, name: "Shoes", price: 2999, category: "Fashion" },
  { id: 3, name: "Book", price: 399, category: "Education" }
]

app.get('/products', (req, res) => {
  res.json({ products: products })
})

app.post('/products', (req, res) => {
  const newProduct = {
    id: products.length + 1,
    ...req.body
  }
  console.log('New Product:', newProduct)
  products.push(newProduct)
  res.json({ message: "Product created", product: newProduct })
})

app.put('/products/:id', (req, res) => {
  const { id } = req.params
  const updatedData = req.body
  console.log(`Updating product with ID ${id}`, updatedData)

  let product = products.find(p => p.id == id)
  if (product) {
    Object.assign(product, updatedData)
    res.json({ message: `Product with ID ${id} updated`, product })
  } else {
    res.status(404).json({ message: `Product with ID ${id} not found` })
  }
})

app.delete('/products/:id', (req, res) => {
  const { id } = req.params
  products = products.filter(p => p.id != id)
  res.json({ message: `Product with ID ${id} deleted successfully` })
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
