import { Product } from "./entities/Product";
import { __prod__ } from "../constants";
import { MikroORM } from '@mikro-orm/core';
import path from 'path';


export default {
    migrations: {
        path: path.join(__dirname, './migrations'), // path to the folder with migrations
        pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
    },
    entities: [Product],
    dbName: 'etStore',
    user: 'postgres',
    password: '121212',
    debug: !__prod__,
    type: 'postgresql'
} as Parameters<typeof MikroORM.init>[0]