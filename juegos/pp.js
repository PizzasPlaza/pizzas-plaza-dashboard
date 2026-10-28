// ===== Pizzas Plaza · módulo común de los juegos (versión con registro y Google Sheet) =====
// Requiere config.js antes: const PP_API = 'https://script.google.com/macros/s/.../exec';
const PP = (()=>{
  const DESCUENTO = 15;
  const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
  const $=id=>document.getElementById(id);
  const fmt=d=>new Date(d).toLocaleDateString('es-MX',{day:'numeric',month:'long',year:'numeric'});
  let cfg={}, base='';
  function sucursal(){ const h=decodeURIComponent(location.hash.slice(1)); if(h && h!=='validar') { store.set('pp_suc',h.replace(/-/g,' ')); } return store.get('pp_suc')||''; }
  const capital=s=>s.replace(/\b\w/g,c=>c.toUpperCase());

  async function api(params){
    if(typeof PP_API==='undefined'||!PP_API) throw new Error('sin-api');
    const q=new URLSearchParams(params).toString();
    const r=await fetch(PP_API+'?'+q,{method:'GET',redirect:'follow'});
    const j=await r.json(); return j;
  }

  // ---------- registro ----------
  const registrado=()=>!!store.get('pp_tel');
  function htmlRegistro(){ return `
<div id="ppReg" class="ppCapa">
  <img class="ppImg" src="${cfg.img||''}" alt="" style="height:96px">
  <h1 class="ppTit">¡Regístrate y juega!</h1>
  <p class="ppMsg">Solo una vez. Si ganas, tu cupón queda ligado a tu celular.</p>
  <form id="ppRegForm" class="ppForm" autocomplete="on">
    <label>Tu nombre<input id="ppNom" name="name" autocomplete="given-name" maxlength="40" required placeholder="Ej. Ana"></label>
    <label>Tu celular (10 dígitos)<input id="ppTel" name="tel" type="tel" inputmode="numeric" autocomplete="tel-national" maxlength="14" required placeholder="55 1234 5678"></label>
    <label class="ppCheck"><input type="checkbox" id="ppAviso" required> <span>Leí y acepto el <a href="${base}aviso.html" target="_blank" rel="noopener">aviso de privacidad</a>.</span></label>
    <label class="ppCheck"><input type="checkbox" id="ppPromos" checked> <span>Quiero recibir promociones de Pizzas Plaza por WhatsApp.</span></label>
    <div id="ppRegErr" class="ppErr"></div>
    <button class="ppBtn" id="ppRegOk" type="submit">¡LISTO, A JUGAR!</button>
  </form>
</div>`; }
  let alRegistrar=null;
  function pedirRegistro(cb){ alRegistrar=cb; $('ppReg').classList.add('on'); setTimeout(()=>$('ppNom').focus(),100); }
  async function enviarRegistro(e){
    e.preventDefault(); const tel=$('ppTel').value.replace(/\D/g,'').slice(-10), nom=$('ppNom').value.trim();
    if(nom.length<2){ $('ppRegErr').textContent='Escribe tu nombre.'; return; }
    if(tel.length!==10){ $('ppRegErr').textContent='El celular debe tener 10 dígitos.'; return; }
    if(!$('ppAviso').checked){ $('ppRegErr').textContent='Necesitas aceptar el aviso de privacidad.'; return; }
    $('ppRegOk').disabled=true; $('ppRegOk').textContent='GUARDANDO…'; $('ppRegErr').textContent='';
    try{ const r=await api({accion:'registrar',tel,nombre:nom,suc:sucursal(),promos:$('ppPromos').checked?1:''}); if(!r.ok) throw new Error(r.error||'error'); }
    catch(err){ $('ppRegOk').disabled=false; $('ppRegOk').textContent='¡LISTO, A JUGAR!'; $('ppRegErr').textContent='No se pudo guardar. Revisa tu conexión e intenta otra vez.'; return; }
    store.set('pp_tel',tel); store.set('pp_nombre',nom);
    $('ppRegOk').disabled=false; $('ppRegOk').textContent='¡LISTO, A JUGAR!';
    $('ppReg').classList.remove('on'); const cb=alRegistrar; alRegistrar=null; cb&&cb();
  }
  function antesDeJugar(cb){ if(registrado()) cb(); else pedirRegistro(cb); }
  // intercepta botones de inicio: si no hay registro, primero pide los datos
  function proteger(ids){ ids.forEach(id=>{ const b=$(id); if(!b) return;
    b.addEventListener('click',e=>{ if(registrado()){ partida('inicio'); return; } e.stopImmediatePropagation(); e.preventDefault(); pedirRegistro(()=>b.click()); },true); }); }
  function cambiarNumero(){ store.del('pp_tel'); store.del('pp_nombre'); pedirRegistro(null); }

  // ---------- cupón ----------
  function htmlCupon(){ return `
<section id="ppCupon" class="ppCapa">
  <img class="ppImg" src="${cfg.img||''}" alt="">
  <h1 class="ppTit" id="ppTitulo">${cfg.titulo}</h1>
  <p class="ppMsg" id="ppMensaje">${cfg.mensaje||''}</p>
  <div class="ppCup" id="ppCupBox">
    <div class="ppPct">${DESCUENTO}%</div>
    <div class="ppQue">de descuento en tu próxima pizza</div>
    <div class="ppCod" id="ppCod">· · ·</div>
    <div class="ppVig" id="ppVig"></div>
    <div class="ppVivo" id="ppVivo"><i></i><span id="ppReloj"></span></div>
    <div id="ppEstado"></div>
    <div class="ppVig" id="ppSuc" style="opacity:.7"></div>
  </div>
  <button class="ppBtn ppVerde" id="ppCanjear">CANJEAR EN CAJA</button>
  <button class="ppBtn ppSec" id="ppReintentar" style="display:none">REINTENTAR</button>
  <p class="ppLegal">Muestra esta pantalla en caja. Válido en sucursales Pizzas Plaza participantes. Un cupón por cliente, no acumulable con otras promociones.</p>
  <button class="ppBtn ppSec" id="ppRejugar">JUGAR OTRA VEZ</button>
  ${cfg.portal!==false?`<a class="ppLink" href="${base}index.html">← Más juegos</a>`:''}
</section>
<div id="ppModal"><div class="ppCaja">
  <div style="font-weight:900;font-size:19px">Solo para el cajero</div>
  <div style="font-size:14px;margin-top:4px">Escribe el PIN para aplicar el descuento. El cupón quedará marcado como CANJEADO en el sistema.</div>
  <input id="ppPin" type="password" inputmode="numeric" maxlength="6" autocomplete="off">
  <div id="ppPinErr" class="ppErr"></div>
  <button id="ppPinOk" style="background:#16A34A;color:#fff">CANJEAR</button><button id="ppPinNo" style="background:#ddd">Cancelar</button>
</div></div>`; }
  let actual=null;
  function pintar(c){
    actual=c; const usado=c.estado==='CANJEADO', vencido=c.estado==='VENCIDO'||(c.estado==='ACTIVO'&&new Date(c.vence)<new Date());
    $('ppCod').textContent=c.codigo; $('ppVig').textContent=(vencido?'Venció el ':'Válido hasta el ')+fmt(c.vence);
    $('ppEstado').innerHTML=usado?`<div class="ppCanjeado">✓ CANJEADO</div><div class="ppVig">${c.canjeado||''}</div>`:vencido?'<div class="ppCanjeado" style="background:#92400E">VENCIDO</div>':'';
    const activo=!usado&&!vencido;
    $('ppCanjear').style.display=activo?'':'none'; $('ppVivo').style.display=activo?'':'none';
    $('ppCod').style.textDecoration=activo?'':'line-through'; $('ppCod').style.opacity=activo?'':'.5';
    $('ppCupBox').classList.toggle('anim',activo);
    const s=sucursal(); $('ppSuc').textContent=s?'Sucursal: '+capital(s):'';
    if(c.yaTenia && activo){ $('ppTitulo').textContent='¡Ya tienes un cupón!'; $('ppMensaje').textContent='Tu cupón activo es este. ¡Úsalo en tu próxima visita!'; }
    else if(c.yaTenia && !activo){ $('ppTitulo').textContent='¡Ganaste otra vez!'; $('ppMensaje').textContent=c.proximo?`Ya usaste tu cupón de este mes. Podrás ganar otro a partir del ${fmt(c.proximo)}.`:'Ya usaste tu cupón.'; }
  }
  async function ganar(){
    $('ppTitulo').textContent=cfg.titulo; $('ppMensaje').textContent=cfg.mensaje||''; $('ppCod').textContent='· · ·'; $('ppVig').textContent='Generando tu cupón…';
    $('ppEstado').innerHTML=''; $('ppReintentar').style.display='none'; $('ppCanjear').style.display='none';
    $('ppCupon').classList.add('on'); $('ppCupon').scrollTop=0;
    partida('gano');
    try{ const r=await api({accion:'cupon',tel:store.get('pp_tel')||'',juego:cfg.clave,suc:sucursal()}); if(!r.ok) throw new Error(r.error); pintar(r); }
    catch(e){ $('ppCod').textContent='SIN CONEXIÓN'; $('ppVig').textContent='No pudimos generar tu cupón. Revisa tu internet y toca Reintentar.'; $('ppReintentar').style.display=''; }
  }
  function partida(resultado,puntos){ api({accion:'partida',tel:store.get('pp_tel')||'',juego:cfg.clave,resultado,puntos:puntos||0,suc:sucursal()}).catch(()=>{}); }

  function init(o){
    cfg=Object.assign({clave:'juego',titulo:'¡Ganaste!',mensaje:'',img:'',alRejugar:null,base:'../',protegidos:[]},o); base=cfg.base;
    if(location.hash==='#validar'){ location.href=base+'caja.html'; return true; }
    sucursal();
    const d=document.createElement('div'); d.innerHTML=htmlRegistro()+(cfg.sinCupon?'':htmlCupon()); document.body.appendChild(d);
    $('ppRegForm').addEventListener('submit',enviarRegistro);
    $('ppTel').addEventListener('input',e=>{ const v=e.target.value.replace(/\D/g,'').slice(0,10); e.target.value=v.replace(/(\d{2})(\d{0,4})(\d{0,4})/,(m,a,b,c)=>[a,b,c].filter(Boolean).join(' ')); });
    if(!cfg.sinCupon){
      $('ppCanjear').onclick=()=>{ $('ppPin').value=''; $('ppPinErr').textContent=''; $('ppModal').classList.add('on'); setTimeout(()=>$('ppPin').focus(),50); };
      $('ppPinNo').onclick=()=>$('ppModal').classList.remove('on');
      $('ppPinOk').onclick=async()=>{ $('ppPinOk').disabled=true; $('ppPinErr').textContent='Verificando…';
        try{ const r=await api({accion:'canjear',codigo:actual.codigo,pin:$('ppPin').value,suc:sucursal()});
          if(!r.ok){ $('ppPinErr').textContent=r.error; } else { actual.estado='CANJEADO'; actual.canjeado=r.canjeado; $('ppModal').classList.remove('on'); pintar(actual); }
        }catch(e){ $('ppPinErr').textContent='Sin conexión. Intenta otra vez.'; }
        $('ppPinOk').disabled=false; };
      $('ppReintentar').onclick=ganar;
      $('ppRejugar').onclick=()=>{ $('ppCupon').classList.remove('on'); cfg.alRejugar&&cfg.alRejugar(); };
      setInterval(()=>{ const r=$('ppReloj'); if(r) r.textContent='Cupón en vivo · '+new Date().toLocaleTimeString('es-MX'); },500);
    }
    proteger(cfg.protegidos);
    addEventListener('hashchange',()=>{ if(location.hash==='#validar') location.href=base+'caja.html'; else sucursal(); });
    return false;
  }
  function record(clave,valor,mayorEsMejor=true){ const k='pp_'+clave+'_record'; const r=store.get(k); const n=r===null?null:+r;
    if(valor!==undefined && (n===null || (mayorEsMejor?valor>n:valor<n))){ store.set(k,valor); return valor; } return n; }
  return {init,ganar,partida,record,store,api,antesDeJugar,proteger,registrado,cambiarNumero,sucursal,DESCUENTO};
})();

