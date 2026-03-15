import { gcd } from './utils.js';

// ========== VIGENÈRE CIPHER ==========
export function vigenereEncrypt() {
    let text = document.getElementById('vig-text').value.toUpperCase().replace(/[^A-Z]/g, '');
    let key = document.getElementById('vig-key').value.toUpperCase().replace(/[^A-Z]/g, '');
    if (!key) { alert('Invalid key'); return; }
    let steps = 'Vigenère encryption:\nText: ' + text + '\nKey: ' + key + '\n\n';
    let result = '';
    for (let i = 0; i < text.length; i++) {
        let t = text.charCodeAt(i) - 65;
        let k = key.charCodeAt(i % key.length) - 65;
        let c = (t + k) % 26;
        result += String.fromCharCode(c + 65);
        steps += `${text[i]} (${t}) + ${key[i % key.length]} (${k}) = ${c} → ${result[i]}\n`;
    }
    document.getElementById('vig-steps').innerText = steps;
    document.getElementById('vig-out').innerText = 'Ciphertext: ' + result;
}

export function vigenereDecrypt() {
    let text = document.getElementById('vig-text').value.toUpperCase().replace(/[^A-Z]/g, '');
    let key = document.getElementById('vig-key').value.toUpperCase().replace(/[^A-Z]/g, '');
    if (!key) { alert('Invalid key'); return; }
    let steps = 'Vigenère decryption:\nCipher: ' + text + '\nKey: ' + key + '\n\n';
    let result = '';
    for (let i = 0; i < text.length; i++) {
        let c = text.charCodeAt(i) - 65;
        let k = key.charCodeAt(i % key.length) - 65;
        let p = (c - k + 26) % 26;
        result += String.fromCharCode(p + 65);
        steps += `${text[i]} (${c}) - ${key[i % key.length]} (${k}) = ${p} → ${result[i]}\n`;
    }
    document.getElementById('vig-steps').innerText = steps;
    document.getElementById('vig-out').innerText = 'Plaintext: ' + result;
}

// ========== AFFINE CIPHER ==========
export function affineEncrypt() {
    let a = parseInt(document.getElementById('aff-a').value);
    let b = parseInt(document.getElementById('aff-b').value);
    let text = document.getElementById('aff-text').value.toUpperCase().replace(/[^A-Z]/g, '');
    if (!text) return;
    if (gcd(a, 26) !== 1) { alert('a must be coprime to 26'); return; }
    let steps = `Affine encryption: E(x) = (${a}*x + ${b}) mod 26\n\n`;
    let result = '';
    for (let i = 0; i < text.length; i++) {
        let x = text.charCodeAt(i) - 65;
        let val = (a * x + b) % 26;
        result += String.fromCharCode(val + 65);
        steps += `${text[i]} (x=${x}) → (${a}*${x}+${b}) mod 26 = ${val} → ${result[i]}\n`;
    }
    document.getElementById('aff-steps').innerText = steps;
    document.getElementById('aff-out').innerText = 'Ciphertext: ' + result;
}

