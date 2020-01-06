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
            }).then(({ rows }) => rows)
    } else if (dataType === "features") {
        const { id, product_id, feature, value } = row;
        pool.query('INSERT INTO products (features) VALUES ($1) WHERE id=$2',
            [{ id, feature, value }, product_id], (error, result) => {
                cb(error)
            }).then(({ rows }) => rows)
    }
}

const getProductList = (page = 1, count = 5) => {
    console.log("getting product list")
    return pool.query('SELECT * FROM products LIMIT $1 OFFSET $2'
    [count, (page - 1) * count]).then(({ rows }) => rows)
}

const getProductByID = (id) => {
    return Promise.all([
        pool.query('SELECT * FROM products where id=$1', [id]),
        pool.query('SELECT * FROM features where product_id=$1', [id])
    ]).then(([productResults, featureResults]) => [productResults.rows[0], featureResults.rows])
        .then(([productInfo, featureInfo]) => {
            productInfo.features = featureInfo;
            console.log(`productInfo ${JSON.stringify(productInfo)}
            featureInfo ${JSON.stringify(featureInfo)}`)
            return productInfo;
        })
}

const getStyleByProductID = (id) => {
    console.log(id)
    return pool.query('SELECT * FROM styles LEFT OUTER JOIN photos on styles.id=photos.style_id WHERE product_id=$1', [id]).then(({ rows }) => rows)
}

module.exports = {
    addData,
    getProductList,
    getProductByID,
    getStyleByProductID
}