// ===== Audio sintetizado compartido =====
const SND=(()=>{
  let AC=null, muted=PP.store.get('pp_mute')==='1';
  function on(){ if(!AC){ try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){} } if(AC&&AC.state==='suspended') AC.resume(); }
  function t(f,d,tipo='square',vol=.07,desliz=0,cuando=0){ if(!AC||muted) return; const a=AC.currentTime+cuando,o=AC.createOscillator(),g=AC.createGain();
    o.type=tipo; o.frequency.setValueAtTime(f,a); if(desliz) o.frequency.exponentialRampToValueAtTime(Math.max(30,f+desliz),a+d);
    g.gain.setValueAtTime(vol,a); g.gain.exponentialRampToValueAtTime(.0001,a+d); o.connect(g).connect(AC.destination); o.start(a); o.stop(a+d+.02); }
  const seq=(arr,tipo='triangle',vol=.08,paso=.1)=>arr.forEach((f,i)=>t(f,paso*1.4,tipo,vol,0,i*paso));
  return { on, t, seq,
    get muted(){return muted}, toggle(){ muted=!muted; PP.store.set('pp_mute',muted?'1':'0'); on(); return muted; },
    ok:()=>seq([660,880],'square',.06,.07), bien:()=>seq([523,659,784,1046],'triangle',.08,.09),
    mal:()=>{t(220,.25,'sawtooth',.08,-120)}, click:()=>t(900,.04,'square',.04),
    gana:()=>seq([523,659,784,1046,784,1046,1318],'triangle',.09,.13), pierde:()=>seq([392,330,262,196],'sawtooth',.06,.18) };
})();
window.vib=window.vib||(ms=>{try{navigator.vibrate&&navigator.vibrate(ms)}catch(e){}});
