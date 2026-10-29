// ===== Pasaporte Plázido: el logo de Pizzas Plaza se colorea rebanada por rebanada =====
// pintarPasaporte(canvas, rebanadas(0-8), base('../' o './'), animarUltima)
const PASAPORTE=(()=>{
  const cache={};
  const cargar=(src)=>cache[src]||(cache[src]=new Promise(r=>{ const i=new Image(); i.onload=()=>r(i); i.onerror=()=>r(null); i.src=src; }));
  const CX=.4781, CY=.5430; // centro de la pizza dentro del logo
  async function pintar(cv,n,base='./',animar=false){
    cancelAnimationFrame(cv._anim);
    const [gris,color]=await Promise.all([cargar(base+'img/logo_pizza_gris.png'),cargar(base+'img/logo_pizza.png')]); if(!gris||!color) return;
    const dpr=Math.min(2,devicePixelRatio||1), w=cv.clientWidth||cv.width, h=w*color.height/color.width;
    cv.width=w*dpr; cv.height=h*dpr; cv.style.height=h+'px'; const g=cv.getContext('2d'); g.setTransform(dpr,0,0,dpr,0,0);
    const cx=w*CX, cy=h*CY, R=w*.62;
    const cuna=(i,esc=1)=>{ const a0=-Math.PI/2+i*Math.PI/4, a1=a0+Math.PI/4; g.beginPath(); g.moveTo(cx,cy); g.arc(cx,cy,R*esc,a0,a1); g.closePath(); };
    const dibujar=(t)=>{ g.clearRect(0,0,w,h); g.drawImage(gris,0,0,w,h);
      for(let i=0;i<Math.min(8,n);i++){ const ult=animar&&i===n-1;
        g.save(); if(ult){ const a=-Math.PI/2+(i+.5)*Math.PI/4, k=1-Math.min(1,t); g.translate(Math.cos(a)*k*w*.12,Math.sin(a)*k*w*.12); g.globalAlpha=Math.min(1,t*1.5); }
        cuna(i); g.clip(); g.drawImage(color,0,0,w,h);
        if(ult&&t<1.6){ g.fillStyle=`rgba(255,255,255,${.6*Math.max(0,1-t)})`; g.fillRect(0,0,w,h); }
        g.restore(); }
      if(n>=8){ g.save(); g.shadowColor='#FCC10C'; g.shadowBlur=20+10*Math.sin(t*6); g.strokeStyle='rgba(252,193,12,.9)'; g.lineWidth=4; g.beginPath(); g.arc(cx,cy,w*.4,0,7); g.stroke(); g.restore(); } };
    if(!animar && n<8){ dibujar(1); return; }
    const t0=performance.now(); const loop=(ts)=>{ const t=(ts-t0)/600; dibujar(t); if(t<1.6||n>=8) cv._anim=requestAnimationFrame(loop); };
    cancelAnimationFrame(cv._anim); cv._anim=requestAnimationFrame(loop);
  }
  return {pintar};
})();
