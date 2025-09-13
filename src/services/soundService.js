// Global Ses Efekti Servisi
class SoundService {
  constructor() {
    this.audioContext = null;
    this.isEnabled = true;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API desteklenmiyor:', error);
      this.isEnabled = false;
    }
  }

  // Ses efektlerini etkinleştir/devre dışı bırak
  setEnabled(enabled) {
    this.isEnabled = enabled;
  }

  // Temel ses efekti oluştur
  createSound(frequency, duration, type = 'sine') {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Ses efekti oluşturulamadı:', error);
    }
  }

  // Önceden tanımlanmış ses efektleri
  playClick() {
    this.createSound(800, 0.1, 'square');
  }

  playSuccess() {
    this.createSound(600, 0.2, 'sine');
    setTimeout(() => this.createSound(1200, 0.2, 'sine'), 100);
  }

  playError() {
    this.createSound(200, 0.3, 'sawtooth');
  }

  playHover() {
    this.createSound(1000, 0.05, 'sine');
  }

  playPoop() {
    this.createSound(150, 0.15, 'triangle');
    setTimeout(() => this.createSound(100, 0.1, 'triangle'), 50);
  }

  playAchievement() {
    // Başarı melodisi
    const notes = [523, 659, 784, 1047]; // C, E, G, C
    notes.forEach((note, index) => {
      setTimeout(() => {
        this.createSound(note, 0.2, 'sine');
      }, index * 100);
    });
  }

  playNotification() {
    this.createSound(800, 0.1, 'square');
    setTimeout(() => this.createSound(1000, 0.1, 'square'), 150);
  }

  playTransition() {
    this.createSound(400, 0.3, 'sine');
  }

  playButtonPress() {
    this.createSound(600, 0.08, 'square');
  }

  playCardFlip() {
    this.createSound(500, 0.1, 'triangle');
    setTimeout(() => this.createSound(700, 0.1, 'triangle'), 50);
  }
}

// Singleton instance
const soundService = new SoundService();

export default soundService;
