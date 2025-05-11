import { useEffect, useState } from "react";
import Track from "../Track/Track";
import useStore from "../../utils/store";
import { fetchMetadata } from "../../utils/utils";
import TRACKS from "../../utils/TRACKS";
import fetchJsonp from "fetch-jsonp";
import s from "./Tracks.module.scss";

const Tracks = () => {
  // Permet d'alterner entre true et false pour afficher/cacher le composant
  const [showTracks, setShowTracks] = useState(false);
  const { tracks, setTracks } = useStore();

  // Nouveau state pour gérer le loader
  const [loading, setLoading] = useState(false);
  
  // Nouveau state pour l'artiste recherché
  const [artist, setArtist] = useState("");

  // Écouter la variable tracks qui vient du store
  useEffect(() => {
    if (tracks.length > TRACKS.length) {
      setShowTracks(true);
    }
  }, [tracks]);

  useEffect(() => {
    fetchMetadata(TRACKS, tracks, setTracks);
  }, []);

  const onKeyDown = (e) => {
    if (e.keyCode === 13 && e.target.value !== "") {
      // L'utilisateur a appuyé sur la touche Entrée
      const userInput = e.target.value;
      setArtist(userInput);  // Mise à jour de l'artiste recherché
      getSongs(userInput);
    }
  };

  const getSongs = async (userInput) => {
    setLoading(true); // Affiche le loader avant la requête

    let response = await fetchJsonp(
      `https://api.deezer.com/search?q=${userInput}&output=jsonp`
    );

    if (response.ok) {
      response = await response.json();

      // Récupérer le tableau de tracks du store existant
      const _tracks = [...tracks];

      // Pour chaque track renvoyée par l'API
      response.data.forEach((result) => {
        // remplacer push par unshift pour avoir les resulatst en haut
        _tracks.unshift(result);
      });

      // Mise à jour du store
      setTracks(_tracks);
    } else {
      // Erreurs
      console.error("Erreur de recherche");
    }

    setLoading(false); // Cacher le loader après la requête
  };

  return (
    <>
      <div
        className={s.toggleTracks}
        onClick={() => setShowTracks(!showTracks)}
      >
        tracklist
      </div>

      <section
        className={`${s.wrapper} ${showTracks ? s.wrapper_visible : ""}`}
      >
        {/* Affichage de l'artiste recherché en haut */}
        {artist && <div className={s.artistName}>Artiste : {artist}</div>}

        <div className={s.tracks}>
          <div className={s.header}>
            <span className={s.order}>#</span>
            <span className={s.title}>Titre</span>
            <span className={s.duration}>Durée</span>
          </div>

          {tracks.map((track, i) => (
            <Track
              key={track.title + i}
              title={track.title}
              duration={track.duration}
              cover={track.album.cover_xl}
              src={track.preview}
              index={i}
            />
          ))}
        </div>

        {/* Affichage du loader pendant la recherche */}
        {loading && (
          <div className={s.loader}>
            <div className={s.spinner}></div> 
          </div>
        )}

        <input
          type="text"
          placeholder="Chercher un artiste"
          className={s.searchInput}
          onKeyDown={onKeyDown}
        />
      </section>
    </>
  );
};

export default Tracks;
