export class GameAudio {
  private context?: AudioContext;
  private master?: GainNode;
  private ambientGain?: GainNode;
  private musicTimer?: number;
  private musicNodes: AudioNode[] = [];
  private musicGain?: GainNode;
  private ambientScene: "menu" | "story" | "duel" = "menu";
  private sfxVolume = 0.9;
  private muted = false;
  private musicMuted = false;

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
      this.master.gain.value = this.muted ? 0 : this.sfxVolume;
      this.master.connect(this.context.destination);
    }
    if (this.context.state === "suspended") {
      void this.context.resume();
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.master) {
      this.master.gain.value = muted ? 0 : this.sfxVolume;
    }
  }

  setSfxVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume / 100));
    if (this.master) {
      this.master.gain.value = this.muted ? 0 : this.sfxVolume;
    }
  }

  setMusicMuted(muted: boolean): void {
    this.musicMuted = muted;
    if (this.musicGain) {
      this.musicGain.gain.value = muted ? 0 : 0.6;
    }
  }

  setMusicVolume(volume: number): void {
    if (this.musicGain) {
      this.musicGain.gain.value = this.musicMuted
        ? 0
        : Math.max(0, Math.min(1, volume / 100));
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

  trainingStart(): void {
    this.tone(261.63, 0.12, "triangle", 0.04);
    this.tone(329.63, 0.14, "triangle", 0.035, 0.08);
    this.tone(392, 0.2, "sine", 0.03, 0.16);
    this.tone(523.25, 0.28, "sine", 0.022, 0.26);
  }

  trainingCorrect(): void {
    this.tone(440, 0.1, "triangle", 0.03);
    this.tone(554.37, 0.16, "sine", 0.024, 0.08);
  }

  trainingMastery(): void {
    this.tone(392, 0.16, "triangle", 0.04);
    this.tone(523.25, 0.18, "triangle", 0.035, 0.1);
    this.tone(659.25, 0.24, "sine", 0.03, 0.2);
    this.tone(783.99, 0.34, "sine", 0.022, 0.32);
  }

  startAmbient(scene: "menu" | "story" | "duel" = "menu"): void {
    this.ensure();
    if (!this.context || !this.master || this.ambientGain) {
      return;
    }
    this.ambientScene = scene;
    const gain = this.context.createGain();
    gain.gain.value = this.muted ? 0 : 0.012;
    if (!this.musicGain) {
      this.musicGain = this.context.createGain();
      this.musicGain.gain.value = 0.6;
      this.musicGain.connect(this.context.destination);
    }
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
    gain.connect(this.musicGain);
    oscillator.start();
    second.start();
    third.start();
    this.ambientGain = gain;
    this.musicNodes = [oscillator, second, third, filter, gain];

    const chords: Record<"menu" | "story" | "duel", number[][]> = {
      menu: [
        [220, 261.63, 329.63],
        [174.61, 220, 261.63],
        [196, 246.94, 293.66],
        [146.83, 220, 293.66]
      ],
      story: [
        [196, 246.94, 293.66],
        [220, 261.63, 329.63],
        [174.61, 220, 261.63],
        [164.81, 207.65, 246.94]
      ],
      duel: [
        [174.61, 220, 261.63],
        [130.81, 174.61, 220],
        [146.83, 196, 246.94],
        [155.56, 207.65, 261.63]
      ]
    };
    const melodies: Record<"menu" | "story" | "duel", number[][]> = {
      menu: [
        [329.63, 392, 440, 392],
        [293.66, 349.23, 392, 349.23],
        [329.63, 392, 440, 493.88],
        [261.63, 329.63, 392, 329.63]
      ],
      story: [
        [392, 440, 493.88, 440],
        [349.23, 392, 440, 392],
        [329.63, 392, 440, 523.25],
        [293.66, 349.23, 415.3, 349.23]
      ],
      duel: [
        [440, 523.25, 587.33, 523.25],
        [392, 493.88, 587.33, 493.88],
        [415.3, 523.25, 659.25, 523.25],
        [349.23, 440, 523.25, 440]
      ]
    };
    let musicIndex = 0;
    const playPhrase = () => {
      if (!this.context || !this.master || this.muted) return;
      const chord = chords[this.ambientScene][musicIndex % chords[this.ambientScene].length];
      chord.forEach((freq, index) => {
        this.tone(freq, 2.4, index === 1 ? "triangle" : "sine", 0.006, index * 0.06);
      });
      const melody =
        melodies[this.ambientScene][musicIndex % melodies[this.ambientScene].length];
      melody.forEach((freq, index) => {
        this.tone(freq, 1.5, index % 2 === 0 ? "sine" : "triangle", 0.007, 0.2 + index * 0.45);
      });
      musicIndex += 1;
    };
    playPhrase();
    this.musicTimer = window.setInterval(playPhrase, 3600);
  }

  setAmbientScene(scene: "menu" | "story" | "duel"): void {
    if (this.ambientScene === scene && this.ambientGain) {
      return;
    }
    this.stopAmbient();
    this.startAmbient(scene);
  }

  stopAmbient(): void {
    if (this.musicTimer !== undefined) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = undefined;
    }
    if (this.context && this.ambientGain) {
      const fading = this.ambientGain;
      this.ambientGain = undefined;
      fading.gain.setTargetAtTime(0, this.context.currentTime, 0.2);
      window.setTimeout(() => {
        fading.disconnect();
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
