declare module 'canvas-confetti' {
    interface IConfettiOptions {
      particleCount?: number;
      angle?: number;
      spread?: number;
      startVelocity?: number;
      decay?: number;
      gravity?: number;
      drift?: number;
      ticks?: number;
      origin?: {
        x?: number;
        y?: number;
      };
      colors?: string[];
      shapes?: ('square' | 'circle')[];
      scalar?: number;
      zIndex?: number;
      disableForReducedMotion?: boolean;
      resize?: boolean;
      useWorker?: boolean;
    }
  
    interface IConfetti {
      (options?: IConfettiOptions): Promise<void>;
      reset: () => void;
    }
  
    const confetti: IConfetti;
    export default confetti;
  }