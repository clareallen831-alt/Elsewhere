(() => {
  const load=src=>new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src=src;
    script.onload=resolve;
    script.onerror=reject;
    document.head.appendChild(script);
  });
  load('./achievements-base.js').then(()=>load('./project-steps.js')).catch(console.error);
  load('./food.js').catch(console.error);
})();