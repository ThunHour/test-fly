import { User } from '@prisma/client';
import { prisma } from '../prisma/db';
import bcrypt from 'bcrypt';

const findUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: {
            email,
        }
    })
};

const createUserByEmailAndPassword = async (user: User) => {
    user.password = bcrypt.hashSync(user.password, 12);
    return await prisma.user.create({
        data: user
    })
};

const findUserById = async (id) => {
    return await prisma.user.findUnique({
        where: {
            id
        }
    })
}


export { findUserByEmail, createUserByEmailAndPassword, findUserById};