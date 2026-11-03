const nav=document.getElementById('nav');addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>30));
document.getElementById('burger').onclick=()=>document.getElementById('links').classList.toggle('open');
const rv=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('in')),{threshold:.01,rootMargin:'0px 0px 12% 0px'});document.querySelectorAll('.reveal').forEach(e=>rv.observe(e));
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
const ps=document.getElementById("posts");if(ps){const q=document.getElementById("q"),cs=[...ps.children];let yr="all",tk="all";const fl=()=>{const v=q.value.toLowerCase();cs.forEach(c=>{c.style.display=(c.dataset.t.includes(v)&&(yr==="all"||c.dataset.y===yr)&&(tk==="all"||c.dataset.k===tk))?"":"none"})};q.oninput=fl;document.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{document.querySelectorAll(".chip").forEach(x=>x.classList.remove("on"));b.classList.add("on");if(b.dataset.k){tk=b.dataset.k;yr="all"}else{yr=b.dataset.y;tk="all"}fl()})}
/* auto reveal + stagger */
document.querySelectorAll('.card,.post,.bk,.review,.store,.sec-head,.cta-box,.eeg-note,.specs>div').forEach((e,i)=>{if(!e.classList.contains('reveal')){e.classList.add('reveal');e.style.transitionDelay=(i%4)*35+'ms';rv.observe(e)}});
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
function plane(sec,btn){if(!sec||!btn||sec.dataset.plane)return;sec.dataset.plane=1;const run=()=>{if(getComputedStyle(sec).position==='static')sec.style.position='relative';const sr=sec.getBoundingClientRect(),br=btn.getBoundingClientRect();const W=sr.width,H=sr.height,bx=br.left-sr.left+br.width/2,by=br.top-sr.top-6;
 const ns='http://www.w3.org/2000/svg';const svg=document.createElementNS(ns,'svg');svg.setAttribute('width',W);svg.setAttribute('height',H);svg.style.cssText='position:absolute;inset:0;pointer-events:none;z-index:5;overflow:hidden';
 const d='M -50,'+(H*.78)+' C '+(W*.08)+','+(H*.45)+' '+(W*.14)+','+(H*.09)+' '+(W*.38)+','+(H*.07)+' S '+(W*.78)+','+(H*.02)+' '+(W*.86)+','+(H*.26)+' S '+(bx+W*.1)+','+(by-H*.1)+' '+(bx+34)+','+(by-8)+' L '+bx+','+by;
 const path=document.createElementNS(ns,'path');path.setAttribute('d',d);path.setAttribute('fill','none');path.setAttribute('stroke','rgba(255,255,255,.55)');path.setAttribute('stroke-width','2');path.setAttribute('stroke-dasharray','2 9');path.setAttribute('stroke-linecap','round');svg.appendChild(path);
 const g=document.createElementNS(ns,'g');const inner=document.createElementNS(ns,'g');inner.innerHTML='<path d="M30 0 L-16 -14 L-6 0 Z" fill="#fff"/><path d="M-6 0 L30 0 L-16 14 Z" fill="#C7D9CC"/><path d="M-6 0 L-16 14 L-10 3 Z" fill="#B7A7D9"/>';g.appendChild(inner);svg.appendChild(g);sec.appendChild(svg);
 const L=path.getTotalLength(),dur=5200,t0=performance.now();const ease=p=>p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;
 function step(n){const p=Math.min(1,(n-t0)/dur),e=ease(p);const len=L*e;const pt=path.getPointAtLength(len),pn=path.getPointAtLength(Math.min(L,len+3)),pp=path.getPointAtLength(Math.max(0,len-3));let ang=Math.atan2(pn.y-pp.y,pn.x-pp.x)*180/Math.PI;const flip=Math.abs(ang)>90?-1:1;const bob=Math.sin(p*18)*(1-p)*3;
  g.setAttribute('transform','translate('+pt.x+','+(pt.y+bob)+') rotate('+ang+')');inner.setAttribute('transform','scale(1,'+flip+') scale('+(1-.2*p)+')');
  path.style.opacity=1-p*.8;
  if(p<1)requestAnimationFrame(step);else{btn.classList.add('bump');setTimeout(()=>btn.classList.remove('bump'),700);sparkle(sec,bx,by+8);setTimeout(()=>{g.style.transition='opacity 1.2s';g.style.opacity=0;setTimeout(()=>svg.remove(),1300)},2400)}}
 requestAnimationFrame(step)};
 const io=new IntersectionObserver(es=>{if(es[0].isIntersecting){io.disconnect();setTimeout(run,300)}},{threshold:.5});io.observe(sec)}
