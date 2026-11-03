/* motion.js: advanced animation layer (4 Nov 2026). Safe: no external data, respects reduced motion. */
(function(){
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches,HOV=matchMedia('(hover:hover) and (pointer:fine)').matches;
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const IO=(els,fn,opt)=>{if(!els.length)return;if(!('IntersectionObserver' in window)){els.forEach(fn);return}const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){io.unobserve(e.target);fn(e.target)}}),opt||{threshold:.15});els.forEach(e=>io.observe(e))};

/* fallback image removal (replaces inline onerror) */
$$('img[data-rm-err]').forEach(i=>{const f=()=>i.remove();if(i.complete&&i.naturalWidth===0)f();else i.addEventListener('error',f,{once:true})});

/* skip link for keyboard users */
const main=document.querySelector('header.nav-wrap');
if(main&&!document.querySelector('.skip')){const tgt=main.nextElementSibling;if(tgt){if(!tgt.id)tgt.id='main';const a=document.createElement('a');a.className='skip';a.href='#'+tgt.id;a.textContent='Skip to content';document.body.prepend(a)}}

/* mark current page in nav */
const here=location.pathname.split('/').pop()||'index.html';
$$('#links a[href]').forEach(a=>{if(a.getAttribute('href').split('#')[0]===here)a.setAttribute('aria-current','page')});

/* external links: never leak the opener */
$$('a[target="_blank"]').forEach(a=>{const r=(a.rel||'').split(/\s+/);if(!r.includes('noopener'))r.push('noopener');a.rel=r.join(' ').trim()});

/* safety net: anything on screen must be visible, even if an observer was missed */
let sn=0;const net=()=>{clearTimeout(sn);sn=setTimeout(()=>{const vh=innerHeight;$$('.reveal:not(.in)').forEach(e=>{const b=e.getBoundingClientRect();if(b.bottom>0&&b.top<vh&&b.height)e.classList.add('in')})},180)};
addEventListener('scroll',net,{passive:true});addEventListener('resize',net);addEventListener('load',net);addEventListener('hashchange',net);
if(RM)return;

/* 1. headline words rise in */
function split(el){let i=0;const walk=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const parts=c.textContent.split(/(\s+)/);const f=document.createDocumentFragment();parts.forEach(p=>{if(!p)return;if(/^\s+$/.test(p)){f.appendChild(document.createTextNode(p));return}const w=document.createElement('span');w.className='mw';const wi=document.createElement('span');wi.className='mwi';wi.style.setProperty('--i',i++);wi.textContent=p;w.appendChild(wi);f.appendChild(w)});c.replaceWith(f)}else if(c.nodeType===1&&!/^(BR|IMG|SVG)$/.test(c.tagName))walk(c)})};
 el.setAttribute('aria-label',el.textContent.replace(/\s+/g,' ').trim());walk(el);$$('.mw',el).forEach(w=>w.setAttribute('aria-hidden','true'));el.style.setProperty('--n',i);el.classList.add('mx-split')}
$$('.hero h1').forEach(split);

/* 2. reveal hooks for accent underlines + footer */
const foot=$$('.foot-cta');
foot.forEach(fc=>{const h=fc.querySelector('h2');if(!h)return;h.setAttribute('aria-label',h.textContent.trim());let i=0;const walk=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();[...c.textContent].forEach(ch=>{if(ch===' '){f.appendChild(document.createTextNode(' '));return}const s=document.createElement('span');s.className='mx-ch';s.setAttribute('aria-hidden','true');s.style.setProperty('--i',i++);s.textContent=ch;f.appendChild(s)});c.replaceWith(f)}else if(c.nodeType===1)walk(c)})};walk(h)});
IO([...foot,...$$('.labcard')],e=>e.classList.add('in'),{threshold:.3});

/* 3. image reveals */
const imgs=$$('.photo,.phone,.bookrow .cover,.about-photo,.portrait').filter(e=>e.querySelector('img'));
imgs.forEach(e=>e.classList.add('mx-img'));IO(imgs,e=>e.classList.add('in'),{threshold:.2});

