export class Sfx {
  private context?: AudioContext;

  ensure() {
    if (!this.context) {
      const AudioContextClass =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (AudioContextClass) {
        this.context = new AudioContextClass();
      }
    }
    if (this.context?.state === "suspended") {
      void this.context.resume();
    }
  }

  collect() {
    this.tone(880, 0.1, "square", 0.04);
  }

  gameOver() {
    this.tone(120, 0.35, "sawtooth", 0.06);
  }

  private tone(
    frequency: number,
    duration: number,
    type: OscillatorType,
    volume: number
  ) {
    if (!this.context) {
      return;
    }
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      this.context.currentTime + duration
    );
    oscillator.connect(gain);
    gain.connect(this.context.destination);
    oscillator.start();
    oscillator.stop(this.context.currentTime + duration);
  }
}
