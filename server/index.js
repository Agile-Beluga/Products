const csv = require('csv-parser');
const fs = require('fs');

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const db = require('../db')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true,
}))

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/products/list', (request, response) => {
    db.getProductList(request.query.page, request.query.count)
        .then((results) => response.json(results))
        .catch((err) => response.json(err))
})

app.get('/products/:product_id', (request, response) => {
    db.getProductByID(request.params.product_id)
        .then((results) => response.json(results))
        .catch((err) => response.json(err))
})

app.get('/products/:product_id/styles', (request, response) => {
    console.log(request.params.product_id)
    db.getStyleByProductID(request.params.product_id)
        .then((results) => response.json(results))
        .catch((err) => response.json(err))
})

app.listen(port, () => {
    console.log(`App running on port ${port}. http://localhost:${port}`)
})