const csv = require('csv-parser');
const fs = require('fs');

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const db = require('../db')

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})
app.post('/products', (request, response) => {
    const errorIds = [];
    const successIds = [];
    fs.createReadStream('./data/product.csv')
        .pipe(csv())
        .on('data', async (row) => {
            let added = await db.createProduct(row, response);
            if (added) {
                console.log(`success @ ${row.id}`)
                successIds.push(row.id)
            } else {
                console.log(`fail @ ${row.id}`)
                errorIds.push(row.id)
            }
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
            response.status(200).send({
                success: successIds,
                errors: errorIds
            })
        });

})
app.listen(port, () => {
    console.log(`App running on port ${port}. http://localhost:${port}`)
})


