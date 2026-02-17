
function gcd(a,b){
  while(b!==0){
    let t=b;
    b=a%b;
    a=t;
  }
  return Math.abs(a);
}

function modInverse(a,m){
  a=((a%m)+m)%m;
  for(let x=1;x<m;x++)
    if((a*x)%m===1) return x;
  return null;
}

function affEncrypt(){
  let t=affText.value.toUpperCase();
  let a=+aKey.value;
  let b=+bKey.value;

  if(!Number.isFinite(a) || !Number.isFinite(b)){
    affOut.innerText="Enter valid numbers for a and b";
    return;
  }

  if(gcd(a,26)!==1){
    affOut.innerText="Invalid a: gcd(a,26) must be 1";
    return;
  }

  let out="";
  let steps="i  P  p  C=(a*p+b) mod26  C\n";
  let i=1;

  for(let ch of t){
    if(ch>='A'&&ch<='Z'){
      let p=ch.charCodeAt(0)-65;
      let c=((a*p)+b)%26;
      let C=String.fromCharCode(c+65);
      out+=C;
      steps+=`${i}  ${ch}  ${p}  (${a}*${p}+${b}) mod26=${c}  ${C}\n`;
      i++;
    }
  }

  affOut.innerText="AFFINE ENCRYPTION STEPS\n\n"+steps+"\nCipher: "+out;
}

function affDecrypt(){
  let t=affText.value.toUpperCase();
  let a=+aKey.value;
  let b=+bKey.value;

  if(!Number.isFinite(a) || !Number.isFinite(b)){
    affOut.innerText="Enter valid numbers for a and b";
    return;
  }

  if(gcd(a,26)!==1){
    affOut.innerText="Invalid a: gcd(a,26) must be 1";
    return;
  }

  let aInv=modInverse(a,26);
  if(aInv===null){
    affOut.innerText="No modular inverse for a under mod 26";
    return;
  }

  let out="";
  let steps=`a^-1 mod26 = ${aInv}\n\n`;
  steps+="i  C  c  P=a^-1*(c-b) mod26  P\n";
  let i=1;

  for(let ch of t){
    if(ch>='A'&&ch<='Z'){
      let c=ch.charCodeAt(0)-65;
      let p=(aInv*(c-b))%26;
      p=(p+26)%26;
      let P=String.fromCharCode(p+65);
      out+=P;
      steps+=`${i}  ${ch}  ${c}  ${aInv}*(${c}-${b}) mod26=${p}  ${P}\n`;
      i++;
    }
  }

  affOut.innerText="AFFINE DECRYPTION STEPS\n\n"+steps+"\nPlain: "+out;
}
