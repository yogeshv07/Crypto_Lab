// ========== MAIN APP MODULE ==========
import { toggleSub, showCipher } from './ui.js';
import { vigenereEncrypt, vigenereDecrypt, affineEncrypt, playfairEncrypt, fermatCalc, computeEuclid } from './classical.js';
import { runDesFullTrace, resetDesTrace } from './des.js';
import { runAesFullTrace, resetAesTrace } from './aes.js';
import { runRSA } from './rsa.js';
import { runDiffieHellman, resetDiffieHellman } from './diffie-hellman.js';
import { computeMD5 } from './md5.js';

// Expose functions to global scope for onclick handlers in HTML
window.toggleSub = toggleSub;
window.showCipher = showCipher;
window.vigenereEncrypt = vigenereEncrypt;
window.vigenereDecrypt = vigenereDecrypt;
window.affineEncrypt = affineEncrypt;
window.playfairEncrypt = playfairEncrypt;
window.fermatCalc = fermatCalc;
window.computeEuclid = computeEuclid;
window.runDesFullTrace = runDesFullTrace;
window.resetDesTrace = resetDesTrace;
window.runAesFullTrace = runAesFullTrace;
window.resetAesTrace = resetAesTrace;
window.runRSA = runRSA;
window.runDiffieHellman = runDiffieHellman;
window.resetDiffieHellman = resetDiffieHellman;
window.computeMD5 = computeMD5;

// Initialize app on page load
window.onload = function() {
    // default active DES
    document.querySelectorAll('.cipher-box').forEach(b => b.classList.remove('active'));
    document.getElementById('des-box').classList.add('active');
};
