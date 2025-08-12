// Компонент воспроизведения
export class Playback {
  constructor(metronome, beatRow) {
    this.metronome = metronome;
    this.beatRow = beatRow;
    this.playing = false;
    this.currentIndex = 0;
    this.intervalId = null;
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Кнопка Play/Pause
    document.getElementById('toggleBtn').addEventListener('click', () => {
      this.togglePlayback();
    });
  }

  async togglePlayback() {
    if (this.playing) {
      this.stopPlayback();
    } else {
      await this.startPlayback();
    }
  }

  async startPlayback() {
    if (!this.metronome.isInitialized()) {
      await this.metronome.init();
    }

    this.playing = true;
    this.updateButtonState();

    const bpm = Number(document.getElementById('bpm').value) || 90;
    const speed = Number(document.getElementById('speed').value) || 100;
    const count = window.app ? window.app.state.count : 8;
    
    const metronomeInterval = (60 / bpm) * 1000 * (100 / speed); // ms per metronome beat

    this.currentIndex = 0;
    this.beatRow.setCurrentIndex(this.currentIndex);

    // Calculate arrow movement interval based on count
    let arrowMoveInterval;
    if (count === 4) {
      arrowMoveInterval = metronomeInterval;
    } else if (count === 8) {
      arrowMoveInterval = metronomeInterval / 2;
    } else if (count === 16) {
      arrowMoveInterval = metronomeInterval / 4;
    }
    
    // Initialize metronome beat counter for this playback session
    let metronomeBeat = 0;
    const beats = this.beatRow.getBeats();
    
    // Start arrow movement and metronome together
    this.intervalId = setInterval(() => {
      // highlight current arrow first
      this.beatRow.setCurrentIndex(this.currentIndex);
      
      // then trigger metronome sound immediately
      if (metronomeBeat === 0) {
        this.metronome.playAccent();
      } else {
        this.metronome.playNormal();
      }
      
      // update indices
      this.currentIndex = (this.currentIndex + 1) % beats.length;
      metronomeBeat = (metronomeBeat + 1) % 4;
      
      // Обновление глобального состояния
      if (window.app) {
        window.app.state.currentIndex = this.currentIndex;
        window.app.state.playing = this.playing;
      }
    }, arrowMoveInterval);
  }

  stopPlayback() {
    this.playing = false;
    this.updateButtonState();
    
    // Clear interval
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.beatRow.setCurrentIndex(-1); // Сброс подсветки
    
    // Обновление глобального состояния
    if (window.app) {
      window.app.state.playing = this.playing;
    }
  }

  updateButtonState() {
    const toggleBtn = document.getElementById('toggleBtn');
    if (this.playing) {
      toggleBtn.textContent = 'Pause';
      toggleBtn.className = 'playback-btn pause-btn';
    } else {
      toggleBtn.textContent = 'Play';
      toggleBtn.className = 'playback-btn play-btn';
    }
  }

  isPlaying() {
    return this.playing;
  }
}