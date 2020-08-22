import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class Product {

    @Field(() => String)
    id!: string;

    @Field(() => String)
    createdAt = new Date();

    @Field(() => String)
    updatedAt = new Date();

    @Field(() => String)
    title!: string;

}