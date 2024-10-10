/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMessage } from "@/types/IChat";

interface ChatMessageBubbleProps {
  isSender: boolean;
  message: IMessage;
  // chatData: any;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  isSender,
  message,
}) => {
  
  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"} mb-3`}>
      <div className="bg--500 flex justify-center items-center">
        <div
          className={`px-4 py-1 max-w-xs flex justify-between ${
            isSender ? "order-1" : "order-2"
          }  ${
            isSender
              ? "bg-blue-500 text-white rounded-l-lg rounded-tr-lg"
              : "bg-gray-200 dark:bg-neutral-800 dark:text-white text-gray-800 rounded-br-lg rounded-tr-lg rounded-tl-lg"
          }`}
        >
          {message.content}
        </div>
        <div
          className={`h-8 w-8  bg-green-300 rounded-full overflow-hidden ${
            isSender ? "order-2 ml-1" : "order-1 mr-1"
          }`}
        >
          <img
            src={message.sender.profileImage}
            alt="Profile Preview"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};
