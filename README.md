# Task Management Application Documentation

Welcome to the Task Management Application documentation. This application allows users to manage tasks efficiently and collaboratively. Below, you will find essential information about the application, installation, technology stack, and authentication.

## Application Overview

The Task Management Application is a web-based platform that enables users to create, manage, and collaborate on tasks. It offers real-time updates, ensuring seamless communication between users. Below is an overview of the technologies used in this application:

- **Node.js:** A JavaScript runtime environment for building the back-end of the application.
- **Express.js:** A web application framework running on Node.js, handling HTTP requests and routes.
- **PostgreSQL:** A document database for storing task data.
- **Passport:** Used for implementing OAuth authentication with Facebook, Google, and GitHub.
- **Redis:** A caching system used for storing temporary data.
- **Nodemailer:** A module for sending emails.

## Installation

To set up the Task Management Application locally, follow these steps:

1. Clone the back-end repository:

   ```bash
   git clone https://github.com/Lefjuu/tasks-management
   ```

2. Create an environment file (`.env`) with your configuration, including OAuth client IDs and secrets for Facebook, Google, and GitHub.

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the application:

   ```bash
   npm start
   ```


## Dependencies

Here are some of the key dependencies used in the application:

- **expressjs:** Handles and routes HTTP requests.
- **jsonwebtoken:** Generates JWTs for authentication.
- **sequalize:** Maps PostgreSQL data to JavaScript.
- **validator:** Provides string validation and sanitization.
- **passport:** Implements OAuth authentication with Facebook, Google, and GitHub.
- **redis:** Used for caching temporary data.
- **nodemailer:** Sends emails for various application functionalities.

## Application Structure (inside src)

- **index.js:** Entry point for the application.
- **app.js:** Defines the Express server, connects to DB and define Models, and connects to redis.
- **config/:** Contains environment variables.
- **lib/:** Contains config and connections to start servers.
- **api/auth/:** Defines everything about authorization.
- **api/controller/:** Contains functions for handling routes.
- **api/model/:** Contains schema definitions for PostgreSQL models.
- **api/routes/:** Defines route definitions for the API.
- **api/service/:** Includes database queries and other activities.
- **util/:** Contains additional features that don't fit elsewhere.

## Authentication

For a detailed API documentation and examples, please refer to the Postman Documentation. This documentation contains information about available API endpoints, their descriptions, parameters, responses, and authentication methods.

Developers and users can access the Postman documentation for a comprehensive guide on using the API and integrating it into their workflow effectively.

Authentication in the Task Management Application is based on JSON Web Tokens (JWT) and Passport. Passport is used to implement OAuth authentication with Facebook, Google, and GitHub. To ensure secure requests, the `Authorization` header is used with a valid JWT. Middleware is provided for request authentication. The required middleware configures JWT with the application's secret, resulting in a 401 status code for unauthenticated requests. The payload of the JWT can be accessed in the endpoint as `req.payload`. The optional middleware is configured the same way but doesn't return a 401 status code for unauthenticated requests.

## Caching and Email Notifications

The application utilizes Redis for caching temporary data, enhancing performance. Additionally, Nodemailer is used for sending email notifications, providing users with important updates and reminders.

You can expand on this documentation further to include specific OAuth setup instructions, Redis caching details, Nodemailer configuration, and any other specific functionalities related to caching and email notifications. This comprehensive documentation will assist users and developers in understanding the advanced features of your Task Management Application.
