import ReactPlayer from "react-player";

const Player = (props) => {
  const { url, muted, playing, playerId } = props;

  return (
    <div>
      <ReactPlayer key={playerId} url={url} muted={muted} playing={playing} />
    </div>
  );
};

export default Player;
