function vigEncrypt(){
  let t=vigText.value.toUpperCase();
  let k=vigKey.value.toUpperCase();
  let out="", j=0;
  let steps="i  P  K  (P,K)->C\n";
  let i=1;

  for(let ch of t){
    if(ch>='A'&&ch<='Z'){
      let pi=ch.charCodeAt(0)-65;
      let ki=k.charCodeAt(j%k.length)-65;
      let ci=(pi+ki)%26;
      out+=String.fromCharCode(ci+65);
      steps+=`${i}  ${ch}  ${k[j%k.length]}  (${pi},${ki})->${String.fromCharCode(ci+65)}\n`;
      j++;
      i++;
    }
  }

  vigOut.innerText="VIGENÈRE ENCRYPTION STEPS\n\n"+steps+"\nCipher: "+out;
}

function vigDecrypt(){
  let t=vigText.value.toUpperCase();
  let k=vigKey.value.toUpperCase();
  let out="", j=0;
  let steps="i  C  K  (C,K)->P\n";
  let i=1;

  for(let ch of t){
    if(ch>='A'&&ch<='Z'){
      let ci=ch.charCodeAt(0)-65;
      let ki=k.charCodeAt(j%k.length)-65;
      let pi=(ci-ki+26)%26;
      out+=String.fromCharCode(pi+65);
      steps+=`${i}  ${ch}  ${k[j%k.length]}  (${ci},${ki})->${String.fromCharCode(pi+65)}\n`;
      j++;
      i++;
    }
  }

  vigOut.innerText="VIGENÈRE DECRYPTION STEPS\n\n"+steps+"\nPlain: "+out;
}
