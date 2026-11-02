const nav=document.getElementById('nav');addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>30));
document.getElementById('burger').onclick=()=>document.getElementById('links').classList.toggle('open');
const rv=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('in')),{threshold:.1});document.querySelectorAll('.reveal').forEach(e=>rv.observe(e));
const bt=document.getElementById('blur');if(bt){const walk=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/\s+/).filter(Boolean).forEach(w=>{const s=document.createElement('span');s.className='w';s.textContent=w;f.appendChild(s)});c.replaceWith(f)}else walk(c)})};walk(bt);const ws=[...bt.querySelectorAll('.w')];const upd=()=>{const r=bt.getBoundingClientRect(),vh=innerHeight;const p=Math.min(1,Math.max(0,(vh*.85-r.top)/(vh*.55+r.height*.4)));ws.forEach((w,i)=>w.classList.toggle('on',i/ws.length<p))};addEventListener('scroll',upd,{passive:true});upd()}
const cf=document.getElementById('cform');if(cf)cf.onsubmit=e=>{e.preventDefault();const d=new FormData(cf);location.href='mailto:lagunnikesh2064@gmail.com?subject='+encodeURIComponent(d.get('subject'))+'&body='+encodeURIComponent(d.get('message')+'\n\n'+d.get('name')+' ('+d.get('email')+') '+d.get('org'))};
/* 15-second hand check */
const hs=document.getElementById('handStage');if(hs){
const STEPS=[[3,'Look at your hand','Just look at it. Nothing else.',0],[3,'Pick one finger in your mind','Decide to lift it, but do NOT move it.',1],[2,'Switch to a different finger','Change your mind. Still do not move.',2],[1,'Now lift one finger','Any finger. Go.',3],[6,'Notice what happened','Did it feel smooth, blocked, or did something else move?',4]];
const fs=[...hs.querySelectorAll('.f')],box=hs.querySelector('.stepbox'),num=hs.querySelector('.ringwrap i'),ring=hs.querySelector('.ring'),btn=hs.querySelector('.go'),res=hs.querySelector('.res');let run=false;
const C=2*Math.PI*30;ring.style.strokeDasharray=C;const setR=p=>ring.style.strokeDashoffset=C*(1-p);setR(0);
function clear(){fs.forEach(f=>f.className.baseVal='f')}
async function go(){if(run)return;run=true;res.classList.remove('show');btn.style.display='none';let left=15;const total=15;
for(const [sec,t,d,k] of STEPS){clear();if(k==0)fs.forEach(f=>f.classList.add('look'));if(k==1){fs[1].classList.add('hold')}if(k==2){fs[3].classList.add('hold')}if(k==3){fs[2].classList.add('up')}
box.innerHTML='<b>'+t+'</b><span>'+d+'</span>';
for(let s=sec;s>0;s--){num.textContent=left;setR((total-left)/total);await new Promise(r=>setTimeout(r,1000));left--}}
num.textContent='0';setR(1);clear();box.innerHTML='<b>Done. How did it feel?</b><span>Pick the closest one below.</span>';res.classList.add('show');btn.textContent='Try again';btn.style.display='';run=false}
btn.onclick=go;
const A={s:'Smooth. Low inner friction and a strong grip on your focus. Your mind follows your intentions well right now.',b:'Blocked. There is a lot of inner friction right now. Try making your next task smaller, or clear your head first (see tip 2).',j:'Your focus slipped mid-thought. Your attention is not holding well at the moment. Shorter work blocks with small breaks can help.',w:'You could not pick a finger. Your mind is wobbling and your energy goes to the easiest option. A tiny, clear first step helps here.',r:'Relief once you moved. You have lots of push built up behind some resistance. Start the thing you are avoiding with a 5-minute timer.'};
res.querySelectorAll('.opts button').forEach(b=>b.onclick=()=>{res.querySelectorAll('.opts button').forEach(x=>x.classList.remove('on'));b.classList.add('on');const a=res.querySelector('.ans');a.textContent=A[b.dataset.k];a.classList.add('show')})}
/* five minute timer */
const tb=document.getElementById('t5');if(tb){let iv=null;tb.onclick=()=>{if(iv){clearInterval(iv);iv=null;tb.textContent='Start 5-minute timer';document.getElementById('t5n').textContent='05:00';return}let s=300;tb.textContent='Stop';iv=setInterval(()=>{s--;const m=String(Math.floor(s/60)).padStart(2,'0'),ss=String(s%60).padStart(2,'0');document.getElementById('t5n').textContent=m+':'+ss;if(s<=0){clearInterval(iv);iv=null;tb.textContent='Start 5-minute timer';document.getElementById('t5n').textContent='Time. What did you notice?'}},1000)}}
/* article filter */
const ps=document.getElementById('posts');if(ps){const q=document.getElementById('q'),cards=[...ps.children];let yr='all';const f=()=>{const v=q.value.toLowerCase();cards.forEach(c=>{c.style.display=(c.dataset.t.includes(v)&&(yr==='all'||c.dataset.y===yr))?'':'none'})};q.oninput=f;document.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{document.querySelectorAll('.chip').forEach(x=>x.classList.remove('on'));b.classList.add('on');yr=b.dataset.y;f()})}
/* auto reveal + stagger */
document.querySelectorAll('.card,.post,.bk,.review,.store,.sec-head,.cta-box,.eeg-note,.specs>div').forEach((e,i)=>{if(!e.classList.contains('reveal')){e.classList.add('reveal');e.style.transitionDelay=(i%4)*80+'ms';rv.observe(e)}});
/* scroll progress */
const pb=document.createElement('div');pb.className='progress';document.body.appendChild(pb);addEventListener('scroll',()=>{pb.style.width=(scrollY/(document.documentElement.scrollHeight-innerHeight)*100)+'%'},{passive:true});
/* count up */
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;co.unobserve(e.target);const el=e.target,n=+el.dataset.count,sf=el.dataset.suffix||'',t0=performance.now();const tick=t=>{const p=Math.min(1,(t-t0)/1600),v=Math.round(n*(1-Math.pow(1-p,3)));el.textContent=v.toLocaleString('en-US')+(p>=1?sf:'');if(p<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)}),{threshold:.5});document.querySelectorAll('[data-count]').forEach(e=>co.observe(e));
/* EEG sweep monitor */
const lerp=(a,b,t)=>a+(b-a)*t;
const comps=[['d',2.2,0.15,0.6],['t',6,0.25,0.95],['a',10,0.35,0.7],['b',21,0.6,0.15]];
function eegSweep(cv,getD,chs,labels,strip){
 const wrap=document.createElement('div');wrap.className='eegwrap'+(strip?' strip':'');cv.parentNode.insertBefore(wrap,cv);
 const grid=document.createElement('canvas');wrap.appendChild(grid);wrap.appendChild(cv);cv.classList.add('trace');
 const H=+cv.getAttribute('height');const LAB=strip?0:56;let w,dpr,x,py=[],gx,tx;
 const SPEED=strip?140:170, GAP=strip?30:26;
 function fit(){dpr=Math.min(2,devicePixelRatio||1);w=wrap.clientWidth;[grid,cv].forEach(c=>{c.width=w*dpr;c.height=H*dpr;c.style.width=w+'px';c.style.height=H+'px'});gx=grid.getContext('2d');tx=cv.getContext('2d');gx.setTransform(dpr,0,0,dpr,0,0);tx.setTransform(dpr,0,0,dpr,0,0);
  gx.clearRect(0,0,w,H);gx.lineWidth=1;const mj=strip?'rgba(64,115,77,.10)':'rgba(255,255,255,.07)';const mn=strip?'rgba(64,115,77,.05)':'rgba(255,255,255,.035)';
  for(let X=LAB;X<w;X+=10){gx.strokeStyle=((X-LAB)%50===0)?mj:mn;gx.beginPath();gx.moveTo(X,0);gx.lineTo(X,H);gx.stroke()}
  for(let Y=0;Y<H;Y+=10){gx.strokeStyle=(Y%50===0)?mj:mn;gx.beginPath();gx.moveTo(LAB,Y);gx.lineTo(w,Y);gx.stroke()}
  if(!strip){gx.font='600 12px Inter,sans-serif';gx.fillStyle='rgba(199,217,204,.85)';labels.forEach((l,i)=>{const by=H*(i+1)/(chs+1);gx.fillText(l,10,by+4)});gx.fillStyle='rgba(255,255,255,.45)';gx.font='11px Inter,sans-serif';gx.fillText('1 sec',w-44,H-8);gx.strokeStyle='rgba(255,255,255,.45)';gx.beginPath();gx.moveTo(w-110,H-12);gx.lineTo(w-60,H-12);gx.stroke()}
  tx.clearRect(0,0,w,H);x=LAB;py=[];}
 fit();addEventListener('resize',fit);
 function sample(t,d,c){const tt=t*0.45;let s=0;for(const [k,f,af,ad] of comps){let amp=lerp(af,ad,d);if(k==='a')amp*=0.65+0.35*Math.sin(t*0.6+c);s+=amp*Math.sin(2*Math.PI*f*tt+c*1.9+f)}
  s+=0.22*(Math.random()-.5)*2*(0.5+0.5*lerp(.4,1,d));
  if(c===0){const ph=(t%7.5);const g=Math.exp(-Math.pow((ph-1)*3.2,2));s+=-1.9*g*(strip?0.4:1)}
  return s}
 let vis=true;new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(wrap);let last=performance.now(),T0=performance.now();
 function frame(now){requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;if(!vis)return;const d=getD(now/1000);const adv=SPEED*dt;let nx=x+adv;
  const cols=strip?['#40734D']:['#C7D9CC','#B7A7D9','#D98B48'];
  const steps=Math.max(1,Math.ceil(adv));for(let s=1;s<=steps;s++){const xx=x+adv*s/steps;const tm=(now-T0)/1000-(adv-adv*s/steps)/SPEED;
   for(let c=0;c<chs;c++){const base=H*(c+1)/(chs+1),amp=strip?H*.2:H/(chs+1)*.32;const y=base-amp*sample(tm,d,c);
    if(py[c]!==undefined&&xx>x){tx.strokeStyle=cols[c%cols.length];tx.lineWidth=strip?1.7:2;tx.lineJoin='round';tx.beginPath();tx.moveTo(x+adv*(s-1)/steps,py[c]);tx.lineTo(xx,y);tx.stroke()}py[c]=y}}
  x=nx;
  tx.clearRect(x+2,0,GAP,H);
  if(x>=w){tx.clearRect(w-4,0,6,H);x=LAB;py=[];tx.clearRect(LAB,0,GAP,H)}
 }
 requestAnimationFrame(frame)}
