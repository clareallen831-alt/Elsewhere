(() => {
  const KEY='elsewhere_health_v1';
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const today=()=>new Date().toISOString().slice(0,10);
  const uid=()=>`${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}};
  const save=d=>localStorage.setItem(KEY,JSON.stringify(d));
  const pretty=s=>{if(!s)return 'Date not recorded';try{return new Date(`${s}T12:00:00`).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'})}catch{return s}};

  function injectStyles(){
    if(document.querySelector('style[data-health-dates]'))return;
    const s=document.createElement('style');s.dataset.healthDates='1';s.textContent=`
      .healthDateLine{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:7px;padding-top:7px;border-top:1px solid rgba(52,75,60,.09);font-size:.76rem;color:#6c756e}
      .healthDateEdit{border:0;background:#eef2e9;color:#344b3c;border-radius:999px;padding:6px 10px;font-weight:700;font-size:.72rem}
      .healthDateModal{position:fixed;z-index:12000;inset:0;background:rgba(34,42,36,.55);display:flex;align-items:flex-end;justify-content:center;padding:12px}
      .healthDateModalCard{width:min(680px,100%);max-height:92vh;overflow:auto;background:#fffdf8;border-radius:26px;padding:25px;box-shadow:0 20px 70px rgba(0,0,0,.2);position:relative}
      .healthDateModalCard h2{font-family:Georgia,serif;font-weight:400;font-size:1.75rem;margin:5px 0 16px}
      .healthDateClose{position:absolute;right:15px;top:12px;border:0;background:transparent;font-size:1.8rem;color:#59645c}
      .healthDateField{display:block;margin:14px 0}.healthDateField span{display:block;font-size:.79rem;font-weight:750;margin-bottom:6px;color:#4f5b52}
      .healthDateField input{width:100%;border:1px solid #ded8cc;border-radius:14px;padding:13px;background:white;color:#263129;font:inherit}
      .healthDateSave{width:100%;border:0;border-radius:15px;padding:14px 16px;background:#344b3c;color:white;font-weight:780;margin-top:8px}
    `;document.head.appendChild(s);
  }

  function modal({eyebrow,title,fields,onSave}){
    document.querySelector('#healthDateModal')?.remove();
    const box=document.createElement('div');box.id='healthDateModal';box.className='healthDateModal';
    box.innerHTML=`<div class="healthDateModalCard"><button class="healthDateClose" aria-label="Close">×</button><p class="eyebrow">${esc(eyebrow)}</p><h2>${esc(title)}</h2>${fields.map(f=>`<label class="healthDateField"><span>${esc(f.label)}</span><input data-hdf="${esc(f.id)}" type="${f.type||'text'}" value="${esc(f.value||'')}"></label>`).join('')}<button class="healthDateSave">Save</button></div>`;
    document.body.appendChild(box);
    const close=()=>box.remove();box.querySelector('.healthDateClose').onclick=close;box.onclick=e=>{if(e.target===box)close()};
    box.querySelector('.healthDateSave').onclick=()=>{const vals={};fields.forEach(f=>vals[f.id]=box.querySelector(`[data-hdf="${f.id}"]`).value.trim());if(!vals[fields[0].id])return;onSave(vals);close()};
  }

  function addMedication(){
    modal({eyebrow:'ADD MEDICATION',title:'When did you start taking it?',fields:[
      {id:'name',label:'Medication name'},
      {id:'dose',label:'Dose / strength (optional)'},
      {id:'schedule',label:'Schedule (optional)'},
      {id:'startDate',label:'Started on',type:'date',value:today()}
    ],onSave:v=>{const d=load();d.medications=d.medications||[];d.medications.push({id:uid(),name:v.name,dose:v.dose,schedule:v.schedule,startDate:v.startDate});save(d);document.querySelector('[data-h="meds"]')?.click()}});
  }

  function addCondition(){
    modal({eyebrow:'ADD HEALTH CONCERN',title:'When did you first notice it?',fields:[
      {id:'name',label:'What would you like to track?'},
      {id:'note',label:'Anything useful to remember? (optional)'},
      {id:'firstNoticedDate',label:'First noticed',type:'date',value:today()}
    ],onSave:v=>{const d=load();d.conditions=d.conditions||[];d.conditions.push({id:uid(),name:v.name,note:v.note,firstNoticedDate:v.firstNoticedDate});save(d);document.querySelector('[data-h="other"]')?.click()}});
  }

  function editMedicationDate(id){const d=load(),m=(d.medications||[]).find(x=>x.id===id);if(!m)return;modal({eyebrow:'MEDICATION DATE',title:m.name,fields:[{id:'date',label:'Started on',type:'date',value:m.startDate||today()}],onSave:v=>{m.startDate=v.date;save(d);document.querySelector('[data-h="meds"]')?.click()}})}
  function editConditionDate(id){const d=load(),c=(d.conditions||[]).find(x=>x.id===id);if(!c)return;modal({eyebrow:'HEALTH CONCERN DATE',title:c.name,fields:[{id:'date',label:'First noticed',type:'date',value:c.firstNoticedDate||today()}],onSave:v=>{c.firstNoticedDate=v.date;save(d);document.querySelector('[data-h="other"]')?.click()}})}

  function enhanceMedication(){
    const add=$('#addMed');if(add&&!add.dataset.dateEnhanced){add.dataset.dateEnhanced='1';add.onclick=addMedication}
    const d=load(),items=[...document.querySelectorAll('#healthBody .healthList .healthItem')];
    (d.medications||[]).forEach((m,i)=>{const item=items[i];if(!item||item.querySelector('.healthDateLine'))return;const line=document.createElement('div');line.className='healthDateLine';line.innerHTML=`<span>Started: ${esc(pretty(m.startDate))}</span><button class="healthDateEdit">${m.startDate?'Change date':'Add date'}</button>`;line.querySelector('button').onclick=()=>editMedicationDate(m.id);item.appendChild(line)});
  }

  function enhanceConditions(){
    const add=$('#addCondition');if(add&&!add.dataset.dateEnhanced){add.dataset.dateEnhanced='1';add.onclick=addCondition}
    const d=load(),items=[...document.querySelectorAll('#healthBody .healthList .healthItem')];
    (d.conditions||[]).forEach((c,i)=>{const item=items[i];if(!item||item.querySelector('.healthDateLine'))return;const line=document.createElement('div');line.className='healthDateLine';line.innerHTML=`<span>First noticed: ${esc(pretty(c.firstNoticedDate))}</span><button class="healthDateEdit">${c.firstNoticedDate?'Change date':'Add date'}</button>`;line.querySelector('button').onclick=()=>editConditionDate(c.id);item.appendChild(line)});
  }

  function enhance(){
    const health=$('#health');if(!health)return;
    const active=$('.healthTabs button.active')?.dataset.h;
    if(active==='meds')enhanceMedication();
    if(active==='other')enhanceConditions();
  }

  injectStyles();
  const observer=new MutationObserver(()=>setTimeout(enhance,0));
  observer.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('click',e=>{if(e.target.closest?.('[data-h="meds"], [data-h="other"], [data-health-nav]'))setTimeout(enhance,30)});
  setTimeout(enhance,700);
})();