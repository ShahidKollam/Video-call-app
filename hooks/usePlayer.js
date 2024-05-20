import { useState } from "react";
import { cloneDeep } from "lodash";

const usePlayer = (myId) => {
  const [player, setPlayer] = useState({});
  const playersCopy = cloneDeep(player);

  const playerHighlighted = playersCopy[myId];

  delete playersCopy[myId];

  const nonHighlightedPlayers = playersCopy;

  return { player, setPlayer, playerHighlighted, nonHighlightedPlayers };
};

export default usePlayer;
