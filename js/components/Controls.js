// Компонент управления
export class Controls {
  constructor(beatRow) {
    this.beatRow = beatRow;
    this.count = 8;
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Кнопки выбора количества битов
    document.querySelectorAll('.count-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.count-btn').forEach(b => {
          b.classList.remove('active');
        });
        btn.classList.add('active');
        const n = Number(btn.getAttribute('data-count'));
        this.setCount(n);
      });
    });

    // Кнопка генерации случайных битов
    document.getElementById('generateBtn').addEventListener('click', () => {
      this.generateRandom();
    });

    // Изменение BPM
    document.getElementById('bpm').addEventListener('input', () => {
      this.updateBpmLabel();
    });
  }

  setCount(n) {
    this.count = n;
    const beats = this.makeBeats(n);
    this.beatRow.setBeats(beats);
    this.beatRow.setCount(n);
    
    // Обновление глобального состояния
    if (window.app) {
      window.app.state.count = n;
      window.app.state.beats = beats;
    }
  }

  makeBeats(n) {
    const arr = [];
    for (let i = 0; i < n; i++) {
      arr.push({ direction: i % 2 === 0 ? 'down' : 'up', play: false });
    }
    arr[0].play = true; // первый всегда playable
    return arr;
  }

  generateRandom() {
    const beats = this.makeBeats(this.count);
    for (let i = 1; i < beats.length; i++) {
      beats[i].play = Math.random() > 0.5;
    }
    this.beatRow.setBeats(beats);
    
    // Обновление глобального состояния
    if (window.app) {
      window.app.state.beats = beats;
    }
  }

  updateBpmLabel() {
    const bpmValue = document.getElementById('bpm').value;
    document.getElementById('bpmLabel').textContent = bpmValue;
    
    // Обновление глобального состояния
    if (window.app) {
      window.app.state.bpm = Number(bpmValue) || 90;
    }
  }

  getCount() {
    return this.count;
  }
}