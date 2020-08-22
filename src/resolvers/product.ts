import { Resolver, Query, Ctx, Arg, Mutation } from "type-graphql";
import { Product } from "../entities/Product";
import { MyContext } from "../types";

@Resolver()
export class ProductResolver {
    @Query(() => [Product])
    products(@Ctx() { em }: MyContext): Promise<Product[]> {
        return em.find(Product, {});
    }
    @Query(() => Product, { nullable: true })
    product(
        @Arg('id') id: number,
        @Ctx() { em }: MyContext): Promise<Product | null> {
        return em.findOne(Product, { id });
    }
    @Mutation(() => Product)
    async addProduct(
        @Arg('title') title: string,
        @Ctx() { em }: MyContext): Promise<Product> {
        const product = em.create(Product, { title });
        await em.persistAndFlush(product);
        return product;
    }
}