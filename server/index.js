const csv = require('csv-parser');
const fs = require('fs');
require('newrelic');
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const db = require('./db')
const cache = require('./cache')
var cors = require('cors')
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true,
}))

app.get('/loaderio-779b014781c24cb63830a3654d3c05aa', (request, response) => {
    response.send('loaderio-779b014781c24cb63830a3654d3c05aa')
})

app.get('/products/list', (request, response) => {
    const { page, count } = request.query;
    cache.get('/products/list', JSON.stringify({ page, count }))
        .then((cachedResponse) => {
            if (cachedResponse) {
                return JSON.parse(cachedResponse)
            } else {
                return db.getProductList(page, count)
                    .then((results) => {
                        cache.set('/products/list',
                            JSON.stringify({ page, count }), JSON.stringify(results))
                        return results;
                    })
            }
        })
        .then((results) => response.json(results))
        .catch((err) => console.log(err))
})

app.get('/products/:product_id', (request, response) => {
    const id = request.params.product_id
    cache.get('/products/:product_id', id)
        .then((cachedResponse) => {
            if (cachedResponse) {
                return JSON.parse(cachedResponse)
            } else {
                return db.getProductByID(id)
                    .then((results) => {
                        cache.set('/products/:product_id', id, JSON.stringify(results))
                        return results;
                    })
            }
        })
        .then((results) => response.json(results))
        .catch((err) => response.json(err))
})

app.get('/products/:product_id/styles', (request, response) => {
    const id = request.params.product_id
    cache.get('/products/:product_id/styles', id)
        .then((cachedResponse) => {
            if (cachedResponse) {
                return JSON.parse(cachedResponse)
            } else {
                return db.getStyleByProductID(id)
                    .then((results) => {
                        cache.set('/products/:product_id/styles', id, JSON.stringify(results))
                        return results;
                    })
            }
        })
        .then((results) => response.json(results))
        .catch((err) => response.json(err))
})

app.get('/products/:product_id/related', (request, response) => {
    const id = request.params.product_id
    cache.get('/products/:product_id/related', id)
        .then((cachedResponse) => {
            if (cachedResponse) {
                // console.log("cached response found")
                return JSON.parse(cachedResponse)
            } else {
                // console.log("no cached response, querying db")
                return db.getRelatedProducts(id)
                    .then((results) => {
                        cache.set('/products/:product_id/related', id, JSON.stringify(results))
                        return results;
                    })
            }
        })
        .then((results) => response.json(results))
        .catch((err) => response.json(err))
})
app.listen(port, () => {
    console.log(`Latest app running on port ${port}. http://localhost:${port}`)
})