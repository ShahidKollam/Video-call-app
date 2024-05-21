import Bottom from "@/component/Bottom";
import styles from "@/styles/room.module.css";
import { useSocket } from "@/context/socket";
import usePeer from "@/hooks/usePeer";
import { useEffect, useState } from "react";
import useMediaStream from "@/hooks/useMediaStream";
import Player from "@/component/Player";
import usePlayer from "@/hooks/usePlayer";
import { useRouter } from "next/router";
import { cloneDeep } from "lodash";
import CopySection from "@/component/CopySection";


const Room = () => {
  const socket = useSocket();
  const { peer, myId } = usePeer();
  const { roomId } = useRouter().query;
  const { stream } = useMediaStream();
  const {
    player,
    setPlayer,
    playerHighlighted,
    nonHighlightedPlayers,
    toogleAudio,
    toogleVideo,
    leaveRoom,
  } = usePlayer(myId, roomId, peer);
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (!socket || !peer || !stream) return;

    const handleUserConnected = (newUser) => {
      console.log(`user-connected in room with userId ${newUser}`);

      const call = peer.call(newUser, stream);
      call.on("stream", (incomingStream) => {
        console.log(`incoming stream from ${newUser}`);

        setPlayer((prev) => ({
          ...prev,
          [newUser]: {
            url: incomingStream,
            muted: true,
            playing: true,
          },
        }));

        setUsers((prev) => ({
          ...prev,
          [newUser]: call
        }))
      });
    };

    socket.on("user-connected", handleUserConnected);

    return () => {
      socket.off("user-connected", handleUserConnected);
    };
  }, [peer, socket, stream, setPlayer]);

  useEffect(() => {
    if (!peer || !stream) return;

    peer.on("call", (call) => {
      const { peer: calledId } = call;
      call.answer(stream);

      call.on("stream", (incomingStream) => {
        console.log(`incoming stream from ${calledId}`);

        setPlayer((prev) => ({
          ...prev,
          [calledId]: {
            url: incomingStream,
            muted: true,
            playing: true,
          },
        }));

        
        setUsers((prev) => ({
          ...prev,
          [calledId]: call
        }))

      });
    });
  }, [peer, setPlayer, stream]);

  useEffect(() => {
    if (!stream || !myId) return;
    console.log(`setting my stream ${myId}`);

    setPlayer((prev) => ({
      ...prev,
      [myId]: {
        url: stream,
        muted: true,
        playing: true,
      },
    }));
  }, [myId, setPlayer, stream]);

  useEffect(() => {
    if (!socket) return;

    const handleToggleAudio = (userId) => {
      console.log(`user with id ${userId} toggled audio`);

      setPlayer((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].muted = !copy[userId].muted;
        return { ...copy };
      });
    };

    const handleToggleVideo = (userId) => {
      console.log(`user with id ${userId} toggled video`);

      setPlayer((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].playing = !copy[userId].playing;
        return { ...copy };
      });
    };

    const handleUserLeave = (userId) => {
      console.log(`user ${userId} is leaving the room`);
      users[userId]?.close()
      const playersCopy = cloneDeep(player);
      delete playersCopy[userId];
      setPlayer(playersCopy);
    }

    socket.on("user-toogle-audio", handleToggleAudio);
    socket.on("user-toogle-video", handleToggleVideo);
    socket.on("user-leave", handleUserLeave);

    return () => {
      socket.off("user-toogle-audio", handleToggleAudio);
      socket.off("user-toogle-video", handleToggleVideo);
      socket.off("user-leave", handleUserLeave);

    };
  }, [socket, setPlayer, users, player]);

  return (
    <>
      <div className={styles.activePlayerContainer}>
        {playerHighlighted && (
          <Player
            url={playerHighlighted.url}
            muted={playerHighlighted.muted}
            playing={playerHighlighted.playing}
            isActive
          />
        )}
      </div>

      <div className={styles.inActivePlayerContainer}>
        {Object.keys(nonHighlightedPlayers).map((playerId) => {
          const { url, muted, playing } = nonHighlightedPlayers[playerId];
          return (
            <Player
              key={playerId}
              url={url}
              muted={muted}
              playing={playing}
              isActive={false}
            />
          );
        })}
      </div>

      <CopySection roomId={roomId} />

      <Bottom
        muted={playerHighlighted?.muted}
        playing={playerHighlighted?.playing}
        toggleAudio={toogleAudio}
        toggleVideo={toogleVideo}
        leaveRoom={leaveRoom}
      />
    </>
  );
};

export default Room;
