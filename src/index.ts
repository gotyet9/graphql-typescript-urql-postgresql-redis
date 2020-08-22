import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from '../constants';
// import { Product } from './entities/Product';
import mikroConfig from './mikro-orm.config';

const main = async () => {
    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();
    // const product = orm.em.create(Product, { title: 'Macbook pro' });
    // await orm.em.persistAndFlush(product);
    // await orm.em.nativeInsert(Product, { title: "my actual product" })
}

main().catch(error => console.error(error));