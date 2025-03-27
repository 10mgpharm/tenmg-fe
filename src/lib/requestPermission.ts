import { getToken, messaging } from "./firebase";
import requestClient from "./requestClient";

export const requestPermission = async (token: string) => {
  try {
    const permission = await Notification.requestPermission();
    const registration = await navigator.serviceWorker.ready;
    if (permission === 'granted') {
      const messagingToken = await getToken(messaging, {
        vapidKey: "BBKy6EXEcJkMBooQHXDoqT0P_hhlYRxYiMv1czk12UPVXddMgWAEUybiWGCjVhHRhfp7cR24tVk8La6VbFwC6iM",
        serviceWorkerRegistration: registration,
      });
      //send token to your backend
      const response = await requestClient({token: token}).post(
        "/account/fcm-token",
        {
          "fcmToken" : messagingToken
        }
      )
      console.log("response", response?.data);
    }  else {
      console.log('Permission denied');
    }
  } catch (err) {
    console.error('Error getting token:', err);
  }
};
