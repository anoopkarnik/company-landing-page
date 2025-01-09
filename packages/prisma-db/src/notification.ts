import db from '@repo/prisma-db/client';

export const getNotifications = async (userId: string) => {
    try {
        const notifications = await db.notification.findMany({
            where: {userId},
            orderBy:{createdAt:'desc'},
            take: 50
            
        });
        return notifications;
    }
    catch (error) {
        return null;
    }
}

export const updateNotification = async (id: string, read: boolean) => {
    const notification = await db.notification.update({
        where: {id},
        data: {
            read
        }
    });
    return notification;
}

export const markAllNotificationsAsRead = async (userId: string) => {
    const notifications = await db.notification.updateMany({
        where: {
            userId,
            read: false
        },
        data: {
            read: true
        }
    });
    return notifications;
}

export const createNotification = async ({userId, message, type, href }: any) => {
    const result = await db.notification.create({
        data:{
            userId,
            message,
            type,
            href
        }
    });
    return result;
}

