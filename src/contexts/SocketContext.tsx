/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useEffect, useState,useReducer } from "react";
import { useSelector } from "react-redux";
import io, { Socket } from "socket.io-client";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";
import Peer from "peerjs";
import { peersReducer } from "@/redux/reducers/peer/peerReducer";
import { addPeer } from "@/redux/actions/user/peerActions";

interface IPeer extends Peer {
  _id: string;
}

interface ISocketContext {
  socket: Socket | null;
  onlineUsers: any[];
  me: IPeer | null;
  stream: MediaStream | null;
}

const SocketContext = createContext<ISocketContext>({
  socket: null,
  onlineUsers: [],
  me: null,
  stream: null, 
});


export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [me, setMe] = useState<IPeer | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { data } = useSelector((state: RootState) => state.user);
  const user = data;
  const navigate = useNavigate();
 const [peers,dispatch]=useReducer(peersReducer,{})

  const getUsers=({participants}:{participants:string})=>{
 console.log('this is participantsssssssss',participants);
//  console.log('room id 66666666666666666666666666',roomId);dfsd
 
  }


  useEffect(() => {
    const myId = uuidV4();
    const peer = new Peer(myId) as IPeer;
    peer._id = myId; 
    setMe(peer);

    if (user && user._id) {
      const newSocket = io("http://localhost:5004", {
        query: { userId: user._id },
        withCredentials: true,
      });

      newSocket.on("connection", () => {
        console.log("Connected to server");
        setSocket(newSocket);
      });

      newSocket.on("room-created", ({ roomId }) => {
        navigate(`/call-room/${roomId}`);
      });

      newSocket.on("get-users",getUsers)

      // try {
      //   navigator.mediaDevices.getUserMedia({video:true,audio:true}).then((stream)=>{
      //     setStream(stream)
      //   })
      // } catch (error) {
      //   console.log(error);
        
      // }

      newSocket.on("disconnect", () => {
        setSocket(null);
      });

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user, navigate]);

  useEffect(()=>{
    if(!me)return
    if(!stream)return
     socket?.on("user-joined",({peerId})=>{
      const call=me.call(peerId,stream)
      call.on('stream',(peerStream)=>{
        
        console.log(call.peer ,peerStream,'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');
        dispatch(addPeer(peerId,peerStream))
      })
    })
    
    
    me.on('call',(call)=>{
      call.on('stream',(peerStream)=>{
        dispatch(addPeer(call.peer,peerStream))
      })
   call.answer(stream)
     })
  },[me,stream])


  // console.log({peers},'oooooooooooooooooooooooo7777777777777777777777777');
  

  const value: ISocketContext = {
    socket,
    onlineUsers,
    me, 
    stream
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}; 