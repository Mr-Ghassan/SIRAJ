// Regenerate browser-loadable data modules for motion compositions (file:// pages cannot fetch JSON).
const fs = require('fs');
const c = require('../00-Brand-Foundation/brand.config.json');
fs.writeFileSync(__dirname + '/../15-Motion-System/lib/siraj-brand-data.js', '/* Generated from 00-Brand-Foundation/brand.config.json — rebuild with: node tools/build-motion-data.js */\n(function(g){g.SIRAJ_BRAND=' + JSON.stringify(c, null, 1) + ';})(typeof window!=="undefined"?window:globalThis);\n');
const P = require('./lib/logo-paths.json');
fs.writeFileSync(__dirname + '/../15-Motion-System/lib/siraj-logo-data.js', '/* SIRAJ official wordmark path data (exact geometry of the supplied master). bbox x 21.787, y 56.81, w 98.163, h 28.11. */\n(function(g){g.SIRAJ_LOGO=' + JSON.stringify(P) + ';g.SIRAJ_LOGO_BOX={x:21.787,y:56.81,w:98.163,h:28.11};})(typeof window!=="undefined"?window:globalThis);\n');
console.log('motion data written');
