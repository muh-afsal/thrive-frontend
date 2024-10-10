/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {ADD_PEER,REMOVE_PEER} from '../../actions/user/peerActions'


type IPeerState=Record<string,{stream:MediaStream}>
type IPeerActions=
| {
    type:typeof ADD_PEER,
    payload:{peerId:string,stream:MediaStream}
    
}
| {
    type:typeof REMOVE_PEER,
    payload:{peerId:string}
    
}


export const peersReducer=(state:IPeerState,action:IPeerActions)=>{
    console.log(action,'jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj');
    
    switch (action.type) {
        case ADD_PEER:
            return{
                ...state,
                [action.payload.peerId]:{
                    stream:action.payload.stream
                }
            }
        case REMOVE_PEER:
            const {[action.payload.peerId]:deleted,...rest}=state;
            return rest
    
        default:
            return{...state}
            break;
    }
}