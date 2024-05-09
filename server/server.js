const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');
const User = require('./models/user');

const typeDefs = gql`
    type Query {
        user(id:ID!): User!
    }

    type Mutation {
        addUser(userInput: UserInput): User!
    }

    type User {
        _id: ID!
        email: String!
        password: String!
    }

    input UserInput {
        email: String!
        password: String!
    }

`;

const resolvers = {
    Query: {
        user: async (parent, args) => {
            try {
                const user = await User.findOne({_id: args.id});
                return {...user._doc};
            } catch (err) {
                throw err;
            }
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            try {
                const user = new User({
                    email: args.userInput.email,
                    password: args.userInput.password
                });

                const result = await user.save();

                return {
                    ...result._doc
                }
            } catch (err) {
                throw err;
            }
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

const PORT = process.env.PORT ||  5000;
mongoose.connect(`mongodb+srv://graphqluser:LW8mzSQwFeAXqKkD@cluster0.gmyc9mz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    server.listen(PORT, () => {
        console.log(`Running running on port ${PORT}`);
    });
}).catch(err => {
    console.log(err);
})