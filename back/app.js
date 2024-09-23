// // app.js
// const express = require('express');
// const { graphqlHTTP } = require('express-graphql');
// const schema=require('./schema/schema');
// // const { buildSchema } = require('graphql');

// // // Construct a schema, using GraphQL schema language
// // const schema = buildSchema(`
// //   type Query {
// //     hello: String
// //   }
// // `);

// // // The root provides a resolver function for each API endpoint
// // const root = {
// //   hello: () => 'Hello world!',
// // };

// const app = express();

// app.use('/graphql', graphqlHTTP({
//     schema : schema,
//     graphiql:true
// //   schema: schema,
// //   rootValue: root,
// //   graphiql: true, // Enable GraphiQL interface
// }));

// app.listen(4000, () => {
//   console.log('Express GraphQL Server Now Running On localhost:4000/graphql');
// });

// app.js

// Import necessary modules
const express = require('express');
const { graphqlHTTP } = require('express-graphql'); // Import GraphQL HTTP middleware
const schema = require('./schema/schema'); // Import GraphQL schema
const cors = require('cors');

// Create an Express application
const app = express();

//cros 
app.use(cors({
    origin: 'http://localhost:5174',
}));

// Define GraphQL endpoint
app.use('/graphql', graphqlHTTP({
    schema: schema, // Specify the GraphQL schema
    graphiql: true // Enable GraphiQL interface for easy testing and development
}));

// Start the Express server
app.listen(4000, () => {
    console.log('Express GraphQL Server Now Running On localhost:4000/graphql');
});


