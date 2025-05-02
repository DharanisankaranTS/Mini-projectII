// This file provides the necessary polyfills for Node.js built-ins in the browser

// Make Buffer available globally
import { Buffer as NodeBuffer } from 'buffer';

// Expose Buffer globally
window.Buffer = NodeBuffer;

// Create a minimal process object
window.process = window.process || { 
  env: {}, 
  nextTick: function(cb) { setTimeout(cb, 0); }
};

// Expose globals for Web3.js and other libraries
window.global = window;
window.global.Buffer = window.Buffer;
window.global.process = window.process;

// Create mock modules that might be required
const mockObj = {};
window.stream = mockObj;
window.util = mockObj;
window.events = mockObj;
// Crypto is already available in the browser, no need to polyfill it

// Make accessible in the global scope
window.global.stream = window.stream;
window.global.util = window.util;
window.global.events = window.events;

// Export for importable use
export { 
  NodeBuffer as Buffer
};
