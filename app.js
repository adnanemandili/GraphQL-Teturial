// app.js
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema=require('./schema/schema');
// const { buildSchema } = require('graphql');

// // Construct a schema, using GraphQL schema language
// const schema = buildSchema(`
//   type Query {
//     hello: String
//   }
// `);

// // The root provides a resolver function for each API endpoint
// const root = {
//   hello: () => 'Hello world!',
// };

const app = express();

app.use('/graphql', graphqlHTTP({
    schema : schema,
    graphiql:true
//   schema: schema,
//   rootValue: root,
//   graphiql: true, // Enable GraphiQL interface
}));

app.listen(4000, () => {
  console.log('Express GraphQL Server Now Running On localhost:4000/graphql');
});

