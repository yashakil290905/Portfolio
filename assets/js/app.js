const VIEWS={dashboard:['Dashboard','Overview'],about:['About Me','Profile'],skills:['Skills','Technology Stack'],projects:['Projects','Selected Work'],experience:['Experience','Career Path'],certificates:['Certificates','Achievements'],services:['Services','What I Can Build'],resume:['Resume','Curriculum Vitae'],gallery:['Gallery','Visual Work'],contact:['Contact','Get In Touch']};
const state={view:'dashboard',theme:'dark',lastInquiry:0};
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2600)}
function animateView(view){
  const root=$(`#view-${view}`); if(!root) return;
  root.classList.remove('view-animate');
  $$('.stagger-item',root).forEach(el=>{el.classList.remove('stagger-item');el.style.removeProperty('--delay');});
  const topLevel=$$('.dashboard-grid > .card,.dashboard-grid > .panel,.page-grid > .card,.page-grid > .panel,.page-grid > .detail-grid > .panel,.full-panel,.contact-layout,.resume-layout,.gallery-grid,.service-page-grid',root);
  const items=topLevel.length?topLevel:$$('.card,.panel,.page-hero,.full-panel,.contact-layout,.project-card,.skill-card,.service-page-grid button,.timeline-panel article,.service-grid button,.project-mini',root);
  items.forEach((el,i)=>{el.classList.add('stagger-item');el.style.setProperty('--delay',`${Math.min(i*120,900)}ms`);});
  // Dashboard hero: reveal the content itself one element at a time.
  if(view==='dashboard'){
    const hero=root.querySelector('.hero-copy');
    if(hero){
      $$('.eyebrow,h1,h2,.hero-copy>p:not(.eyebrow),.hero-actions,.connect-label,.social-row',hero).forEach((el,i)=>{el.classList.add('stagger-item');el.style.setProperty('--delay',`${180+i*115}ms`);});
    }
    const heroPhoto=root.querySelector('.hero-photo');
    if(heroPhoto){heroPhoto.classList.add('stagger-item');heroPhoto.style.setProperty('--delay','80ms');}
    $$('.stat',root).forEach((el,i)=>{el.classList.add('stagger-item');el.style.setProperty('--delay',`${220+i*90}ms`);});
    $$('.info-strip>div',root).forEach((el,i)=>{el.classList.add('stagger-item');el.style.setProperty('--delay',`${620+i*80}ms`);});
    $$('.skills-panel .bars>div,.tech-grid>span,.project-mini-grid>.project-mini,.service-grid>button,.timeline-panel article',root).forEach((el,i)=>{el.classList.add('stagger-item');el.style.setProperty('--delay',`${720+i*70}ms`);});
  }
  void root.offsetWidth;
  root.classList.add('view-animate');
}
function addMotion(){
  const interactive=$$('.card,.panel,.project-mini,.project-card,.service-grid button,.service-page-grid button,.skill-card,.stat,.nav-item,.top-actions button,.primary,.ghost');
  interactive.forEach(el=>{el.addEventListener('pointermove',e=>{if(window.matchMedia('(max-width:900px)').matches)return;const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.setProperty('--mx',`${x*100}%`);el.style.setProperty('--my',`${y*100}%`);if(el.matches('.card,.panel,.project-mini,.project-card,.service-grid button,.service-page-grid button,.skill-card'))el.style.transform=`perspective(900px) rotateX(${(-y*2.2).toFixed(2)}deg) rotateY(${(x*2.2).toFixed(2)}deg) translateY(-2px)`});el.addEventListener('pointerleave',()=>{el.style.transform=''});});
  $$('button.primary,button.ghost,.nav-item,.filter,.mobile-nav button,.circle-btn').forEach(btn=>btn.addEventListener('click',e=>{const r=btn.getBoundingClientRect(),dot=document.createElement('i');dot.className='ripple';dot.style.left=`${e.clientX-r.left}px`;dot.style.top=`${e.clientY-r.top}px`;btn.appendChild(dot);setTimeout(()=>dot.remove(),600)}));
}


