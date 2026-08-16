(() => {
  const VERSION='20260816-favourites2';
  const load=src=>new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src=`${src}?v=${VERSION}`;
    script.onload=resolve;
    script.onerror=reject;
    document.head.appendChild(script);
  });
  load('./achievements-base.js').then(()=>load('./project-steps.js')).catch(console.error);
  load('./food.js').then(()=>load('./recipe-calculator.js')).then(()=>load('./recipe-paste.js')).then(()=>load('./food-extras.js')).then(()=>load('./food-favourites-v2.js')).catch(console.error);
  load('./backup.js').catch(console.error);
})();