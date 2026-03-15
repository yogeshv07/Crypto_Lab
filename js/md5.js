import { MD5_S, MD5_K } from './constants.js';

// ========== MD5 HASH FUNCTION ==========

function leftRotate(value, amount) {
    return ((value << amount) | (value >>> (32 - amount))) & 0xFFFFFFFF;
}

export function md5Hash(message, showSteps = true) {
    let steps = showSteps ? [] : null;

    let msgBytes = new TextEncoder().encode(message);
    let msgLen = msgBytes.length;

    let padded = new Uint8Array(Math.floor((msgLen + 8) / 64 + 1) * 64);
    padded.set(msgBytes);
    padded[msgLen] = 0x80;

    let lenBits = msgLen * 8;
    for (let i = 0; i < 8; i++) {
        padded[padded.length - 8 + i] = (lenBits >>> (i * 8)) & 0xFF;
    }

    if (showSteps) {
        steps.push("Step 1: Padding the message");
        steps.push(`Original message length: ${msgLen} bytes`);
        steps.push(`Padded message length: ${padded.length} bytes`);
    }

    let h0 = 0x67452301;
    let h1 = 0xefcdab89;
    let h2 = 0x98badcfe;
    let h3 = 0x10325476;

    if (showSteps) {
        steps.push("Step 2: Initialize MD5 state");
        steps.push(`h0 = ${h0.toString(16).padStart(8, '0')}`);
        steps.push(`h1 = ${h1.toString(16).padStart(8, '0')}`);
        steps.push(`h2 = ${h2.toString(16).padStart(8, '0')}`);
        steps.push(`h3 = ${h3.toString(16).padStart(8, '0')}`);
    }

    for (let chunkStart = 0; chunkStart < padded.length; chunkStart += 64) {
        let chunk = padded.slice(chunkStart, chunkStart + 64);
        let w = new Array(16);
        for (let i = 0; i < 16; i++) {
            w[i] = (chunk[i*4]) | (chunk[i*4+1] << 8) | (chunk[i*4+2] << 16) | (chunk[i*4+3] << 24);
        }

        if (showSteps) {
            steps.push(`\nProcessing chunk ${chunkStart/64 + 1}`);
            steps.push("Message schedule (w[0..15]):");
            for (let i = 0; i < 16; i++) {
                steps.push(`w[${i}] = ${w[i].toString(16).padStart(8, '0')}`);
            }
        }

        let a = h0, b = h1, c = h2, d = h3;

        if (showSteps) {
            steps.push("Initial a,b,c,d for this chunk:");
            steps.push(`a = ${a.toString(16).padStart(8, '0')}, b = ${b.toString(16).padStart(8, '0')}, c = ${c.toString(16).padStart(8, '0')}, d = ${d.toString(16).padStart(8, '0')}`);
        }

        for (let i = 0; i < 64; i++) {
            let f, g;
            if (i < 16) {
                f = (b & c) | (~b & d);
                g = i;
            } else if (i < 32) {
                f = (d & b) | (~d & c);
                g = (5 * i + 1) % 16;
            } else if (i < 48) {
                f = b ^ c ^ d;
                g = (3 * i + 5) % 16;
            } else {
                f = c ^ (b | ~d);
                g = (7 * i) % 16;
            }

            f = (f + a + MD5_K[i] + w[g]) & 0xFFFFFFFF;
            a = d;
            d = c;
            c = b;
            b = (b + leftRotate(f, MD5_S[i])) & 0xFFFFFFFF;

            if (showSteps && (i % 4 === 0 || i === 63)) {
                steps.push(`Round ${Math.floor(i/16) + 1}, step ${i%16 + 1}: a=${a.toString(16).padStart(8, '0')}, b=${b.toString(16).padStart(8, '0')}, c=${c.toString(16).padStart(8, '0')}, d=${d.toString(16).padStart(8, '0')}`);
            }
        }

        h0 = (h0 + a) & 0xFFFFFFFF;
        h1 = (h1 + b) & 0xFFFFFFFF;
        h2 = (h2 + c) & 0xFFFFFFFF;
        h3 = (h3 + d) & 0xFFFFFFFF;

        if (showSteps) {
            steps.push("After adding chunk:");
            steps.push(`h0 = ${h0.toString(16).padStart(8, '0')}, h1 = ${h1.toString(16).padStart(8, '0')}, h2 = ${h2.toString(16).padStart(8, '0')}, h3 = ${h3.toString(16).padStart(8, '0')}`);
        }
    }

    let digest = new Uint8Array(16);
    digest[0] = h0 & 0xFF; digest[1] = (h0 >>> 8) & 0xFF; digest[2] = (h0 >>> 16) & 0xFF; digest[3] = (h0 >>> 24) & 0xFF;
    digest[4] = h1 & 0xFF; digest[5] = (h1 >>> 8) & 0xFF; digest[6] = (h1 >>> 16) & 0xFF; digest[7] = (h1 >>> 24) & 0xFF;
    digest[8] = h2 & 0xFF; digest[9] = (h2 >>> 8) & 0xFF; digest[10] = (h2 >>> 16) & 0xFF; digest[11] = (h2 >>> 24) & 0xFF;
    digest[12] = h3 & 0xFF; digest[13] = (h3 >>> 8) & 0xFF; digest[14] = (h3 >>> 16) & 0xFF; digest[15] = (h3 >>> 24) & 0xFF;

    let hashHex = Array.from(digest, b => b.toString(16).padStart(2, '0')).join('');

    if (showSteps) {
        steps.push("\nFinal MD5 hash:");
        steps.push(hashHex);
    }

    return { hash: hashHex, steps: steps };
}

export function computeMD5() {
    let message = document.getElementById('md5-message').value;
    let result = md5Hash(message);
    document.getElementById('md5-steps').innerText = result.steps.join('\n');
    document.getElementById('md5-out').innerText = 'MD5 Hash: ' + result.hash;
}