function sparkle(sec,x,y){for(let i=0;i<14;i++){const s=document.createElement('i');s.className='spark';const a=Math.PI*2*i/14,r=40+Math.random()*50;s.style.left=x+'px';s.style.top=y+'px';s.style.setProperty('--dx',Math.cos(a)*r+'px');s.style.setProperty('--dy',Math.sin(a)*r-20+'px');s.style.background=['#D98B48','#B7A7D9','#C7D9CC','#fff'][i%4];sec.appendChild(s);setTimeout(()=>s.remove(),1100)}}
const ns1=document.getElementById('news');if(ns1)plane(ns1,ns1.querySelector('.sub-form button'));
/* hello bubble */
const hb=document.querySelector('.hello');if(hb)setTimeout(()=>hb.classList.add('on'),900);
/* 12 second eye check */
const es=document.getElementById('eyeStage');if(es){const box=es.querySelector('.eyebox'),dot=es.querySelector('.dot'),box2=es.querySelector('.stepbox'),num=es.querySelector('.ringwrap i'),ring=es.querySelector('.ring'),btn=es.querySelector('.go'),res=es.querySelector('.res');let run=false;const C=2*Math.PI*30;ring.style.strokeDasharray=C;const setR=p=>ring.style.strokeDashoffset=C*(1-p);setR(0);
const ST=[[2,'Look at the dot','Straight ahead. Keep your head still.',0],[2,'Shift your eyes slightly right','Follow the dot with your eyes only.',1],[2,'Now slightly left','Eyes only. Head still.',-1],[4,'Back to the middle. Hold.','Keep your eyes locked on the dot.',0],[2,'Notice','What stayed steady, drifted or felt tense?',0]];
const AN={s:'Smooth. Your focus locked back on easily, a sign of low inner friction and a firm grip on attention today.',d:'Your eyes drifted. Your attention slips easily at the moment. Try shorter work blocks with small breaks.',t:'Tense. Holding steady took effort, which suggests quite a bit of inner friction right now. Clear your head first (tip 3).',w:'A small wobble before settling is common. It can mean your focus is just opening up, so give it a minute.'};
async function go(){if(run)return;run=true;res.classList.remove('show');btn.style.display='none';let left=12;for(const [s,t,d,x] of ST){dot.style.left=(50+x*30)+'%';box.classList.toggle('glow',x!==0);box2.innerHTML='<b>'+t+'</b><span>'+d+'</span>';for(let i=s;i>0;i--){num.textContent=left;setR((12-left)/12);await new Promise(r=>setTimeout(r,1000));left--}}
num.textContent='0';setR(1);box.classList.remove('glow');box2.innerHTML='<b>Done. How did it feel?</b><span>Pick the closest one.</span>';res.classList.add('show');btn.textContent='Try again';btn.style.display='';run=false}
btn.onclick=go;res.querySelectorAll('.opts button').forEach(b=>b.onclick=()=>{res.querySelectorAll('.opts button').forEach(x=>x.classList.remove('on'));b.classList.add('on');const a=res.querySelector('.ans');a.textContent=AN[b.dataset.k];a.classList.add('show')})}

/* sticker */
const STICKER_MSG="Hey, it's Nikesh. If you know what to do and still can't start, you're not lazy, you're just stuck at the doorway. Everything here is to help you walk through it.";
(function(){const bg=document.createElement('div');bg.className='stk-bg';bg.innerHTML='<div class="stk" role="dialog" aria-label="A note from Nikesh"><button class="x" aria-label="Close">&times;</button><img src="'+(location.pathname.includes('/a/')?'../':'')+'img/nikesh.jpg" alt="Nikesh Lagun"><p>'+STICKER_MSG+'</p><div class="sig">Nikesh</div><a class="say" href="mailto:lagunnikesh2064@gmail.com">Say hi back</a></div>';document.body.appendChild(bg);
const open=()=>{if(matchMedia('(hover:hover) and (pointer:fine)').matches)return;bg.classList.add('on')},close=()=>bg.classList.remove('on');bg.onclick=e=>{if(e.target===bg||e.target.classList.contains('x'))close()};addEventListener('keydown',e=>{if(e.key==='Escape')close()});
document.querySelectorAll('.hello').forEach(el=>el.addEventListener('click',open));
document.querySelectorAll('.nav .brand').forEach(b=>{const av=b.querySelector('.av');if(av)av.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();open()})})})();

