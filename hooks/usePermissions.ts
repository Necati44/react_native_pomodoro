import * as Notifications from 'expo-notifications';

export async function usePermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        alert('Notification are disabled for this application! Enable them in the application\'s parameters.');
        return;
    }
}
