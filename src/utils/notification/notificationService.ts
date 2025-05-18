import { CLIENT_API } from '@/axios';

interface DBNotification {
  userId:string | undefined;
  message: string;
}

export const sendInAppNotification = async (notification: DBNotification): Promise<void> => {
  try {
     await CLIENT_API.post('/notification/add-notification', notification);
   
  } catch (error) {
    console.error('Error saving notification to DB:', error);
  }
};
