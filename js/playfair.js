function pfEncrypt(){
  let t=pfText.value, k=pfKey.value;
  let m=generateMatrix(k);
  let p=prepText(t);
  let steps="5×5 MATRIX:\n";

  for(let i=0;i<25;i++){
    steps+=m[i]+" ";
    if((i+1)%5===0) steps+="\n";
  }

  steps+="\nPREPARED TEXT: "+p+"\n\n";
  let out="", s=1;

  for(let i=0;i<p.length;i+=2){
    let a=p[i], b=p[i+1];
    let [r1,c1]=pos(m,a), [r2,c2]=pos(m,b);
    let x,y;

    if(r1===r2){
      x=m[r1*5+(c1+1)%5];
      y=m[r2*5+(c2+1)%5];
      steps+=`P${s}: ${a}${b} → same row → ${x}${y}\n`;
    } else if(c1===c2){
      x=m[((r1+1)%5)*5+c1];
      y=m[((r2+1)%5)*5+c2];
      steps+=`P${s}: ${a}${b} → same column → ${x}${y}\n`;
    } else {
      x=m[r1*5+c2];
      y=m[r2*5+c1];
      steps+=`P${s}: ${a}${b} → rectangle → ${x}${y}\n`;
    }
    out+=x+y; s++;
  }
  pfOut.innerText="PLAYFAIR ENCRYPTION STEPS\n\n"+steps+"\nCIPHERTEXT: "+out;
}