function initJobTitleRotator(){
  const box = $('#jobTitleRotator');
  const target = box?.querySelector('.job-type-target');
  const main = box?.querySelector('.job-type-main');
  const accent = box?.querySelector('.job-type-accent');
  if(!box || !target || !main || !accent) return;

  const titles = [
    ['Full Stack', 'Developer'],
    ['Frontend', 'Developer'],
    ['Backend', 'Developer'],
    ['Python Django', 'Developer'],
    ['Web Application', 'Developer'],
    ['API', 'Developer']
  ];

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let timer = null;
  let cancelled = false;
  let paused = false;
  let running = true;
  let cycleToken = 0;

  const cfg = {
    typeSpeed: 72,
    deleteSpeed: 42,
    startDelay: 450,
    hold: 1550,
    between: 420,
    smartBackspace: true
  };

  const sleep = ms => new Promise(resolve => {
    timer = window.setTimeout(resolve, ms);
  });

  const clearTimer = () => {
    if(timer){ window.clearTimeout(timer); timer = null; }
  };

  const split = text => Array.from(text);
  const getCurrent = () => main.textContent || '';

  const render = (text, accentVisible = false) => {
    main.textContent = text;
    accent.textContent = accentVisible ? 'Developer' : '';
  };

  const setCaretState = state => {
    target.dataset.state = state;
  };

  const typeText = async (text, token) => {
    const chars = split(text);
    let out = '';
    for(const char of chars){
      if(cancelled || token !== cycleToken) return false;
      while(paused && running && !cancelled) await sleep(100);
      out += char;
      render(out);
      await sleep(cfg.typeSpeed + (char === ' ' ? 35 : 0));
    }
    return true;
  };

  const deleteText = async (count, token) => {
    for(let i=0;i<count;i++){
      if(cancelled || token !== cycleToken) return false;
      while(paused && running && !cancelled) await sleep(100);
      const chars = split(getCurrent());
      chars.pop();
      render(chars.join(''));
      await sleep(cfg.deleteSpeed);
    }
    return true;
  };

  const typeAccent = async token => {
    if(cancelled || token !== cycleToken) return false;
    const word = 'Developer';
    let out = '';
    for(const char of split(word)){
      if(cancelled || token !== cycleToken) return false;
      out += char;
      accent.textContent = out;
      await sleep(cfg.typeSpeed - 12);
    }
    return true;
  };

  const run = async () => {
    if(!running || cancelled || reduceMotion.matches || document.documentElement.classList.contains('motion-off')) return;
    const token = ++cycleToken;
    setCaretState('typing');

    while(running && !cancelled && token === cycleToken){
      const [role] = titles[index];
      const previousRole = index === 0 ? '' : titles[index - 1][0];
      const common = cfg.smartBackspace && previousRole
        ? (() => { let i=0; while(i<previousRole.length && i<role.length && previousRole[i]===role[i]) i++; return i; })()
        : 0;

      if(index === 0){
        render('');
        await sleep(cfg.startDelay);
        if(!(await typeText(role, token))) break;
      }else{
        setCaretState('deleting');
        const keep = common;
        const current = getCurrent();
        if(current.length > keep) await deleteText(current.length - keep, token);
        const prefix = role.slice(0, keep);
        render(prefix);
        await typeText(role.slice(keep), token);
      }

      if(!(await typeAccent(token))) break;
      setCaretState('holding');
      await sleep(cfg.hold);
      if(!running || cancelled || token !== cycleToken) break;

      setCaretState('deleting');
      accent.textContent = '';
      await deleteText(getCurrent().length, token);
      setCaretState('between');
      await sleep(cfg.between);

      index = (index + 1) % titles.length;
      if(index === 0){
        render('');
        await sleep(120);
      }
      setCaretState('typing');
    }
  };

  const start = () => {
    if(!running || cancelled || reduceMotion.matches || document.documentElement.classList.contains('motion-off')){
      if(reduceMotion.matches || document.documentElement.classList.contains('motion-off')){
        render(titles[index][0], true);
        setCaretState('static');
      }
      return;
    }
    clearTimer();
    run();
  };

  const pause = () => { paused = true; };
  const resume = () => { paused = false; };

  box.addEventListener('mouseenter', pause);
  box.addEventListener('mouseleave', resume);
  document.addEventListener('visibilitychange', () => {
    if(document.hidden) pause(); else resume();
  });
  reduceMotion.addEventListener?.('change', start);
  window.addEventListener('portfolio-motion-on', start);
  window.addEventListener('portfolio-motion-off', () => {
    clearTimer();
    render(titles[index][0], true);
    setCaretState('static');
  });
  window.addEventListener('beforeunload', () => {
    cancelled = true;
    running = false;
    clearTimer();
  }, {once:true});

  render('');
  start();
}

