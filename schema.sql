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
--     ID INTEGER,
--     PRODUCT_ID INTEGER REFERENCES products(ID),
--     NAME VARCHAR (100) NOT NULL,
--     SALE_PRICE VARCHAR (100),
--     ORIGINAL_PRICE VARCHAR (100),
--     DEFAULT_ITEM VARCHAR (100),
--     PRIMARY KEY (ID, PRODUCT_ID)
-- );

-- COPY styles 
-- FROM './csv_files/styles.csv' DELIMITER ',' CSV HEADER;

-- DROP TABLE IF EXISTS features;
-- CREATE TABLE features (
--     ID INTEGER,
--     PRODUCT_ID INTEGER REFERENCES products(ID),
--     FEATURE VARCHAR (1000),
--     VALUE VARCHAR (1000),
--     PRIMARY KEY (ID, PRODUCT_ID)
-- );

-- COPY features 
-- FROM './csv_files/features.csv' DELIMITER ',' CSV HEADER;

DROP TABLE IF EXISTS skus;
CREATE TABLE skus (
    ID INTEGER,
    STYLE_ID INTEGER REFERENCES styles(ID),
    SIZE VARCHAR (2),
    QUANTITY VARCHAR (1000),
    PRIMARY KEY (ID, STYLE_ID)
);

COPY skus 
FROM './csv_files/skus.csv' DELIMITER ',' CSV HEADER;

DROP TABLE IF EXISTS photos;
CREATE TABLE photos (
    ID INTEGER,
    PRODUCT_ID INTEGER REFERENCES products(ID),
    THUMBNAIL_URL VARCHAR (10000),
    URL VARCHAR (10000),
    PRIMARY KEY (ID, PRODUCT_ID)
);

COPY photos 
FROM './csv_files/photos.csv' DELIMITER ',' CSV HEADER;