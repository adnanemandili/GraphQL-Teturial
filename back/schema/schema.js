// schema.js

// Import necessary GraphQL modules
const { 
    GraphQLObjectType,     // Define GraphQL object types
    GraphQLString,         // Define GraphQL string type
    GraphQLSchema,         // Define GraphQL schema
    GraphQLList,           // Define GraphQL list type
    GraphQLNonNull ,        // Define GraphQL non-null type
    GraphQLInt
} = require('graphql');

// app.js
const { Pool } = require('pg');  // Import Pool from pg module
require('dotenv').config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
PGPASSWORD = decodeURIComponent(PGPASSWORD); // Decode password if needed

// Create a PostgreSQL connection pool
const pool = new Pool({
  host: PGHOST,               // Your Neon database host
  database: PGDATABASE,       // Your database name
  user: PGUSER,               // Your database username
  password: PGPASSWORD,       // Your database password
  port: 5432,                 // Default PostgreSQL port
  ssl: {
    rejectUnauthorized: false, // Set to false for local testing; true in production
  },
});

// Function to get PostgreSQL version
async function getPgVersion() {
  const client = await pool.connect(); // Get a client from the pool
  try {
    const result = await client.query('SELECT version()');
    console.log(result.rows[0]);
  } catch (error) {
    console.error("Error fetching PostgreSQL version:", error);
  } finally {
    client.release(); // Release the client back to the pool
  }
}

// Call the function
getPgVersion()

// Define the Author type
const AuthorType = new GraphQLObjectType({
    name: "Author",                 // Name of the GraphQL object type
    fields: () => ({                // Define the fields of the Author type
        id: { type: GraphQLString },   // Author ID
        name: { type: GraphQLString}, // Author name
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
                id: { type: new GraphQLNonNull(GraphQLString) } // ID of the book to retrieve
            },
            resolve(parent, args) {
                // Resolve function to fetch book data from the database
                return pool.query('SELECT * FROM book WHERE id = $1', [args.id])
                    .then(res => res.rows[0]);
            }
        },

        //Query to get the number of this elements , the number has been entred in args 
        findBooks: {
            type: new GraphQLList(BookType),  // Return a list of books
            args: {
                number: { type: new GraphQLNonNull(GraphQLString) }  // 'number' should be an integer
            },
            resolve(parent, args) {
                return pool.query('SELECT * FROM book ORDER BY id LIMIT $1', [args.number])
                    .then(res => res.rows);  // Return all rows, not just the first one
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
                id: { type: new GraphQLNonNull(GraphQLString) } // ID of the author to retrieve
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
                name: { type: new GraphQLNonNull(GraphQLString) },       // Name of the new book
                genre: { type: new GraphQLNonNull(GraphQLString) },      // Genre of the new book
                authorId: { type: GraphQLString }    // ID of the author who wrote the book
            },
            resolve(parent, args) {
                // Resolve function to add a new book to the database
                const { name, genre, authorId } = args;
                return pool.query('INSERT INTO book(name, genre, author_id) VALUES($1, $2, $3) RETURNING *', [name, genre, authorId])
                    .then(res => res.rows[0]);
            }
        },
         // Mutation pour mettre à jour un livre existant
         updateBook: {
            type: BookType,  // Type de retour de la mutation
            args: {
                id: { type: GraphQLString },   // ID du livre à mettre à jour
                name: { type: GraphQLString }, // Nouveau nom du livre
                genre: { type: GraphQLString } // Nouveau genre du livre
            },
            async resolve(parent, args) {
                const { id, name, genre } = args;
                // Mise à jour d'un livre existant dans la base de données PostgreSQL
                const { rows } = await pool.query('UPDATE book SET name = $1, genre = $2 WHERE id = $3 RETURNING *', [name, genre, id]);
                return rows[0];
            }
        },
        // Mutation pour supprimer un livre existant
        deleteBook: {
            type: BookType,  // Type de retour de la mutation
            args: {
                id: { type: GraphQLString } // ID du livre à supprimer
            },
            async resolve(parent, args) {
                const { id } = args;
                // Suppression d'un livre existant de la base de données PostgreSQL
                const { rows } = await pool.query('DELETE FROM book WHERE id = $1 RETURNING *', [id]);
                return rows[0];
            }
        },
        // Mutation to add a new author
        addAuthor: {
            type: AuthorType,    // Return type of the mutation
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) } // Name of the new author
            },
            resolve(parent, args) {
                // Resolve function to add a new author to the database
                const { name } = args;
                return pool.query('INSERT INTO author(name) VALUES($1) RETURNING *', [name])
                    .then(res => res.rows[0]);
            }
        },
        // Mutation pour mettre à jour un auteur existant
        updateAuthor: {
            type: AuthorType,  // Type de retour de la mutation
            args: {
                id: { type: GraphQLString },   // ID de l'auteur à mettre à jour
                name: { type: GraphQLString } // Nouveau nom de l'auteur
            },
            async resolve(parent, args) {
                const { id, name } = args;
                // Mise à jour d'un auteur existant dans la base de données PostgreSQL
                const { rows } = await pool.query('UPDATE author SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
                return rows[0];
            }
        },
        // Mutation pour supprimer un auteur existant
        deleteAuthor: {
            type: AuthorType,  // Type de retour de la mutation
            args: {
                id: { type: GraphQLString } // ID de l'auteur à supprimer
            },
            async resolve(parent, args) {
                const { id } = args;
                // Suppression d'un auteur existant de la base de données PostgreSQL
                const { rows } = await pool.query('DELETE FROM author WHERE id = $1 RETURNING *', [id]);
                return rows[0];
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
