# GraphQL Server with PostgreSQL Integration

This repository contains a GraphQL server implementation integrated with PostgreSQL, allowing you to perform CRUD operations on a "Book" entity.

## Features

- Query books by ID or retrieve all books
- Add a new book
- Update an existing book
- Delete a book

## Setup

1. **Create a new project with Node.js and Express.js:**

    ```bash
    mkdir graphql-postgresql-server
    cd graphql-postgresql-server
    npm init -y
    npm install express
    ```

2. **Install GraphQL dependencies:**

    ```bash
    npm install graphql express-graphql
    ```

3. **Install PostgreSQL dependency:**

    ```bash
    npm install pg
    ```

4. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/graphql-postgresql-server.git
    ```

5. **Install dependencies:**

    ```bash
    cd graphql-postgresql-server
    npm install
    ```

6. **Configure PostgreSQL:**

    - Make sure you have PostgreSQL installed and running on your machine.
    - Create a new database named `Books`.
    - Adjust the database connection settings in `schema.js` if necessary.

7. **Run the server:**

    ```bash
    npm start
    ```

    The server will start running on `http://localhost:4000`.

## Usage

- Use a tool like [GraphiQL](https://github.com/graphql/graphiql) to interact with the GraphQL server.
- Perform queries and mutations as described in the GraphQL schema.
- Sample GraphQL queries and mutations are provided in the code comments.

## GraphQL Schema

The GraphQL schema includes the following types and operations:

- **Types:**
    - `Book`: Represents a book entity with `id`, `name`, and `genre` fields.

- **Root Queries:**
    - `book`: Query to retrieve a book by ID.
    - `books`: Query to retrieve all books.

- **Mutations:**
    - `addBook`: Mutation to add a new book.
    - `updateBook`: Mutation to update an existing book.
    - `deleteBook`: Mutation to delete a book.

## Contributing

Feel free to contribute to this project by opening issues or submitting pull requests. Your contributions are welcome!

## License

This project is licensed under the [MIT License](LICENSE).
