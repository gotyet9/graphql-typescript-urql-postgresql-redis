import { Resolver, Ctx, Arg, Mutation, ObjectType, Field, Query } from "type-graphql";
import argon2 from 'argon2';
import { User } from "../entities/User";
import { MyContext } from "../types";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import shortid from "shortid";

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}


@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User;
}

@Resolver()
export class RegisterResolver {
    @Query(() => User, { nullable: true })
    me(@Ctx() { db, req }: MyContext) {
        // you are not logged in
        if (!req.session!.userId) {
            return null;
        }
        return db.collection('users').findOne({ id: req.session!.userId });
    }
    @Mutation(() => User)
    async register(
        @Arg('userInput') userInput: UsernamePasswordInput,
        @Ctx() { db }: MyContext): Promise<User | null> {
        const hashedPassword = await argon2.hash(userInput.password);
        const userId = shortid.generate();
        await db.collection('users').insertOne({
            id: userId,
            createdAt: new Date(),
            updatedAt: new Date(),
            username: userInput.username,
            password: hashedPassword
        });
        return db.collection('users').findOne({ id: userId });;
    }
    @Mutation(() => UserResponse)
    async login(
        @Arg("usernameOrEmail") usernameOrEmail: string,
        @Arg("password") password: string,
        @Ctx() { db, req }: MyContext): Promise<UserResponse> {
        const user = await db.collection('users').findOne({ username: usernameOrEmail });
        if (!user) {
            return {
                errors: [
                    {
                        field: "usernameOrEmail",
                        message: "that username doesn't exist",
                    },
                ],
            };
        }
        const valid = await argon2.verify(user.password, password);
        if (!valid) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "incorrect password",
                    },
                ],
            };
        }

        // store userId in session

        req.session!.userId = user.id;

        return { user };
    }
}