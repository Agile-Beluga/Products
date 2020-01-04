const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: 'db',
    database: 'products',
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
})

const addData = (dataType, row, cb) => {
    if (dataType === "product") {
        const { id, name, slogan, description, category, default_price, features, related } = row
        pool.query('INSERT INTO products (id, name, slogan, description, category, default_price, features, related) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [id, name, slogan, description, category, default_price, features, related], (error, results) => {
                cb(error)
            })
    } else if (dataType === "features") {
        const { id, product_id, feature, value } = row;
        pool.query('INSERT INTO products (features) VALUES ($1) WHERE id=$2',
            [{ id, feature, value }, product_id], (error, result) => {
                cb(error)
            })
    }
}

const getProductList = (page, count) => {
    return pool.query('SELECT * FROM products LIMIT $1 OFFSET $2', [count, (page - 1) * count])
}

const getProductByID = (id) => {
    console.log(id)
    return pool.query('SELECT * FROM products WHERE id=$1', [id])
}

module.exports = {
    addData,
    getProductList,
    getProductByID
}