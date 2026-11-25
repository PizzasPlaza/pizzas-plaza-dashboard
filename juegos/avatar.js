// =====================================================================
//  AVATAR · Familia Pizzas Plaza
//  Dibuja el personaje de cada cliente (estilo Pizzas Plaza) en un canvas.
//  AVATAR.dibujar(ctx, cfg, tamaño, t)  ·  AVATAR.aleatorio()  ·  AVATAR.OPC
// =====================================================================
const AVATAR = (()=>{
  const TINTA='#2B1A10';
  const OPC={
    forma:   ['Pizza','Rebanada','Champiñón','Tomate','Aceituna','Queso','Caja de pizza','Pimiento'],
    color:   ['#F6C453','#E8543A','#7CC94A','#F08A2E','#9B6FD0','#5FA8D3','#F4E1C1','#E4007C','#3A3A3A','#FFFFFF'],
    ojos:    ['Grandes','Felices','Guiño','Estrellas','Dormilón','Enojado'],
    boca:    ['Sonrisota','Sonrisa','Lengua','Sorpresa','Dientes','Pícaro'],
    bigote:  ['Sin bigote','Clásico','Grueso','Delgado','Barba','Chivo'],
    sombrero:['Nada','Gorro de chef','Gorra','Sombrero charro','Gorro navideño','Corona','Moño','Audífonos','Cuernitos'],
    extra:   ['Nada','Lentes','Lentes de sol','Bufanda','Chapitas','Pecas','Curita'],
    zapatos: ['#C8102E','#2B6CD9','#1E8A3A','#FCC10C','#2B1A10','#FFFFFF'],
  };
  const aleatorio=()=>({forma:r(8),color:r(10),ojos:r(6),boca:r(6),bigote:r(6),sombrero:r(9),extra:r(7),zapatos:r(6)});
  const r=n=>Math.floor(Math.random()*n);
  const valido=c=>{ const d={forma:0,color:0,ojos:0,boca:0,bigote:0,sombrero:0,extra:0,zapatos:0}; if(!c||typeof c!=='object') return d; for(const k in d){ const n=parseInt(c[k]); d[k]=isFinite(n)&&n>=0&&n<(OPC[k]||[]).length?n:0; } return d; };
  const claro=(hex,f)=>{ const n=parseInt(hex.slice(1),16); let R=n>>16&255,G=n>>8&255,B=n&255; R=Math.round(Math.min(255,R+(255-R)*f)); G=Math.round(Math.min(255,G+(255-G)*f)); B=Math.round(Math.min(255,B+(255-B)*f)); return `rgb(${R},${G},${B})`; };
  const oscuro=(hex,f)=>{ const n=parseInt(hex.slice(1),16); return `rgb(${Math.round((n>>16&255)*(1-f))},${Math.round((n>>8&255)*(1-f))},${Math.round((n&255)*(1-f))})`; };

  // ---------- cuerpos: cada uno dice dónde va la cara, el sombrero, brazos y piernas ----------
  function cuerpo(g,c){ const col=OPC.color[c.color]; const rel=(x,y,rx,ry)=>{ const gr=g.createRadialGradient(x-rx*.35,y-ry*.4,rx*.1,x,y,Math.max(rx,ry)); gr.addColorStop(0,claro(col,.45)); gr.addColorStop(1,col); return gr; };
    g.lineWidth=11; g.strokeStyle=TINTA; g.lineJoin='round'; g.lineCap='round';
    switch(c.forma){
      case 0:{ // pizza redonda con orilla y pepperoni
        g.fillStyle='#D99A50'; g.beginPath(); g.arc(256,250,132,0,7); g.fill(); g.stroke();
        g.fillStyle=rel(256,250,112,112); g.beginPath(); g.arc(256,250,110,0,7); g.fill();
        g.fillStyle='#C0392B'; [[190,190],[322,200],[180,300],[330,300],[256,170]].forEach(([x,y])=>{ g.beginPath(); g.arc(x,y,17,0,7); g.fill(); });
        return {fx:256,fy:262,top:118,ancho:132,brazoY:262,abajo:380}; }
      case 1:{ // rebanada (punta abajo, orilla arriba)
        g.fillStyle=rel(256,240,120,140); g.beginPath(); g.moveTo(256,400); g.lineTo(118,150); g.quadraticCurveTo(256,96,394,150); g.closePath(); g.fill(); g.stroke();
        g.fillStyle='#D99A50'; g.beginPath(); g.moveTo(118,150); g.quadraticCurveTo(256,96,394,150); g.quadraticCurveTo(256,128,118,150); g.fill(); g.stroke();
        g.fillStyle='#C0392B'; [[200,190],[310,190],[256,290]].forEach(([x,y])=>{ g.beginPath(); g.arc(x,y,15,0,7); g.fill(); });
        return {fx:256,fy:225,top:112,ancho:112,brazoY:220,abajo:385,piernasJuntas:true}; }
      case 2:{ // champiñón
        g.fillStyle='#F4E8D6'; g.beginPath(); g.roundRect(186,220,140,170,40); g.fill(); g.stroke();
        g.fillStyle=rel(256,190,150,100); g.beginPath(); g.ellipse(256,215,160,105,0,Math.PI,0); g.quadraticCurveTo(256,250,96,215); g.fill(); g.stroke();
        g.fillStyle='rgba(255,255,255,.8)'; [[190,160],[300,150],[245,120],[340,195]].forEach(([x,y])=>{ g.beginPath(); g.arc(x,y,16,0,7); g.fill(); });
        return {fx:256,fy:300,top:112,ancho:70,brazoY:300,abajo:390,carasobreClaro:true}; }
      case 3:{ // tomate
        g.fillStyle=rel(256,262,128,118); g.beginPath(); g.ellipse(256,262,130,120,0,0,7); g.fill(); g.stroke();
        g.fillStyle='#3E9B3A'; g.beginPath(); for(let i=0;i<5;i++){ const a=-Math.PI/2+i*Math.PI*2/5; g.lineTo(256+Math.cos(a)*55,148+Math.sin(a)*22); g.lineTo(256+Math.cos(a+.6)*16,148+Math.sin(a+.6)*8); } g.closePath(); g.fill(); g.stroke();
        g.beginPath(); g.moveTo(256,145); g.lineTo(262,112); g.stroke();
        return {fx:256,fy:272,top:128,ancho:128,brazoY:275,abajo:378}; }
      case 4:{ // aceituna
        g.fillStyle=rel(256,255,104,138); g.beginPath(); g.ellipse(256,258,104,138,0,0,7); g.fill(); g.stroke();
        g.fillStyle='#C0392B'; g.beginPath(); g.ellipse(256,150,26,16,0,0,7); g.fill(); g.stroke();
        return {fx:256,fy:270,top:120,ancho:102,brazoY:275,abajo:392}; }
      case 5:{ // queso
        g.fillStyle=rel(256,250,140,120); g.beginPath(); g.moveTo(126,370); g.lineTo(126,200); g.lineTo(386,140); g.lineTo(386,370); g.closePath(); g.fill(); g.stroke();
        g.fillStyle=oscuro(OPC.color[c.color],.18); [[170,330,22],[350,190,16],[340,330,18],[160,230,12]].forEach(([x,y,rr])=>{ g.beginPath(); g.arc(x,y,rr,0,7); g.fill(); });
        return {fx:256,fy:268,top:150,ancho:130,brazoY:280,abajo:372}; }
      case 6:{ // caja de pizza
        g.fillStyle=rel(256,260,140,120); g.beginPath(); g.roundRect(120,150,272,226,18); g.fill(); g.stroke();
        g.strokeStyle='#C8102E'; g.lineWidth=8; g.beginPath(); g.roundRect(136,166,240,194,10); g.stroke(); g.strokeStyle=TINTA; g.lineWidth=11;
        g.beginPath(); g.moveTo(120,180); g.lineTo(392,180); g.stroke();
        return {fx:256,fy:272,top:150,ancho:136,brazoY:280,abajo:376}; }
      case 7:{ // pimiento
        g.fillStyle=rel(256,262,120,126); g.beginPath(); g.moveTo(256,150); g.bezierCurveTo(150,140,120,230,150,330); g.bezierCurveTo(170,390,230,392,256,370); g.bezierCurveTo(282,392,342,390,362,330); g.bezierCurveTo(392,230,362,140,256,150); g.fill(); g.stroke();
        g.fillStyle='#3E9B3A'; g.beginPath(); g.roundRect(240,112,32,44,10); g.fill(); g.stroke();
        return {fx:256,fy:262,top:140,ancho:118,brazoY:270,abajo:380}; }
    } }
  // ---------- brazos y piernas (como Plázido: palitos con guantes y zapatos) ----------
  function extremidades(g,c,m,t){ const ola=Math.sin(t*6)*.35; g.strokeStyle=TINTA; g.lineWidth=11; g.lineCap='round';
    const guante=(x,y)=>{ g.fillStyle='#FFFFFF'; g.beginPath(); g.arc(x,y,20,0,7); g.fill(); g.stroke(); };
    // brazo izquierdo (abajo) y derecho (saludando)
    const xi=256-m.ancho+6, xd=256+m.ancho-6, y=m.brazoY;
    g.beginPath(); g.moveTo(xi,y); g.quadraticCurveTo(xi-50,y+20,xi-58,y+70); g.stroke(); guante(xi-58,y+76);
    const ang=-1.1+ola, ex=xd+Math.cos(ang)*80, ey=y+Math.sin(ang)*80; g.beginPath(); g.moveTo(xd,y); g.quadraticCurveTo(xd+40,y-10,ex,ey); g.stroke(); guante(ex,ey);
    // piernas
    const zap=OPC.zapatos[c.zapatos]; const sep=m.piernasJuntas?26:46;
    [[-sep,-1],[sep,1]].forEach(([dx,l])=>{ const x0=256+dx, y0=m.abajo-6; g.beginPath(); g.moveTo(x0,y0); g.lineTo(x0+l*4,470); g.stroke();
      g.fillStyle=zap; g.beginPath(); g.ellipse(x0+l*18,480,36,18,0,0,7); g.fill(); g.stroke(); g.fillStyle='rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(x0+l*10,474,14,6,0,0,7); g.fill(); }); }
  // ---------- cara ----------
  function cara(g,c,m,t){ const fx=m.fx, fy=m.fy, parp=(Math.floor(t*1.3)%5===0&&(t*1.3%1)<.12); g.lineWidth=8; g.strokeStyle=TINTA;
    const ojoB=(x,y)=>{ g.fillStyle='#FFF'; g.beginPath(); g.ellipse(x,y,26,32,0,0,7); g.fill(); g.stroke(); if(parp){ g.fillStyle=OPC.color[c.color]; g.fillRect(x-28,y-34,56,34); g.beginPath(); g.moveTo(x-26,y); g.lineTo(x+26,y); g.stroke(); return; } g.fillStyle=TINTA; g.beginPath(); g.arc(x+4,y+6,13,0,7); g.fill(); g.fillStyle='#FFF'; g.beginPath(); g.arc(x+8,y+1,4.5,0,7); g.fill(); };
    const arco=(x,y,arriba=true)=>{ g.beginPath(); g.arc(x,y+(arriba?10:-10),20,arriba?Math.PI*1.1:.1*Math.PI,arriba?Math.PI*1.9:.9*Math.PI); g.stroke(); };
    const ex=40, ey=fy-26;
    switch(c.ojos){
      case 0: ojoB(fx-ex,ey); ojoB(fx+ex,ey); break;
      case 1: g.lineWidth=10; arco(fx-ex,ey); arco(fx+ex,ey); break;
      case 2: ojoB(fx-ex,ey); g.lineWidth=10; arco(fx+ex,ey); break;
      case 3: [fx-ex,fx+ex].forEach(x=>{ g.fillStyle='#FCC10C'; g.beginPath(); for(let i=0;i<10;i++){ const a=-Math.PI/2+i*Math.PI/5, rr=i%2?12:30; g.lineTo(x+Math.cos(a)*rr,ey+Math.sin(a)*rr); } g.closePath(); g.fill(); g.stroke(); }); break;
      case 4: [fx-ex,fx+ex].forEach(x=>{ g.fillStyle='#FFF'; g.beginPath(); g.ellipse(x,ey,26,22,0,0,7); g.fill(); g.stroke(); g.fillStyle=OPC.color[c.color]; g.beginPath(); g.ellipse(x,ey-8,28,16,0,Math.PI,0); g.fill(); g.beginPath(); g.moveTo(x-26,ey-4); g.lineTo(x+26,ey-4); g.stroke(); g.fillStyle=TINTA; g.beginPath(); g.arc(x,ey+6,9,0,7); g.fill(); }); break;
      case 5: ojoB(fx-ex,ey); ojoB(fx+ex,ey); g.lineWidth=10; g.beginPath(); g.moveTo(fx-ex-28,ey-44); g.lineTo(fx-ex+22,ey-30); g.moveTo(fx+ex+28,ey-44); g.lineTo(fx+ex-22,ey-30); g.stroke(); break; }
    // boca
    const by=fy+42; g.lineWidth=8;
    switch(c.boca){
      case 0: g.fillStyle='#7A1F1F'; g.beginPath(); g.moveTo(fx-48,by-8); g.quadraticCurveTo(fx,by+62,fx+48,by-8); g.closePath(); g.fill(); g.stroke(); g.fillStyle='#FFF'; g.fillRect(fx-30,by-6,60,14); g.fillStyle='#FF7A8A'; g.beginPath(); g.ellipse(fx,by+26,18,9,0,0,7); g.fill(); break;
      case 1: g.lineWidth=10; g.beginPath(); g.arc(fx,by-24,40,.2*Math.PI,.8*Math.PI); g.stroke(); break;
      case 2: g.lineWidth=10; g.beginPath(); g.arc(fx,by-24,38,.15*Math.PI,.85*Math.PI); g.stroke(); g.fillStyle='#FF6B81'; g.beginPath(); g.ellipse(fx+8,by+18,16,20,0,0,Math.PI); g.lineTo(fx-8,by+12); g.fill(); g.lineWidth=6; g.stroke(); break;
      case 3: g.fillStyle='#7A1F1F'; g.beginPath(); g.ellipse(fx,by+6,20,26,0,0,7); g.fill(); g.stroke(); break;
      case 4: g.fillStyle='#FFF'; g.beginPath(); g.roundRect(fx-46,by-12,92,34,14); g.fill(); g.stroke(); g.lineWidth=5; for(let i=1;i<4;i++){ g.beginPath(); g.moveTo(fx-46+i*23,by-12); g.lineTo(fx-46+i*23,by+22); g.stroke(); } g.beginPath(); g.moveTo(fx-46,by+5); g.lineTo(fx+46,by+5); g.stroke(); break;
      case 5: g.lineWidth=10; g.beginPath(); g.moveTo(fx-30,by+8); g.quadraticCurveTo(fx+10,by+20,fx+40,by-8); g.stroke(); break; }
    // bigote / barba
    g.fillStyle=TINTA; const my=fy+24;
    switch(c.bigote){
      case 1: [-1,1].forEach(s=>{ g.beginPath(); g.moveTo(fx,my); g.bezierCurveTo(fx+s*30,my-22,fx+s*70,my-6,fx+s*76,my-24); g.bezierCurveTo(fx+s*86,my+6,fx+s*40,my+18,fx,my+8); g.fill(); }); break;
      case 2: g.beginPath(); g.roundRect(fx-62,my-14,124,30,15); g.fill(); break;
      case 3: g.lineWidth=7; g.beginPath(); g.moveTo(fx-50,my+2); g.quadraticCurveTo(fx,my-14,fx+50,my+2); g.stroke(); break;
      case 4: g.globalAlpha=.9; g.beginPath(); g.moveTo(fx-80,fy+10); g.quadraticCurveTo(fx-70,fy+110,fx,fy+118); g.quadraticCurveTo(fx+70,fy+110,fx+80,fy+10); g.quadraticCurveTo(fx,fy+60,fx-80,fy+10); g.fill(); g.globalAlpha=1; break;
      case 5: g.beginPath(); g.moveTo(fx-16,fy+80); g.lineTo(fx+16,fy+80); g.lineTo(fx,fy+112); g.closePath(); g.fill(); break; }
    // extras de cara
    g.lineWidth=7; g.strokeStyle=TINTA;
    switch(c.extra){
      case 1: g.fillStyle='rgba(180,220,255,.25)'; [fx-ex,fx+ex].forEach(x=>{ g.beginPath(); g.arc(x,ey,34,0,7); g.fill(); g.stroke(); }); g.beginPath(); g.moveTo(fx-ex+34,ey); g.lineTo(fx+ex-34,ey); g.stroke(); break;
      case 2: g.fillStyle='#14141A'; [fx-ex,fx+ex].forEach(x=>{ g.beginPath(); g.roundRect(x-34,ey-22,68,44,14); g.fill(); g.stroke(); }); g.beginPath(); g.moveTo(fx-6,ey-8); g.lineTo(fx+6,ey-8); g.stroke(); g.fillStyle='rgba(255,255,255,.5)'; g.fillRect(fx-ex-24,ey-14,14,6); g.fillRect(fx+ex-24,ey-14,14,6); break;
      case 4: g.fillStyle='rgba(255,90,120,.45)'; [fx-ex-24,fx+ex+24].forEach(x=>{ g.beginPath(); g.ellipse(x,fy+18,20,12,0,0,7); g.fill(); }); break;
      case 5: g.fillStyle='rgba(120,60,20,.6)'; [[-70,8],[-56,20],[-80,24],[70,8],[56,20],[80,24]].forEach(([dx,dy])=>{ g.beginPath(); g.arc(fx+dx,fy+dy,4,0,7); g.fill(); }); break;
      case 6: g.save(); g.translate(fx+66,fy+4); g.rotate(-.6); g.fillStyle='#F2C9A0'; g.beginPath(); g.roundRect(-26,-10,52,20,8); g.fill(); g.stroke(); g.fillStyle='#E0B08A'; g.fillRect(-8,-8,16,16); g.restore(); break; }
  }
  // ---------- sombreros y cosas arriba ----------
  function arriba(g,c,m,t){ const x=256, y=m.top; g.lineWidth=10; g.strokeStyle=TINTA;
    switch(c.sombrero){
      case 1: g.fillStyle='#FFFFFF'; g.beginPath(); g.roundRect(x-62,y-30,124,40,8); g.fill(); g.stroke(); g.beginPath(); g.arc(x-44,y-58,34,0,7); g.arc(x,y-78,40,0,7); g.arc(x+44,y-58,34,0,7); g.fill(); g.stroke(); g.fillStyle='#FFFFFF'; g.fillRect(x-58,y-50,116,24); break;
      case 2: g.fillStyle='#C8102E'; g.beginPath(); g.arc(x,y,70,Math.PI,0); g.closePath(); g.fill(); g.stroke(); g.beginPath(); g.moveTo(x+40,y); g.quadraticCurveTo(x+120,y-6,x+130,y+14); g.lineTo(x+40,y+14); g.closePath(); g.fill(); g.stroke(); g.fillStyle='#FCC10C'; g.beginPath(); g.arc(x,y-68,10,0,7); g.fill(); break;
      case 3: g.fillStyle='#5B3A1E'; g.beginPath(); g.ellipse(x,y+4,150,30,0,0,7); g.fill(); g.stroke(); g.beginPath(); g.moveTo(x-60,y); g.quadraticCurveTo(x-50,y-100,x,y-104); g.quadraticCurveTo(x+50,y-100,x+60,y); g.fill(); g.stroke(); g.strokeStyle='#FCC10C'; g.lineWidth=8; g.beginPath(); g.ellipse(x,y+2,120,20,0,Math.PI*.1,Math.PI*.9); g.stroke(); g.beginPath(); g.moveTo(x-54,y-24); g.lineTo(x+54,y-24); g.stroke(); break;
      case 4: g.fillStyle='#C8102E'; g.beginPath(); g.moveTo(x-74,y+6); g.quadraticCurveTo(x-10,y-140,x+96,y-62); g.lineTo(x+70,y+6); g.closePath(); g.fill(); g.stroke(); g.fillStyle='#FFF'; g.beginPath(); g.roundRect(x-82,y-10,164,30,15); g.fill(); g.stroke(); g.beginPath(); g.arc(x+98,y-60,18,0,7); g.fill(); g.stroke(); break;
      case 5: g.fillStyle='#FCC10C'; g.beginPath(); g.moveTo(x-64,y+6); g.lineTo(x-64,y-50); g.lineTo(x-32,y-22); g.lineTo(x,y-64); g.lineTo(x+32,y-22); g.lineTo(x+64,y-50); g.lineTo(x+64,y+6); g.closePath(); g.fill(); g.stroke(); g.fillStyle='#C8102E'; g.beginPath(); g.arc(x,y-14,9,0,7); g.fill(); break;
      case 6: g.fillStyle='#E4007C'; g.save(); g.translate(x+56,y+10); g.rotate(.3); g.beginPath(); g.moveTo(0,0); g.lineTo(-46,-30); g.lineTo(-46,30); g.closePath(); g.moveTo(0,0); g.lineTo(46,-30); g.lineTo(46,30); g.closePath(); g.fill(); g.stroke(); g.beginPath(); g.arc(0,0,12,0,7); g.fill(); g.stroke(); g.restore(); break;
      case 7: g.lineWidth=14; g.beginPath(); g.arc(256,m.fy-10,m.ancho+6,Math.PI*1.05,Math.PI*1.95); g.stroke(); g.fillStyle='#C8102E'; g.lineWidth=9; [-1,1].forEach(s=>{ const ax=256+s*(m.ancho+4); g.beginPath(); g.roundRect(ax-20,m.fy-40,40,64,14); g.fill(); g.stroke(); }); break;
      case 8: g.fillStyle='#C8102E'; [-1,1].forEach(s=>{ g.beginPath(); g.moveTo(x+s*40,y+10); g.quadraticCurveTo(x+s*70,y-20,x+s*58,y-56); g.quadraticCurveTo(x+s*40,y-20,x+s*20,y+12); g.closePath(); g.fill(); g.stroke(); }); break; }
    if(c.extra===3){ const yb=m.brazoY+(m.forma===1?-10:0); g.fillStyle='#C8102E'; g.beginPath(); g.roundRect(256-m.ancho*.75,m.fy+70,m.ancho*1.5,32,14); g.fill(); g.stroke(); g.beginPath(); g.roundRect(256+m.ancho*.35,m.fy+90,30,70,10); g.fill(); g.stroke(); g.fillStyle='#FFF'; for(let i=0;i<4;i++) g.fillRect(256-m.ancho*.6+i*m.ancho*.4,m.fy+76,14,20); }
  }
  // ---------- dibujar todo ----------
  function dibujar(ctx,cfg,tam=512,t=0,opts={}){ const c=valido(cfg); ctx.save(); ctx.clearRect(0,0,tam,tam); const s=tam/512; ctx.scale(s,s);
    if(opts.fondo){ const gr=ctx.createRadialGradient(256,240,40,256,256,300); gr.addColorStop(0,'#FFF3C4'); gr.addColorStop(1,opts.fondo); ctx.fillStyle=gr; ctx.fillRect(0,0,512,512); }
    const rebote=opts.quieto?0:Math.abs(Math.sin(t*3))*8; ctx.translate(0,-rebote);
    ctx.fillStyle='rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(256,498+rebote,120,12,0,0,7); ctx.fill();
    const g=ctx; const m0={}; // primero brazos/piernas (detrás), luego cuerpo, cara y sombrero
    const m=cuerpo(TMP(),c); m.forma=c.forma;
    extremidades(g,c,m,t); cuerpo(g,c); cara(g,c,m,t); arriba(g,c,m,t);
    ctx.restore(); return m; }
  let _tmp=null; function TMP(){ if(!_tmp){ const c=document.createElement('canvas'); c.width=c.height=8; _tmp=c.getContext('2d'); } return _tmp; }
  function aURL(cfg,tam=256,opts={}){ const cv=document.createElement('canvas'); cv.width=cv.height=tam; dibujar(cv.getContext('2d'),cfg,tam,0,Object.assign({quieto:true},opts)); return cv.toDataURL('image/png'); }
  return {OPC,aleatorio,valido,dibujar,aURL};
})();
