/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose from "mongoose";

export type Participant = {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    profileImage: string;
  };
  

  export type Chat = {
    _id: string;
    name: string;
    isGroupChat: boolean;
    groupIcon:string;
    lastMessage: string | null;
    participants: Participant[];
  };
  

  export interface IMessage {
    _id: string;
    content: string;
    attachments: any[];
    sender: {
      [x: string]: string | undefined;
      firstname: string;
      lastname: string;
      profileImage: string;
    };
  }
  
  export interface ChatMessageBubbleProps {
    isSender: boolean;
    content: string;
  }


  export interface IChatMessage {
    _id: string;
    content: string;
    sender: {
      firstname: string; // Change to just string
      lastname: string; // Change to just string
      profileImage: string; // Change to just string
    };
    attachments: any[]; // Keep as is if necessary
    chat: mongoose.Types.ObjectId | null;
  }
  