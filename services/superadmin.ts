import { SuperAdmin } from '@prisma/client';
import { prisma } from '../prisma/db';

const findSuperAdminByUsername = async (username: string) => {
    return await prisma.superAdmin.findUnique({
        where: {
            username,
        }
    })
};

const findSuperAdminById = async (id) => {
    return await prisma.superAdmin.findUnique({
        where: {
            id,
        }
    })
};

const createSuperAdmin = async (superAdmin: SuperAdmin) => {
    return await prisma.superAdmin.create({
        data: superAdmin,
    })
}
export { findSuperAdminByUsername, findSuperAdminById , createSuperAdmin};