/* hello chip */
const hb2=document.querySelector('.hello');if(hb2)setTimeout(()=>hb2.classList.add('on'),900);
const ns2=document.getElementById('news');if(ns2&&!ns2.dataset.plane)plane(ns2,ns2.querySelector('.sub-form button'));

/* chip popovers: tap to toggle, tap outside to close */
(function(){const chips=[...document.querySelectorAll('.chipf')];chips.forEach(c=>c.addEventListener('click',e=>{if(e.target.closest('.pop a'))return;const was=c.classList.contains('open');chips.forEach(x=>x.classList.remove('open'));if(!was)c.classList.add('open');e.stopPropagation()}));document.addEventListener('click',()=>chips.forEach(x=>x.classList.remove('open')))})();
/* album CDs peek out when scrolled into view */
(function(){const al=[...document.querySelectorAll('.alb')];if(!al.length)return;const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const i=al.indexOf(e.target);setTimeout(()=>e.target.classList.add('peek'),250+i*220);io.unobserve(e.target)}}),{threshold:.5});al.forEach(a=>io.observe(a))})();

/* v6: hero watermark word, doc scrollspy, share links */
document.querySelectorAll('.hero.small').forEach(h=>{const e=h.querySelector('.eyebrow');const w=(e?e.textContent:document.title.split('|')[0]).replace(/\s*[&·].*$/,'').trim().split(' ')[0];h.setAttribute('data-word',w.slice(0,12))});
(function(){const links=[...document.querySelectorAll('.toc-v a')];if(!links.length)return;const map=new Map(links.map(a=>[a.getAttribute('href').slice(1),a]));const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(l=>l.classList.remove('on'));const a=map.get(e.target.id);if(a)a.classList.add('on')}}),{rootMargin:'-20% 0px -70% 0px'});map.forEach((a,id)=>{const el=document.getElementById(id);if(el)io.observe(el)})})();
document.querySelectorAll('[data-share]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const u=encodeURIComponent(location.href),t=encodeURIComponent(document.title);const k=a.dataset.share;if(k==='x')window.open('https://twitter.com/intent/tweet?url='+u+'&text='+t,'_blank','noopener');else if(k==='in')window.open('https://www.linkedin.com/sharing/share-offsite/?url='+u,'_blank','noopener');else{navigator.clipboard&&navigator.clipboard.writeText(location.href);a.firstChild.textContent='Copied! '}}));

/* v7: search palette + back to top */
(function(){const root=(document.querySelector('script[src$="js/main.js"]').getAttribute('src')||'js/main.js').replace('js/main.js','');
const bg=document.createElement('div');bg.className='srch-bg';bg.innerHTML='<div class="srch" role="dialog" aria-label="Search"><input type="search" placeholder="Search pages, essays, books and papers" aria-label="Search"><div class="srch-res"></div><div class="srch-foot"><span>&uarr;&darr; to move</span><span>Enter to open</span><span>Esc to close</span></div></div>';document.body.appendChild(bg);
const inp=bg.querySelector('input'),res=bg.querySelector('.srch-res');let loaded=false,sel=0,list=[];
const load=()=>new Promise(r=>{if(window.SITE_INDEX)return r();const s=document.createElement('script');s.src=root+'js/search-index.js';s.onload=r;document.head.appendChild(s)});
const url=e=>e.ext?e.u:root+e.u;
function render(q){q=q.trim().toLowerCase();const toks=q.split(/\s+/).filter(Boolean);let items=window.SITE_INDEX||[];
 if(toks.length){items=items.map(e=>{const T=e.t.toLowerCase(),D=(e.d+' '+e.b).toLowerCase();let s=0;for(const t of toks){if(T.includes(t))s+=5+(T.startsWith(t)?3:0);else if(D.includes(t))s+=1;else return null}return {e,s}}).filter(Boolean).sort((a,b)=>b.s-a.s).map(x=>x.e)}else{items=items.filter(e=>e.k==='Page'||e.k==='Book').slice(0,8)}
 list=items.slice(0,12);sel=0;res.innerHTML=list.length?list.map((e,i)=>'<a href="'+url(e)+'"'+(e.ext?' target="_blank" rel="noopener"':'')+' class="'+(i===0?'sel':'')+'"><span class="k">'+e.k+'</span><b>'+e.t.replace(/</g,'&lt;')+'</b><span class="d">'+(e.d||'').replace(/</g,'&lt;')+'</span></a>').join(''):'<div class="srch-empty">No matches. Try a shorter word.</div>'}
const open=async()=>{await load();bg.classList.add('on');inp.value='';render('');setTimeout(()=>inp.focus(),30)},close=()=>bg.classList.remove('on');
const mark=()=>[...res.children].forEach((a,i)=>a.classList.toggle('sel',i===sel));
inp.addEventListener('input',()=>render(inp.value));
inp.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();sel=Math.min(list.length-1,sel+1);mark();res.children[sel]?.scrollIntoView({block:'nearest'})}else if(e.key==='ArrowUp'){e.preventDefault();sel=Math.max(0,sel-1);mark();res.children[sel]?.scrollIntoView({block:'nearest'})}else if(e.key==='Enter'){const a=res.children[sel];if(a&&a.href){if(a.target==='_blank')window.open(a.href,'_blank','noopener');else location.href=a.href}}});
bg.addEventListener('click',e=>{if(e.target===bg)close()});
addEventListener('keydown',e=>{const tag=(e.target.tagName||'').toLowerCase();if(e.key==='Escape')close();if((e.key==='/'&&tag!=='input'&&tag!=='textarea')||((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k')){e.preventDefault();open()}});
document.querySelectorAll('.navsearch').forEach(b=>b.addEventListener('click',open));
const tt=document.createElement('button');tt.className='totop';tt.setAttribute('aria-label','Back to top');tt.innerHTML='&uarr;';tt.onclick=()=>scrollTo({top:0,behavior:'smooth'});document.body.appendChild(tt);addEventListener('scroll',()=>tt.classList.toggle('on',scrollY>900),{passive:true});
})();

/* music: play a preview when a CD slides out */
(function(){const al=[...document.querySelectorAll('.alb[data-audio]')];if(!al.length)return;
const btn=document.getElementById('soundbtn');let soundOn=false,cur=null,raf=0;const MAXV=.7;
const hov=matchMedia('(hover:hover)').matches;
const a=new Audio();a.preload='none';
function label(c,p){const s=c.querySelector('.playbtn span');if(s)s.textContent=p?'Pause':'Play preview'}
function fade(to,ms,done){cancelAnimationFrame(raf);const from=a.volume,t0=performance.now();(function s(t){const k=Math.min(1,(t-t0)/ms);a.volume=Math.max(0,Math.min(1,from+(to-from)*k));if(k<1)raf=requestAnimationFrame(s);else if(done)done()})(t0)}
function stop(c){if(!c)return;c.classList.remove('playing');label(c,false);if(c===cur){const x=c;fade(0,350,()=>{if(cur===x){a.pause();cur=null}})}}
function play(c){document.dispatchEvent(new CustomEvent('cdplay'));if(cur&&cur!==c){cur.classList.remove('playing');label(cur,false)}
 cancelAnimationFrame(raf);if(cur!==c){a.pause();a.src=c.dataset.audio;a.currentTime=0;cur=c}
 a.volume=0;const p=a.play();if(p&&p.catch)p.catch(()=>{c.classList.remove('playing');label(c,false)});
 c.classList.add('playing');label(c,true);fade(MAXV,600)}
a.addEventListener('timeupdate',()=>{if(cur&&a.duration&&a.currentTime>a.duration-1.2&&a.volume>0.01&&!a._f){a._f=1;fade(0,1100)}});
a.addEventListener('ended',()=>{a._f=0;if(cur){cur.classList.remove('playing');label(cur,false);cur=null}});
a.addEventListener('play',()=>{a._f=0});
function setSound(v){soundOn=v;if(btn){btn.classList.toggle('on',v);btn.setAttribute('aria-pressed',v);btn.querySelector('span').textContent=v?'Sound on (hover a record)':'Tap to turn sound on'}if(!v&&cur)stop(cur)}
if(btn)btn.addEventListener('click',()=>setSound(!soundOn));
al.forEach(c=>{
 if(hov){c.addEventListener('mouseenter',()=>{if(soundOn&&!window.__barPlaying)play(c)});c.addEventListener('mouseleave',()=>{if(c===cur)stop(c)})}
 const tog=()=>{if(c.classList.contains('playing')){stop(c)}else{if(!soundOn)setSound(true);play(c)}};
 c.querySelector('.playbtn').addEventListener('click',e=>{e.stopPropagation();tog()});
 c.querySelector('.disc').addEventListener('click',()=>{if(!hov)tog();else if(!c.classList.contains('playing')){if(!soundOn)setSound(true);play(c)}});
});
document.addEventListener('barplay',()=>{if(cur)stop(cur)});document.addEventListener('visibilitychange',()=>{if(document.hidden&&cur)stop(cur)});
window.__musicPrev={get paused(){return a.paused},get vol(){return a.volume},get cur(){return cur},get soundOn(){return soundOn}};
})();
