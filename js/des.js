import { DES_IP, DES_FP, DES_E, DES_P, DES_PC1, DES_PC2, DES_SHIFTS } from './constants.js';
import { hex2bin } from './utils.js';

// ========== DES CIPHER ==========

export function runDesFullTrace() {
    let key = document.getElementById('des-key').value.trim();
    let input = document.getElementById('des-input').value.trim();
    let mode = document.getElementById('des-mode').value;
    let steps = " DES FULL TRACE \n";
    steps += "\n>>> KEY SCHEDULE (16 subkeys) <<<\n";
    let keyBin = '';
    for (let i = 0; i < 16; i += 2) keyBin += hex2bin(key.substr(i, 2), 8);
    steps += `Key bits (64): ${keyBin.match(/.{1,8}/g).join(' ')}\n`;
    let key56 = DES_PC1.map(i => keyBin[i - 1]).join('');
    steps += `After PC‑1 (56 bits): ${key56.match(/.{1,7}/g).join(' ')}\n`;
    let C = key56.slice(0, 28), D = key56.slice(28);
    steps += `C0 = ${C} , D0 = ${D}\n`;
    let subkeys = [];
    for (let r = 1; r <= 16; r++) {
        C = C.slice(DES_SHIFTS[r - 1]) + C.slice(0, DES_SHIFTS[r - 1]);
        D = D.slice(DES_SHIFTS[r - 1]) + D.slice(0, DES_SHIFTS[r - 1]);
        let combined = C + D;
        let key48 = DES_PC2.map(i => combined[i - 1]).join('');
        subkeys.push(key48);
        steps += `Round ${r.toString().padStart(2)} shift ${DES_SHIFTS[r - 1]} → C${r} D${r} PC2 → subkey: ${key48.match(/.{1,6}/g).join(' ')}\n`;
    }
    steps += "\n\n>>> ENCRYPTION ROUNDS (IP, 16 rounds, FP) <<<\n";
    let pt = input.padEnd(8, '\0').split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join('');
    steps += `Plaintext bits (ASCII): ${pt.match(/.{1,8}/g).join(' ')}\n`;
    let block = DES_IP.map(i => pt[i - 1]).join('');
    steps += `After IP: ${block.match(/.{1,8}/g).join(' ')}\n`;
    let L = block.slice(0, 32), R = block.slice(32);
    steps += `L0 = ${L.match(/.{1,8}/g).join(' ')}\nR0 = ${R.match(/.{1,8}/g).join(' ')}\n`;
    for (let r = 1; r <= 16; r++) {
        let key48 = subkeys[r - 1];
        steps += `\n----- ROUND ${r} -----\n`;
        let exp = DES_E.map(i => R[i - 1]).join('');
        steps += `Expanded R: ${exp.match(/.{1,6}/g).join(' ')}\n`;
        let xor = '';
        for (let i = 0; i < 48; i++) xor += exp[i] ^ key48[i];
        steps += `XOR K${r} : ${xor.match(/.{1,6}/g).join(' ')}\n`;
        let sOut = '';
        for (let box = 0; box < 8; box++) {
            let seg = xor.slice(box * 6, box * 6 + 6);
            let row = parseInt(seg[0] + seg[5], 2);
            let col = parseInt(seg.slice(1, 5), 2);
            let val = (row * 16 + col) % 16;
            sOut += val.toString(2).padStart(4, '0');
            steps += ` S${box + 1} input=${seg} row=${row} col=${col} → output ${val.toString(16).toUpperCase()} (${val.toString(2).padStart(4, '0')})\n`;
        }
        steps += `S‑box out (32 bits): ${sOut.match(/.{1,4}/g).join(' ')}\n`;
        let pOut = DES_P.map(i => sOut[i - 1]).join('');
        steps += `After P: ${pOut.match(/.{1,8}/g).join(' ')}\n`;
        let newR = '';
        for (let i = 0; i < 32; i++) newR += L[i] ^ pOut[i];
        steps += `XOR with L → new R = ${newR.match(/.{1,8}/g).join(' ')}\n`;
        L = R; R = newR;
        steps += `L${r} = ${L.match(/.{1,8}/g).join(' ')}\nR${r} = ${R.match(/.{1,8}/g).join(' ')}\n`;
    }
    let preFinal = R + L;
    steps += `\nBefore FP (R16+L16): ${preFinal.match(/.{1,8}/g).join(' ')}\n`;
    let cipherBits = DES_FP.map(i => preFinal[i - 1]).join('');
    steps += `After FP: ${cipherBits.match(/.{1,8}/g).join(' ')}\n`;
    let cipherHex = '';
    for (let i = 0; i < 64; i += 4) cipherHex += parseInt(cipherBits.slice(i, i + 4), 2).toString(16);
    steps += `\n FINAL CIPHERTEXT (hex): ${cipherHex} \n`;
    document.getElementById('des-steps').innerText = steps;
    document.getElementById('des-out').innerText = 'Ciphertext: ' + cipherHex;
}

export function resetDesTrace() {
    document.getElementById('des-key').value = '133457799bbcdff1';
    document.getElementById('des-input').value = 'ABCDEFGH';
    document.getElementById('des-mode').value = 'encrypt';
    document.getElementById('des-steps').innerText = '// DES step dump will appear here';
    document.getElementById('des-out').innerText = 'Result: ';
}