document.querySelectorAll('canvas.eeg').forEach(cv=>{if(cv.dataset.mode==='main'){const sl=document.getElementById('drift');const st=document.getElementById('eegState');const mt={d:document.getElementById('m_d'),t:document.getElementById('m_t'),a:document.getElementById('m_a'),b:document.getElementById('m_b')};let cur=+sl.value/100;eegSweep(cv,()=>{const target=+sl.value/100;cur+=(target-cur)*.04;for(const [k,f,af,ad] of comps)mt[k].style.width=Math.round(lerp(af,ad,cur)*100)+'%';st.textContent=cur<.33?'Focused on the task':cur<.66?'Attention starting to slip':'Mind wandering';return cur},3,['Fp1','C3','O1'],false)}else{eegSweep(cv,t=>.45+.4*Math.sin(t*.25),1,[],true)}});
/* paper plane landing */
function plane(sec,btn){if(!sec||!btn||sec.dataset.plane)return;sec.dataset.plane=1;const run=()=>{const cs=getComputedStyle(sec);if(cs.position==='static')sec.style.position='relative';const sr=sec.getBoundingClientRect(),br=btn.getBoundingClientRect();const W=sr.width,Hh=sr.height,bx=br.left-sr.left+br.width/2,by=br.top-sr.top-8;
 const ns='http://www.w3.org/2000/svg';const svg=document.createElementNS(ns,'svg');svg.setAttribute('class','planesvg');svg.setAttribute('width',W);svg.setAttribute('height',Hh);svg.style.cssText='position:absolute;inset:0;pointer-events:none;z-index:5;overflow:visible';
 const d='M -60,'+(Hh*.55)+' C '+(W*.12)+','+(-Hh*.25)+' '+(W*.38)+','+(Hh*.05)+' '+(W*.5)+','+(Hh*.2)+' S '+(bx+W*.18)+','+(by-Hh*.15)+' '+bx+','+by;
 const path=document.createElementNS(ns,'path');path.setAttribute('d',d);path.setAttribute('fill','none');path.setAttribute('stroke','rgba(255,255,255,.6)');path.setAttribute('stroke-width','2');path.setAttribute('stroke-dasharray','2 9');path.setAttribute('stroke-linecap','round');svg.appendChild(path);
 const g=document.createElementNS(ns,'g');g.innerHTML='<path d="M0 0 L34 -12 L10 4 Z" fill="#fff"/><path d="M10 4 L34 -12 L13 14 Z" fill="#C7D9CC"/><path d="M10 4 L14 14 L17 7 Z" fill="#B7A7D9"/>';svg.appendChild(g);sec.appendChild(svg);
 const L=path.getTotalLength(),dur=3600,t0=performance.now();path.style.strokeDasharray='2 9';
 function step(n){let p=Math.min(1,(n-t0)/dur);const e=1-Math.pow(1-p,2.2);const pt=path.getPointAtLength(L*e),pt2=path.getPointAtLength(Math.min(L,L*e+2));let ang=Math.atan2(pt2.y-pt.y,pt2.x-pt.x)*180/Math.PI;if(p>.92)ang=ang*(1-(p-.92)/.08)+(-8)*((p-.92)/.08);g.setAttribute('transform','translate('+pt.x+','+pt.y+') rotate('+ang+') scale('+(1-.15*p)+')');
  path.setAttribute('stroke-dashoffset',0);path.style.opacity=1-p*.7;
  if(p<1)requestAnimationFrame(step);else{btn.classList.add('bump');setTimeout(()=>btn.classList.remove('bump'),700);sparkle(sec,bx,by+6);setTimeout(()=>{g.style.transition='opacity 1.2s';g.style.opacity=0;path.style.opacity=0;setTimeout(()=>svg.remove(),1300)},2600)}}
 requestAnimationFrame(step)};
 const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){io.disconnect();setTimeout(run,300)}},{threshold:.45});io.observe(sec)}
