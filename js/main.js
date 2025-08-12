// Точка входа приложения
import { BeatRow } from './components/BeatRow.js';
import { Controls } from './components/Controls.js';
import { Playback } from './components/Playback.js';
import { Metronome } from './audio/Metronome.js';
import { ExportUtils } from './utils/ExportUtils.js';

// Инициализация приложения
document.addEventListener('DOMContentLoaded', async () => {
  // Создание экземпляров компонентов
  const metronome = new Metronome();
  const beatRow = new BeatRow();
  const controls = new Controls(beatRow);
  const playback = new Playback(metronome, beatRow);
  const exportUtils = new ExportUtils(beatRow);

  // Инициализация компонентов
  await metronome.init(); // Инициализация метронома
  beatRow.init();
  controls.init();
  playback.init();
  exportUtils.init();

  // Глобальное состояние приложения
  window.app = {
    beatRow,
    controls,
    playback,
    metronome,
    exportUtils,
    state: {
      count: 8,
      beats: [],
      playing: false,
      currentIndex: 0,
      bpm: 90,
      speed: 100,
      chords: []
    }
  };

  // Установка начальных значений
  controls.setCount(8);
  controls.updateBpmLabel();
});