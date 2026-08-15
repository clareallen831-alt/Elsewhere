(() => {
  const VERSION='20260815-foodlog2';
  const load=src=>new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src=`${src}?v=${VERSION}`;
    script.onload=resolve;
    script.onerror=reject;
    document.head.appendChild(script);
  });
  load('./achievements-base.js').then(()=>load('./project-steps.js')).catch(console.error);
  load('./food.js').then(()=>load('./recipe-calculator.js')).then(()=>load('./recipe-paste.js')).catch(console.error);
})();
