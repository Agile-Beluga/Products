const Sequelize = require('sequelize');

// Option 1: Passing parameters separately
// const sequelize = new Sequelize('products', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
//     host: 'db',
//     dialect: 'postgres'
// });

// sequelize
//     .authenticate()
//     .then(() => {
//         console.log('Connection has been established successfully.');
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });

const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: 'db',
    database: 'products',
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
})

const getProductList = (page = 1, count = 5) => {
    return pool.connect()
        .then(client => client.query('SELECT * FROM products LIMIT $1 OFFSET $2', [count, (page - 1) * count])
            .then(({ rows }) => {
                client.release()
                return rows
            })
            .catch(err => {
                client.release()
                return err
            }))
    // return pool.query('SELECT * FROM products LIMIT $1 OFFSET $2',
    //     [count, (page - 1) * count]).then(({ rows }) => rows)
}

const getProductByID = (id) => {
    return pool.connect()
        .then(client =>
            Promise.all([
                client.query('SELECT * FROM products where id=$1', [id]),
                client.query('SELECT * FROM features where product_id=$1', [id])
            ]).then(([productResults, featureResults]) => [productResults.rows[0], featureResults.rows])
                .then(([productInfo, featureInfo]) => {
                    client.release()
                    productInfo.features = featureInfo;
                    return productInfo;
                })
                .catch(err => {
                    client.release()
                    return err
                })
        )
}

const getStyleByProductID = (id) => {
    let styles = []
    return pool.connect()
        .then(client => {
            return client.query('SELECT * FROM styles WHERE product_id=$1', [id])
                .then(({ rows }) => {
                    styles = rows;
                    return Promise.all(styles.map(style =>
                        client.query('SELECT * FROM skus WHERE style_id=$1', [style.id])))
                })
                .then((skus) => {
                    console.log("skus: " + JSON.stringify(skus[0].rows))
                    styles.forEach((style, index) => {
                        console.log(index)
                        const styleSku = {};
                        skus[index].rows.forEach((row) => styleSku[row.size] = row.quantity)
                        style.skus = styleSku;
                    })
                    client.release()
                    return {
                        product_id: id,
                        results: styles
                    }
                })
                .catch(err => {
                    client.release()
                    console.log(err)
                })
        })


}

module.exports = {
    getProductList,
    getProductByID,
    getStyleByProductID
}