import { useState } from "react";
import { cloneDeep } from "lodash";
import { useSocket } from "@/context/socket";
import { useRouter } from "next/router";

const usePlayer = (myId, roomId, peer) => {
  const socket = useSocket()
  const [player, setPlayer] = useState({});
  const playersCopy = cloneDeep(player);
  const router = useRouter()
  const playerHighlighted = playersCopy[myId];

  delete playersCopy[myId];
 
  const nonHighlightedPlayers = playersCopy;

  const toogleAudio = () => {
    console.log("i toggled audio");
    setPlayer((prev) => {
      const copy = cloneDeep(prev)
      copy[myId].muted = !copy[myId].muted
      return {...copy}
    })

    socket.emit('user-toogle-audio', myId, roomId)
  }

  const toogleVideo = () => {
    console.log("i toggled video");

    setPlayer((prev) => { 
      const copy = cloneDeep(prev)
      copy[myId].playing = !copy[myId].playing
      return {...copy}
    })
 
    socket.emit('user-toogle-video', myId, roomId)
  }

  const leaveRoom = () => {
    socket.emit('user-leave', myId, roomId)
    console.log("leaving room", roomId)
    peer?.disconnect();
    router.push('/')
}

  return { player, setPlayer, playerHighlighted, nonHighlightedPlayers, toogleAudio, toogleVideo, leaveRoom };
};

export default usePlayer;
