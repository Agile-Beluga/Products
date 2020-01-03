const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'products',
    password: 'docker',
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


module.exports = {
    addData
}