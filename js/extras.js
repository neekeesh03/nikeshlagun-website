/* Extras: motion, music player bar, research explorer, share card */
(function(){
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches,HOV=matchMedia('(hover:hover) and (pointer:fine)').matches;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];

/* ---------- 1. motion & polish ---------- */
document.body.classList.add('fx-ready');
addEventListener('pageshow',e=>{if(e.persisted)document.body.classList.remove('pg-out')});
document.addEventListener('click',e=>{
 const a=e.target.closest('a');if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button)return;
 const h=a.getAttribute('href');if(!h||h[0]==='#'||a.target==='_blank'||a.hasAttribute('download')||/^(mailto:|tel:|javascript:)/.test(h))return;
 let u;try{u=new URL(a.href,location.href)}catch(_){return}
 if(u.origin!==location.origin||(u.pathname===location.pathname&&u.hash))return;
 if(RM)return;
 e.preventDefault();document.body.classList.add('pg-out');setTimeout(()=>location.href=a.href,130);
});
if(HOV&&!RM){
 const ring=document.createElement('div'),dot=document.createElement('div');ring.className='fx-ring';dot.className='fx-dot';document.body.append(ring,dot);
 let tx=0,ty=0,x=0,y=0;
 addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY;ring.classList.add('on');dot.classList.add('on');dot.style.transform=`translate(${tx}px,${ty}px)`;
  ring.classList.toggle('hot',!!e.target.closest('a,button,input,.disc,.sleeve,summary,[role=button]'))},{passive:true});
 addEventListener('mousedown',()=>ring.classList.add('down'));addEventListener('mouseup',()=>ring.classList.remove('down'));
 document.addEventListener('mouseleave',()=>{ring.classList.remove('on');dot.classList.remove('on')});
 (function loop(){x+=(tx-x)*.18;y+=(ty-y)*.18;ring.style.transform=`translate(${x}px,${y}px)`;requestAnimationFrame(loop)})();
 // spotlight + lift on cards
 $$('.card,.bk,.review,.acard,.store,.alb,.post,.cta-box,.mm,.specs>div').forEach(el=>{
  if(getComputedStyle(el).position==='static')el.style.position='relative';
  el.classList.add('fxc');const s=document.createElement('i');s.className='spot';el.prepend(s);
  el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();el.style.setProperty('--mx',(e.clientX-r.left)+'px');el.style.setProperty('--my',(e.clientY-r.top)+'px')},{passive:true});
 });
 // magnetic buttons
 $$('.btn,.cta-pill').forEach(b=>{b.classList.add('mag');
  b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.translate=((e.clientX-r.left-r.width/2)*.18)+'px '+((e.clientY-r.top-r.height/2)*.28)+'px'},{passive:true});
  b.addEventListener('mouseleave',()=>b.style.translate='')});
}
if(!RM){ // soft parallax on glows
 const gl=$$('.glow');if(gl.length){let tk=false;addEventListener('scroll',()=>{if(tk)return;tk=true;requestAnimationFrame(()=>{const y=scrollY;gl.forEach((g,i)=>{g.style.translate=`0 ${y*(.12+i*.05)}px`});tk=false})},{passive:true})}
}

