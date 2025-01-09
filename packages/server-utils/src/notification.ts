export const updateNotificationAction = async (id:string) =>{
    try {
        await fetch('/api/notification/updateNotification', {
            method: 'POST',
            body: JSON.stringify({id}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    catch (error) {
        return null;
    }
}

export const updateAllNotificationsAction = async () =>{
    try {
        await fetch('/api/notification/updateAllNotifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    catch (error) {
        return null;
    }
}