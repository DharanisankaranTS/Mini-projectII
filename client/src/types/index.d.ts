// Global type augmentation for Node.js modules in browser
declare module 'crypto-browserify';
declare module 'stream-browserify';
declare module 'events';
declare module 'util';

// Extend window interface
interface Window {
  global: typeof globalThis & {
    Buffer: typeof Buffer;
    stream: any;
    events: any;
    util: any;
  };
  Buffer: typeof Buffer;
  stream: any;
  events: any;
  util: any;
  process: any;
}

declare global {
  interface Process {
    env: Record<string, string | undefined>;
    nextTick: (callback: Function) => void;
  }
}
