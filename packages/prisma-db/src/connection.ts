import db from '@repo/prisma-db/client';

export const updateConnection = async (id: string, name: string) => {
    const connection = await db.connection.update({
        where: {
            id
        },
        data: {
            name
        }
    });
    return connection;
}

export const deleteConnection = async (id: string) => {
    const connection = await db.connection.delete({
        where: {
            id
        }
    });
    return connection;
}

export const getConnectionsByUser = async (userId: string) => {
    const connections = await db.connection.findMany({
        where: {
            userId
        }
    });
    return connections;
}

export const getConnectionsByUserAndType = async (userId: string, type: string) => {
    try {
        const connections = await db.connection.findMany({
            where: {
                userId,
                type
            }
        });
        return connections;
    }
    catch (error) {
        return null;
    }
}


export const createConnection = async ({name, type, userId, details }: any) => {
    const result = await db.connection.create({
        data:{
            name: name,
            type: type,
            userId: userId,
            details: details
        }
    });
    return result;
}

export const getConnectionById = async (id: string) => {
    const connection = await db.connection.findUnique({
        where: {
            id
        }
    });
    return connection;
}

export const getConnectionByUserIdAndTypeAndName = async (userId: string, type: string, name: string) => {
    try {
        const connection = await db.connection.findFirst({
            where: {
                userId,
                type,
                name
            }
        });
        return connection;
    }
    catch (error) {
        return null;
    }
}