export class Sfx {
  private context?: AudioContext;
  private muted = false;
  private ambientOscillator?: OscillatorNode;
  private ambientGain?: GainNode;

  setMuted(value: boolean) {
    this.muted = value;
    if (this.ambientGain) {
      this.ambientGain.gain.value = value ? 0 : 0.02;
    }
  }

  startAmbient() {
    this.ensure();
    if (!this.context || this.ambientOscillator) {
      return;
    }
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.value = 110;
    gain.gain.value = this.muted ? 0 : 0.02;
    oscillator.connect(gain);
    gain.connect(this.context.destination);
    oscillator.start();
    this.ambientOscillator = oscillator;
    this.ambientGain = gain;
  }

  stopAmbient() {
    if (this.ambientOscillator) {
      this.ambientOscillator.stop();
      this.ambientOscillator.disconnect();
      this.ambientOscillator = undefined;
    }
    if (this.ambientGain) {
      this.ambientGain.disconnect();
      this.ambientGain = undefined;
    }
  }

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

  wave() {
    this.tone(220, 0.12, "triangle", 0.04);
    this.tone(330, 0.14, "triangle", 0.03);
  }

  private tone(
    frequency: number,
    duration: number,
    type: OscillatorType,
    volume: number
  ) {
    if (!this.context || this.muted) {
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
