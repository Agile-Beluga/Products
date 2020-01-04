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
        .then(({ rows }) => response.json(rows))
        .catch((err) => response.json(err))
})

app.get('/products/:product_id', (request, response) => {
    console.log(request.params.product_id)
    db.getProductByID(request.params.product_id)
        .then(({ rows }) => response.json(rows))
        .catch((err) => response.json(err))
})

app.listen(port, () => {
    console.log(`App running on port ${port}. http://localhost:${port}`)
})