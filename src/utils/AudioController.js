import gsap from "gsap";
import detect from "bpm-detective";

class AudioController {
  constructor() {
    this.isPlaying = false;  // Ajouter un flag pour savoir si la musique joue
  }

  setup() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();

    this.audio = new Audio();
    this.audio.crossOrigin = "anonymous";
    this.bpm = null;

    // this.audio.src = danceTheNight;
    this.audio.volume = 0.1;

    this.audioSource = this.ctx.createMediaElementSource(this.audio);

    this.analyserNode = new AnalyserNode(this.ctx, {
      fftSize: 1024,
      smoothingTimeConstant: 0.8,
    });

    this.fdata = new Uint8Array(this.analyserNode.frequencyBinCount);

    this.audioSource.connect(this.analyserNode);
    this.audioSource.connect(this.ctx.destination);

    gsap.ticker.add(this.tick);

    this.audio.addEventListener("loadeddata", async () => {
      await this.detectBPM();
      // console.log(`The BPM is: ${bpm}`);
    });

    this.audio.addEventListener("play", () => {
      this.isPlaying = true;  // Musique commence à jouer
    });

    this.audio.addEventListener("pause", () => {
      this.isPlaying = false;  // Musique est en pause
    });

    this.audio.addEventListener("ended", () => {
      this.isPlaying = false;  // Musique terminée
    });
  }

  detectBPM = async () => {
    // Créer un contexte audio hors ligne pour traiter les données
    const offlineCtx = new OfflineAudioContext(
      1,
      this.audio.duration * this.ctx.sampleRate,
      this.ctx.sampleRate
    );
    // Décoder les données audio actuelles
    const response = await fetch(this.audio.src); // Charger le fichier audio
    const buffer = await response.arrayBuffer();
    const audioBuffer = await offlineCtx.decodeAudioData(buffer);
    // Utiliser bpm-detective pour détecter le BPM
    this.bpm = detect(audioBuffer);
    console.log(`Detected BPM: ${this.bpm}`);
    // return bpm;
  };

  play = (src) => {
    this.audio.src = src;
    this.audio.play();
  };

  tick = () => {
    this.analyserNode.getByteFrequencyData(this.fdata);
  };
}

const audioController = new AudioController();
export default audioController;
