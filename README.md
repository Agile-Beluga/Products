# Agile Beluga Products API

Back-end system designed to handle high volumes of traffic for 4 products endpoints

## Endpoints

### GET /products/list

- **Parameters**: page, count
- **Response**: List of products

### GET /products/:product_id

- **Response**: Product level information

### GET /products/:product_id/styles

- **Response**: Style information for a given product

### GET /products/:product_id/related

- **Response**: Product IDs for products related to given product

## Technologies Used

- Postgres
- Express
- Node
- Redis
- Docker
- AWS

## Outcomes

Initial load tests were optimized by adding a Redis cache, resulting in a throughput increase of 50%.

[Summary Slides](https://docs.google.com/presentation/d/1NxMgmeyWt9WPl5I6GIqTdtjxwND3BOJDya-QxdFOlmU/edit#slide=id.g7c6a004845_1_49)

## Setup

### 1. Create 3 separate EC2 instances
Install docker on all of them using the following commands:
```
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
apt-cache policy docker-ce
sudo apt-get install -y docker-ce
sudo usermod -a -G docker ubuntu
```
Log out and log back in

### 2. Set up PostgreSQL Database
Ensure security group for Postgres is set up on AWS (Postgres: 5432)
```bash
mkdir data
docker run --rm --name db -e POSTGRES_PASSWORD=password -d -p 5432:5432 -v $PWD/data:/var/lib/postgresql/data postgres
```
Bash in to terminal to check if it's running:
```bash
docker exec -it db bash
psql -U postgres
```

Check on local computer:
`psql -d postgres -U postgres -h $AGILE_BELUGA_DB -p 5432`

Do load data onto EC2 DB instance:
```bash
psql -d postgres -U postgres -h $AGILE_BELUGA_DB -p 5432 -c "\copy products (id, name, slogan, description, category, default_price) FROM '$PWD/csv-files/product.csv' DELIMITER ',' CSV HEADER;"
psql -d postgres -U postgres -h $AGILE_BELUGA_DB -p 5432 -c "\copy styles FROM '$PWD/csv-files/styles.csv' DELIMITER ',' CSV HEADER;"
psql -d postgres -U postgres -h $AGILE_BELUGA_DB -p 5432 -c "\copy features FROM './csv-files/features.csv' DELIMITER ',' CSV HEADER;"
psql -d postgres -U postgres -h $AGILE_BELUGA_DB -p 5432 -c "\copy skus FROM './csv-files/skus.csv' DELIMITER ',' CSV HEADER;"
psql -d postgres -U postgres -h $AGILE_BELUGA_DB -p 5432 -c "\copy tempPhotos FROM './csv-files/photos.csv' DELIMITER ',' CSV HEADER;"
psql -d postgres -U postgres -h $AGILE_BELUGA_DB -p 5432 -c "\copy related FROM './csv-files/related.csv' DELIMITER ',' CSV HEADER;"
```
### 3. Set up Node Server
Ensure TCP Port 3000 is open on EC2

Set up bash profile on EC2 instance (`vim ~/.bash_profile):
```bash
export NODE_ENV='production'
export POSTGRES_PASSWORD='password'
export POSTGRES_USER='postgres'
export AGILE_BELUGA_DB=[DB_IP_ADDRESS]
alias refresh='docker stop ubuntu_redis_1 && docker pull lainermeister/agile-beluga-products && docker-compose up -d'
```
Set up a `redis.conf` file with the following:
```conf
maxmemory 250mb
maxmemory-policy allkeys-lru
```
Set up a `docker-compose.yml` file with the following:
```yml
version: '3.2'
services:
  redis:
    image: redis
    volumes:
      - $PWD/redis.conf:/usr/local/etc/redis/redis.conf
    command: "/usr/local/etc/redis/redis.conf"
  web:
    # build: .
    depends_on:
      - redis
    image: lainermeister/agile-beluga-products
    working_dir: /app
    environment:
      - NODE_ENV=production
      - POSTGRES_PASSWORD=[PASSWORD]
      - POSTGRES_USER=postgres
      - AGILE_BELUGA_DB=[DB_IP_ADDRESS]
    ports:
      - "3000:3000"
    command: "npm start"
 ```
Type `refresh` to run server.

### 4. Set up Client
Ensure TCP Port 3000 is open on EC2
Set up bash profile on EC2 instance (`vim ~/.bash_profile`):
`alias refresh='docker pull lainermeister/kartify-front-end && docker-compose up -d'`
Set up a `docker-compose.yml` file with the following:
```yml
version: '3.2'
services:
  web:
    image: lainermeister/kartify-front-end
    working_dir: /app
    environment:
      - PORT=3000
      - PRODUCT_SERVER=[SERVER_IP_ADDRESS]
      - CLOUD_NAME=drkqjbjvd
      - CLOUD_API_KEY=624315126115589
      - CLOUD_API_SECRET=mRRZKkpU1nG56SHohQ7J-M3q7kw
      - ENVIRONMENT=production
    ports:
      - "3000:3000"
    command: "npm start"
```
Type `refresh` to start.
Navigate to `http:[CLIENT_ENDPOINT]:3000/products/1` to view site.
