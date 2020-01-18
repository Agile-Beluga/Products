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

### Outcomes

Initial load tests were optimized by adding a Redis cache, resulting in a throughput increase of 50%.

[Summary Slides](https://docs.google.com/presentation/d/1NxMgmeyWt9WPl5I6GIqTdtjxwND3BOJDya-QxdFOlmU/edit#slide=id.g7c6a004845_1_49)
