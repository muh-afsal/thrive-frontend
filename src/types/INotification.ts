import { ObjectId } from "mongoose";

export interface notificationDataType {
    userId: ObjectId;
    message: string;
  }