const express = require('express');
const {ApolloServer,gql} = require('apollo-server-express');

const PORT = process.env.PORT || 3000;
const app = express();

const typeDefs = gql`
    type Query {
        hello: String
    }
`;
const resolvers = {
    Query: {
        hello: () => 'Hello World'
    }
};
const server = new ApolloServer({typeDefs, resolvers});
const startApolloServer = async (typeDefs, resolvers) => {
    await server.start();
    server.applyMiddleware({app, path: '/'});
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    })
}
startApolloServer();

