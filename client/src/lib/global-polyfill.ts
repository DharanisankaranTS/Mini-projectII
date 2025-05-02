// Import Node.js modules available for browser
import { Buffer } from 'buffer';
import stream from 'stream-browserify';
import events from 'events';
import util from 'util';

// Polyfill for Node.js globals in browser environment
window.global = window;
window.process = { env: {}, nextTick: (cb: Function) => setTimeout(cb, 0) };

// Add all Node.js modules to the window object
window.Buffer = Buffer;
window.stream = stream;
window.events = events;
window.util = util;

// Ensure these modules are also available globally
window.global.Buffer = Buffer;
window.global.stream = stream;
window.global.events = events;
window.global.util = util;

// For ES module compatibility
export { Buffer, stream, events, util };