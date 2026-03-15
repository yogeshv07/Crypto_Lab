# Project Modularization Summary

## ✅ Structure Created

### Directories
- **css/** - Stylesheet folder  
- **js/** - JavaScript modules folder

### CSS File (1 file)
- **css/styles.css** - Extracted all inline styles from HTML

### JavaScript Modules (9 files)

**Core Modules:**
- `js/constants.js` - MD5, DES, AES constants and lookup tables
- `js/utils.js` - Shared utilities (gcd, modPow, hexToBytes, matrixString, etc.)
- `js/app.js` - Main entry point that imports and initializes all modules

**Cipher Modules (one function per module):**
- `js/classical.js` - Vigenère, Affine, Playfair, Fermat, Extended Euclid
- `js/des.js` - DES encryption (16 rounds)
- `js/aes.js` - AES-128 encryption (10 rounds)
- `js/md5.js` - MD5 hash function
- `js/rsa.js` - RSA encryption/decryption
- `js/diffie-hellman.js` - Diffie-Hellman key exchange
- `js/ui.js` - UI interaction (toggleSub, showCipher)

### HTML Files
- **index.html** (NEW) - Main entry point using modular imports
- **cipher.html** - Legacy file (kept for reference)

### Updated Files
- **server.js** - Now serves static CSS and JS files properly

## Module Dependencies

```
index.html
    ↓
js/app.js
    ├── imports: js/constants.js
    ├── imports: js/utils.js
    ├── imports: js/classical.js
    ├── imports: js/des.js
    ├── imports: js/aes.js
    ├── imports: js/md5.js
    ├── imports: js/rsa.js
    ├── imports: js/diffie-hellman.js
    └── imports: js/ui.js

Interconnections:
- classical.js imports utils (gcd)
- des.js imports constants, utils (hex2bin)
- aes.js imports constants, utils (hexToBytes, bytesToHex, matrixString)
- md5.js imports constants (MD5_S, MD5_K)
- rsa.js imports utils (isPrime, gcdStepsHTML, modPow)
- diffie-hellman.js imports utils (modPow)
```

## Running the Application

```bash
node server.js
```

Open browser to: `http://localhost:3500/`

Or directly: `http://localhost:3500/index.html`

## Benefits of This Structure

✅ **Separation of Concerns** - Each cipher has its own module
✅ **Reusability** - Utils functions shared across modules
✅ **Maintainability** - Easy to find and modify specific ciphers
✅ **Scalability** - Add new ciphers without touching existing code
✅ **Clean HTML** - No inline scripts or styles
✅ **Module System** - Uses ES6 import/export
✅ **No Build Required** - Works directly in modern browsers

## File Statistics
- CSS: 1 file (styles.css)
- JS: 9 files
  - 1 entry point (app.js)
  - 1 constants file
  - 1 utils file
  - 1 UI file
  - 5 cipher modules
- HTML: 2 files (index.html + legacy cipher.html)
- Server: 1 file (updated server.js)