// instant navigation: prefetch pages on hover / touch
const pf=new Set();const prefetch=a=>{try{const u=new URL(a.href,location.href);if(u.origin!==location.origin||pf.has(u.pathname)||u.pathname===location.pathname)return;pf.add(u.pathname);const l=document.createElement('link');l.rel='prefetch';l.href=u.pathname;document.head.append(l)}catch(_){}};
document.addEventListener('mouseover',e=>{const a=e.target.closest('a[href]');a&&prefetch(a)},{passive:true});document.addEventListener('touchstart',e=>{const a=e.target.closest('a[href]');a&&prefetch(a)},{passive:true});
/* ---------- 2. music player bar ---------- */
const albs=$$('.alb[data-audio]');
if(albs.length){
 // lyrics: paste real lyrics here, keyed by file name
 const LYRICS={"parkhiraxu": "Ajham bhari maya yo Timilai sadhai\nBudeskalma ma Hasideula sangai", "priya_phool": "Timi fula bhayesi maya\nMa bannai parigo kada\nNatra aru kasaile timlai\nChudi laijala\n\nMana bhari nai fuli dinu\nMa bhamara bani dulxu\nTimi sanga jivan bitauda\nSara duniyalai bhulxu", "timi_ra_ma": "Ekantama lagana malai sangai\nRamaula haii sangai sadhai\nMann ka kura pokhi\nTimi ra ma", "mayalu": "Jivan ko ranga\nBhare ma aja\nSapta indreni\nTimro nai majha\n\nTimlai nai kurera, basera, geeta gayera\nXodera jawauu, haat samai bhagauu yo sansara", "ekasi_timi": "heraile po malai aljaula ni\nbolai le po malai bagaula ni\nheraile po malai aljaula ni\nbolai le po malai bagaula ni", "bhagi_jaun": "bhagi jaun, maya hami dui, xadi yo sansar lai kainakai, kura haru ta.."};
 const songs=albs.map(c=>({el:c,src:c.dataset.audio,key:c.dataset.audio.split('/').pop().replace('.wav',''),title:$('h3',c).textContent,cover:$('.sleeve img',c)?.src||'',tag:$('.tag',c)?.textContent||''}));
 const ic={play:'<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',pause:'<svg viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>',prev:'<svg viewBox="0 0 24 24"><path d="M6 5h2v14H6zM20 5v14L9 12z"/></svg>',next:'<svg viewBox="0 0 24 24"><path d="M16 5h2v14h-2zM4 5v14l11-7z"/></svg>',list:'<svg viewBox="0 0 24 24"><path d="M4 6h12v2H4zM4 11h12v2H4zM4 16h8v2H4zM18 11v7a3 3 0 1 1-2-2.8V11z"/></svg>',shuf:'<svg viewBox="0 0 24 24"><path d="M16 4h4v4l-1.6-1.6L5.4 19.4 4 18 17 5.4 16 4zM4 6l5 5-1.4 1.4L4 8.8zM15 14l5 5v-4h-2v.2L16.4 13.6z"/></svg>'};
 const bar=document.createElement('div');bar.className='pbar';bar.setAttribute('role','region');bar.setAttribute('aria-label','Music player');
 bar.innerHTML=`<div class="pbar-row"><img class="pb-cover" alt=""><div class="pb-meta"><b>Pick a song</b><span></span><div class="pb-seek"><time>0:00</time><input type="range" min="0" max="1000" value="0" aria-label="Seek"><time class="pb-dur">0:30</time></div></div>
 <div class="pb-ctl"><button class="pb-skip pb-prev" aria-label="Previous">${ic.prev}</button><button class="pb-play" aria-label="Play">${ic.play}</button><button class="pb-skip pb-next" aria-label="Next">${ic.next}</button><button class="pb-shuf pb-skip" aria-label="Shuffle" title="Shuffle">${ic.shuf}</button><button class="pb-list" aria-label="Queue and lyrics" title="Queue and lyrics">${ic.list}</button></div></div>
 <div class="pb-panel"><div class="pb-tabs"><button class="on" data-t="q">Queue</button><button data-t="l">Lyrics</button></div><div class="pb-q"></div><div class="pb-lyr empty" hidden></div><p class="pb-hint">These are 30-second previews. Full songs are on Spotify and YouTube.</p></div>`;
 document.body.append(bar);document.body.classList.add('has-pbar');
 const au=new Audio();au.preload='none';let idx=-1,shuf=false,seeking=false;
 const q=$('.pb-q',bar),lyr=$('.pb-lyr',bar),rng=$('input',bar),times=$$('time',bar),playBtn=$('.pb-play',bar);
 const fmt=s=>isFinite(s)?Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0'):'0:00';
 songs.forEach((s,i)=>{const b=document.createElement('button');b.innerHTML=`<img src="${s.cover}" alt=""><span>${s.title}</span><small>0:30</small>`;b.onclick=()=>load(i,true);q.append(b)});
 function marks(){$$('button',q).forEach((b,i)=>b.classList.toggle('cur',i===idx));songs.forEach((s,i)=>s.el.classList.toggle('playing',i===idx&&!au.paused));
  bar.classList.toggle('playing',!au.paused);playBtn.innerHTML=au.paused?ic.play:ic.pause;playBtn.setAttribute('aria-label',au.paused?'Play':'Pause');window.__barPlaying=!au.paused}
 function load(i,go){if(i<0)i=songs.length-1;if(i>=songs.length)i=0;idx=i;const s=songs[i];au.src=s.src;$('.pb-cover',bar).src=s.cover;$('.pb-meta b',bar).textContent=s.title;$('.pb-meta span',bar).textContent=s.tag;
  const L=LYRICS[s.key];lyr.textContent=L||'Lyrics for this song are coming soon.';lyr.classList.toggle('empty',!L);
  bar.classList.add('show');document.dispatchEvent(new CustomEvent('barplay'));
  if(go)au.play().catch(()=>{});marks()}
 function next(d){if(shuf&&d>0){let n;do n=Math.floor(Math.random()*songs.length);while(n===idx&&songs.length>1);load(n,true)}else load(idx+d,true)}
 playBtn.onclick=()=>{if(idx<0)return load(0,true);au.paused?(document.dispatchEvent(new CustomEvent('barplay')),au.play()):au.pause()};
 $('.pb-prev',bar).onclick=()=>next(-1);$('.pb-next',bar).onclick=()=>next(1);
 $('.pb-shuf',bar).onclick=e=>{shuf=!shuf;e.currentTarget.classList.toggle('on',shuf)};
 $('.pb-list',bar).onclick=()=>bar.classList.toggle('open');
 $$('.pb-tabs button',bar).forEach(b=>b.onclick=()=>{$$('.pb-tabs button',bar).forEach(x=>x.classList.toggle('on',x===b));const l=b.dataset.t==='l';q.hidden=l;lyr.hidden=!l});
 au.addEventListener('play',marks);au.addEventListener('pause',marks);au.addEventListener('ended',()=>next(1));
 au.addEventListener('loadedmetadata',()=>times[1].textContent=fmt(au.duration));
 au.addEventListener('timeupdate',()=>{if(!seeking&&au.duration){rng.value=au.currentTime/au.duration*1000}times[0].textContent=fmt(au.currentTime)});
 rng.addEventListener('input',()=>{seeking=true;if(au.duration)times[0].textContent=fmt(rng.value/1000*au.duration)});
 rng.addEventListener('change',()=>{if(au.duration)au.currentTime=rng.value/1000*au.duration;seeking=false});
 document.addEventListener('cdplay',()=>{if(!au.paused)au.pause()});
 addEventListener('keydown',e=>{if(e.target.matches('input,textarea'))return;if(e.code==='Space'&&idx>=0&&!e.target.closest('button,a')){e.preventDefault();playBtn.click()}});
 if('mediaSession' in navigator){navigator.mediaSession.setActionHandler('nexttrack',()=>next(1));navigator.mediaSession.setActionHandler('previoustrack',()=>next(-1))}
 // "Lyrics" button on every card
 songs.forEach((s,i)=>{const pb=$('.playbtn',s.el);if(!pb)return;const lb=document.createElement('button');lb.type='button';lb.className='lyrbtn';lb.textContent='Lyrics';lb.onclick=ev=>{ev.stopPropagation();load(i,false);bar.classList.add('open');const tb=$$('.pb-tabs button',bar).find(b=>b.dataset.t==='l');tb&&tb.click()};pb.after(lb)});
 // "Play all" button under the sound button
 const sb=document.getElementById('soundbtn');if(sb){const pa=document.createElement('button');pa.type='button';pa.className='soundbtn';pa.style.marginLeft='10px';pa.innerHTML='<span>Play all songs</span>';pa.onclick=()=>load(0,true);sb.after(pa)}
 // cards: double-click the CD to send it to the player bar
 songs.forEach((s,i)=>{const d=$('.disc',s.el);d&&d.addEventListener('dblclick',()=>load(i,true))});
}

