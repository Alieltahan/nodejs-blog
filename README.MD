# Blog Management Project

This document serves as a guide for the development of a blog management application.

## Project Structure (Conceptual)

This section outlines the basic structure and functionality of the application's components.

Blog management
├───config
│   ├───custom-environment-variables.js # Config `env variables`.
│   ├───default.json # Config `fallback env` variables.
│   └───test.json # Config `test env` variables.
├───controller
│   ├───BlogController # for controlling the `Blog` logic.
│   └───UserController # for controlling the `User` logic.
├───middleware
│   ├───authorize # for authorizing the `user` for specific routes and adding the user object decoded via JWT to the req.body.user.
│   ├───validateObjectId # for validating the object ID (for `MongoDB ID` ) of blogs on specific routes.
│   └───error # for handling error happened during routes.
├───models
│   ├───blogsModel # Handling the `Blogs` Schema and validation.
│   ├───usersModel # Handling the `Users` Schema and validation.
│   └───types # Handle the types of Blogs/User Schema.
├───routes
│   ├───usersRoutes # Handling the `Users Routes`.
│   └───blogsRoutes # Handling the `Users Routes`.
├───services
│   ├───Logger # Custom Logger to console log / write files of errors via `winston`.
│   ├───usersRoutes # Handling the `Users Routes`.
│   └───blogsRoutes # Handling the `Users Routes`.
├───startup ( The needed functions to init the App )
│   ├───db # Establish DB connection.
│   ├───helmet # Enabling helmet lib for Security.
│   ├───objectIdValidation # Enabling  Joi object validation.
│   └───routes # Initializing App routes.
├───tests Includes Unit/Integration test files
├───Types Includes Types used for payload/request.
├───Utils
│   ├───AppError # Custom error handling.
│   └───constants # constants used around the App.
├───.gitignore ignored files for Git.
├───jest.config.js Config file for Jest.
├───tsconfig.json TS Config file.
└───index.js # App entry point.


### User Authentication

* **Sign Up:**
    * API Endpoint: `POST /api/signup`
    * Input: `email`, `password`, `name`
    * Validation:
        * `email`: Standard email format.
        * `password`: Complex password requirements (min 8 characters, alphanumeric).
    * Output: Success or error message.
* **Sign In:**
    * API Endpoint: `POST /api/login`
    * Input: `email`, `password`
    * Validation: Credentials.
    * Output: JWT token or error message.
* **Unit Tests:**
    * Verify signup and login functionality.
    * Test valid and invalid inputs.
    * Test successful and failed authentication.

### Blog Management

* **Create Blog:**
    * API Endpoint: `POST /api/blogs`
    * Input: `title`, `content`, `category`
    * Validation:
        * `title`: Required (non-empty string).
        * `content`: Required (non-empty string).
        * `category`: Optional string.
    * Output: Success or error message.
* **View Blogs:**
    * API Endpoint: `GET /api/blogs`
    * Input: Optional `category` query parameter for filtration via category.
    * Output: List of blogs.
* **Edit Blog (Owner Only):**
    * API Endpoint: `PUT /api/blogs/:id`
    * Input: `id` (blog ID), updates `title`/ `content`/ `category`
    * Validation:
        * `title`: Required string.
        * `content`: Required string.
        * `category`: Optional string.
        * **Ownership Check:** Verify that the authenticated user is the owner of the blog.
    * Output: Success or error message.
* **Delete Blog (Owner Only):**
    * API Endpoint: `DELETE /api/blogs/:id`
    * Input: `id` (blog ID)
    * **Ownership Check:** Verify that the authenticated user is the owner of the blog.
    * Output: Success or error message.
* **Ownership:**
    * Ensure users can only edit or delete their own blogs.

### Database

* **Users Table/Collection:**
    * `_id` Auto MongoDB id.
    * `email`
    * `hashedPassword`
    * `name`
* **Blogs Table/Collection:**
    * `_id` Auto MongoDB id.
    * `title`
    * `content`
    * `category`
    * `user` :{ `_id`, `name`, `email` } (Owner) // Saving it here for performance & less queries.
    * `createdAt`: Date
    * `updatedAt`: Date

## API Endpoints

### Authentication

* `POST /api/signup`: User registration.
* `POST /api/login`: User login.

### Blog

* `POST /api/blogs`: Create a new blog post.
* `GET /api/blogs`: Retrieve a list of blog posts (with optional category filtering).
* `PUT /api/blogs/:id`: Update an existing blog post (owner only).
* `DELETE /api/blogs/:id`: Delete a blog post (owner only).

## Testing

* Unit tests for authentication (signup and login).