// ========== PLAYFAIR CIPHER ==========
export function playfairEncrypt() {
    let key = document.getElementById('pf-key').value.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    let plain = document.getElementById('pf-text').value.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    if (!key || !plain) return;

    let seen = new Set();
    let matrix = [];
    let all = key + 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
    for (let ch of all) {
        if (!seen.has(ch) && ch >= 'A' && ch <= 'Z' && ch !== 'J') {
            seen.add(ch);
            matrix.push(ch);
        }
    }
    let matHtml = '';
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            matHtml += `<div class="matrix-cell">${matrix[r*5 + c]}</div>`;
        }
    }
    document.getElementById('pf-matrix').innerHTML = matHtml;

    let pairs = [];
    for (let i = 0; i < plain.length; i += 2) {
        let a = plain[i];
        let b = (i + 1 < plain.length) ? plain[i + 1] : 'X';
        if (a === b) b = 'X';
        pairs.push([a, b]);
    }

    let steps = 'Playfair matrix built.\n\nDigraphs:\n';
    let result = '';
    for (let [a, b] of pairs) {
        steps += `${a}${b} → `;
        let r1 = Math.floor(matrix.indexOf(a) / 5), c1 = matrix.indexOf(a) % 5;
        let r2 = Math.floor(matrix.indexOf(b) / 5), c2 = matrix.indexOf(b) % 5;
        let na, nb;
        if (r1 === r2) {
            na = matrix[r1 * 5 + (c1 + 1) % 5];
            nb = matrix[r2 * 5 + (c2 + 1) % 5];
        } else if (c1 === c2) {
            na = matrix[((r1 + 1) % 5) * 5 + c1];
            nb = matrix[((r2 + 1) % 5) * 5 + c2];
        } else {
            na = matrix[r1 * 5 + c2];
            nb = matrix[r2 * 5 + c1];
        }
        result += na + nb;
        steps += `${na}${nb}\n`;
    }
    document.getElementById('pf-steps').innerText = steps;
    document.getElementById('pf-out').innerText = 'Ciphertext: ' + result;
}

// ========== FERMAT'S LITTLE THEOREM ==========
export function fermatCalc() {
    let p = parseInt(document.getElementById('fer-p').value);
    let a = parseInt(document.getElementById('fer-a').value);
    if (p <= 1 || a % p === 0) { alert('p must be prime, a not multiple of p'); return; }
    let steps = `Fermat: a^(p-1) ≡ 1 (mod p) for prime p\np = ${p}, a = ${a}\n\n`;
    let exp = p - 1;
    let result = 1;
    let base = a % p;
    let e = exp;
    steps += `Computing ${a}^${exp} mod ${p} using repeated squaring:\n`;
    while (e > 0) {
        if (e & 1) result = (result * base) % p;
        base = (base * base) % p;
        e >>= 1;
    }
    steps += `Result: ${a}^${exp} mod ${p} = ${result}\n`;
    if (result === 1) steps += `\n✓ Fermat holds: ${a}^(${p}-1) ≡ 1 (mod ${p})`;
    else steps += `\n✗ Not 1 – but p may not be prime.`;
    document.getElementById('fer-steps').innerText = steps;
    document.getElementById('fer-out').innerText = `${a}^${p-1} mod ${p} = ${result}`;
}

// ========== EXTENDED EUCLIDEAN ALGORITHM ==========
export function computeEuclid() {
    let a = parseInt(document.getElementById('euc-a').value);
    let b = parseInt(document.getElementById('euc-b').value);
    if (a < 0 || b < 0) { alert('positive integers only'); return; }
    let steps = `Extended Euclidean Algorithm for (${a}, ${b})\n\n`;
    let r0 = a, r1 = b, s0 = 1, s1 = 0, t0 = 0, t1 = 1;
    steps += `i\tr\tq\ts\tt\n`;
    steps += `0\t${r0}\t\t${s0}\t${t0}\n`;
    steps += `1\t${r1}\t\t${s1}\t${t1}\n`;
    let i = 2;
    while (r1 !== 0) {
        let q = Math.floor(r0 / r1);
        let r2 = r0 % r1;
        let s2 = s0 - q * s1;
        let t2 = t0 - q * t1;
        steps += `${i}\t${r2}\t${q}\t${s2}\t${t2}\n`;
        r0 = r1; r1 = r2; s0 = s1; s1 = s2; t0 = t1; t1 = t2;
        i++;
    }
    steps += `\nGCD = ${r0}\n`;
    steps += `Coefficients: s = ${s0}, t = ${t0}\n`;
    steps += `Check: ${a}*${s0} + ${b}*${t0} = ${a*s0 + b*t0}`;
    document.getElementById('euc-steps').innerText = steps;
    document.getElementById('euc-out').innerText = `GCD(${a},${b}) = ${r0}`;
}