/* ---------- 3. research explorer (click a box to trace its path) ---------- */
const mms=$$('.mm');
if(mms.length){
 const tryEnh=()=>{mms.forEach(mm=>{const svg=$('svg',mm);if(!svg||mm.dataset.pz||mm.querySelector('.pie,.rtl'))return;mm.dataset.pz=1;setTimeout(()=>enh(mm,$('svg',mm)||svg),700)})};
 const mo=new MutationObserver(tryEnh);mms.forEach(m=>mo.observe(m,{childList:true,subtree:true}));tryEnh();setTimeout(tryEnh,2500);setTimeout(tryEnh,6000);
 function enh(mm,svg){
  const nodes=$$('g.node',svg),edges=$$('path.flowchart-link',svg);
  const nid=n=>{const m=(n.id||'').match(/flowchart-(.+)-\d+$/);return m?m[1]:null};
  const idset=new Set(nodes.map(nid).filter(Boolean));
  const ed=edges.map(p=>{let s=null,e=null;const m=(p.id||'').match(/(?:^|-)L[_-](.+)_\d+$/);if(m){const parts=m[1].split('_');for(let i=1;i<parts.length;i++){const a=parts.slice(0,i).join('_'),b=parts.slice(i).join('_');if(idset.has(a)&&idset.has(b)){s=a;e=b;break}}}return{p,s,e}}).filter(x=>x.s&&x.e);
  if(!nodes.length||!ed.length)return;
  const clear=()=>{mm.classList.remove('trace');$$('.hl,.sel',svg).forEach(x=>x.classList.remove('hl','sel'))};
  const hint=document.createElement('p');hint.className='pz-hint';hint.textContent='Tip: click any box to light up everything that leads to it and comes from it. Click again to reset.';(svg.closest('pre')||svg).after(hint);
  nodes.forEach(n=>n.addEventListener('click',ev=>{ev.stopPropagation();const id=nid(n);if(!id)return;if(n.classList.contains('sel')){clear();return}
   clear();const up=new Set([id]),dn=new Set([id]);let ch=true;
   while(ch){ch=false;ed.forEach(x=>{if(dn.has(x.s)&&!dn.has(x.e)){dn.add(x.e);ch=true}if(up.has(x.e)&&!up.has(x.s)){up.add(x.s);ch=true}})}
   const all=new Set([...up,...dn]);mm.classList.add('trace');nodes.forEach(m=>{const i=nid(m);if(i&&all.has(i))m.classList.add('hl')});n.classList.add('sel');
   ed.forEach(x=>{if((up.has(x.s)&&up.has(x.e))||(dn.has(x.s)&&dn.has(x.e)))x.p.classList.add('hl')})}));
  mm.addEventListener('click',ev=>{if(!ev.target.closest('.node'))clear()});
 }
}

