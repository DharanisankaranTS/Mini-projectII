// Simple polyfill for Node.js globals in browser environment
window.global = window;

// Create process object first
window.process = { env: {}, nextTick: (cb: Function) => setTimeout(cb, 0) };
window.global.process = window.process;

// Use proper buffer implementation from the buffer package
import { Buffer } from 'buffer';
window.Buffer = Buffer;
window.global.Buffer = Buffer;

// Create the essential slice method if it doesn't exist
if (!window.Buffer.prototype.slice) {
  window.Buffer.prototype.slice = function slice(start: number, end?: number) {
    const buf = this.subarray(start, end);
    const ret = new Buffer(buf.length);
    buf.copy(ret);
    return ret;
  };
}

// Define minimal implementations of Node.js modules
const dummyObj = {};
window.global.stream = dummyObj;
window.stream = dummyObj;
window.global.events = dummyObj;
window.events = dummyObj;
window.global.util = dummyObj;
window.util = dummyObj;
