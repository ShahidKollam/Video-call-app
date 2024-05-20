import { useRouter } from "next/router";
import { v4 } from "uuid";
import styles from "@/styles/home.module.css";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("")

  const createAndJoin = () => {
    const roomId = v4();
    router.push(`/${roomId}`);
  };

  const joinRoom = () => {
    if (roomId) {
      router.push(`/${roomId}`);
    } else {
      alert("Please provide a valid room ID")
    }
  }

  return (
    <div className={styles.homeContainer}>
      <h1>Video Call App</h1>
      <div className={styles.enterRoom}>
        <input placeholder="Enter Room ID" value={roomId} onChange={(e) => setRoomId(e?.target?.value)} />
        <button onClick={joinRoom}>Join Room</button>
      </div>
      <span className={styles.separatorText}>
        --------------- OR ---------------
      </span>
      <button onClick={createAndJoin}>Create a new Room</button>
    </div>
  );
}
