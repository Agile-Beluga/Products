const csv = require('csv-parser');
const fs = require('fs');
require('newrelic');
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const db = require('./db')
const cache = require('./cache')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true,
}))

// app.get('/loaderio-a9b96e566e83ea103824b022d25a1116', (request, response) => {
//     response.send('loaderio-a9b96e566e83ea103824b022d25a1116')
// })

app.get('/products/list', (request, response) => {
    const { page, count } = request.query;
    console.log("getting list" + JSON.stringify({ page, count }))
    cache.get('/products/list', JSON.stringify({ page, count }))
        .then((cachedResponse) => {
            if (cachedResponse) {
                console.log("cached response found")
                return (JSON.parse(cachedResponse))
            } else {
                console.log("no cached response, querying db")
                return db.getProductList(page, count)
                    .then((results) => {
                        cache.set('/products/list', JSON.stringify({ page, count }), JSON.stringify(results))
                        return results;
                    })
            }
        })
        .then((results) => response.json(results))
        .catch((err) => console.log(err))
})

app.get('/products/:product_id', (request, response) => {
    db.getProductByID(request.params.product_id)
        .then((results) => response.json(results))
        .catch((err) => response.json(err))
})

app.get('/products/:product_id/styles', (request, response) => {
    db.getStyleByProductID(request.params.product_id)
        .then((results) => response.json(results))
        .catch((err) => response.json(err))
})

app.get('/products/:product_id/related', (request, response) => {
    db.getRelatedProducts(request.params.product_id)
        .then((results) => response.json(results))
        .catch((err) => response.json(err))
})
app.listen(port, () => {
    console.log(`Latest app running on port ${port}. http://localhost:${port}`)
})