/* ---------- 4. share card ---------- */
['handStage','eyeStage'].forEach(id=>{
 const stg=document.getElementById(id);if(!stg)return;const ans=$('.ans',stg),res=$('.res',stg);if(!ans||!res)return;
 const kind=id==='handStage'?'15-second hand check':'12-second eye check';let picked='';
 $$('.opts button',stg).forEach(b=>b.addEventListener('click',()=>picked=b.textContent));
 const box=document.createElement('div');box.className='sharebox';box.hidden=true;
 box.innerHTML='<button class="mk">Make my result card</button>';
 const prev=document.createElement('img');prev.className='cardprev';prev.alt='My result card';
 ans.after(box);box.after(prev);
 new MutationObserver(()=>{box.hidden=!ans.textContent.trim();prev.classList.remove('show');$$('.dl,.sh,.cp',box).forEach(x=>x.remove())}).observe(ans,{childList:true,characterData:true,subtree:true});
 function wrap(c,t,x,y,w,lh){const ws=t.split(' ');let l='';for(const w1 of ws){const tt=l?l+' '+w1:w1;if(c.measureText(tt).width>w&&l){c.fillText(l,x,y);y+=lh;l=w1}else l=tt}c.fillText(l,x,y);return y+lh}
 function draw(){const W=1080,H=1350,cv=document.createElement('canvas');cv.width=W;cv.height=H;const c=cv.getContext('2d');
  const g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,'#F2F2F2');g.addColorStop(1,'#C7D9CC');c.fillStyle=g;c.fillRect(0,0,W,H);
  c.fillStyle='rgba(183,167,217,.35)';c.beginPath();c.arc(W-120,160,260,0,7);c.fill();c.fillStyle='rgba(217,139,72,.25)';c.beginPath();c.arc(120,H-160,220,0,7);c.fill();
  c.fillStyle='#40734D';c.fillRect(0,0,W,16);
  c.fillStyle='#40734D';c.font='600 34px Inter,system-ui,sans-serif';c.fillText('MY '+kind.toUpperCase(),80,130);
  const txt=ans.textContent.trim();const first=txt.split(/(?<=\.)\s/)[0];const rest=txt.slice(first.length).trim();
  c.fillStyle='#1d2a21';c.font='italic 400 92px "Instrument Serif",Georgia,serif';let y=wrap(c,first.replace(/\.$/,''),80,300,W-160,104);
  c.fillStyle='#696866';c.font='400 40px Inter,system-ui,sans-serif';y=wrap(c,rest,80,y+40,W-160,58);
  if(picked){c.fillStyle='#fff';const pw=Math.min(W-160,c.measureText('I felt: '+picked).width+60);c.beginPath();c.roundRect(80,H-330,pw,76,38);c.fill();c.fillStyle='#40734D';c.font='600 32px Inter,system-ui,sans-serif';c.fillText('I felt: '+picked,110,H-281)}
  c.fillStyle='#D98B48';c.beginPath();c.roundRect(80,H-210,W-160,110,55);c.fill();c.fillStyle='#fff';c.font='700 38px Inter,system-ui,sans-serif';c.textAlign='center';c.fillText('Try yours: nikeshlagun.com.np/tips',W/2,H-143);c.textAlign='left';
  c.fillStyle='#696866';c.font='400 26px Inter,system-ui,sans-serif';c.fillText('A fun self-check from Nikesh Lagun\u2019s research. Not a medical test.',80,H-52);
  return cv}
 $('.mk',box).onclick=()=>{const cv=draw();prev.src=cv.toDataURL('image/png');prev.classList.add('show');
  $$('.dl,.sh,.cp',box).forEach(x=>x.remove());
  const mkb=(cls,t,alt,fn)=>{const b=document.createElement('button');b.className=cls+(alt?' alt':'');b.textContent=t;b.onclick=fn;box.append(b)};
  const text='My '+kind+': '+ans.textContent.trim().split(/(?<=\.)\s/)[0]+' Try yours: https://nikeshlagun.com.np/tips.html';
  mkb('dl','Download image',false,()=>{const a=document.createElement('a');a.href=prev.src;a.download='my-focus-check.png';a.click()});
  mkb('sh','Share',true,async()=>{try{const blob=await new Promise(r=>cv.toBlob(r,'image/png'));const f=new File([blob],'my-focus-check.png',{type:'image/png'});
    if(navigator.canShare&&navigator.canShare({files:[f]}))await navigator.share({files:[f],text});else if(navigator.share)await navigator.share({text,url:'https://nikeshlagun.com.np/tips.html'});else{await navigator.clipboard.writeText(text);alert('Copied. Paste it anywhere.')}}catch(_){}});
  mkb('cp','Copy text',true,async()=>{try{await navigator.clipboard.writeText(text);alert('Copied.')}catch(_){}});
 };
});
})();