function setView(view){if(!VIEWS[view])return;state.view=view;$$('.view').forEach(v=>v.classList.toggle('active',v.id===`view-${view}`));$$('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view && (b.classList.contains('nav-item')||b.closest('.mobile-nav'))));$('#crumbText').textContent=VIEWS[view][0];$('#crumbSub').textContent=VIEWS[view][1];document.title=`Yasin Arafat Shakil | ${VIEWS[view][0]}`;$('#sidebar').classList.remove('open');$('#menuSheet').classList.remove('open');animateView(view)}
function openCommand(){const m=$('#commandModal');m.classList.add('open');m.setAttribute('aria-hidden','false');$('#commandInput').focus();renderResults('')}
function closeCommand(){const m=$('#commandModal');m.classList.remove('open');m.setAttribute('aria-hidden','true')}
function renderResults(q){
  const query=String(q||'').trim().toLowerCase();
  const actions=[
    {id:'dashboard',title:'Dashboard',sub:'Overview',icon:'⌂',type:'view'},
    {id:'about',title:'About Me',sub:'Profile',icon:'♙',type:'view'},
    {id:'skills',title:'Skills',sub:'Technology Stack',icon:'◈',type:'view'},
    {id:'projects',title:'Projects',sub:'Selected Work',icon:'⊞',type:'view'},
    {id:'experience',title:'Experience',sub:'Career Path',icon:'◷',type:'view'},
    {id:'certificates',title:'Certificates',sub:'Achievements',icon:'▣',type:'view'},
    {id:'services',title:'Services',sub:'What I Can Build',icon:'ϟ',type:'view'},
    {id:'resume',title:'Resume',sub:'Curriculum Vitae',icon:'▤',type:'view'},
    {id:'gallery',title:'Gallery',sub:'Visual Work',icon:'▧',type:'view'},
    {id:'contact',title:'Contact',sub:'WhatsApp Inquiry',icon:'✉',type:'view'},
    {id:'service-web',title:'Web Development',sub:'Open service inquiry',icon:'◉',type:'service',service:'Web Development'},
    {id:'service-app',title:'Web Application',sub:'Open service inquiry',icon:'▦',type:'service',service:'Web Application'},
    {id:'service-api',title:'API Development',sub:'Open service inquiry',icon:'⌘',type:'service',service:'API Development'},
    {id:'service-shop',title:'E-Commerce',sub:'Open service inquiry',icon:'🛒',type:'service',service:'E-Commerce'},
    {id:'whatsapp',title:'WhatsApp',sub:'Contact +601162051292',icon:'◌',type:'whatsapp'}
  ];
  const list=actions.filter(x=>(x.title+' '+x.sub+' '+x.service||'').toLowerCase().includes(query));
  $('#commandResults').innerHTML=list.map(x=>`<button class="command-result" data-command-type="${x.type}" data-command-id="${x.id}" data-service="${x.service||''}"><b>${x.icon}</b><span><strong>${x.title}</strong><small>${x.sub}</small></span><kbd>${x.type==='view'?'OPEN':x.type==='service'?'INQUIRE':'GO'}</kbd></button>`).join('')||'<div class="command-empty">No matching command found</div>';
  $$('[data-command-type]').forEach(b=>b.onclick=()=>{
    const type=b.dataset.commandType;
    if(type==='view') setView(b.dataset.commandId);
    if(type==='service') openService(b.dataset.service);
    if(type==='whatsapp') window.open('https://wa.me/601162051292','_blank','noopener,noreferrer');
    closeCommand();
  });
}
function safe(v,max){return String(v||'').trim().replace(/[<>]/g,'').slice(0,max)}
function validEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)}
function openWhatsApp(data){const now=Date.now();if(now-state.lastInquiry<4000){toast('Please wait a few seconds before sending again.');return}state.lastInquiry=now;const lines=['🚀 PORTFOLIO INQUIRY','','Name: '+safe(data.name,60),'Email: '+safe(data.email,120)];if(data.phone)lines.push('Phone: '+safe(data.phone,25));if(data.service)lines.push('Service: '+safe(data.service,60));if(data.budget)lines.push('Budget: '+safe(data.budget,50));if(data.timeline)lines.push('Timeline: '+safe(data.timeline,50));lines.push('','Message:',safe(data.message,1000),'','Sent from Yasin Portfolio OS');const url='https://wa.me/601162051292?text='+encodeURIComponent(lines.join('\n'));window.open(url,'_blank','noopener,noreferrer');toast('WhatsApp opened with your inquiry. Press Send to deliver it.')}
function openService(service){$('#serviceModal').classList.add('open');$('#serviceForm [name=service]').value=service||'General Inquiry';$('#serviceForm [name=name]').focus();document.body.classList.add('modal-open')}
function closeService(){$('#serviceModal').classList.remove('open');document.body.classList.remove('modal-open')}
function downloadResume(){setView('resume');setTimeout(()=>window.print(),150)}
function tick(){const d=new Date();$('#localTime').textContent=d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'});$('#localDate').textContent=d.toLocaleDateString([], {month:'short',day:'2-digit',year:'numeric'})}
function toggleTheme(){document.documentElement.classList.toggle('light');state.theme=document.documentElement.classList.contains('light')?'light':'dark';localStorage.setItem('portfolio_theme',state.theme);const b=$('#settingTheme');if(b)b.textContent=state.theme==='light'?'Switch to Dark':'Switch to Light'}
function toggleMotion(){const off=document.documentElement.classList.toggle('motion-off');localStorage.setItem('portfolio_motion',off?'off':'on');$('#settingMotion').textContent=off?'OFF':'ON';if(!off)window.dispatchEvent(new Event('portfolio-motion-on'));toast(off?'Animations disabled':'Advanced animations enabled')}
function openSettings(){const m=$('#settingsModal');m.classList.add('open');m.setAttribute('aria-hidden','false');const off=localStorage.getItem('portfolio_motion')==='off';document.documentElement.classList.toggle('motion-off',off);$('#settingMotion').textContent=off?'OFF':'ON';$('#settingTheme').textContent=document.documentElement.classList.contains('light')?'Switch to Dark':'Switch to Light'}
function closeSettings(){$('#settingsModal').classList.remove('open');$('#settingsModal').setAttribute('aria-hidden','true')}

function setupInteractive(){
  $$('[data-project]').forEach(b=>b.addEventListener('click',()=>openProject(b.dataset.project)));
  $$('.filter').forEach(b=>b.addEventListener('click',()=>{
    $$('.filter').forEach(x=>x.classList.remove('active')); b.classList.add('active');
    const key=b.textContent.trim().toLowerCase();
    $$('.project-card').forEach(card=>{
      const type=(card.dataset.category||card.querySelector('span')?.textContent||'').toLowerCase();
      const show=key==='all'||type.includes(key);
      card.hidden=!show;
      if(show){card.animate([{opacity:.2,transform:'translateY(10px) scale(.98)'},{opacity:1,transform:'none'}],{duration:420,easing:'cubic-bezier(.16,1,.3,1)'});}
    });
  }));
  $('#certPrev')?.addEventListener('click',()=>shiftCertificate(-1)); $('#certNext')?.addEventListener('click',()=>shiftCertificate(1));
  $$('.gallery-grid img').forEach(img=>img.addEventListener('click',()=>openLightbox(img.src,img.alt)));
}
let certPage=1;
function shiftCertificate(dir){certPage=Math.max(1,Math.min(4,certPage+dir));const f=$('.cert-view iframe');if(f)f.src=`assets/img/certificate.pdf#page=${certPage}&view=FitH`;$$('.dots i').forEach((d,i)=>d.classList.toggle('active',i===certPage-1));}
function openProject(id){const data={ecommerce:['E-Commerce Website','Full Stack','Laravel · MySQL · Bootstrap','Modern online store concept with product management, cart and backend-ready architecture.','assets/img/project-2.jpg'],portfolio:['Portfolio Website','Frontend','HTML · CSS · JavaScript','Responsive portfolio experience with app-style navigation, themes and interactive sections.','assets/img/project-1.jpg'],task:['Task Management App','Web App','React · Node.js · MongoDB','Productivity dashboard concept with authentication-ready flows and modular UI components.','assets/img/bg.gif']}[id];if(!data)return;const [title,type,tags,desc,img]=data;$('#projectModalContent').innerHTML=`<img src="${img}" alt="${title}"><div class="modal-project-copy"><span>${type}</span><h2>${title}</h2><p>${desc}</p><div class="tags">${tags.split(' · ').map(x=>`<b>${x}</b>`).join('')}</div><button class="primary" id="projectInquiry">Discuss Project ↗</button></div>`;$('#projectModal').classList.add('open');document.body.classList.add('modal-open');$('#projectInquiry').onclick=()=>{closeProject();openService(title)};}
function closeProject(){ $('#projectModal').classList.remove('open');document.body.classList.remove('modal-open'); }
function openLightbox(src,alt){$('#lightbox img').src=src;$('#lightbox img').alt=alt||'Portfolio image';$('#lightbox').classList.add('open');document.body.classList.add('modal-open')}
function closeLightbox(){ $('#lightbox').classList.remove('open');document.body.classList.remove('modal-open'); }
function bootLoader(){
  const loader=$('#appLoader'), progress=$('#loaderProgress'), percent=$('#loaderPercent'), message=$('#loaderMessage');
  if(!loader) return Promise.resolve();
  const messages=['Booting interface','Loading visual system','Preparing interactions','Syncing portfolio modules','Optimizing responsive UI','Finalizing secure workspace'];
  const start=performance.now();
  const duration=window.matchMedia('(prefers-reduced-motion: reduce)').matches?450:1450;
  return new Promise(resolve=>{
    const tick=now=>{
      const t=Math.min(1,(now-start)/duration);
      const eased=1-Math.pow(1-t,3);
      const value=Math.round(eased*100);
      if(progress) progress.style.width=value+'%';
      if(percent) percent.textContent=value+'%';
      if(message) message.textContent=messages[Math.min(messages.length-1,Math.floor(t*messages.length))];
      if(t<1){requestAnimationFrame(tick);return;}
      window.setTimeout(()=>{loader.classList.add('is-hidden');document.body.classList.add('app-ready');resolve();},180);
    };
    requestAnimationFrame(tick);
    window.setTimeout(()=>{loader.classList.add('is-hidden');document.body.classList.add('app-ready');resolve();},2600);
  });
}

function init(){
  const saved=localStorage.getItem('portfolio_theme');
  if(saved==='light')document.documentElement.classList.add('light');
  const motionOff=localStorage.getItem('portfolio_motion')==='off';
  document.documentElement.classList.toggle('motion-off',motionOff);

  $$('[data-view]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
  $('#openCommand').onclick=openCommand;
  $('#commandModal').addEventListener('click',e=>{if(e.target.id==='commandModal')closeCommand()});
  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCommand()}
    if(e.key==='Escape'){closeCommand();closeService();closeProject();closeLightbox();closeSettings();$('#menuSheet').classList.remove('open')}
  });
  $('#commandInput').addEventListener('input',e=>renderResults(e.target.value));
  $('#mobileMenu').onclick=()=>$('#sidebar').classList.toggle('open');
  $('#menuFloat').onclick=()=>$('#menuSheet').classList.add('open');
  $$('[data-close-menu]').forEach(x=>x.onclick=()=>$('#menuSheet').classList.remove('open'));
  $('#themeBtn').onclick=toggleTheme;
  $('#sheetTheme').onclick=()=>{toggleTheme();$('#menuSheet').classList.remove('open')};
  $('#downloadCv').onclick=downloadResume;
  $('#heroCv').onclick=downloadResume;
  $('#printResume').onclick=()=>window.print();
  $('#settingsBtn').onclick=openSettings;
  $('#closeSettings').onclick=closeSettings;
  $('#settingTheme').onclick=toggleTheme;
  $('#settingMotion').onclick=toggleMotion;
  $('#settingsModal').addEventListener('click',e=>{if(e.target.id==='settingsModal')closeSettings()});
  $('#notifyBtn').onclick=()=>toast('System online • No new notifications');
  $('#inboxBtn').onclick=()=>setView('contact');
  $('#projectModal').addEventListener('click',e=>{if(e.target.id==='projectModal')closeProject()});
  $('#closeProject').onclick=closeProject;
  $('#lightbox').addEventListener('click',e=>{if(e.target.id==='lightbox')closeLightbox()});
  $('#closeLightbox').onclick=closeLightbox;
  $$('[data-service]').forEach(b=>b.addEventListener('click',()=>openService(b.dataset.service)));
  $('#closeService').onclick=closeService;
  $('#serviceModal').addEventListener('click',e=>{if(e.target.id==='serviceModal')closeService()});
  $('#inquiryForm').addEventListener('submit',e=>{
    e.preventDefault();
    const f=new FormData(e.currentTarget);
    if(f.get('website'))return;
    const data=Object.fromEntries(f.entries());
    if(!safe(data.name,60)||!validEmail(data.email)||!safe(data.message,1000)||!data.service){$('#formStatus').textContent='Please complete the required fields correctly.';toast('Please complete the required fields.');return}
    $('#formStatus').textContent='Opening WhatsApp…';
    openWhatsApp(data);e.currentTarget.reset();
  });
  setupInteractive();addMotion();initJobTitleRotator();setView('dashboard');
  $('#serviceForm').addEventListener('submit',e=>{
    e.preventDefault();
    const data=Object.fromEntries(new FormData(e.currentTarget).entries());
    if(!safe(data.name,60)||!validEmail(data.email)||!safe(data.message,1000)){toast('Please enter a valid name, email and message.');return}
    openWhatsApp(data);e.currentTarget.reset();closeService();
  });
  tick();setInterval(tick,1000);
  if('serviceWorker' in navigator)navigator.serviceWorker.register('pwa/service-worker.js').catch(()=>{});
}

