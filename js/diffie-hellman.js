import { modPow } from './utils.js';

// ========== DIFFIE-HELLMAN KEY EXCHANGE ==========

export function runDiffieHellman() {
    let p = parseInt(document.getElementById('dh-p').value);
    let g = parseInt(document.getElementById('dh-g').value);
    let a = parseInt(document.getElementById('dh-a').value);
    let b = parseInt(document.getElementById('dh-b').value);

    if ([p, g, a, b].some(Number.isNaN)) {
        alert('Enter valid numeric values for P, G, a and b.');
        return;
    }
    if (p <= 1 || g <= 0 || a <= 0 || b <= 0) {
        alert('P must be greater than 1, and G, a, b must be positive.');
        return;
    }

    let alicePublic = modPow(g, a, p);
    let bobPublic = modPow(g, b, p);
    let aliceSecret = modPow(bobPublic, a, p);
    let bobSecret = modPow(alicePublic, b, p);

    let steps = " DIFFIE-HELLMAN KEY EXCHANGE \n\n" ;
    steps += `Public values:\nP = ${p}\nG = ${g}\n\n`;
    steps += `Private keys:\nAlice chooses a = ${a}\nBob chooses b = ${b}\n\n`;
    steps += "Step 1: Compute public keys\n";
    steps += `Alice computes A = G^a mod P = ${g}^${a} mod ${p} = ${alicePublic}\n`;
    steps += `Bob computes B = G^b mod P = ${g}^${b} mod ${p} = ${bobPublic}\n\n`;
    steps += "Step 2: Exchange public keys\n";
    steps += `Alice sends A = ${alicePublic}\n`;
    steps += `Bob sends B = ${bobPublic}\n\n`;
    steps += "Step 3: Compute shared secret\n";
    steps += `Alice computes K = B^a mod P = ${bobPublic}^${a} mod ${p} = ${aliceSecret}\n`;
    steps += `Bob computes K = A^b mod P = ${alicePublic}^${b} mod ${p} = ${bobSecret}\n\n`;
    steps += aliceSecret === bobSecret
        ? `Shared secret established successfully: K = ${aliceSecret}`
        : `Mismatch detected: Alice=${aliceSecret}, Bob=${bobSecret}`;

    document.getElementById('dh-steps').innerText = steps;
    document.getElementById('dh-out').innerText =
        aliceSecret === bobSecret
            ? `Result: Shared secret key = ${aliceSecret} (A = ${alicePublic}, B = ${bobPublic})`
            : 'Result: Error - computed secrets do not match';
}

export function resetDiffieHellman() {
    document.getElementById('dh-p').value = '23';
    document.getElementById('dh-g').value = '5';
    document.getElementById('dh-a').value = '6';
    document.getElementById('dh-b').value = '15';
    document.getElementById('dh-steps').innerText = '// Diffie-Hellman steps will appear here';
    document.getElementById('dh-out').innerText = 'Result: ';
}
