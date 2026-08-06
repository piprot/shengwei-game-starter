export class GameAudio {
  private context?: AudioContext;
  private master?: GainNode;
  private ambientGain?: GainNode;
  private musicTimer?: number;
  private musicNodes: AudioNode[] = [];
  private muted = false;

  ensure(): void {
    if (!this.context) {
      const AudioContextClass =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextClass) {
        return;
      }
      this.context = new AudioContextClass();
      this.master = this.context.createGain();
      this.master.gain.value = this.muted ? 0 : 0.9;
      this.master.connect(this.context.destination);
    }
    if (this.context.state === "suspended") {
      void this.context.resume();
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.master) {
      this.master.gain.value = muted ? 0 : 0.9;
    }
  }

  ui(): void {
    this.tone(420, 0.06, "sine", 0.018);
  }

  choose(): void {
    this.tone(520, 0.08, "triangle", 0.028);
    this.tone(780, 0.1, "sine", 0.02, 0.06);
  }

  expert(): void {
    this.tone(523.25, 0.12, "triangle", 0.045);
    this.tone(659.25, 0.14, "triangle", 0.04, 0.08);
    this.tone(783.99, 0.2, "sine", 0.035, 0.16);
  }

  partial(): void {
    this.tone(392, 0.12, "triangle", 0.04);
    this.tone(466.16, 0.16, "sine", 0.03, 0.09);
  }

  risk(): void {
    this.tone(220, 0.18, "sawtooth", 0.028);
    this.tone(164.81, 0.24, "sine", 0.035, 0.08);
  }

  duelPick(): void {
    this.tone(660, 0.07, "square", 0.018);
  }

  round(): void {
    this.tone(330, 0.09, "triangle", 0.03);
    this.tone(495, 0.12, "sine", 0.025, 0.07);
  }

  win(): void {
    this.tone(523.25, 0.12, "triangle", 0.05);
    this.tone(659.25, 0.14, "triangle", 0.045, 0.1);
    this.tone(783.99, 0.18, "triangle", 0.04, 0.2);
    this.tone(1046.5, 0.26, "sine", 0.03, 0.3);
  }

  lose(): void {
    this.tone(392, 0.16, "sine", 0.045);
    this.tone(311.13, 0.2, "sine", 0.04, 0.12);
    this.tone(233.08, 0.28, "sine", 0.035, 0.24);
  }

  remoteConnected(): void {
    this.tone(520, 0.1, "triangle", 0.035);
    this.tone(780, 0.14, "sine", 0.03, 0.08);
  }

  startAmbient(): void {
    this.ensure();
    if (!this.context || !this.master || this.ambientGain) {
      return;
    }
    const gain = this.context.createGain();
    gain.gain.value = this.muted ? 0 : 0.012;
    const oscillator = this.context.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = 55;
    const second = this.context.createOscillator();
    second.type = "triangle";
    second.frequency.value = 82.41;
    const third = this.context.createOscillator();
    third.type = "sine";
    third.frequency.value = 110;
    const filter = this.context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 320;
    oscillator.connect(filter);
    second.connect(filter);
    third.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    oscillator.start();
    second.start();
    third.start();
    this.ambientGain = gain;
    this.musicNodes = [oscillator, second, third, filter, gain];

    const playPhrase = () => {
      if (!this.context || !this.master || this.muted) return;
      const start = this.context.currentTime + 0.03;
      const notes = [220, 261.63, 329.63, 261.63];
      notes.forEach((freq, index) => {
        this.tone(freq, 1.7, "sine", 0.008, index * 0.55);
      });
    };
    playPhrase();
    this.musicTimer = window.setInterval(playPhrase, 5200);
  }

  stopAmbient(): void {
    if (this.musicTimer !== undefined) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = undefined;
    }
    if (this.context && this.ambientGain) {
      this.ambientGain.gain.setTargetAtTime(0, this.context.currentTime, 0.2);
      window.setTimeout(() => {
        this.ambientGain?.disconnect();
        this.ambientGain = undefined;
      }, 500);
    }
  }

  private tone(
    frequency: number,
    duration: number,
    type: OscillatorType,
    volume: number,
    delay = 0
  ): void {
    if (!this.context || !this.master || this.muted) {
      return;
    }
    const start = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(this.master);
    oscillator.start(start);
    oscillator.stop(start + duration);
  }
}
