// schema.js

// Import necessary GraphQL modules
const { 
    GraphQLObjectType,     // Define GraphQL object types
    GraphQLString,         // Define GraphQL string type
    GraphQLSchema,         // Define GraphQL schema
    GraphQLList,           // Define GraphQL list type
    GraphQLNonNull         // Define GraphQL non-null type
} = require('graphql');

// Import the PostgreSQL client
const { Pool } = require('pg');

// Create a PostgreSQL connection pool
const pool = new Pool({
    user: 'postgres',          // PostgreSQL username
    host: 'localhost',         // PostgreSQL host
    database: 'Books',         // PostgreSQL database name
    password: 'admin',         // PostgreSQL password
    port: 5432                 // Default PostgreSQL port
});

// Define the Author type
const AuthorType = new GraphQLObjectType({
    name: "Author",                 // Name of the GraphQL object type
    fields: () => ({                // Define the fields of the Author type
        id: { type: GraphQLString },   // Author ID
        name: { type: GraphQLString }, // Author name
        books: {                       // List of books written by the author
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // Retrieve books written by this author from the database
                return pool.query('SELECT * FROM book WHERE author_id = $1', [parent.id])
                    .then(res => res.rows);
            }
        }
    })
});

// Define the Book type
const BookType = new GraphQLObjectType({
    name: "Book",                   // Name of the GraphQL object type
    fields: () => ({                // Define the fields of the Book type
        id: { type: GraphQLString },      // Book ID
        name: { type: GraphQLString },    // Book name
        genre: { type: GraphQLString },   // Book genre
        authorId: { type: GraphQLString } // Author ID associated with the book
    })
});

// Define the Root Query
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",         // Name of the root query type
    fields: {
        // Query to get a single book by ID
        book: {
            type: BookType,        // Return type of the query
            args: {
                id: { type: GraphQLString } // ID of the book to retrieve
            },
            resolve(parent, args) {
                // Resolve function to fetch book data from the database
                return pool.query('SELECT * FROM book WHERE id = $1', [args.id])
                    .then(res => res.rows[0]);
            }
        },
        // Query to get all books
        books: {
            type: new GraphQLList(BookType), // Return type of the query
            resolve(parent, args) {
                // Resolve function to fetch all books from the database
                return pool.query('SELECT * FROM book')
                    .then(res => res.rows);
            }
        },
        // Query to get a single author by ID
        author: {
            type: AuthorType,       // Return type of the query
            args: {
                id: { type: GraphQLString } // ID of the author to retrieve
            },
            resolve(parent, args) {
                // Resolve function to fetch author data from the database
                return pool.query('SELECT * FROM author WHERE id = $1', [args.id])
                    .then(res => res.rows[0]);
            }
        },
        // Query to get all authors
        authors: {
            type: new GraphQLList(AuthorType), // Return type of the query
            resolve(parent, args) {
                // Resolve function to fetch all authors from the database
                return pool.query('SELECT * FROM author')
                    .then(res => res.rows);
            }
        }
    }
});

// Define Mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',          // Name of the mutation type
    fields: {
        // Mutation to add a new book
        addBook: {
            type: BookType,     // Return type of the mutation
            args: {
                name: { type: GraphQLString },       // Name of the new book
                genre: { type: GraphQLString },      // Genre of the new book
                authorId: { type: GraphQLString }    // ID of the author who wrote the book
            },
            resolve(parent, args) {
                // Resolve function to add a new book to the database
                const { name, genre, authorId } = args;
                return pool.query('INSERT INTO book(name, genre, author_id) VALUES($1, $2, $3) RETURNING *', [name, genre, authorId])
                    .then(res => res.rows[0]);
            }
        },
        // Mutation to add a new author
        addAuthor: {
            type: AuthorType,    // Return type of the mutation
            args: {
                name: { type: GraphQLString } // Name of the new author
            },
            resolve(parent, args) {
                // Resolve function to add a new author to the database
                const { name } = args;
                return pool.query('INSERT INTO author(name) VALUES($1) RETURNING *', [name])
                    .then(res => res.rows[0]);
            }
        }
    }
});

// Create the GraphQL Schema
const schema = new GraphQLSchema({
    query: RootQuery,           // Root query for retrieving data
    mutation: Mutation          // Mutation for modifying data
});

module.exports = schema;        // Export the GraphQL schema for use in the application
