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
        .then(client => {
            return client.query(`SELECT *, 
            (SELECT array_to_json(array_agg(row_to_json(f))) features 
            FROM (select feature, value from features where product_id=$1) f) 
            FROM products where id=$1`, [id])
                .then(({ rows }) => {
                    client.release()
                    return rows[0]
                })
                .catch(err => {
                    client.release()
                    return err
                })
        })
}
/* `SELECT s.id style_id, s.name, s.original_price, s.sale_price, s.default_item "default?", 
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
            (SELECT * FROM styles WHERE product_id=2) s` */
const getStyleByProductID = (id) => {
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
                    console.log("rows: " + JSON.stringify(rows))
                    rows.forEach((row) => {
                        const styleSkus = {}
                        console.log(`skus & photos ${JSON.stringify(row.skus)} ${typeof row.skus}
                        ${JSON.stringify(row.photos)} ${typeof row.photos}
                        `)
                        if (row.skus !== null) {
                            row.skus.forEach((sku) => styleSkus[sku.size] = sku.quantity)
                        } else {
                            console.log("skus is null")
                            styleSkus.null = null;
                        }
                        console.log("line 91")
                        if (row.photos !== null) {
                            console.log("photos is not null")
                        } else {
                            console.log("photos is null")
                            row.photos = [{
                                thumbnail_url: null,
                                url: null
                            }]
                        }
                        row.skus = styleSkus;
                        row.sale_price === "null" ? row.sale_price = "0" : row.sale_price = row.sale_price;
                    })
                    console.log("cleaned rows: " + JSON.stringify(rows))
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