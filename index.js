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
    if (allowedOrigins.includes(origin) || !origin) {
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
    u
