🛠 Basic Setup Instructions
Clone the Repository to folder
terminal command "git clone https://github.com/The42-Digital-Agency/horizon-hobby-backend.git"

Create .env file in root project folder

Install Dependencies in root project folder
terminal command "npm install"

Run the Application
terminal command "npm run start"

##########################

📦 Import API Documentation
This API is designed to manage product imports from an external source to a local database and to Shopify.

Base URL

http://localhost:3000/api/import
1. POST /api/import

Description

Creates products in Shopify based on the provided productIds.

Request Body

Type: application/json

Format:
JSON
{
  "productIds": ["TAM35379", "TAM35386", ..., "TAM14137"]
}
Maximum: 100 product IDs (strings) in the array.

Response

Returns the status of each product ID:

JSON

{
  "notFoundProductIds": ["TAM35379", "TAM35386"],
  "foundProductIds": ["TAM14137", "TAM14136", "TAM14134"]
}
notFoundProductIds: Product IDs that were not found or could not be uploaded to Shopify.

foundProductIds: Product IDs that were found and successfully uploaded to Shopify.

http://localhost:3000/api/import/save-in-database

2. GET /api/import/save-in-database

Description

Fetches products from the external API (https://apis.horizonhobby.com/products/api/v1/items/) and creates or updates them in the local database.

Response

Returns a success or failure status with optional details.

