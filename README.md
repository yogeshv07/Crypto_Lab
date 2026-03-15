# Cryptography Lab - Modular Structure

## Project Structure

```
Crypto Lab/
├── index.html              # Main HTML entry point
├── server.js              # Express server
├── cipher.html            # (Legacy - original file)
│
├── css/
│   └── styles.css         # All stylesheet rules
│
└── js/
    ├── app.js             # Main module - imports & initializes all functions
    ├── constants.js       # Cryptography constants (MD5, DES, AES, RSA)
    ├── utils.js           # Helper functions (gcd, modPow, hex conversions, etc.)
    ├── classical.js       # Classical ciphers (Vigenère, Affine, Playfair, Fermat, Euclid)
    ├── des.js             # DES encryption (16 rounds)
    ├── aes.js             # AES-128 encryption (10 rounds)
    ├── md5.js             # MD5 hashing function
    ├── rsa.js             # RSA encryption/decryption
    ├── diffie-hellman.js  # Diffie-Hellman key exchange
    └── ui.js              # UI interaction functions (toggleSub, showCipher)
```

## How It Works

### Module Organization
- **constants.js**: Stores all cryptography lookup tables and constants
- **utils.js**: Reusable helper functions like GCD, modular exponentiation, byte conversions
- **Individual cipher modules**: Each cipher (DES, AES, RSA, etc.) is in its own module
- **app.js**: Acts as the main entry point that imports all modules and exposes functions to the global scope

### Entry Point
- **index.html** loads **js/app.js** as a module script
- app.js imports all cipher modules and makes functions available on `window` for HTML onclick handlers
- Functions are called directly from HTML elements (e.g., `onclick="vigenereEncrypt()"`)

## To Run

```bash
node server.js
```

Then open `http://localhost:3000/index.html` in your browser.

## CSS Styling

All CSS is now in **css/styles.css** with proper organization:
- Layout classes (.app, .sidebar, .main)
- Component classes (.cipher-box, .steps-panel, .result-box, etc.)
- Responsive design patterns

## Adding New Ciphers

To add a new cipher:

1. Create a new file in `js/cipher-name.js`
2. Export the main function and any helpers
3. Import it in `js/app.js`
4. Add it to `window` in app.js: `window.newFunction = newFunction;`
5. Add the HTML form to `index.html`
6. Add the onclick handler to the button

Example:
```javascript
// js/newcipher.js
export function newCipherEncrypt() {
  // implementation
}

// js/app.js
import { newCipherEncrypt } from './newcipher.js';
window.newCipherEncrypt = newCipherEncrypt;
```