/* ---------- 5. animated pie ---------- */
(function(){
 const pies=[...document.querySelectorAll('.pie')];
 pies.forEach(p=>{
  const total=+p.dataset.total||1,ring=p.querySelector('.pie-ring'),lis=[...p.querySelectorAll('.pie-leg li')],mid=p.querySelector('.pie-mid'),mb=mid.querySelector('b'),ms=mid.querySelector('span');
  const R=78,C=2*Math.PI*R,GAP=2.5;let acc=0;const NS='http://www.w3.org/2000/svg';const cs=[];
  lis.forEach((li,i)=>{const v=+li.dataset.v,len=v/total*C;const c=document.createElementNS(NS,'circle');c.setAttribute('cx',120);c.setAttribute('cy',120);c.setAttribute('r',R);c.setAttribute('stroke',li.dataset.c);c.setAttribute('stroke-width',40);
   c.style.strokeDasharray='0 '+C;c.style.strokeDashoffset=-acc;c.dataset.len=Math.max(len-GAP,0.5);c.dataset.i=i;ring.append(c);cs.push(c);acc+=len;
   li.querySelector('em').textContent=Math.round(v/total*100)+'%';
   const on=()=>hl(i),off=()=>hl(-1);li.addEventListener('mouseenter',on);li.addEventListener('focus',on);li.addEventListener('mouseleave',off);li.addEventListener('blur',off);
   c.addEventListener('mouseenter',on);c.addEventListener('mouseleave',off);c.addEventListener('click',()=>hl(p.classList.contains('has-hl')&&c.classList.contains('hl')?-1:i))});
  const base=[mb.textContent,ms.textContent];
  function hl(i){p.classList.toggle('has-hl',i>=0);cs.forEach((c,k)=>c.classList.toggle('hl',k===i));lis.forEach((l,k)=>l.classList.toggle('hl',k===i));
   if(i>=0){const l=lis[i];mb.textContent=l.dataset.v;ms.textContent=(l.dataset.v==='1'?'paper':'papers')+', '+l.querySelector('em').textContent}else{mb.textContent=base[0];ms.textContent=base[1]}}
  let played=false;function play(){if(played)return;played=true;p.classList.add('go');
   cs.forEach((c,i)=>setTimeout(()=>{c.style.strokeDasharray=c.dataset.len+' '+C},i*170));
   lis.forEach((l,i)=>l.style.transitionDelay=(i*90+150)+'ms');
   const t0=performance.now(),dur=1400;(function tick(t){const k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,3);if(!p.classList.contains('has-hl'))mb.textContent=Math.round(e*total);if(k<1)requestAnimationFrame(tick)})(t0)}
  if(matchMedia('(prefers-reduced-motion:reduce)').matches||!('IntersectionObserver' in window)){played=true;p.classList.add('go');cs.forEach(c=>c.style.strokeDasharray=c.dataset.len+' '+C);return}
  mb.textContent='0';new IntersectionObserver((es,io)=>{if(es[0].isIntersecting){io.disconnect();play()}},{threshold:.3}).observe(p);
 });
})();

