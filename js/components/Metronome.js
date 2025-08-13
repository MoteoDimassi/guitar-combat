// Компонент метронома с Web Audio API
export class Metronome {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.currentBeat = 0;
    this.bpm = 90;
    this.beatCount = 4;
    
    // Параметры планирования звука
    this.lookahead = 25; // мс — как часто проверяем, что планировать
    this.scheduleAheadTime = 0.1; // сек — планируем вперед
    this.nextNoteTime = 0.0;
    this.timerID = null;
  }

  init() {
    // Инициализация Web Audio Context по запросу
    console.log('Metronome initialized with Web Audio API');
  }

  start() {
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    
    // Создаем AudioContext при первом запуске
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    this.currentBeat = 0;
    this.nextNoteTime = this.audioCtx.currentTime + 0.05;
    this.scheduler();
  }

  stop() {
    if (!this.isPlaying) return;
    
    this.isPlaying = false;
    if (this.timerID) {
      clearTimeout(this.timerID);
      this.timerID = null;
    }
  }

  setBpm(bpm) {
    this.bpm = bpm;
    // При изменении BPM во время воспроизведения перезапуск не требуется
    // так как планирование происходит динамически
  }

  setBeatCount(count) {
    this.beatCount = count;
  }
  
  setCurrentBeat(beatIndex) {
    this.currentBeat = beatIndex;
    // Вызываем onBeat для немедленного обновления визуального состояния
    if (this.onBeat) {
      this.onBeat(beatIndex);
    }
  }

  // Переход к следующей ноте
  nextNote() {
    const secondsPerBeat = 60.0 / this.bpm;
    this.nextNoteTime += secondsPerBeat;
    this.currentBeat++;
    if (this.currentBeat >= this.beatCount) {
      this.currentBeat = 0;
    }
  }

  // Планирование звукового клика
  scheduleClick(time, isAccent) {
    if (!this.audioCtx) return;
    
    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(isAccent ? 1500 : 1000, time);

    gainNode.gain.setValueAtTime(1, time);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    osc.start(time);
    osc.stop(time + 0.05);
  }

  // Планировщик звуков
  scheduler() {
    if (!this.audioCtx || !this.isPlaying) return;
    
    while (this.nextNoteTime < this.audioCtx.currentTime + this.scheduleAheadTime) {
      const isAccent = (this.currentBeat === 0);
      this.scheduleClick(this.nextNoteTime, isAccent);
      this.onBeat(this.currentBeat);
      this.nextNote();
    }
    this.timerID = setTimeout(() => this.scheduler(), this.lookahead);
  }

  onBeat(beatIndex) {
    // Визуальная индикация с звуком
    console.log(`Beat ${beatIndex} (sound played)`);
  }

  isPlaying() {
    return this.isPlaying;
  }
  
  getCurrentBeat() {
    return this.currentBeat;
  }
}