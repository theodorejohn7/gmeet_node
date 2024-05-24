const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { createServer } = require('http');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { useServer } = require('graphql-ws/lib/use/ws');
const { WebSocketServer } = require('ws');
const cors = require('cors');

let participants = [];

const app = express();

const allowedOrigins = ['https://meet.google.com', 'https://gmeet-fe.vercel.app'];

app.use(cors({
  origin: (origin, callback) => {
    // if (allowedOrigins.includes(origin) || !origin) {
    if (origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// GraphQL schema
const typeDefs = gql`
  type Query {
    participants: [String]
  }

  type Mutation {
    updateParticipants(participants: [String]!): [String]
  }

  type Subscription {
    participantsUpdated: [String]
  }
`;

// PubSub for subscriptions
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const resolvers = {
  Query: {
    participants: () => participants,
  },
  Mutation: {
    updateParticipants: (_, { participants: newParticipants }) => {
      participants = newParticipants;
      pubsub.publish('PARTICIPANTS_UPDATED', { participantsUpdated: participants });
      return participants;
    },
  },
  Subscription: {
    participantsUpdated: {
      subscribe: () => pubsub.asyncIterator(['PARTICIPANTS_UPDATED']),
    },
  },
};

// Create GraphQL schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create Apollo server
const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    // Handle any additional context setup if needed
  },
  cors: false,
});
await server.start();

// Apply middleware to express app
server.applyMiddleware({ app, path: '/graphql', cors: false }); // Disable default CORS handling by Apollo

// Create HTTP server
const httpServer = createServer(app);

// Create WebSocket server
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
  verifyClient: (info, cb) => {
    const origin = info.origin;
    if (allowedOrigins.includes(origin)) {
      cb(true);
    } else {
      cb(false, 403, 'Forbidden');
    }
  },
});

// Use WebSocket server
useServer({ schema }, wsServer);

// Start the server
httpServer.listen(3000, () => {
  console.log('Server is running on port 3000');
});
