-- DROP TABLE IF EXISTS products;
-- CREATE TABLE products (
--     ID INT PRIMARY KEY,
--     NAME VARCHAR (100) NOT NULL,
--     SLOGAN VARCHAR (1000),
--     DESCRIPTION VARCHAR (1000),
--     CATEGORY VARCHAR (100) NOT NULL,
--     DEFAULT_PRICE VARCHAR (100),
--     RELATED INTEGER[]
-- );

-- COPY products (id, name, slogan, description, category, default_price) 
-- FROM './csv_files/product.csv' DELIMITER ',' CSV HEADER;

-- DROP TABLE IF EXISTS styles;
-- CREATE TABLE styles (
--     ID INTEGER PRIMARY KEY,
--     PRODUCT_ID INTEGER,
--     NAME VARCHAR (100) NOT NULL,
--     SALE_PRICE VARCHAR (100),
--     ORIGINAL_PRICE VARCHAR (100),
--     DEFAULT_ITEM VARCHAR (100),
--     FOREIGN KEY (PRODUCT_ID) REFERENCES products(ID)
-- );

-- COPY styles 
-- FROM './csv_files/styles.csv' DELIMITER ',' CSV HEADER;

-- DROP TABLE IF EXISTS features;
-- CREATE TABLE features (
--     ID INTEGER PRIMARY KEY,
--     PRODUCT_ID INTEGER,
--     FEATURE VARCHAR (1000),
--     VALUE VARCHAR (1000),
--     FOREIGN KEY (PRODUCT_ID) REFERENCES products(ID)
-- );

-- COPY features 
-- FROM './csv_files/features.csv' DELIMITER ',' CSV HEADER;

-- DROP TABLE IF EXISTS skus;
-- CREATE TABLE skus (
--     ID INTEGER PRIMARY KEY,
--     STYLE_ID INTEGER,
--     SIZE VARCHAR (10),
--     QUANTITY VARCHAR (1000),
--     FOREIGN KEY (STYLE_ID) REFERENCES styles(ID)
-- );

-- COPY skus 
-- FROM './csv_files/skus.csv' DELIMITER ',' CSV HEADER;

-- DROP TABLE IF EXISTS tempPhotos;
-- CREATE TABLE tempPhotos (
--     ID INTEGER,
--     PRODUCT_ID INTEGER,
--     THUMBNAIL_URL VARCHAR (100000),
--     URL VARCHAR (100000)
-- );

-- COPY tempPhotos 
-- FROM './csv_files/photos.csv' DELIMITER ',' CSV HEADER;

DROP TABLE IF EXISTS photos;
CREATE TABLE photos (
    ID INTEGER PRIMARY KEY,
    PRODUCT_ID INTEGER,
    THUMBNAIL_URL VARCHAR (100000),
    URL VARCHAR (100000)
);

INSERT INTO photos SELECT * FROM tempPhotos ON CONFLICT DO NOTHING;