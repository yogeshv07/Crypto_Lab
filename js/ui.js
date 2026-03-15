// ========== UI INTERACTION FUNCTIONS ==========

export function toggleSub(header) {
    let s = header.nextElementSibling;
    s.classList.toggle('show');
    header.querySelector('.arrow').textContent = s.classList.contains('show') ? '▼' : '▶';
}

export function showCipher(name) {
    document.querySelectorAll('.cipher-box').forEach(b => b.classList.remove('active'));
    document.getElementById(name + '-box')?.classList.add('active');
    document.querySelectorAll('.cipher-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    let names = {
        vigenere: 'Vigenère', affine: 'Affine', playfair: 'Playfair',
        fermat: 'Fermat', euclid: 'Euclid', des: 'DES (full trace)', aes: 'AES-128',
        rsa: 'RSA (full step‑by‑step)', md5: 'MD5'
    };
}
