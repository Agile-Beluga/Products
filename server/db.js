const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.AGILE_BELUGA_DB,
    database: 'postgres',
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
})

console.log(`connecting to db ${process.env.AGILE_BELUGA_DB} ${process.env.POSTGRES_USER}`)

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

// const getStyleByProductID = (id) => {
//     let styles = []
//     return pool.connect()
//         .then(client => {
//             return client.query('SELECT * FROM styles WHERE product_id=$1', [id])
//                 .then(({ rows }) => {
//                     styles = rows.map((row) => {
//                         row.style_id = row.id;
//                         delete row.id;
//                         delete row.product_id;
//                         row["default?"] = row.default_item;
//                         delete row.default_item;
//                         return row;
//                     });
//                     return Promise.all(styles.map(style =>
//                         client.query('SELECT * FROM skus WHERE style_id=$1', [style.style_id])))
//                 })
//                 .then((skus) => {
//                     styles.forEach((style, index) => {
//                         const styleSku = {};
//                         skus[index].rows.forEach((row) => styleSku[row.size] = row.quantity)
//                         style.skus = styleSku;
//                     })
//                     console.log("now querying photos")
//                     return Promise.all(styles.map(style =>
//                         client.query('SELECT * FROM photos WHERE style_id=$1', [style.style_id])))
//                 })
//                 .then((photos) => {
//                     console.log(photos.length + " style photos found")
//                     styles.forEach((style, index) => {
//                         console.log(index)
//                         const stylePhotos = [];
//                         photos[index].rows.forEach(({ thumbnail_url, url }) => {
//                             stylePhotos.push({ thumbnail_url, url })
//                         })
//                         style.photos = stylePhotos;
//                     })
//                     client.release()
//                     return {
//                         product_id: id,
//                         results: styles
//                     }
//                 })
//                 .catch(err => {
//                     client.release()
//                     console.log(err)
//                 })
//         })
// }

const getStyleByProductID = (id) => {

    // skus(ARRAY(SELECT '{ ' || sk.size || ': ' || sk.quantity || '}' FROM skus sk WHERE sk.style_id = s.id)),
    // LEFT JOIN skus sk ON sk.style_id=s.id

    // (SELECT ROW_TO_JSON(ROW(sk.size, sk.quantity)) FROM skus sk WHERE sk.style_id=s.id),

    let styles = []
    return pool.connect()
        .then(client => {
            return client.query(`SELECT s.id style_id, s.name, s.original_price, s.sale_price, s.default_item "default?", 
            (select array_to_json(array_agg(row_to_json(p)))
            from (
                select thumbnail_url, url
                from photos
                where photos.style_id=s.id) p
                ) photos,
                (select array_to_json(array_agg(row_to_json(sk)))
                    from (
                      select size, quantity
                      from skus
                      where skus.style_id=s.id) sk
                  ) skus
                 FROM 
            (SELECT * FROM styles WHERE product_id=$1) s`, [id])
                .then(({ rows }) => {
                    client.release()
                    rows.forEach((row) => {
                        const styleSkus = {}
                        row.skus.forEach((sku) => {
                            styleSkus[sku.size] = sku.quantity
                        })
                        row.skus = styleSkus;
                    })

                    return {
                        product_id: id,
                        results: rows
                    };
                })
                .catch(err => {
                    client.release()
                    console.log(err)
                })
        })
}

const getRelatedProducts = (id) => {
    return pool.connect()
        .then(client =>
            client.query('SELECT * FROM related where current_product_id=$1', [id])
                .then(({ rows }) => {
                    client.release()
                    console.log("related: " + rows)
                    return rows.map(row => row.related_product_id);
                })
                .catch(err => {
                    client.release()
                    return err
                })
        )
}

module.exports = {
    getProductList,
    getProductByID,
    getStyleByProductID,
    getRelatedProducts
}