const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');
const todos = require('./data.json');
const app = express();

const PORT = process.env.PORT || 3000;
const typeDefs = gql`
    type Query {
        todos: [Todo!]!
        todo(id: ID!): Todo!
    }
    type Mutation {
        newTodo(text: String!): Todo!
        updateTodo(id: ID!, text: String, completed: Boolean): Todo!
        deleteTodo(id: ID!): Todo!
    }
    type Todo {
        id: ID!
        text: String!
        completed: Boolean
    }
`;
const resolvers = {
    Query: {
        todos: () => todos,
        todo: (parent, args) => {
            return todos.find(todo => todo.id === args.id);
        }
    },
    Mutation: {
        newTodo: (parent, args) => {
            const todo = {
                id: String(todos.length + 1),
                text: args.text,
                completed: false
            }
            todos.push(todo);
            return todo;
        },
        updateTodo: (parent, args) => {
            const todoIndex = todos.findIndex(todo => todo.id === args.id);
            const todo = {
                id: args.id,
                text: args.text || todos[todoIndex].text,
                completed: args.completed || todos[todoIndex].completed
            };
            todos[todoIndex] = todo;
            return todo;
        },
        deleteTodo: (parent, args) => {
            const deleteTodo = todos.find(todo => todo.id === args.id);
            todos = todos.filter(todo => todo.id !== args.id);
            return deleteTodo;
        }
    }
};
const server = new ApolloServer({typeDefs, resolvers});
const startServer = async (typeDefs, resolvers) => {
    await server.start();
    server.applyMiddleware({app, path: '/'});
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
}
startServer();