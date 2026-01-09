/**
 * Audio Manager - Singleton for managing ambient audio
 * Handles play, pause, volume, and browser autoplay restrictions
 */

class AudioManager {
  constructor() {
    this.audio = null;
    this.isEnabled = false;
    this.volume = 0.3;
  }

  init(audioElement) {
    this.audio = audioElement;
    if (this.audio) {
      this.audio.volume = this.volume;
      this.audio.loop = true;
    }
  }

  play() {
    if (this.audio) {
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.isEnabled = true;
        }).catch(() => {
          console.info('Audio autoplay blocked by browser.');
        });
      }
    }
  }

  pause() {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
      this.isEnabled = false;
    }
  }

  toggle() {
    if (this.isEnabled) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }
}

// Export singleton instance
export default new AudioManager();
