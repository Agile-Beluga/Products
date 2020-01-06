const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: 'db',
    database: 'products',
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
})

const getProductList = (page = 1, count = 5) => {
    return pool.query('SELECT * FROM products LIMIT $1 OFFSET $2',
        [count, (page - 1) * count]).then(({ rows }) => rows)
}

const getProductByID = (id) => {
    return Promise.all([
        pool.query('SELECT * FROM products where id=$1', [id]),
        pool.query('SELECT * FROM features where product_id=$1', [id])
    ]).then(([productResults, featureResults]) => [productResults.rows[0], featureResults.rows])
        .then(([productInfo, featureInfo]) => {
            productInfo.features = featureInfo;
            return productInfo;
        })
}

const getStyleByProductID = (id) => {
    return pool.query('SELECT * FROM styles LEFT OUTER JOIN photos on styles.id=photos.style_id WHERE product_id=$1', [id]).then(({ rows }) => rows)
}

module.exports = {
    getProductList,
    getProductByID,
    getStyleByProductID
}