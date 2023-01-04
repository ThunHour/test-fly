import { User } from '@prisma/client';
// import { prisma } from '../prisma/db';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

const findCustomerById = async (id) => {
    return await prisma.customer.findUnique({
        where: {
            id
        }
    })
}

export { findCustomerById }