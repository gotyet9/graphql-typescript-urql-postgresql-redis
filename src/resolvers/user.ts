import { Resolver, Ctx, Arg, Mutation, ObjectType, Field } from "type-graphql";
import argon2 from 'argon2';
import { User } from "../entities/User";
import { MyContext } from "../types";
import { UsernamePasswordInput } from "./UsernamePasswordInput";

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
    @Mutation(() => User)
    async register(
        @Arg('userInput') userInput: UsernamePasswordInput,
        @Ctx() { em }: MyContext): Promise<User> {

        const hashedPassword = await argon2.hash(userInput.password);
        const user = em.create(User, {
            username: userInput.username,
            password: hashedPassword
        });
        await em.persistAndFlush(user);
        return user;
    }
    @Mutation(() => UserResponse)
    async login(
        @Arg("usernameOrEmail") usernameOrEmail: string,
        @Arg("password") password: string,
        @Ctx() { em }: MyContext): Promise<UserResponse> {
        const user = await em.findOne(User, { username: usernameOrEmail });
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
        return { user };
    }
}