(() => {
  const KEY='elsewhere_sewing';
  const fallback={equipment:[],wishlist:[],projects:[]};
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||JSON.stringify(fallback))}catch{return {...fallback,projects:[]}}};
  const write=value=>localStorage.setItem(KEY,JSON.stringify(value));
  const makeId=()=>typeof uid==='function'?uid():`${Date.now()}-${Math.random().toString(36).slice(2,8)}`;

  function ensureSteps(){
    const state=read();
    let changed=false;
    state.projects=(state.projects||[]).map(project=>{
      if(!Array.isArray(project.steps)){
        project.steps=[];
        if(project.next&&String(project.next).trim())project.steps.push({id:makeId(),text:String(project.next).trim(),done:false});
        changed=true;
      }
      project.steps=project.steps.map(step=>{
        if(!step.id){step.id=makeId();changed=true}
        if(typeof step.done!=='boolean'){step.done=false;changed=true}
        return step;
      });
      return project;
    });
    if(changed)write(state);
    return state;
  }

  function syncNext(project){
    const next=(project.steps||[]).find(step=>!step.done);
    project.next=next?next.text:'All small steps done';
  }

  function addStep(projectId,index){
    if(typeof openModal!=='function')return;
    openModal('ADD A SMALL STEP','Keep it small enough to feel doable.',[
      {id:'step',label:'What is the next small step?',type:'text'}
    ],values=>{
      const text=String(values.step||'').trim();
      if(!text)return;
      const state=ensureSteps();
      const project=state.projects.find(x=>projectId&&x.id===projectId)||state.projects[index];
      if(!project)return;
      project.steps.push({id:makeId(),text,done:false});
      syncNext(project);
      write(state);
      renderSew();
    });
  }

  function enhanceProjects(){
    const state=ensureSteps();
    const cards=[...document.querySelectorAll('#sewProjects > .listItem')];

    cards.forEach((card,index)=>{
      const project=state.projects[index];
      if(!project)return;

      const oldNext=card.querySelector(':scope > small');
      if(oldNext)oldNext.remove();

      const oldChange=card.querySelector('[data-nextproject]');
      if(oldChange)oldChange.remove();

      const list=document.createElement('div');
      list.className='projectStepList';

      const heading=document.createElement('span');
      heading.className='projectStepHeading';
      heading.textContent='SMALL STEPS';
      list.appendChild(heading);

      if(project.steps.length){
        project.steps.forEach(step=>{
          const row=document.createElement('label');
          row.className=`projectStep${step.done?' done':''}`;

          const input=document.createElement('input');
          input.type='checkbox';
          input.checked=!!step.done;
          input.setAttribute('aria-label',`Completed: ${step.text}`);

          const text=document.createElement('span');
          text.textContent=step.text;

          input.onchange=()=>{
            const current=ensureSteps();
            const targetProject=current.projects.find(x=>project.id&&x.id===project.id)||current.projects[index];
            if(!targetProject)return;
            const targetStep=targetProject.steps.find(x=>x.id===step.id);
            if(!targetStep)return;
            targetStep.done=input.checked;
            syncNext(targetProject);
            write(current);
            renderSew();
          };

          row.append(input,text);
          list.appendChild(row);
        });
      }else{
        const empty=document.createElement('p');
        empty.className='projectStepEmpty';
        empty.textContent='No small steps yet. Add the first one when you are ready.';
        list.appendChild(empty);
      }

      if(project.steps.length&&project.steps.every(step=>step.done)){
        const complete=document.createElement('p');
        complete.className='projectStepsComplete';
        complete.textContent='All your small steps are ticked. If it feels finished, tap “I made it”.';
        list.appendChild(complete);
      }

      const title=card.querySelector(':scope > strong');
      if(title)title.insertAdjacentElement('afterend',list);
      else card.prepend(list);

      let actions=card.querySelector('.rowActions');
      if(!actions){
        actions=document.createElement('div');
        actions.className='rowActions';
        card.appendChild(actions);
      }

      const add=document.createElement('button');
      add.type='button';
      add.className='projectAddStep';
      add.textContent='+ Add small step';
      add.onclick=()=>addStep(project.id,index);
      actions.prepend(add);
    });
  }

  function injectStyles(){
    const style=document.createElement('style');
    style.textContent=`
      .projectStepList{display:grid;gap:7px;margin:13px 0 5px}
      .projectStepHeading{font-size:.61rem;letter-spacing:.15em;font-weight:850;color:#52685a}
      .projectStep{display:flex;align-items:flex-start;gap:9px;padding:9px 10px;background:var(--sage2);border-radius:12px;color:var(--ink);font-size:.86rem;line-height:1.35}
      .projectStep input{width:19px;height:19px;margin:0;flex:0 0 auto;accent-color:var(--forest);cursor:pointer}
      .projectStep.done span{text-decoration:line-through;color:var(--muted)}
      .projectStepEmpty{margin:2px 0;color:var(--muted);font-size:.82rem;line-height:1.4}
      .projectStepsComplete{margin:3px 0 0;padding:9px 10px;background:var(--clayp);border-radius:12px;color:#68483d;font-family:var(--serif);font-size:.88rem;line-height:1.4}
    `;
    document.head.appendChild(style);
  }

  const baseSew=typeof renderSew==='function'?renderSew:null;
  if(baseSew)renderSew=function(){baseSew();enhanceProjects()};
  injectStyles();
})();