/* ---------- 6. free-book lead magnet ---------- */
(function(){
 const form=document.querySelector('.lead-form');if(!form)return;
 const KEY='lagun_lead_v1',box=form.closest('.leadbox'),done=box.querySelector('.lead-done'),err=form.querySelector('.lead-err'),inp=form.querySelector('input'),btn=form.querySelector('button');
 const show=(again)=>{form.hidden=true;done.hidden=false;const nx=box.querySelector('.lead-next');if(nx)nx.hidden=false;if(again)done.querySelector('.lead-msg').textContent='Welcome back.'};
 try{if(localStorage.getItem(KEY)==='1')show(true)}catch(_){}
 form.addEventListener('submit',async e=>{e.preventDefault();err.hidden=true;const email=inp.value.trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){err.textContent='That email does not look right. Mind checking it?';err.hidden=false;inp.focus();return}
  btn.disabled=true;btn.firstChild.textContent='Unlocking your copy... ';
  try{await fetch('https://nikeshlagun.substack.com/api/v1/free?nojs=true',{method:'POST',mode:'no-cors',body:new URLSearchParams({email,first_url:location.href,first_referrer:document.referrer||'',current_url:location.href,current_referrer:document.referrer||'',referral_code:'',source:'switch-on-free-book'})})}catch(_){}
  try{localStorage.setItem(KEY,'1')}catch(_){}
  show(false);done.scrollIntoView({block:'nearest',behavior:'smooth'})});
})();

