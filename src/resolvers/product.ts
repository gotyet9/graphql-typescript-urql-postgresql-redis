import { Resolver, Query, Ctx, Arg, Mutation } from "type-graphql";
import shortid from 'shortid';
import { Product } from "../entities/Product";
import { MyContext } from "../types";

@Resolver()
export class ProductResolver {
    @Query(() => [Product])
    products(@Ctx() { db }: MyContext): Promise<Product[]> {
        return db.collection('products').find({}).toArray();
    }
    @Query(() => Product, { nullable: true })
    product(
        @Arg('id') id: number,
        @Ctx() { db }: MyContext): Promise<Product | null> {
        return db.collection('products').findOne({ id });
    }
    @Mutation(() => Product)
    async addProduct(
        @Arg('title') title: string,
        @Ctx() { db }: MyContext): Promise<Product | null> {
        const productId = shortid.generate();
        await db.collection('products').insertOne({
            id: productId,
            createdAt: new Date(),
            updatedAt: new Date(),
            title
        });
        return db.collection('products').findOne({ id: productId });;
    }
}