bootLoader().finally(init);


/* =========================================================
   PORTFOLIO OS v3.0 — ADVANCED INTERACTION ENGINE
   ========================================================= */
(function(){
  'use strict';

  const v3 = {
    started: performance.now(),
    selectedCommand: 0,
    commands: [],
    cursor: {x:0,y:0,rx:0,ry:0},
    raf: null
  };

  const q = s => document.querySelector(s);
  const qa = s => [...document.querySelectorAll(s)];

  function setText(id, value){
    const el = document.getElementById(id);
    if(el) el.textContent = value;
  }

  function formatTime(sec){
    const h=Math.floor(sec/3600), m=Math.floor((sec%3600)/60), s=sec%60;
    return h ? `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}` :
      `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  function updateTelemetry(){
    const now = new Date();
    const clock = now.toLocaleTimeString([], {hour12:false});
    setText('liveClock', clock);
    setText('panelClock', clock);

    const elapsed = Math.floor((performance.now()-v3.started)/1000);
    setText('sessionTime', formatTime(elapsed));
    setText('panelSession', formatTime(elapsed));

    const view = (window.state && state.view) || document.querySelector('.view.active')?.id?.replace('view-','') || 'dashboard';
    setText('panelView', view.toUpperCase());

    const online = navigator.onLine;
    setText('networkState', online ? 'ONLINE' : 'OFFLINE');
    setText('panelNetwork', online ? 'ONLINE' : 'OFFLINE');
    setText('networkLatency', online ? 'READY' : 'OFF');
    const dot = document.querySelector('.pulse-network .pulse-dot');
    if(dot) dot.classList.toggle('online', online);

    const theme = document.documentElement.classList.contains('light') ? 'LIGHT' : 'DARK';
    setText('interfaceMode', theme);

    const motion = !document.documentElement.classList.contains('motion-off');
    setText('motionText', motion ? 'ON' : 'OFF');
    const mb=q('#motionBar'); if(mb) mb.style.width=motion?'100%':'25%';

    const perf = Math.max(88, Math.min(99, Math.round(100 - (performance.now()%700)/700*7)));
    const pb=q('#uiPerfBar'); if(pb) pb.style.width=perf+'%';
    setText('uiPerfText', perf+'%');
  }

  function initQuickPanel(){
    const panel=q('#quickPanel');
    if(!panel) return;
    const open=()=>{panel.classList.add('open');panel.setAttribute('aria-hidden','false');updateTelemetry();};
    const close=()=>{panel.classList.remove('open');panel.setAttribute('aria-hidden','true');};
    q('#notifyBtn')?.addEventListener('click',open);
    q('#inboxBtn')?.addEventListener('click',open);
    panel.addEventListener('click',e=>{
      if(e.target.matches('[data-close-quick],.quick-panel-backdrop')) close();
      const b=e.target.closest('[data-view]');
      if(b){ close(); if(typeof setView==='function') setView(b.dataset.view); }
    });
    window.addEventListener('keydown',e=>{ if(e.key==='Escape') close(); });
  }

  function initCommandEnhancer(){
    const input=q('#commandInput');
    const results=q('#commandResults');
    if(!input || !results) return;

    const refresh=()=>{
      v3.commands=qa('#commandResults .command-result');
      v3.selectedCommand=Math.min(v3.selectedCommand,Math.max(0,v3.commands.length-1));
      v3.commands.forEach((el,i)=>el.classList.toggle('command-selected',i===v3.selectedCommand));
    };

    input.addEventListener('input',()=>{v3.selectedCommand=0;setTimeout(refresh,0);});
    input.addEventListener('keydown',e=>{
      if(!['ArrowDown','ArrowUp','Enter'].includes(e.key)) return;
      e.preventDefault();
      refresh();
      if(!v3.commands.length) return;
      if(e.key==='ArrowDown') v3.selectedCommand=(v3.selectedCommand+1)%v3.commands.length;
      if(e.key==='ArrowUp') v3.selectedCommand=(v3.selectedCommand-1+v3.commands.length)%v3.commands.length;
      if(e.key==='Enter') v3.commands[v3.selectedCommand]?.click();
      v3.commands.forEach((el,i)=>el.classList.toggle('command-selected',i===v3.selectedCommand));
      v3.commands[v3.selectedCommand]?.scrollIntoView({block:'nearest'});
    });

    const observer=new MutationObserver(refresh);
    observer.observe(results,{childList:true});
  }

  function initQuickCommands(){
    qa('[data-command]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const view=btn.dataset.command;
        if(typeof setView==='function') setView(view);
      });
    });
    q('#quickCommandBtn')?.addEventListener('click',()=>typeof openCommand==='function'&&openCommand());
  }

  function initKeyboardSystem(){
    window.addEventListener('keydown',e=>{
      const tag=(document.activeElement?.tagName||'').toLowerCase();
      const typing=['input','textarea','select'].includes(tag);
      if(e.ctrlKey && e.key.toLowerCase()==='k'){
        e.preventDefault();
        if(typeof openCommand==='function') openCommand();
        return;
      }
      if(e.key==='Escape'){
        if(typeof closeCommand==='function') closeCommand();
      }
      if(typing) return;
      const key=e.key.toLowerCase();
      const map={h:'dashboard',a:'about',s:'skills',p:'projects',e:'experience',c:'contact',r:'resume'};
      if(e.altKey && map[key] && typeof setView==='function'){
        e.preventDefault();
        setView(map[key]);
      }
    });
  }

  function initEnhancedCursor(){
    if(window.matchMedia('(pointer:coarse)').matches || window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const dot=document.createElement('div'), ring=document.createElement('div');
    dot.className='cursor-dot'; ring.className='cursor-ring';
    document.body.append(dot,ring);
    document.body.classList.add('cursor-enhanced');
    window.addEventListener('pointermove',e=>{
      v3.cursor.x=e.clientX; v3.cursor.y=e.clientY;
      dot.style.left=e.clientX+'px'; dot.style.top=e.clientY+'px';
      v3.cursor.rx += (e.clientX-v3.cursor.rx)*.18;
      v3.cursor.ry += (e.clientY-v3.cursor.ry)*.18;
      ring.style.left=v3.cursor.rx+'px'; ring.style.top=v3.cursor.ry+'px';
    },{passive:true});
    qa('button,a,.project-mini,.project-card,.card,.panel').forEach(el=>{
      el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
    });
  }

  function initThemePersistence(){
    const KEY='portfolio_os_v3_theme';
    const saved=localStorage.getItem(KEY);
    if(saved==='light' && !document.documentElement.classList.contains('light')) document.documentElement.classList.add('light');

    const sync=()=>{
      const light=document.documentElement.classList.contains('light');
      localStorage.setItem(KEY,light?'light':'dark');
      setText('interfaceMode',light?'LIGHT':'DARK');
    };
    q('#themeBtn')?.addEventListener('click',()=>setTimeout(sync,30));
    q('#settingTheme')?.addEventListener('click',()=>setTimeout(sync,30));
    q('#sheetTheme')?.addEventListener('click',()=>setTimeout(sync,30));
    sync();
  }

  function initNetworkEvents(){
    window.addEventListener('online',updateTelemetry);
    window.addEventListener('offline',updateTelemetry);
  }

  function initViewObserver(){
    const observer=new MutationObserver(()=>updateTelemetry());
    qa('.view').forEach(v=>observer.observe(v,{attributes:true,attributeFilter:['class']}));
  }

  function boot(){
    updateTelemetry();
    initQuickPanel();
    initCommandEnhancer();
    initQuickCommands();
    initKeyboardSystem();
    initEnhancedCursor();
    initThemePersistence();
    initNetworkEvents();
    initViewObserver();
    setInterval(updateTelemetry,1000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();


/* =========================================================
   PORTFOLIO OS v4.0 — ADVANCED COMMAND / TERMINAL / ANALYTICS
   ========================================================= */
(function(){
  'use strict';
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const V4_KEY='portfolio_os_v4_stats';
  const stats=JSON.parse(sessionStorage.getItem(V4_KEY)||'{"interactions":0,"started":'+Date.now()+'}');
  const save=()=>sessionStorage.setItem(V4_KEY,JSON.stringify(stats));
  const hit=()=>{stats.interactions++;save();};

  function open(id){const e=$(id);if(e){e.classList.add('open');e.setAttribute('aria-hidden','false');hit();}}
  function closeAll(){$$('.v4-overlay.open').forEach(e=>{e.classList.remove('open');e.setAttribute('aria-hidden','true')});}

  function scrollView(view){
    if(typeof window.setView==='function') window.setView(view);
    else {
      const e=$('#view-'+view); e?.scrollIntoView({behavior:'smooth'});
    }
    hit();
  }

  function terminalWrite(text,cls=''){
    const s=$('#terminalScreen');if(!s)return;
    const line=document.createElement('div');line.className='terminal-line '+cls;line.innerHTML=text;
    s.appendChild(line);s.scrollTop=s.scrollHeight;
  }

  function terminalCommand(cmd){
    const c=cmd.trim().toLowerCase();
    terminalWrite('<span>visitor@portfolio:~$</span> '+cmd,'cmd');
    const routes={about:'about',skills:'skills',projects:'projects',experience:'experience',contact:'contact'};
    if(c==='help'){
      terminalWrite('Available: <span>help</span> <span>about</span> <span>skills</span> <span>projects</span> <span>experience</span> <span>contact</span> <span>clear</span> <span>status</span> <span>whoami</span>');
    }else if(c==='clear'){
      $('#terminalScreen').innerHTML='';
    }else if(c==='whoami'){
      terminalWrite('Yasin Arafat Shakil — Full Stack Developer / IT Portfolio');
    }else if(c==='status'){
      terminalWrite(navigator.onLine?'SYSTEM: ONLINE — interface operational':'SYSTEM: OFFLINE — local interface active','ok');
    }else if(routes[c]){
      terminalWrite('Routing to '+c.toUpperCase()+' ...','ok');
      closeAll();scrollView(routes[c]);
    }else if(c){
      terminalWrite('Command not found. Type <span>help</span>.','err');
    }
  }

  function updateAnalytics(){
    const elapsed=Math.floor((Date.now()-stats.started)/1000);
    const h=Math.floor(elapsed/3600),m=Math.floor((elapsed%3600)/60),s=elapsed%60;
    const t=h?`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`:`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    const set=(id,v)=>{const e=$(id);if(e)e.textContent=v};
    set('#aSession',t);set('#aInteractions',stats.interactions);
    set('#aDevice',innerWidth<700?'MOBILE':innerWidth<1100?'TABLET':'DESKTOP');
    set('#aNetwork',navigator.onLine?'ONLINE':'OFFLINE');
    set('#networkFooterState',navigator.onLine?'ONLINE':'OFFLINE');
    set('#signalScore',navigator.onLine?'98%':'74%');
    const bar=$('#signalBar');if(bar)bar.style.width=navigator.onLine?'98%':'74%';
  }

  function initTerminal(){
    const form=$('#terminalForm'),input=$('#terminalInput');
    if(!form||!input)return;
    form.addEventListener('submit',e=>{e.preventDefault();terminalCommand(input.value);input.value='';hit()});
    document.addEventListener('click',e=>{
      if(e.target.closest('[data-command="terminal"]')){open('#terminalOverlay');setTimeout(()=>input.focus(),120)}
    });
  }

  function initAnalytics(){
    document.addEventListener('click',e=>{
      if(e.target.closest('[data-command="analytics"]')){open('#analyticsOverlay');updateAnalytics()}
    });
    $('#copyDiagnostics')?.addEventListener('click',async()=>{
      const text=`Portfolio OS v4.0 | ${navigator.onLine?'ONLINE':'OFFLINE'} | viewport ${innerWidth}x${innerHeight} | interactions ${stats.interactions}`;
      try{await navigator.clipboard.writeText(text); if(typeof window.showToast==='function')window.showToast('Diagnostics copied');}catch{}
      hit();
    });
    $('#resetSessionStats')?.addEventListener('click',()=>{stats.interactions=0;stats.started=Date.now();save();updateAnalytics()});
    setInterval(updateAnalytics,1000);
  }

  function initNetwork(){
    $('#v4NetworkBtn')?.addEventListener('click',()=>open('#networkOverlay'));
    window.addEventListener('online',updateAnalytics);window.addEventListener('offline',updateAnalytics);
  }

  function initShortcuts(){
    $('#v4ShortcutsBtn')?.addEventListener('click',()=>open('#shortcutsOverlay'));
    document.addEventListener('click',e=>{
      if(e.target.closest('[data-close-v4]'))closeAll();
      const backdrop=e.target.closest('.v4-backdrop');if(backdrop)closeAll();
    });
    document.addEventListener('keydown',e=>{
      if(e.key==='Escape')closeAll();
      if(e.altKey&&e.key.toLowerCase()==='t'){e.preventDefault();open('#terminalOverlay');setTimeout(()=>$('#terminalInput')?.focus(),100)}
      if(e.altKey&&e.key.toLowerCase()==='n'){e.preventDefault();open('#networkOverlay')}
      if(e.altKey&&e.key.toLowerCase()==='?'){e.preventDefault();open('#shortcutsOverlay')}
    });
  }

  function interactionCounter(){
    document.addEventListener('click',e=>{
      if(e.target.closest('button,a,[role="button"],.card,.project-card')){hit();updateAnalytics()}
    },{passive:true});
  }

  function boot(){
    save();initTerminal();initAnalytics();initNetwork();initShortcuts();interactionCounter();updateAnalytics();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
