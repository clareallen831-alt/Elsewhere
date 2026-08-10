(() => {
  const KEY='elsewhere_health_v1';
  const symptomOptions=['Cramps','Headache','Bloating','Breast tenderness','Low mood','Irritable','Anxious','Fatigue','Poor sleep','Nausea','Back pain','Joint / muscle pain','Digestive changes','Dizziness','Hot flushes','Night sweats','Spotting'];
  const severityLabels={1:'Mild',2:'Noticeable',3:'Strong',4:'Very strong'};
  let activeTab='overview';

  const q=s=>document.querySelector(s), qa=s=>[...document.querySelectorAll(s)];
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const uid=()=>`${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  const today=()=>{const d=new Date(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${d.getFullYear()}-${m}-${day}`};
  const defaults=()=>({periods:[],symptoms:[],medications:[],medLogs:[],conditions:[],conditionLogs:[]});
  const data=()=>{try{return {...defaults(),...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return defaults()}};
  const save=v=>localStorage.setItem(KEY,JSON.stringify(v));
  const prettyDate=s=>s?new Date(`${s}T12:00:00`).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'}):'';
  const dayDiff=(a,b)=>Math.round((Date.parse(`${a}T12:00:00Z`)-Date.parse(`${b}T12:00:00Z`))/86400000);
  const nowTime=()=>new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});

  function injectAssets(){
    if(!q('link[data-health-css]')){const l=document.createElement('link');l.rel='stylesheet';l.href='./health.css';l.dataset.healthCss='1';document.head.appendChild(l)}
  }
  function injectUI(){
    if(q('#health'))return;
    const main=q('main');
    const section=document.createElement('section');section.className='view';section.id='health';
    section.innerHTML=`
      <div class="sectionIntro healthIntro"><p class="eyebrow">HEALTH</p><h1>A quiet record of how your body is doing.</h1><p>Notice patterns, remember what happened, and keep useful information together.</p></div>
      <div class="healthPrivacy"><strong>Your record, not a diagnosis.</strong><p>Health information stays on this device. Elsewhere does not diagnose symptoms or tell you to change medication. Follow medication instructions from your prescriber or pharmacist.</p></div>
      <div class="healthSummary" id="healthSummary"></div>
      <div class="healthTabs" id="healthTabs">
        <button data-health-tab="overview" class="selected">Overview</button><button data-health-tab="cycle">Cycle</button><button data-health-tab="symptoms">Symptoms</button><button data-health-tab="meds">Medication</button><button data-health-tab="other">Other health</button>
      </div>
      <div id="healthContent"></div>`;
    main.appendChild(section);
    const nav=q('.bottomNav');if(nav&&!q('[data-health-nav]')){nav.classList.add('healthNavReady');const b=document.createElement('button');b.className='nav';b.dataset.go='health';b.dataset.healthNav='1';b.innerHTML='✚<span>Health</span>';b.onclick=()=>openHealth();nav.appendChild(b)}
    qa('#healthTabs button').forEach(b=>b.onclick=()=>{activeTab=b.dataset.healthTab;qa('#healthTabs button').forEach(x=>x.classList.toggle('selected',x===b));render()});
    if(q('#clearAll'))q('#clearAll').addEventListener('click',()=>localStorage.removeItem(KEY));
  }
  function openHealth(){
    if(typeof go==='function')go('health');else{qa('.view').forEach(v=>v.classList.toggle('active',v.id==='health'));qa('.nav').forEach(n=>n.classList.toggle('active',n.dataset.go==='health'));window.scrollTo(0,0)}
    render();
  }
  function switchTab(tab){activeTab=tab;qa('#healthTabs button').forEach(x=>x.classList.toggle('selected',x.dataset.healthTab===tab));render()}

  function periodStats(h){
    const starts=h.periods.map(x=>x.start).filter(Boolean).sort();const last=starts.at(-1)||null;
    const intervals=[];for(let i=1;i<starts.length;i++){const d=dayDiff(starts[i],starts[i-1]);if(d>0)intervals.push(d)}
    const recent=intervals.slice(-6);const avg=recent.length?Math.round(recent.reduce((a,b)=>a+b,0)/recent.length):null;
    const cycleDay=last&&dayDiff(today(),last)>=0?dayDiff(today(),last)+1:null;
    return {last,avg,cycleDay};
  }
  function dueDoses(m,date=today()){
    if(!m.active)return[];const day=new Date(`${date}T12:00:00`).getDay();
    if(m.schedule==='daily')return[{key:'1',label:m.time1||'Daily dose'}];
    if(m.schedule==='twice')return[{key:'1',label:m.time1||'Dose 1'},{key:'2',label:m.time2||'Dose 2'}];
    if(m.schedule==='weekly'&&Number(m.weekday)===day)return[{key:'1',label:m.time1||'Weekly dose'}];
    return[];
  }
  function taken(h,medId,doseKey,date=today()){return h.medLogs.some(x=>x.medId===medId&&x.date===date&&x.doseKey===doseKey)}
  function summary(){
    const h=data(),p=periodStats(h),active=h.medications.filter(x=>x.active),due=active.flatMap(m=>dueDoses(m).map(d=>({m,d}))),done=due.filter(x=>taken(h,x.m.id,x.d.key)).length,lastSym=[...h.symptoms].sort((a,b)=>b.date.localeCompare(a.date))[0];
    q('#healthSummary').innerHTML=`<div class="healthSummaryCard"><span>Cycle</span><strong>${p.cycleDay?`Day ${p.cycleDay}`:p.last?'Logged':'Not logged yet'}</strong></div><div class="healthSummaryCard"><span>Medication today</span><strong>${due.length?`${done} of ${due.length} taken`:active.length?'Nothing due':'None added'}</strong></div><div class="healthSummaryCard"><span>Last symptom log</span><strong>${lastSym?prettyDate(lastSym.date):'None yet'}</strong></div><div class="healthSummaryCard"><span>Other health</span><strong>${h.conditions.filter(x=>x.active).length||'None'} ${h.conditions.filter(x=>x.active).length===1?'item':'items'}</strong></div>`;
  }
  function render(){summary();if(!q('#healthContent'))return;({overview:renderOverview,cycle:renderCycle,symptoms:renderSymptoms,meds:renderMeds,other:renderOther}[activeTab]||renderOverview)()}

  function renderOverview(){
    const h=data(),p=periodStats(h),due=h.medications.filter(x=>x.active).flatMap(m=>dueDoses(m).map(d=>({m,d})));
    q('#healthContent').innerHTML=`
      <div class="healthSection"><p class="eyebrow">TODAY</p><h2>A few useful things in one place.</h2><p>You only need to log what is useful to you.</p><div class="healthList">
        <button class="healthItem clickable" id="healthQuickCycle"><div class="healthItemTop"><div><strong>${p.cycleDay?`Cycle day ${p.cycleDay}`:'Log your cycle'}</strong><small>${p.last?`Last period started ${prettyDate(p.last)}`:'Start with the first day of your next period, or add a recent one.'}</small></div><span class="healthBadge">Cycle</span></div></button>
        <button class="healthItem clickable" id="healthQuickSymptoms"><div class="healthItemTop"><div><strong>How is your body today?</strong><small>Log symptoms without needing to explain or interpret them.</small></div><span class="healthBadge">Symptoms</span></div></button>
        <button class="healthItem clickable" id="healthQuickMeds"><div class="healthItemTop"><div><strong>${due.length?`${due.length} medication ${due.length===1?'dose':'doses'} on today's list`:'Medication tracker'}</strong><small>Mark what you've taken, or add your regular medication.</small></div><span class="healthBadge">Medication</span></div></button>
        <button class="healthItem clickable" id="healthQuickOther"><div class="healthItemTop"><div><strong>Other health</strong><small>Keep dated notes for migraines, pain, digestive issues, skin problems or anything else you choose.</small></div><span class="healthBadge">Your list</span></div></button>
      </div></div>
      <div class="healthNote">Elsewhere is useful for remembering patterns and dates, but it is not an emergency or medication reminder system. If something feels medically concerning, use your usual healthcare route.</div>`;
    q('#healthQuickCycle').onclick=()=>switchTab('cycle');q('#healthQuickSymptoms').onclick=()=>switchTab('symptoms');q('#healthQuickMeds').onclick=()=>switchTab('meds');q('#healthQuickOther').onclick=()=>switchTab('other');
  }

  function renderCycle(){
    const h=data(),p=periodStats(h),list=[...h.periods].sort((a,b)=>b.start.localeCompare(a.start));
    q('#healthContent').innerHTML=`<div class="healthSection"><p class="eyebrow">CYCLE</p><h2>${p.cycleDay?`Cycle day ${p.cycleDay}`:'Start your cycle record'}</h2><p>${p.last?`Your most recent logged period started ${prettyDate(p.last)}.${p.avg?` Your logged cycles average about ${p.avg} days.`:''}`:'Add the first day of a period to begin.'}</p>${p.avg?'<div class="healthTiny">The average is calculated only from the dates you log. It is a record, not a prediction of ovulation, fertility or contraception.</div>':''}<button class="healthAdd" id="addPeriod">+ Log a period</button></div><div class="healthSection"><p class="eyebrow">HISTORY</p><h2>Your period logs</h2><div class="healthList">${list.length?list.map(x=>`<div class="healthItem"><div class="healthItemTop"><div><strong>${prettyDate(x.start)}${x.end?` – ${prettyDate(x.end)}`:''}</strong><small>${esc(x.flow||'Flow not noted')}${x.note?` · ${esc(x.note)}`:''}</small></div><span class="healthBadge">${esc(x.flow||'Logged')}</span></div><div class="healthActions"><button data-delete-period="${x.id}">Remove</button></div></div>`).join(''):'<p class="healthEmpty">No period logs yet.</p>'}</div></div>`;
    q('#addPeriod').onclick=openPeriodForm;qa('[data-delete-period]').forEach(b=>b.onclick=()=>{const h=data();h.periods=h.periods.filter(x=>x.id!==b.dataset.deletePeriod);save(h);render()});
  }
  function openPeriodForm(){openModal('CYCLE','Log a period',`<label class="healthField"><span>Start date</span><input id="hpStart" type="date" value="${today()}"></label><label class="healthField"><span>End date <small class="muted">optional</small></span><input id="hpEnd" type="date"></label><label class="healthField"><span>Flow</span><select id="hpFlow"><option>Spotting</option><option>Light</option><option selected>Medium</option><option>Heavy</option></select></label><label class="healthField"><span>Anything to remember? <small class="muted">optional</small></span><textarea id="hpNote" rows="3"></textarea></label>`,()=>{const start=q('#hpStart').value;if(!start)return false;const h=data();h.periods.unshift({id:uid(),start,end:q('#hpEnd').value,flow:q('#hpFlow').value,note:q('#hpNote').value.trim()});save(h);return true})}

  function renderSymptoms(){
    const h=data(),list=[...h.symptoms].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,30);
    q('#healthContent').innerHTML=`<div class="healthSection"><p class="eyebrow">SYMPTOMS</p><h2>How did your body feel?</h2><p>Log what you noticed. You do not need to decide what caused it.</p><button class="healthAdd" id="addSymptoms">+ Log symptoms</button></div><div class="healthSection"><p class="eyebrow">RECENT</p><h2>Your symptom notes</h2><div class="healthList">${list.length?list.map(x=>`<div class="healthItem"><div class="healthItemTop"><div><strong>${prettyDate(x.date)}</strong><small>${x.items.map(esc).join(' · ')}${x.note?`<br>${esc(x.note)}`:''}</small></div><span class="healthBadge">${severityLabels[x.severity]||'Logged'}</span></div><div class="healthActions"><button data-delete-symptom="${x.id}">Remove</button></div></div>`).join(''):'<p class="healthEmpty">Nothing logged yet.</p>'}</div></div>`;
    q('#addSymptoms').onclick=openSymptomForm;qa('[data-delete-symptom]').forEach(b=>b.onclick=()=>{const h=data();h.symptoms=h.symptoms.filter(x=>x.id!==b.dataset.deleteSymptom);save(h);render()});
  }
  function openSymptomForm(){
    openModal('SYMPTOMS','What did you notice?',`<label class="healthField"><span>Date</span><input id="hsDate" type="date" value="${today()}"></label><div class="healthField"><span>Symptoms</span><div class="symptomGrid" id="symptomGrid">${symptomOptions.map(x=>`<button type="button" class="symptomChip" data-symptom="${esc(x)}">${esc(x)}</button>`).join('')}</div></div><label class="healthField"><span>Something else <small class="muted">optional</small></span><input id="hsCustom" type="text" placeholder="Add your own symptom"></label><div class="healthField"><span>How noticeable was it?</span><div class="severityGrid" id="symptomSeverity">${Object.entries(severityLabels).map(([v,l])=>`<button type="button" class="severityChip" data-severity="${v}">${l}</button>`).join('')}</div></div><label class="healthField"><span>Notes <small class="muted">optional</small></span><textarea id="hsNote" rows="3" placeholder="Timing, what you were doing, anything useful to remember…"></textarea></label>`,()=>{const chosen=qa('#symptomGrid .selected').map(x=>x.dataset.symptom),custom=q('#hsCustom').value.trim();if(custom)chosen.push(custom);if(!chosen.length)return false;const severity=Number(q('#symptomSeverity .selected')?.dataset.severity||1);const h=data();h.symptoms.unshift({id:uid(),date:q('#hsDate').value||today(),items:chosen,severity,note:q('#hsNote').value.trim()});save(h);return true},()=>{qa('.symptomChip').forEach(b=>b.onclick=()=>b.classList.toggle('selected'));qa('#symptomSeverity .severityChip').forEach(b=>b.onclick=()=>{qa('#symptomSeverity .severityChip').forEach(x=>x.classList.toggle('selected',x===b))});q('#symptomSeverity .severityChip')?.classList.add('selected')})
  }

  function renderMeds(){
    const h=data(),active=h.medications.filter(x=>x.active),inactive=h.medications.filter(x=>!x.active),due=active.flatMap(m=>dueDoses(m).map(d=>({m,d}))),prn=active.filter(m=>m.schedule==='asneeded');
    q('#healthContent').innerHTML=`<div class="healthSection"><p class="eyebrow">TODAY'S MEDICATION</p><h2>A simple checklist.</h2><p>This records what you tell Elsewhere you took. It does not replace prescription instructions or a reliable medication alarm.</p><div class="healthList">${due.length?due.map(({m,d})=>{const isTaken=taken(h,m.id,d.key);return `<div class="medToday"><div class="healthItemTop"><div><strong>${esc(m.name)}</strong><small>${esc(m.dose||'')}${m.dose&&d.label?' · ':''}${esc(d.label)}</small></div><span class="healthBadge">${isTaken?'Taken':'Not yet'}</span></div><div class="healthActions"><button class="${isTaken?'taken':''}" data-toggle-dose="${m.id}|${d.key}">${isTaken?'✓ Taken — undo':'Mark taken'}</button></div></div>`}).join(''):'<p class="healthEmpty">Nothing scheduled in Elsewhere for today.</p>'}${prn.map(m=>`<div class="healthItem"><div class="healthItemTop"><div><strong>${esc(m.name)}</strong><small>${esc(m.dose||'')} · As needed</small></div></div><div class="healthActions"><button data-prn-dose="${m.id}">Log a dose now</button></div></div>`).join('')}</div><button class="healthAdd" id="addMedication">+ Add medication</button></div><div class="healthSection"><p class="eyebrow">MY MEDICATION</p><h2>What you're tracking</h2><div class="healthList">${active.length?active.map(m=>medCard(m,true)).join(''):'<p class="healthEmpty">No medication added yet.</p>'}${inactive.length?`<p class="healthHistoryHeading">Not currently shown</p>${inactive.map(m=>medCard(m,false)).join('')}`:''}</div></div>`;
    q('#addMedication').onclick=openMedicationForm;qa('[data-toggle-dose]').forEach(b=>b.onclick=()=>toggleDose(b.dataset.toggleDose));qa('[data-prn-dose]').forEach(b=>b.onclick=()=>logPrn(b.dataset.prnDose));qa('[data-toggle-med]').forEach(b=>b.onclick=()=>{const h=data(),m=h.medications.find(x=>x.id===b.dataset.toggleMed);if(m)m.active=!m.active;save(h);render()});
  }
  function medCard(m,on){const schedule={daily:'Daily',twice:'Twice daily',weekly:`Weekly · ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][Number(m.weekday)||0]}`,asneeded:'As needed'}[m.schedule]||m.schedule;return `<div class="healthItem"><div class="healthItemTop"><div><strong>${esc(m.name)}</strong><small>${esc(m.dose||'')}${m.dose?' · ':''}${esc(schedule)}</small></div><span class="healthBadge">${on?'Tracking':'Hidden'}</span></div><div class="healthActions"><button data-toggle-med="${m.id}">${on?'Stop showing':'Show again'}</button></div></div>`}
  function toggleDose(key){const [medId,doseKey]=key.split('|'),h=data(),idx=h.medLogs.findIndex(x=>x.medId===medId&&x.date===today()&&x.doseKey===doseKey);idx>=0?h.medLogs.splice(idx,1):h.medLogs.unshift({id:uid(),medId,date:today(),doseKey,takenAt:nowTime()});save(h);render()}
  function logPrn(medId){const h=data();h.medLogs.unshift({id:uid(),medId,date:today(),doseKey:`prn-${Date.now()}`,takenAt:nowTime()});save(h);render()}
  function openMedicationForm(){
    openModal('MEDICATION','Add something you take',`<div class="healthNote">This is a tracker only. Enter the schedule you have already been given by your prescriber, pharmacist or medicine label.</div><label class="healthField"><span>Name</span><input id="hmName" type="text" placeholder="Medication name"></label><label class="healthField"><span>Dose / strength <small class="muted">optional</small></span><input id="hmDose" type="text" placeholder="e.g. 10 mg, 1 tablet"></label><label class="healthField"><span>Schedule</span><select id="hmSchedule"><option value="daily">Daily</option><option value="twice">Twice daily</option><option value="weekly">Weekly</option><option value="asneeded">As needed</option></select></label><label class="healthField"><span>Usual time / first dose <small class="muted">optional</small></span><input id="hmTime1" type="time"></label><label class="healthField" id="hmTime2Wrap" style="display:none"><span>Second dose time <small class="muted">optional</small></span><input id="hmTime2" type="time"></label><label class="healthField" id="hmWeekWrap" style="display:none"><span>Weekly day</span><select id="hmWeekday"><option value="1">Monday</option><option value="2">Tuesday</option><option value="3">Wednesday</option><option value="4">Thursday</option><option value="5">Friday</option><option value="6">Saturday</option><option value="0">Sunday</option></select></label>`,()=>{const name=q('#hmName').value.trim();if(!name)return false;const h=data();h.medications.unshift({id:uid(),name,dose:q('#hmDose').value.trim(),schedule:q('#hmSchedule').value,time1:q('#hmTime1').value,time2:q('#hmTime2').value,weekday:q('#hmWeekday').value,active:true});save(h);return true},()=>{const update=()=>{q('#hmTime2Wrap').style.display=q('#hmSchedule').value==='twice'?'block':'none';q('#hmWeekWrap').style.display=q('#hmSchedule').value==='weekly'?'block':'none'};q('#hmSchedule').onchange=update;update()})
  }

  function renderOther(){
    const h=data(),active=h.conditions.filter(x=>x.active),inactive=h.conditions.filter(x=>!x.active);
    q('#healthContent').innerHTML=`<div class="healthSection"><p class="eyebrow">OTHER HEALTH</p><h2>Track what matters to you.</h2><p>Create your own item — for example pain, migraines, reflux, skin symptoms or anything else — then add dated notes when it changes.</p><button class="healthAdd" id="addCondition">+ Add a health issue</button></div><div class="healthSection"><p class="eyebrow">MY HEALTH NOTES</p><div class="healthList">${active.length?active.map(c=>conditionCard(c,h,true)).join(''):'<p class="healthEmpty">Nothing added yet.</p>'}${inactive.length?`<p class="healthHistoryHeading">Not currently shown</p>${inactive.map(c=>conditionCard(c,h,false)).join('')}`:''}</div></div>`;
    q('#addCondition').onclick=openConditionForm;qa('[data-log-condition]').forEach(b=>b.onclick=()=>openConditionLog(b.dataset.logCondition));qa('[data-toggle-condition]').forEach(b=>b.onclick=()=>{const h=data(),c=h.conditions.find(x=>x.id===b.dataset.toggleCondition);if(c)c.active=!c.active;save(h);render()});
  }
  function conditionCard(c,h,on){const logs=h.conditionLogs.filter(x=>x.conditionId===c.id).sort((a,b)=>b.date.localeCompare(a.date)),last=logs[0];return `<div class="healthItem"><div class="healthItemTop"><div><strong>${esc(c.name)}</strong><small>${esc(c.note||'')}${last?`${c.note?' · ':''}Last log ${prettyDate(last.date)}`:''}</small></div>${last?`<span class="healthBadge">${severityLabels[last.severity]||'Logged'}</span>`:''}</div>${last?.note?`<small>${esc(last.note)}</small>`:''}<div class="healthActions">${on?`<button data-log-condition="${c.id}">Log today</button>`:''}<button data-toggle-condition="${c.id}">${on?'Stop showing':'Show again'}</button></div></div>`}
  function openConditionForm(){openModal('OTHER HEALTH','Add a health issue',`<label class="healthField"><span>Name</span><input id="hcName" type="text" placeholder="e.g. Migraine, knee pain, reflux"></label><label class="healthField"><span>Anything useful to remember? <small class="muted">optional</small></span><textarea id="hcNote" rows="3"></textarea></label>`,()=>{const name=q('#hcName').value.trim();if(!name)return false;const h=data();h.conditions.unshift({id:uid(),name,note:q('#hcNote').value.trim(),active:true});save(h);return true})}
  function openConditionLog(id){const h=data(),c=h.conditions.find(x=>x.id===id);if(!c)return;openModal('HEALTH NOTE',`Log ${esc(c.name)}`,`<label class="healthField"><span>Date</span><input id="hclDate" type="date" value="${today()}"></label><div class="healthField"><span>How noticeable was it?</span><div class="severityGrid" id="conditionSeverity">${Object.entries(severityLabels).map(([v,l])=>`<button type="button" class="severityChip" data-severity="${v}">${l}</button>`).join('')}</div></div><label class="healthField"><span>Notes <small class="muted">optional</small></span><textarea id="hclNote" rows="4" placeholder="What happened, how long it lasted, anything you want to remember…"></textarea></label>`,()=>{const severity=Number(q('#conditionSeverity .selected')?.dataset.severity||1);const h=data();h.conditionLogs.unshift({id:uid(),conditionId:id,date:q('#hclDate').value||today(),severity,note:q('#hclNote').value.trim()});save(h);return true},()=>{qa('#conditionSeverity .severityChip').forEach(b=>b.onclick=()=>qa('#conditionSeverity .severityChip').forEach(x=>x.classList.toggle('selected',x===b)));q('#conditionSeverity .severityChip')?.classList.add('selected')})}

  let afterOpen=null,saveHandler=null;
  function openModal(eyebrow,title,body,onSave,onOpen){
    q('#elsewhereHealthModal')?.remove();const m=document.createElement('div');m.className='healthModal';m.id='elsewhereHealthModal';m.innerHTML=`<div class="healthModalCard"><button class="healthClose" aria-label="Close">×</button><p class="eyebrow">${esc(eyebrow)}</p><h2>${title}</h2>${body}<button class="healthSave">Save</button></div>`;document.body.appendChild(m);saveHandler=onSave;afterOpen=onOpen;m.querySelector('.healthClose').onclick=()=>m.remove();m.onclick=e=>{if(e.target===m)m.remove()};m.querySelector('.healthSave').onclick=()=>{const ok=saveHandler?.();if(ok!==false){m.remove();render()}};afterOpen?.();
  }

  function init(){injectAssets();injectUI();render();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