/* 4. 3D tilt */
if(HOV){$$('.hero-art .cover,.bookrow .cover,.phone,.bk-cover,.hero .cover').forEach(el=>{if(el.classList.contains('mx-tilt'))return;el.classList.add('mx-tilt');if(getComputedStyle(el).position==='static')el.style.position='relative';const g=document.createElement('i');g.className='mx-glare';el.appendChild(g);
 const base=getComputedStyle(el).transform;const b=base&&base!=='none'?base+' ':'';
 el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;el.classList.add('live');el.style.transform=b+`perspective(900px) rotateY(${(px-.5)*16}deg) rotateX(${(.5-py)*12}deg) scale(1.03)`;el.style.setProperty('--gx',px*100+'%');el.style.setProperty('--gy',py*100+'%')},{passive:true});
 el.addEventListener('mouseleave',()=>{el.classList.remove('live');el.style.transform=''})})}

/* 5. eyebrow text scramble */
const CH='abcdefghijklmnopqrstuvwxyz';
IO($$('.sec-head .eyebrow,.labcard .eyebrow').filter(e=>e.children.length===0&&e.textContent.length<48),el=>{const fin=el.textContent;el.setAttribute('aria-label',fin);el.classList.add('mx-scr');const t0=performance.now(),D=700;
 const tick=t=>{const p=Math.min(1,(t-t0)/D),n=Math.floor(fin.length*p);let s='';for(let k=0;k<fin.length;k++)s+=k<n||fin[k]===' '||!/[a-z]/i.test(fin[k])?fin[k]:CH[(Math.random()*26)|0];el.textContent=s;if(p<1)requestAnimationFrame(tick);else el.textContent=fin};requestAnimationFrame(tick)},{threshold:.6});

/* 6. Lagun Lab network graphic */
$$('.labcard').forEach(c=>{if(c.querySelector('.mx-net'))return;const ns='http://www.w3.org/2000/svg';const s=document.createElementNS(ns,'svg');s.setAttribute('class','mx-net');s.setAttribute('viewBox','0 0 340 240');s.setAttribute('aria-hidden','true');
 const P=[[30,120,''],[100,50,'l'],[100,190,'l'],[175,120,''],[245,60,''],[245,180,'l'],[310,120,'o']],E=[[0,1],[0,2],[1,3],[2,3],[3,4],[3,5],[4,6],[5,6],[1,4]];
 E.forEach(([a,b])=>{const l=document.createElementNS(ns,'line');l.setAttribute('x1',P[a][0]);l.setAttribute('y1',P[a][1]);l.setAttribute('x2',P[b][0]);l.setAttribute('y2',P[b][1]);s.appendChild(l)});
 P.forEach(([x,y,k],i)=>{const ci=document.createElementNS(ns,'circle');ci.setAttribute('cx',x);ci.setAttribute('cy',y);ci.setAttribute('r',k==='o'?11:8);if(k)ci.setAttribute('class',k);ci.style.setProperty('--d',i*.45);s.appendChild(ci)});
 const sp=document.createElementNS(ns,'circle');sp.setAttribute('r',4);sp.setAttribute('class','spark');s.appendChild(sp);
 const route=[0,1,3,4,6,5,3,2,0];let t=0,vis=false;new IntersectionObserver(e=>{vis=e[0].isIntersecting;if(vis)requestAnimationFrame(run)}).observe(c);
 function run(){if(!vis)return;t+=.012;const seg=Math.floor(t)%(route.length-1),f=t%1,a=P[route[seg]],b=P[route[seg+1]],e=f<.5?2*f*f:1-Math.pow(-2*f+2,2)/2;sp.setAttribute('cx',a[0]+(b[0]-a[0])*e);sp.setAttribute('cy',a[1]+(b[1]-a[1])*e);requestAnimationFrame(run)}
 c.prepend(s)});

/* 7. hero scroll-out */
const hero=document.querySelector('.hero:not(.small)');
if(hero){let tk=false;const upd=()=>{const h=hero.offsetHeight||1;hero.style.setProperty('--hp',Math.max(0,Math.min(1,scrollY/h)).toFixed(3));tk=false};addEventListener('scroll',()=>{if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd()}

/* 8. ambient floating dots on coloured bands */
$$('.sec.greenbg,.sec.lavbg').forEach(sec=>{if(sec.querySelector('.mx-float'))return;const f=document.createElement('div');f.className='mx-float';f.setAttribute('aria-hidden','true');
 for(let k=0;k<14;k++){const i=document.createElement('i');i.style.cssText=`--x:${Math.random()*100}%;--s:${4+Math.random()*10}px;--t:${12+Math.random()*14}s;--d:${Math.random()}`;f.appendChild(i)}
 if(getComputedStyle(sec).position==='static')sec.style.position='relative';sec.prepend(f)});
})();
