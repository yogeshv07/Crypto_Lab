function isPrime(n){
  if(n<=1) return false;
  for(let i=2;i*i<=n;i++)
    if(n%i===0) return false;
  return true;
}

function modExp(base,exp,mod){
  let result=1;
  base%=mod;
  while(exp>0){
    if(exp%2===1)
      result=(result*base)%mod;
    base=(base*base)%mod;
    exp=Math.floor(exp/2);
  }
  return result;
}

function modExpTrace(base,exp,mod){
  let result=1;
  base=((base%mod)+mod)%mod;
  let steps="";
  let step=1;

  while(exp>0){
    steps+=`Step ${step}: exp=${exp}, result=${result}, base=${base}\n`;
    if(exp%2===1){
      let newResult=(result*base)%mod;
      steps+=`  multiply: result = (${result}*${base}) mod ${mod} = ${newResult}\n`;
      result=newResult;
    }
    let newBase=(base*base)%mod;
    steps+=`  square:   base = (${base}*${base}) mod ${mod} = ${newBase}\n`;
    base=newBase;
    exp=Math.floor(exp/2);
    step++;
  }

  steps+=`\nFinal: result=${result}\n`;
  return { result, steps };
}

function runFermat(){
  let a=+fermatA.value;
  let p=+fermatP.value;

  if(!isPrime(p)){
    fermatResult.innerText="p must be prime";
    return;
  }

  let traced=modExpTrace(a,p-1,p);
  let result=traced.result;

  fermatResult.innerText=
    result===1 ?
    "Fermat Verified" :
    "Not satisfied";

  fermatSteps.innerText=
    `${a}^${p-1} mod ${p} = ${result}\n\nINTERMEDIATE STEPS\n\n${traced.steps}`;
}
