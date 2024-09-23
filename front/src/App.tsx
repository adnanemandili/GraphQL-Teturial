import React, { useEffect, useState } from 'react'
import './App.css'
import { useQuery,gql } from '@apollo/client';
import { concatAST } from 'graphql';
import Home from './components/Home';


const App = () => {
  // const [data, setData] = useState(null); // 'data' will store the fetched authors

  // // Apollo Client setup
  // const client = new ApolloClient({
  //   uri: 'http://localhost:4000/graphql', // The endpoint for your GraphQL server
  //   cache: new InMemoryCache(),
  // });

  // Fetch the GraphQL query data
  // useEffect(() => {
  //   client
  //     .query({
  //       query: gql`
  //         {
  //           authors {
  //             id
  //             name
  //             books {
  //               id
  //               name
  //             }
  //           }
  //         }
  //       `,
  //     })
  //     .then((result) => setData(result.data)) // Update the state with query result
  //     .catch((error) => console.error('Error fetching data:', error)); // Handle any errors
  // }, []);
  const GET_AUTHORS =gql`
          {
            authors {
              id
              name
              books {
                id
                name
              }
            }
          }
        `;

  const {loading,error,data}=useQuery(GET_AUTHORS);
  // {data ? (
  //   <ul>
  //     {data.authors.map((author) => (
  //       <li key={author.id}>
  //         <strong>{author.name}</strong>
  //         <ul>
  //           {author.books.map((book) => (
  //             <li key={book.id}>{book.name}</li>
  //           ))}
  //         </ul>
  //       </li>
  //     ))}
  //   </ul>
  // ) : loading ? (
  //   <p>Loading...</p> // Show loading state while data is being fetched
  // ) : (
  //   <p>Error: {error.message}</p> // Show error message if an error occurs
  // )}
  return (
    <h1 className="text-3xl font-bold underline">
      <Home/>
    </h1>
  )
}

export default App