(function(){const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
/* ---------- 7. timeline reveal ---------- */
$$('.rtl').forEach(t=>{if(!('IntersectionObserver' in window)){t.classList.add('go');return}new IntersectionObserver((es,io)=>{if(es[0].isIntersecting){io.disconnect();t.classList.add('go')}},{threshold:.25}).observe(t)});

/* ---------- 8. page-flip book (glide the cursor to turn pages) ---------- */
$$('.flip').forEach(fl=>{
 const leaves=$$('.leaf',fl),n=leaves.length,wrap=fl.closest('.flipwrap');let p=0,target=0,raf=0,drag=null;
 const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
 function paint(){leaves.forEach((l,i)=>{const t=Math.max(0,Math.min(1,p-i));const ang=-180*t;l.style.transform='rotateY('+ang+'deg)';l.style.zIndex=t>.5?i+1:n-i;l.style.setProperty('--s',Math.sin(t*Math.PI).toFixed(3))});
  const sh=p<1?-.5*(1-p):(p>n-1?.5*(p-(n-1)):0);fl.style.transform='translateX(calc(var(--w)*'+sh+'))'}
 function loop(){p+=(target-p)*(RM?1:.11);if(Math.abs(target-p)<.002)p=target;paint();raf=Math.abs(target-p)>=.002?requestAnimationFrame(loop):0}
 const go=t=>{target=Math.max(0,Math.min(n,t));if(!raf)raf=requestAnimationFrame(loop)};
 const area=wrap.querySelector('.flipstage')||wrap;
 area.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=area.getBoundingClientRect();const x=(e.clientX-r.left)/r.width;go((x-.12)/.76*n)});
 area.addEventListener('pointerleave',e=>{if(e.pointerType==='touch')return;go(Math.round(target))});
 area.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch')return;drag={x:e.clientX,p:target}});
 area.addEventListener('pointermove',e=>{if(!drag||e.pointerType!=='touch')return;const w=fl.getBoundingClientRect().width/2;go(drag.p+(e.clientX-drag.x)/w*1.4)});
 const end=()=>{if(drag){drag=null;go(Math.round(target))}};area.addEventListener('pointerup',end);area.addEventListener('pointercancel',end);
 area.style.touchAction='pan-y';
 wrap.setAttribute('tabindex','0');wrap.addEventListener('keydown',e=>{if(e.key==='ArrowRight')go(Math.round(target)+1);if(e.key==='ArrowLeft')go(Math.round(target)-1)});
 paint();
 // intro: page 1 lifts to show it is alive
 if('IntersectionObserver' in window&&!RM)new IntersectionObserver((es,io)=>{if(es[0].isIntersecting){io.disconnect();setTimeout(()=>{if(target===0){go(1);setTimeout(()=>{if(target===1)go(0)},1400)}},700)}},{threshold:.6}).observe(fl);
});

