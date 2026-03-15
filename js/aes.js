import { SBOX, RCON } from './constants.js';
import { hexToBytes, bytesToHex, matrixString } from './utils.js';

// ========== AES-128 CIPHER ==========

function mixColumn(col) {
    let a = col.slice();
    const xtime = (x) => ((x << 1) ^ ((x & 0x80) ? 0x1b : 0)) & 0xff;
    let b = [
        xtime(a[0]) ^ xtime(a[1]) ^ a[1] ^ a[2] ^ a[3],
        a[0] ^ xtime(a[1]) ^ xtime(a[2]) ^ a[2] ^ a[3],
        a[0] ^ a[1] ^ xtime(a[2]) ^ xtime(a[3]) ^ a[3],
        xtime(a[0]) ^ a[0] ^ a[1] ^ a[2] ^ xtime(a[3])
    ];
    return b;
}

export function runAesFullTrace() {
    let keyHex = document.getElementById('aes-key').value.trim();
    let input = document.getElementById('aes-input').value.trim();
    let mode = document.getElementById('aes-mode').value;
    let steps = " AES-128 ENHANCED TRACE \n";

    steps += "\n>>> KEY EXPANSION (internal steps + subword/rotword/rcon) <<<\n";
    let keyBytes = hexToBytes(keyHex);
    let w = [];
    for (let i = 0; i < 4; i++) w.push(keyBytes.slice(i * 4, i * 4 + 4));
    steps += `Initial w[0..3] as 4 words:\n w0=${bytesToHex(w[0])} w1=${bytesToHex(w[1])} w2=${bytesToHex(w[2])} w3=${bytesToHex(w[3])}\n`;
    for (let i = 4; i < 44; i++) {
        let temp = w[i - 1].slice();
        if (i % 4 === 0) {
            let orig = temp.slice();
            temp = [temp[1], temp[2], temp[3], temp[0]];
            steps += ` rotword(${bytesToHex(orig)}) = ${bytesToHex(temp)}\n`;
            let beforeSub = temp.slice();
            temp = temp.map(b => SBOX[b]);
            steps += ` subword(${bytesToHex(beforeSub)}) = ${bytesToHex(temp)}\n`;
            let rconVal = RCON[i / 4 - 1];
            steps += ` rcon[${i / 4}] = 0x${rconVal.toString(16).padStart(2, '0')}\n`;
            temp[0] ^= rconVal;
            steps += ` after XOR rcon: ${bytesToHex(temp)}\n`;
        }
        let newW = [];
        for (let j = 0; j < 4; j++) newW[j] = w[i - 4][j] ^ temp[j];
        w.push(newW);
        steps += ` w[${i}] = w[${i - 4}] XOR temp → ${bytesToHex(newW)}\n`;
    }
    steps += "\n>>> ROUND KEYS (11 rounds) <<<\n";
    for (let r = 0; r <= 10; r++) {
        let rk = w.slice(r * 4, r * 4 + 4).flat();
        steps += `round key ${r}: ${bytesToHex(rk)}\n`;
    }

    steps += "\n>>> ENCRYPTION PROCESS (10 rounds) with matrix state and MixColumns detail <<<\n";
    let ptBytes = new TextEncoder().encode(input.padEnd(16, '\0')).slice(0, 16);
    steps += `Plaintext bytes: ${bytesToHex(Array.from(ptBytes))}\n`;
    let state = Array.from(ptBytes);
    steps += matrixString(state, "Initial state (column-major)");

    let roundKey = w.slice(0, 4).flat();
    steps += `\nAddRoundKey 0 with key: ${bytesToHex(roundKey)}\n`;
    for (let i = 0; i < 16; i++) state[i] ^= roundKey[i];
    steps += matrixString(state, "After initial AddRoundKey");

    for (let r = 1; r <= 10; r++) {
        steps += `\n========== ROUND ${r} ==========\n`;

        let oldState = state.slice();
        for (let i = 0; i < 16; i++) state[i] = SBOX[state[i]];
        steps += `SubBytes (S-box):\n from: ${bytesToHex(oldState)}\n to : ${bytesToHex(state)}\n`;
        steps += matrixString(state, "After SubBytes");

        let afterSR = new Array(16);
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                afterSR[row + 4 * col] = state[row + 4 * ((col + row) % 4)];
            }
        }
        steps += `ShiftRows:\n from: ${bytesToHex(state)}\n to : ${bytesToHex(afterSR)}\n`;
        steps += matrixString(afterSR, "After ShiftRows");

        if (r < 10) {
            let beforeMC = afterSR.slice();
            let afterMC = new Array(16);
            steps += `\n--- MixColumns detailed (each column) ---\n`;
            for (let col = 0; col < 4; col++) {
                let colBytes = [beforeMC[0 + 4 * col], beforeMC[1 + 4 * col], beforeMC[2 + 4 * col], beforeMC[3 + 4 * col]];
                let mixed = mixColumn(colBytes);
                steps += ` column ${col} input : [${colBytes.map(b => '0x' + b.toString(16).padStart(2, '0')).join(' ')}]\n`;
                steps += ` output: [${mixed.map(b => '0x' + b.toString(16).padStart(2, '0')).join(' ')}]\n`;
                for (let row = 0; row < 4; row++) afterMC[row + 4 * col] = mixed[row];
            }
            steps += `MixColumns result: ${bytesToHex(afterMC)}\n`;
            state = afterMC;
            steps += matrixString(state, "After MixColumns");
        } else {
            state = afterSR;
        }

        roundKey = w.slice(r * 4, r * 4 + 4).flat();
        steps += `\nAddRoundKey ${r} with key: ${bytesToHex(roundKey)}\n`;
        for (let i = 0; i < 16; i++) state[i] ^= roundKey[i];
        steps += matrixString(state, `After AddRoundKey ${r}`);
    }

    let cipherHex = bytesToHex(state);
    steps += `\n FINAL CIPHERTEXT: ${cipherHex} \n`;
    document.getElementById('aes-steps').innerText = steps;
    document.getElementById('aes-out').innerText = 'Ciphertext: ' + cipherHex;
}

export function resetAesTrace() {
    document.getElementById('aes-key').value = '2b7e151628aed2a6abf7158809cf4f3c';
    document.getElementById('aes-input').value = 'Hello, AES-128!';
    document.getElementById('aes-mode').value = 'encrypt';
    document.getElementById('aes-steps').innerText = '// AES step dump (matrix & MixColumns detail) will appear here';
    document.getElementById('aes-out').innerText = 'Result: ';
}
