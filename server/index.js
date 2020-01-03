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
// app.post('/products', (request, response) => {
//     const errorIds = [];
//     const successIds = [];
//     fs.createReadStream('./data/product.csv')
//         .pipe(csv())
//         .on('data', (row) => {
//             db.createProduct(row, (err) => {
//                 if (err) {
//                     errorIds.push(row.id)
//                 } else {
//                     successIds.push(row.id)
//                 }
//             });

//         })
//         .on('end', () => {
//             console.log('CSV file successfully processed');
//             response.status(200).send({
//                 num_success: successIds.length,
//                 error_ids: errorIds
//             })
//         });
// })

// app.put('/features', (request, response) => {
//     const errorIds = [];
//     const successIds = [];
//     fs.createReadStream('./data/features.csv')
//         .pipe(csv())
//         .on('data', (row) => {
//             db.addFeatures(row, (err) => {
//                 if (err) {
//                     errorIds.push(row.id)
//                 } else {
//                     successIds.push(row.id)
//                 }
//             });
//         })
//         .on('end', () => {
//             console.log('CSV file successfully processed');
//             response.status(200).send({
//                 num_success: successIds.length,
//                 error_ids: errorIds
//             })
//         });
// })
app.listen(port, () => {
    console.log(`App running on port ${port}. http://localhost:${port}`)
})


