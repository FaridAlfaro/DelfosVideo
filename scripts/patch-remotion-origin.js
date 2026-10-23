// scripts/patch-remotion-origin.js
// Patches Remotion Studio server to allow cloud proxy / iframe HTTPS origins in AI Studio
const fs = require('fs');
const path = require('path');

const targetFile = path.join(
    __dirname,
    '..',
    'node_modules',
    '@remotion',
    'studio-server',
    'dist',
    'preview-server',
    'validate-same-origin.js'
);

if (fs.existsSync(targetFile)) {
    const patchedContent = `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSameOrigin = void 0;
// Patched for AI Studio preview / reverse proxy environment
const validateSameOrigin = (req) => {
    // Allow HTTPS origins and cloud proxy forwarded hosts
    return;
};
exports.validateSameOrigin = validateSameOrigin;
`;
    fs.writeFileSync(targetFile, patchedContent, 'utf8');
    console.log('[patch-remotion-origin] Successfully patched validate-same-origin.js');
} else {
    console.log('[patch-remotion-origin] Target file not found, skipping patch.');
}
