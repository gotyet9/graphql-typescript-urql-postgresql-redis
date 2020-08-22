import 'reflect-metadata';
import { __prod__ } from '../constants';
import express from 'express';
import { MongoClient } from 'mongodb';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { ProductResolver } from './resolvers/product';
import { RegisterResolver } from './resolvers/user';

import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from './types';

const main = async () => {
    const uri = "mongodb+srv://admin:admin@cluster0.kbyq2.mongodb.net/etshop?retryWrites=true&w=majority";
    const db_name = 'etshop';
    const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const dbClient = await mongoClient.connect();
    const db = dbClient.db(db_name);

    const app = express();

    const redisStore = connectRedis(session);
    const redisClient = redis.createClient();

    app.use(
        session({
            name: 'qid',
            store: new redisStore({
                client: redisClient,
                disableTouch: true
            }),
            cookie: {
                maxAge: 1000 * 60 * 24 * 365, // 1 year
                httpOnly: true,
                sameSite: 'lax', // csrf
                secure: __prod__ // cookies only work in https
            },
            saveUninitialized: false,
            secret: 'shgdsaduwbfbfjhsafjsaf',
            resave: false,
        })
    )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [ProductResolver, RegisterResolver],
            validate: false
        }),
        context: ({ req, res }): MyContext => ({ db, dbClient, req, res })
    })

    apolloServer.applyMiddleware({ app })

    app.listen(5242, () => {
        console.log(`server running at localhost:4000`)
    })
}

main().catch(error => console.error(error));