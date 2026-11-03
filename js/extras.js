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
 e.preventDefault();document.body.classList.add('pg-out');setTimeout(()=>location.href=a.href,210);
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

/* ---------- 2. music player bar ---------- */
const albs=$$('.alb[data-audio]');
if(albs.length){
 // lyrics: paste real lyrics here, keyed by file name
 const LYRICS={parkhiraxu:'',priya_phool:'',timi_ra_ma:'',mayalu:'',ekasi_timi:'',bhagi_jaun:''};
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
 // "Play all" button under the sound button
 const sb=document.getElementById('soundbtn');if(sb){const pa=document.createElement('button');pa.type='button';pa.className='soundbtn';pa.style.marginLeft='10px';pa.innerHTML='<span>Play all songs</span>';pa.onclick=()=>load(0,true);sb.after(pa)}
 // cards: double-click the CD to send it to the player bar
 songs.forEach((s,i)=>{const d=$('.disc',s.el);d&&d.addEventListener('dblclick',()=>load(i,true))});
}

/* ---------- 3. research explorer ---------- */
const mms=$$('.mm');
if(mms.length){
 const tryEnh=()=>{mms.forEach(mm=>{const svg=$('svg',mm);if(!svg||mm.dataset.pz)return;mm.dataset.pz=1;setTimeout(()=>{const s2=$('svg',mm);if(s2)enh(mm,s2)},700)})};
 const mo=new MutationObserver(tryEnh);mms.forEach(m=>mo.observe(m,{childList:true,subtree:true}));tryEnh();setTimeout(tryEnh,2500);setTimeout(tryEnh,6000);
 function enh(mm,svg){
  const box=document.createElement('div');box.className='pz';svg.parentNode.insertBefore(box,svg);box.append(svg);
  const st={k:1,x:0,y:0};const ap=()=>{svg.style.transform=`translate(${st.x}px,${st.y}px) scale(${st.k})`;box.classList.toggle('can',st.k>1)};
  const zoom=(f,cx,cy)=>{const r=box.getBoundingClientRect();cx=cx??r.width/2;cy=cy??r.height/2;const k=Math.max(1,Math.min(4,st.k*f));const s=k/st.k;st.x=cx-(cx-st.x)*s;st.y=cy-(cy-st.y)*s;st.k=k;if(k===1){st.x=0;st.y=0}ap()};
  const tools=document.createElement('div');tools.className='pz-tools';tools.innerHTML='<button aria-label="Zoom in">+</button><button aria-label="Zoom out">&minus;</button><button aria-label="Reset">&#8634;</button><button aria-label="Full screen">&#9974;</button>';box.append(tools);
  const [zi,zo,zr,zf]=$$('button',tools);zi.onclick=()=>zoom(1.4);zo.onclick=()=>zoom(1/1.4);zr.onclick=()=>{st.k=1;st.x=st.y=0;ap();clear()};zf.onclick=()=>{box.classList.toggle('pz-full')};
  addEventListener('keydown',e=>{if(e.key==='Escape')box.classList.remove('pz-full')});
  box.addEventListener('wheel',e=>{if(!(e.ctrlKey||e.metaKey))return;e.preventDefault();const r=box.getBoundingClientRect();zoom(e.deltaY<0?1.15:1/1.15,e.clientX-r.left,e.clientY-r.top)},{passive:false});
  let drag=null;box.addEventListener('pointerdown',e=>{if(st.k<=1||e.target.closest('.pz-tools'))return;drag={x:e.clientX-st.x,y:e.clientY-st.y,moved:false};box.classList.add('drag');box.setPointerCapture(e.pointerId)});
  box.addEventListener('pointermove',e=>{if(!drag)return;st.x=e.clientX-drag.x;st.y=e.clientY-drag.y;drag.moved=true;ap()});
  const end=()=>{drag=null;box.classList.remove('drag')};box.addEventListener('pointerup',end);box.addEventListener('pointercancel',end);
  // trace path on click (flowcharts)
  const nodes=$$('g.node',svg),edges=$$('.edgePaths path,path.flowchart-link',svg);
  const nid=n=>{const m=(n.id||'').match(/flowchart-(.+)-\d+$/);return m?m[1]:null};
  const idset=new Set(nodes.map(nid).filter(Boolean));
  const ed=edges.map(p=>{let s=null,e=null;const m=(p.id||'').match(/(?:^|-)L[_-](.+)_\d+$/);if(m){const parts=m[1].split('_');for(let i=1;i<parts.length;i++){const a=parts.slice(0,i).join('_'),b=parts.slice(i).join('_');if(idset.has(a)&&idset.has(b)){s=a;e=b;break}}}
   if(!s){const c=[...p.classList];const a=c.find(x=>x.startsWith('LS-')),b=c.find(x=>x.startsWith('LE-'));if(a&&b){s=a.slice(3);e=b.slice(3)}}return{p,s,e}}).filter(x=>x.s&&x.e);
  function clear(){box.classList.remove('trace');$$('.hl,.sel',svg).forEach(x=>x.classList.remove('hl','sel'))}
  if(nodes.length&&ed.length){
   const hint=document.createElement('p');hint.className='pz-hint';hint.textContent='Click a box to trace what leads to it and what comes from it. Use + / - to zoom, drag to move, or the corner button for full screen.';(mm.querySelector('pre')||box).after(hint);
   nodes.forEach(n=>n.addEventListener('click',e=>{if(drag&&drag.moved)return;e.stopPropagation();const id=nid(n);if(!id)return;
    if(n.classList.contains('sel')){clear();return}
    clear();const up=new Set([id]),dn=new Set([id]);let ch=true;
    while(ch){ch=false;ed.forEach(x=>{if(dn.has(x.s)&&!dn.has(x.e)){dn.add(x.e);ch=true}if(up.has(x.e)&&!up.has(x.s)){up.add(x.s);ch=true}})}
    const all=new Set([...up,...dn]);box.classList.add('trace');
    nodes.forEach(m=>{const i=nid(m);if(i&&all.has(i))m.classList.add('hl')});n.classList.add('sel');
    ed.forEach(x=>{if((up.has(x.s)&&up.has(x.e))||(dn.has(x.s)&&dn.has(x.e)))x.p.classList.add('hl')})}));
   box.addEventListener('click',e=>{if(!e.target.closest('.node,.pz-tools'))clear()});
  }else{const hint=document.createElement('p');hint.className='pz-hint';hint.textContent='Use + / - to zoom, drag to move, or the corner button for full screen.';(mm.querySelector('pre')||box).after(hint)}
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
