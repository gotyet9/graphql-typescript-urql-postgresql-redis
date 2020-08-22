import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
export class User {

    @Field(() => String)
    id!: string;

    @Field(() => String)
    createdAt = new Date();

    @Field(() => String)
    updatedAt = new Date();

    @Field(() => String)
    username!: string;

    password!: string;

}