/* ---------- 9. sticker note on hover ---------- */
(function(){
 if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
 const src=document.querySelector('.stk');if(!src)return;
 const pop=document.createElement('div');pop.className='stk-pop';pop.innerHTML=src.innerHTML.replace(/<button class="x"[^>]*>.*?<\/button>/,'');
 document.body.append(pop);let hideT,cur=null;
 const place=el=>{const r=el.getBoundingClientRect(),w=pop.offsetWidth||340,h=pop.offsetHeight||460;let x=r.left+r.width/2-w/2;x=Math.max(12,Math.min(innerWidth-w-12,x));let y=r.top-h-14;if(y<12)y=Math.min(innerHeight-h-12,r.bottom+14);pop.style.left=x+'px';pop.style.top=Math.max(12,y)+'px'};
 const show=el=>{clearTimeout(hideT);cur=el;place(el);pop.classList.add('on')};
 const hide=()=>{hideT=setTimeout(()=>pop.classList.remove('on'),220)};
 [...document.querySelectorAll('.hello,.nav .brand .av')].forEach(el=>{el.addEventListener('mouseenter',()=>show(el));el.addEventListener('mouseleave',hide)});
 pop.addEventListener('mouseenter',()=>clearTimeout(hideT));pop.addEventListener('mouseleave',hide);
 addEventListener('scroll',()=>{if(pop.classList.contains('on')&&cur)place(cur)},{passive:true});
})();

})();

/* ---------- 10. conversion helpers ---------- */
(function(){
 const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
 const KEY='lagun_lead_v1';let unlocked=false;try{unlocked=localStorage.getItem(KEY)==='1'}catch(_){}
 const pre=location.pathname.includes('/a/')?'../':'';
 // proof line beside every email box
 $$('.cta-box').forEach(b=>{if(!$('.proof',b)){const f=$('form',b);if(f){const p=document.createElement('p');p.className='proof';p.textContent='Join 2,417 readers. Count from Substack, 3 November 2026.';f.after(p)}}});
 // welcome back: swap the free-book buttons once unlocked
 if(unlocked){$$('a[href$="switch-on.html#free"]').forEach(a=>{const arrow=a.querySelector('i');const t=document.createElement('span');t.textContent='Open your free book ';a.textContent='';a.append(t);if(arrow)a.append(arrow)})}
 // after the hand or eye check: next rung of the ladder
 ['handStage','eyeStage'].forEach(id=>{const st=document.getElementById(id);if(!st)return;const ans=$('.ans',st);if(!ans)return;
  new MutationObserver(()=>{if(!ans.textContent.trim()||$('.ladder',st))return;const l=document.createElement('div');l.className='ladder';
   l.innerHTML=unlocked?'<b>Keep going</b><p>Your result is the first step. Your free book explains what to do with it.</p><a href="'+pre+'switch-on.html#free">Open your free book</a>':'<b>Your result is step one</b><p>Switch On explains why your mind did this and what to try next. Unlock it free in 10 seconds.</p><a href="'+pre+'switch-on.html#free">Unlock my free copy</a>';
   st.querySelector('.res').append(l)}).observe(ans,{childList:true,characterData:true,subtree:true})});
 // slim mobile bar
 if(!unlocked&&!/switch-on\.html|privacy\.html|music\.html/.test(location.pathname)){
  const b=document.createElement('div');b.className='stickycta';b.innerHTML='<span>Switch On, free</span><a href="'+pre+'switch-on.html#free">Unlock my copy</a>';document.body.append(b);
  let shown=false;addEventListener('scroll',()=>{const s=scrollY>620&&scrollY<document.documentElement.scrollHeight-innerHeight-500;if(s!==shown){shown=s;b.classList.toggle('show',s)}},{passive:true})}
})();
