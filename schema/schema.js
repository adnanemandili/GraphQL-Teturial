const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLList,
    // GraphQLNonNull
} = require('graphql');

const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Books',
    password: 'admin',
    port: 5432
});

const BookType = new GraphQLObjectType({
    name: "Book",
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        genre: { type: GraphQLString }
    })
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        book: {
            type: BookType,
            args: {
                id: { type: GraphQLString }
            },
            async resolve(parent, args) {
                const { rows } = await pool.query('SELECT * FROM book WHERE id = $1', [args.id]);
                return rows[0];
            }
        },
        books: {
            type: new GraphQLList(BookType),
            async resolve(parent, args) {
                const { rows } = await pool.query('SELECT * FROM book');
                return rows;
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addBook: {
            type: BookType,
            args: {
                name: { type: GraphQLString },
                genre: { type: GraphQLString }
            },
            async resolve(parent, args) {
                const { name, genre } = args;
                const { rows } = await pool.query('INSERT INTO book(name, genre) VALUES($1, $2) RETURNING *', [name, genre]);
                return rows[0];
            }
        },
        updateBook: {
            type: BookType,
            args: {
                id: { type: GraphQLString },
                name: { type: GraphQLString },
                genre: { type: GraphQLString }
            },
            async resolve(parent, args) {
                const { id, name, genre } = args;
                const { rows } = await pool.query('UPDATE book SET name = $1, genre = $2 WHERE id = $3 RETURNING *', [name, genre, id]);
                return rows[0];
            }
        },
        deleteBook: {
            type: BookType,
            args: {
                id: { type: GraphQLString }
            },
            async resolve(parent, args) {
                const { id } = args;
                const { rows } = await pool.query('DELETE FROM book WHERE id = $1 RETURNING *', [id]);
                return rows[0];
            }
        }
    }
});

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});

module.exports = schema;
