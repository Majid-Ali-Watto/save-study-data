# MongoDB-Powered Nuxt API for Posts Management

This project is a robust backend API built with Nuxt.js and MongoDB, designed to manage and serve posts data. It demonstrates a clean and efficient way to integrate a Nuxt application with a MongoDB database, enabling dynamic data fetching and management.

## Features

- **MongoDB Integration**: Utilizes MongoDB for storing and retrieving posts data, ensuring scalability and performance.
- **Typed API**: Implements TypeScript interfaces to enforce type safety for data structures and API responses.
- **Error Handling**: Includes comprehensive error handling to manage database connection issues and unexpected errors.
- **Environment-Specific Logging**: Differentiates error details for development and production environments for enhanced security.
- **Scalable Architecture**: The project is designed to be easily extendable to handle additional features and API endpoints.

## Key Endpoints

### `/api/get`
Fetches all posts stored in the MongoDB collection.

- **Request**: No parameters required.
- **Response**:
  - Success: Returns a list of posts with details like title, description, link, and creation date.
  - Failure: Returns an error message with debugging information in development mode.

### Example API Response
```json
{
  "success": true,
  "posts": [
    {
      "_id": "64b7f4c8f1a82e27d49e6b33",
      "title": "Nuxt MongoDB Integration",
      "description": "Learn how to connect MongoDB with Nuxt.js",
      "link": "https://example.com/nuxt-mongodb",
      "createdAt": "2024-12-11T10:00:00Z"
    }
  ]
}
```
### Technology Stack
**Nuxt.js**: A powerful framework for building server-side rendered Vue.js applications.
**MongoDB**: A NoSQL database chosen for its flexibility and ease of use.
**TypeScript**: Ensures type safety and reduces runtime errors.
**TailwindCSS**: (Optional) Can be used for styling frontend components.