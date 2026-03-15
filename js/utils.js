// Utility Functions

export function gcd(a, b) {
    return b ? gcd(b, a % b) : a;
}

export function isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++)
        if (num % i === 0) return false;
    return true;
}

export function hexToBytes(h) {
    let b = [];
    for (let i = 0; i < h.length; i += 2)
        b.push(parseInt(h.substr(i, 2), 16));
    return b;
}

export function bytesToHex(b) {
    return b.map(x => x.toString(16).padStart(2, '0')).join('');
}

export function hex2bin(hex, bits) {
    return parseInt(hex, 16).toString(2).padStart(bits, '0');
}

export function modPow(base, exp, mod) {
    let result = 1n;
    let b = BigInt(base) % BigInt(mod);
    let e = BigInt(exp);
    let m = BigInt(mod);

    while (e > 0n) {
        if (e & 1n) result = (result * b) % m;
        b = (b * b) % m;
        e >>= 1n;
    }

    return result;
}

export function gcdStepsHTML(a, b) {
    let html = "<h3 style='color:#a78bfa;'>Euclidean division steps</h3>";
    html += "<table><tr><th>a</th><th>b</th><th>q</th><th>r</th></tr>";
    let r0 = a, r1 = b;
    while (r1 !== 0) {
        let q = Math.floor(r0 / r1);
        let r = r0 % r1;
        html += `<tr><td>${r0}</td><td>${r1}</td><td>${q}</td><td>${r}</td></tr>`;
        r0 = r1;
        r1 = r;
    }
    html += "</table>";
    return html;
}

export function matrixString(arr, title) {
    let s = title ? `\n${title} (col major):\n` : '';
    for (let row = 0; row < 4; row++) {
        s += ' [ ';
        for (let col = 0; col < 4; col++) {
            s += arr[row + 4 * col].toString(16).padStart(2, '0') + ' ';
        }
        s += ']\n';
    }
    return s;
}
