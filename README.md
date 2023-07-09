# Linkcut Application Backend

This is the backend component of the Linkcut application. It provides functionality to shorten URLs and generate QR codes for them.

## Features

- User authentication: Users can create accounts and log in to the application.
- URL shortening: Users can shorten long URLs into shorter, more manageable links.
- QR code generation: The application generates QR codes for the shortened URLs.
- User-specific URL management: Users can view, edit, and delete their shortened URLs.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- Shortid
- qrcode

## Installation

1. Clone the repository:

```
git clone LINKCUT_BACKEND_REPO_LINK
```

2. Install dependencies:

```
cd linkcut-backend
npm install
```

3. Set up environment variables:

- Create a `.env` file in the root directory of the project.
- Copy the contents of the `sample.env` file into the `.env` file.
- Define the following environment variables in the `.env` file:

  ```
  PORT=<port_number>
  DATABASE_URL=<mongodb_connection_string>
  SECRET_KEY=<secret_key>
  etc.
  ```

4. Start the application:
    
    ```
    npm start
    ```

5. The backend server should now be running on the specified port (default: 3000).


## API Endpoints

- **POST /auth/register**: Creates a new user account.
- **POST /auth/login**: Authenticates and logs in a user.
- **POST /urls**: Shortens a URL and associates it with the authenticated user.
- **GET /urls**: Retrieves all URLs associated with the authenticated user.
- **GET /urls/:id**: Retrieves details of a specific URL.
- **PUT /urls/:id**: Updates a specific URL.
- **DELETE /urls/:id**: Deletes a specific URL.
- **GET /qrcode/:id**: Retrieves the QR code image for a specific URL.

## File Arrangement and Structure

- **index.js**: Entry point of the application.
- **app.js**: Sets up the Express.js application and middleware.
- **config**: Contains configuration files, such as database configuration and environment variables.
- **controllers**: Implements the application's logic and handles HTTP requests.
- **models**: Defines Mongoose models for user accounts and URLs.
- **routes**: Contains Express.js route handlers for different API endpoints.
- **middlewares**: Custom middleware functions used in the application.
- **services**: Implements various services, such as URL shortening and QR code generation.
- **utils**: Contains utility functions used throughout the application.
- **public**: Stores any static assets, such as CSS or client-side JavaScript files.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.


