// Компонент воспроизведения
export class Playback {
  constructor(beatRow) {
    this.beatRow = beatRow;
    this.playing = false;
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
    this.playing = true;
    this.updateButtonState();

    const bpm = Number(document.getElementById('bpm').value) || 90;
    const count = window.app ? window.app.state.count : 8;
    const currentIndex = window.app ? window.app.state.currentIndex : 0;
    
    // Используем метроном вместо собственной логики
    if (window.app && window.app.metronome) {
      window.app.metronome.setBpm(bpm);
      window.app.metronome.setBeatCount(count);
      
      // Устанавливаем текущую позицию перед запуском
      if (currentIndex >= 0) {
        window.app.metronome.setCurrentBeat(currentIndex);
      }
      
      window.app.metronome.start();
      
      // Подписываемся на события метронома
      window.app.metronome.onBeat = (beatIndex) => {
        this.beatRow.setCurrentIndex(beatIndex);
        
        // Обновление глобального состояния
        if (window.app) {
          window.app.state.currentIndex = beatIndex;
          window.app.state.playing = this.playing;
        }
      };
    }
  }

  stopPlayback() {
    this.playing = false;
    this.updateButtonState();
    
    // Останавливаем метроном
    if (window.app && window.app.metronome) {
      window.app.metronome.stop();
    }
    
    // Не сбрасываем подсветку, чтобы сохранить текущую позицию
    // this.beatRow.setCurrentIndex(-1);
    
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