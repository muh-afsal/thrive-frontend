
import { useParams } from "react-router-dom";
import { useSocket } from "@/contexts/SocketContext";
import { useEffect } from "react";
import MediaStreamDisplay from "./MediaStreamDisplay";

const CallRoomPage:React.FC=()=>{

const {roomId} = useParams()
const {socket,me, stream}=useSocket()
const peerId=me?._id 

useEffect(()=>{
    if(me)socket?.emit('join-room',{roomId,peerId})
},[roomId,me,socket])

    return(
      <>
          <div>
            this is room {roomId}
          </div>
          <div>
            <MediaStreamDisplay stream={stream} />
          </div>
          </>
    )
}

export default CallRoomPage;
