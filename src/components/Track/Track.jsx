import { useState } from "react";
import audioController from "../../utils/AudioController";
import scene from "../../webgl/Scene";
import s from "./Track.module.scss";

const Track = ({ title, cover, src, duration, artists, index }) => {
  const [isPlaying, setIsPlaying] = useState(false); // Etat de lecture du morceau

  const getSeconds = () => {
    const minutes = Math.floor(duration / 60);
    let seconds = Math.round(duration - minutes * 60);

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    return minutes + ":" + seconds;
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioController.pause(); // Met en pause
    } else {
      audioController.play(src); // Démarre la lecture
      scene.cover.setCover(cover); // Mise à jour de la couverture de la scène
    }
    setIsPlaying(!isPlaying); // Alterne l'état de lecture
  };

  return (
    <div className={s.track} onClick={togglePlayPause}>
      <span className={s.order}>{index + 1}</span>
      <div className={s.title}>
        <img src={cover} alt="" className={s.cover} />
        <div className={s.details}>
          <span className={s.trackName}>{title}</span>
          {/* {artists.map((artist, i) => (
            <span key={artist + i} className={s.artistName}>
              {artist}
            </span>
          ))} */}
        </div>
      </div>
      <span className={s.duration}>{getSeconds()}</span>

      {/* Bouton avec emojis */}
      <button 
        className={s.playPauseButton} 
        onClick={togglePlayPause}
      >
        {isPlaying ? "⏸️" : "▶️"}
      </button>
    </div>
  );
};

export default Track;
