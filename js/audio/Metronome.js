// Аудио компонент метронома
import * as Tone from 'https://unpkg.com/tone@14.7.77/build/Tone.js';

export class Metronome {
  constructor() {
    this.accentSynth = null;
    this.normalSynth = null;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    
    try {
      // Инициализация Tone.js
      await Tone.start();
      
      // Создание синтезаторов для метронома
      this.accentSynth = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 2,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.1, sustain: 0.01, release: 0.1 }
      }).toDestination();

      this.normalSynth = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 4,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.05, sustain: 0.01, release: 0.05 }
      }).toDestination();

      this.initialized = true;
    } catch (error) {
      console.error('Ошибка инициализации метронома:', error);
    }
  }

  playAccent() {
    if (this.accentSynth && this.initialized) {
      this.accentSynth.triggerAttackRelease('C2', '8n', Tone.now());
    }
  }

  playNormal() {
    if (this.normalSynth && this.initialized) {
      this.normalSynth.triggerAttackRelease('C3', '8n', Tone.now());
    }
  }

  isInitialized() {
    return this.initialized;
  }
}