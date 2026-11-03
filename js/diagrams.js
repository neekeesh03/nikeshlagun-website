/* Diagrams: loads the self-hosted Mermaid library only when a diagram is near the screen */
(function(){
const nodes=[...document.querySelectorAll('pre.mermaid')];if(!nodes.length)return;
const base=(document.currentScript&&document.currentScript.src||'').replace(/js\/diagrams\.js.*$/,'');
let started=false;
function go(){if(started)return;started=true;
 const s=document.createElement('script');s.src=base+'js/vendor/mermaid.min.js?v=11.17.2';
 s.onload=async()=>{const m=window.mermaid;if(!m)return;
  m.initialize({startOnLoad:false,theme:'base',securityLevel:'strict',fontFamily:'Inter, sans-serif',themeVariables:{primaryColor:'#C7D9CC',primaryTextColor:'#1d2a21',primaryBorderColor:'#40734D',lineColor:'#696866',secondaryColor:'#e9e4f4',tertiaryColor:'#f8e9db',noteBkgColor:'#f8e9db',pie1:'#40734D',pie2:'#D98B48',pie3:'#B7A7D9',pie4:'#C7D9CC',pie5:'#696866',pie6:'#8fb49a',pieTitleTextSize:'18px',pieSectionTextColor:'#fff',cScale0:'#C7D9CC',cScale1:'#e9e4f4',cScale2:'#f8e9db',cScale3:'#C7D9CC',cScaleLabel0:'#1d2a21',cScaleLabel1:'#1d2a21',cScaleLabel2:'#1d2a21',cScaleLabel3:'#1d2a21'}});
  try{await m.run({nodes})}catch(e){console.warn('diagram',e)}
  document.dispatchEvent(new CustomEvent('diagrams:ready'))};
 s.onerror=()=>nodes.forEach(n=>n.classList.add('mm-fail'));
 document.head.appendChild(s)}
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){io.disconnect();go()}},{rootMargin:'900px 0px'});nodes.forEach(n=>io.observe(n))}else go();
setTimeout(go,9000);
})();
