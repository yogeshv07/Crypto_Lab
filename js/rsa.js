import { isPrime, gcdStepsHTML, modPow } from './utils.js';

// ========== RSA ENCRYPTION ==========

function extendedEuclidHTML(phi, e) {
    let r1 = phi, r2 = e;
    let s1 = 1, s2 = 0;
    let t1 = 0, t2 = 1;

    let html = "<h3 style='color:#a78bfa;'>Extended Euclidean table</h3>";
    html += "<table><tr><th>step</th><th>r</th><th>q</th><th>s</th><th>t</th></tr>";
    let step = 0;
    html += `<tr><td>${step}</td><td>${r1}</td><td>-</td><td>${s1}</td><td>${t1}</td></tr>`;
    step++;
    html += `<tr><td>${step}</td><td>${r2}</td><td>-</td><td>${s2}</td><td>${t2}</td></tr>`;

    while (r2 !== 0) {
        let q = Math.floor(r1 / r2);
        let r = r1 - q * r2;
        let s = s1 - q * s2;
        let t = t1 - q * t2;
        step++;
        html += `<tr><td>${step}</td><td>${r}</td><td>${q}</td><td>${s}</td><td>${t}</td></tr>`;
        r1 = r2; r2 = r;
        s1 = s2; s2 = s;
        t1 = t2; t2 = t;
    }
    html += "</table>";
    return { d: t1, html: html };
}

function fastExpDetailed(base, exp, mod) {
    let binary = exp.toString(2);
    let html = `<h4 style='color:#f59e0b;'>${base}^${exp} mod ${mod}</h4>`;
    html += `Binary of ${exp} = ${binary}<br><br>`;
    html += "<b>Step 1: Compute powers</b><br>";

    let current = BigInt(base) % BigInt(mod);
    let m = BigInt(mod);
    let powers = [];

    for (let i = 0; i < binary.length; i++) {
        let powerVal = (current % m).toString();
        powers.push(powerVal);
        html += `${base}^2^${i} mod ${mod} = ${powerVal}<br>`;
        current = (current * current) % m;
    }

    html += "<br><b>Step 2: Multiply selected powers</b><br>(";
    let final = 1n;
    for (let i = 0; i < binary.length; i++) {
        if (binary[binary.length - 1 - i] === "1") {
            html += powers[i] + " × ";
            final = (final * BigInt(powers[i])) % m;
        }
    }
    html = html.slice(0, -3);
    html += ") mod " + mod + "<br>";
    html += `<b>Final result = ${final.toString()}</b><br>`;
    return { value: Number(final), html: html };
}

function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

export function runRSA() {
    let p = parseInt(document.getElementById('rsa-p').value);
    let q = parseInt(document.getElementById('rsa-q').value);
    let e = parseInt(document.getElementById('rsa-e').value);
    let message = document.getElementById('rsa-m').value.trim();

    if (!isPrime(p) || !isPrime(q)) {
        alert("p and q must be prime numbers!");
        return;
    }

    let n = p * q;
    let phi = (p - 1) * (q - 1);

    let steps = "<span style='color:#a78bfa; font-size:1.4rem;'>RSA </span><br><br>";
    steps += `<b>1. Compute n</b> : n = ${p} × ${q} = ${n}<br>`;
    steps += `<b>2. Compute φ(n)</b> : φ = (${p}-1)(${q}-1) = ${phi}<br><br>`;
    steps += `<b>3. Check gcd(e, φ)</b> with e = ${e}<br>`;
    steps += gcdStepsHTML(phi, e);

    if (gcd(phi, e) !== 1) {
        steps += "<br><span style='color:#f87171;'>e is not coprime with φ(n). Choose another e.</span>";
        document.getElementById('rsa-steps').innerHTML = steps;
        document.getElementById('rsa-out').innerText = 'Error: e not valid';
        return;
    }
    steps += `<br> gcd = 1 → e is valid.<br>`;

    steps += `<b>4. Find d (private exponent) using extended Euclid</b><br>`;
    let ee = extendedEuclidHTML(phi, e);
    let d = ee.d;
    if (d < 0) d += phi;
    steps += ee.html;
    steps += `<br>d = ${d} (after making positive)<br>`;
    steps += `<b>Public key</b> : (${e}, ${n})<br>`;
    steps += `<b>Private key</b>: (${d}, ${n})<br><br>`;

    let finalResultText = "";
    if (!isNaN(message) && message !== "") {
        let M = parseInt(message);
        steps += `<h3 style='color:#a78bfa;'>Encryption (numeric)</h3>`;
        let enc = fastExpDetailed(M, e, n);
        steps += enc.html;
        steps += `<h3 style='color:#a78bfa;'>Decryption</h3>`;
        let dec = fastExpDetailed(enc.value, d, n);
        steps += dec.html;
        finalResultText = `Ciphertext: ${enc.value} → Decrypted: ${dec.value}`;
    } else {
        steps += `<h3 style='color:#a78bfa;'>TEXT MODE – processing each character</h3>`;
        let cipherChars = [];
        let plainChars = [];
        for (let i = 0; i < message.length; i++) {
            let ascii = message.charCodeAt(i);
            steps += `<hr><b>Character '${message[i]}' (ASCII ${ascii})</b><br>`;
            let enc = fastExpDetailed(ascii, e, n);
            steps += enc.html;
            let dec = fastExpDetailed(enc.value, d, n);
            steps += dec.html;
            cipherChars.push(enc.value);
            plainChars.push(String.fromCharCode(dec.value));
        }
        let cipherText = cipherChars.join(' ');
        let recovered = plainChars.join('');
        steps += `<hr><b>Final cipher values</b> : ${cipherText}<br>`;
        steps += `<b>Recovered text</b> : ${recovered}<br>`;
        finalResultText = `Ciphertext (numbers): ${cipherText} → Decrypted text: ${recovered}`;
    }

    document.getElementById('rsa-steps').innerHTML = steps;
    document.getElementById('rsa-out').innerText = 'Result: ' + finalResultText;
}
