const { 
    GraphQLObjectType, // Defines a new GraphQL object type
    GraphQLString,     // Represents a string type in GraphQL
    GraphQLSchema,     // Creates a GraphQL schema that defines the entire GraphQL API
    GraphQLList,       // Represents a list type in GraphQL
} = require('graphql');

const { Pool } = require('pg'); // Imports the PostgreSQL client library

// Creates a PostgreSQL connection pool
const pool = new Pool({
    user: 'postgres',    // PostgreSQL username
    host: 'localhost',   // PostgreSQL host
    database: 'Books',   // PostgreSQL database name
    password: 'admin',   // PostgreSQL password
    port: 5432           // PostgreSQL port
});

// Defines the GraphQL Book type
const BookType = new GraphQLObjectType({
    name: "Book",             // Name of the GraphQL object type
    fields: () => ({          // Defines the fields of the Book type
        id: { type: GraphQLString },    // Represents the ID of the book
        name: { type: GraphQLString },  // Represents the name of the book
        genre: { type: GraphQLString }  // Represents the genre of the book
    })
});

// Defines the root query for retrieving data (GET mathod)
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",    // Name of the root query type
    fields: {
        book: {               // Defines a query to get a single book by ID
            type: BookType,   // Specifies the return type of the query
            args: {           // Specifies the arguments for the query
                id: { type: GraphQLString } // ID of the book to retrieve
            },
            async resolve(parent, args) {   // Resolves the query
                // Retrieves book data from the PostgreSQL database
                const { rows } = await pool.query('SELECT * FROM book WHERE id = $1', [args.id]);
                return rows[0];  // Returns the book data
            }
        },
        books: {              // Defines a query to get all books
            type: new GraphQLList(BookType),  // Specifies the return type of the query
            async resolve(parent, args) {     // Resolves the query
                // Retrieves all book data from the PostgreSQL database
                const { rows } = await pool.query('SELECT * FROM book');
                return rows;   // Returns all book data
            }
        }
    }
});

// Defines mutations for modifying data (POST,PUT,DELETE methods)
const Mutation = new GraphQLObjectType({
    name: 'Mutation',    // Name of the mutation type
    fields: {
        addBook: {        // Mutation to add a new book
            type: BookType,  // Specifies the return type of the mutation
            args: {          // Specifies the arguments for the mutation
                name: { type: GraphQLString },   // Name of the new book
                genre: { type: GraphQLString }   // Genre of the new book
            },
            async resolve(parent, args) {     // Resolves the mutation
                const { name, genre } = args;  // Destructures arguments
                // Inserts a new book into the PostgreSQL database
                const { rows } = await pool.query('INSERT INTO book(name, genre) VALUES($1, $2) RETURNING *', [name, genre]);
                return rows[0];   // Returns the newly added book
            }
        },
        updateBook: {     // Mutation to update an existing book
            type: BookType,  // Specifies the return type of the mutation
            args: {           // Specifies the arguments for the mutation
                id: { type: GraphQLString },   // ID of the book to update
                name: { type: GraphQLString }, // New name for the book
                genre: { type: GraphQLString } // New genre for the book
            },
            async resolve(parent, args) {   // Resolves the mutation
                const { id, name, genre } = args;  // Destructures arguments
                // Updates an existing book in the PostgreSQL database
                const { rows } = await pool.query('UPDATE book SET name = $1, genre = $2 WHERE id = $3 RETURNING *', [name, genre, id]);
                return rows[0];   // Returns the updated book
            }
        },
        deleteBook: {     // Mutation to delete an existing book
            type: BookType,  // Specifies the return type of the mutation
            args: {           // Specifies the arguments for the mutation
                id: { type: GraphQLString } // ID of the book to delete
            },
            async resolve(parent, args) {   // Resolves the mutation
                const { id } = args;   // Destructures arguments
                // Deletes an existing book from the PostgreSQL database
                const { rows } = await pool.query('DELETE FROM book WHERE id = $1 RETURNING *', [id]);
                return rows[0];   // Returns the deleted book
            }
        }
    }
});

// Creates the GraphQL schema that combines the root query and mutations
const schema = new GraphQLSchema({
    query: RootQuery,    // Specifies the root query
    mutation: Mutation   // Specifies the mutations
});

module.exports = schema;   // Exports the GraphQL schema for use in the application