function sparkle(sec,x,y){for(let i=0;i<14;i++){const s=document.createElement('i');s.className='spark';const a=Math.PI*2*i/14,r=40+Math.random()*50;s.style.left=x+'px';s.style.top=y+'px';s.style.setProperty('--dx',Math.cos(a)*r+'px');s.style.setProperty('--dy',Math.sin(a)*r-20+'px');s.style.background=['#D98B48','#B7A7D9','#C7D9CC','#fff'][i%4];sec.appendChild(s);setTimeout(()=>s.remove(),1100)}}
const ns1=document.getElementById('news');if(ns1)plane(ns1,ns1.querySelector('.sub-form button'));
document.querySelectorAll('.cta-box').forEach(cb=>{const bt=cb.querySelector('.sub-form button');if(bt){cb.style.position='relative';plane(cb,bt)}});
/* hello bubble */
const hb=document.querySelector('.hello');if(hb)setTimeout(()=>hb.classList.add('on'),900);
/* 12 second eye check */
const es=document.getElementById('eyeStage');if(es){const box=es.querySelector('.eyebox'),dot=es.querySelector('.dot'),box2=es.querySelector('.stepbox'),num=es.querySelector('.ringwrap i'),ring=es.querySelector('.ring'),btn=es.querySelector('.go'),res=es.querySelector('.res');let run=false;const C=2*Math.PI*30;ring.style.strokeDasharray=C;const setR=p=>ring.style.strokeDashoffset=C*(1-p);setR(0);
const ST=[[2,'Look at the dot','Straight ahead. Keep your head still.',0],[2,'Shift your eyes slightly right','Follow the dot with your eyes only.',1],[2,'Now slightly left','Eyes only. Head still.',-1],[4,'Back to the middle. Hold.','Keep your eyes locked on the dot.',0],[2,'Notice','What stayed steady, drifted or felt tense?',0]];
const AN={s:'Smooth. Your focus locked back on easily, a sign of low inner friction and a firm grip on attention today.',d:'Your eyes drifted. Your attention slips easily at the moment. Try shorter work blocks with small breaks.',t:'Tense. Holding steady took effort, which suggests quite a bit of inner friction right now. Clear your head first (tip 3).',w:'A small wobble before settling is common. It can mean your focus is just opening up, so give it a minute.'};
async function go(){if(run)return;run=true;res.classList.remove('show');btn.style.display='none';let left=12;for(const [s,t,d,x] of ST){dot.style.left=(50+x*30)+'%';box.classList.toggle('glow',x!==0);box2.innerHTML='<b>'+t+'</b><span>'+d+'</span>';for(let i=s;i>0;i--){num.textContent=left;setR((12-left)/12);await new Promise(r=>setTimeout(r,1000));left--}}
num.textContent='0';setR(1);box.classList.remove('glow');box2.innerHTML='<b>Done. How did it feel?</b><span>Pick the closest one.</span>';res.classList.add('show');btn.textContent='Try again';btn.style.display='';run=false}
btn.onclick=go;res.querySelectorAll('.opts button').forEach(b=>b.onclick=()=>{res.querySelectorAll('.opts button').forEach(x=>x.classList.remove('on'));b.classList.add('on');const a=res.querySelector('.ans');a.textContent=AN[b.dataset.k];a.classList.add('show')})}
