const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'products',
    password: 'docker',
    port: 5432,
})

const createProduct = async (row) => {
    const { id, name, slogan, description, category, default_price, features, related } = row

    pool.query('INSERT INTO products (id, name, slogan, description, category, default_price, features, related) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [id, name, slogan, description, category, default_price, features, related], async (error, results) => {
            if (error) {
                return false;
            }
            return true;
        })
}

module.exports = {
    createProduct
}