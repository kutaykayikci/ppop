// Feedback ses efektleri servisi
class FeedbackSoundService {
  constructor() {
    this.sounds = new Map();
    this.enabled = true;
    this.volume = 0.3;
    this.preloadSounds();
  }

  // Ses dosyalarını önceden yükle
  preloadSounds() {
    const soundFiles = {
      success: '/sounds/success.wav',
      error: '/sounds/error.wav',
      warning: '/sounds/warning.wav',
      info: '/sounds/info.wav',
      poop: '/sounds/poop.wav',
      achievement: '/sounds/achievement.wav',
      motivation: '/sounds/motivation.wav',
      reminder: '/sounds/reminder.wav'
    };

    Object.entries(soundFiles).forEach(([name, url]) => {
      try {
        const audio = new Audio(url);
        audio.preload = 'auto';
        audio.volume = this.volume;
        this.sounds.set(name, audio);
      } catch (error) {
        console.log(`Ses dosyası yüklenemedi: ${name}`, error);
      }
    });
  }

  // Ses çal
  play(soundName) {
    if (!this.enabled) return;

    const audio = this.sounds.get(soundName);
    if (audio) {
      try {
        // Ses dosyasını başa al
        audio.currentTime = 0;
        audio.volume = this.volume;
        audio.play().catch(error => {
          console.log(`Ses çalınamadı: ${soundName}`, error);
        });
      } catch (error) {
        console.log(`Ses oynatma hatası: ${soundName}`, error);
      }
    } else {
      console.log(`Ses dosyası bulunamadı: ${soundName}`);
    }
  }

  // Ses seviyesini ayarla
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(audio => {
      audio.volume = this.volume;
    });
  }

  // Ses efektlerini aç/kapat
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  // Tüm sesleri durdur
  stopAll() {
    this.sounds.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  // Ses dosyası ekle
  addSound(name, url) {
    try {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audio.volume = this.volume;
      this.sounds.set(name, audio);
    } catch (error) {
      console.log(`Ses dosyası eklenemedi: ${name}`, error);
    }
  }

  // Mevcut sesleri listele
  getAvailableSounds() {
    return Array.from(this.sounds.keys());
  }

  // Ses dosyası var mı kontrol et
  hasSound(soundName) {
    return this.sounds.has(soundName);
  }
}

// Singleton instance
const feedbackSoundService = new FeedbackSoundService();

export default feedbackSoundService;
