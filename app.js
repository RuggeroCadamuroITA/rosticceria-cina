const PHONE = '393894742589';
const STORE_KEY = 'rosticceria-cina-order-v1';
const euro = cents => `€ ${(cents / 100).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

let menuData;
let state = { lines: [], name: '', notes: '' };
let currentPage = 'home';
const fixedChoices = new Map();

async function initializeSite() {
  try {
    const response = await fetch(new URL('menu.json', document.baseURI));
    if (!response.ok) throw new Error(`menu.json: ${response.status}`);
    menuData = await response.json();
  } catch (error) {
    // file:// blocks fetch in Chromium; this snapshot of menu.json keeps local previews usable.
    if (window.RC_MENU_INLINE) {
      menuData = window.RC_MENU_INLINE;
      console.info('Rosticceria Cina: menu locale caricato per anteprima.');
    } else {
      console.error(error);
      document.querySelector('#menu-content').innerHTML = '<p class="empty-search">Il menù non è disponibile. Apri il sito tramite un server statico.</p>';
      return;
    }
  }
  loadState();
  renderAll();
  setupNavigation();
  setupEvents();
  observeRevealTargets();
  setRoute(location.hash.slice(1) || 'home', false);
}
function loadState() {
  try { const saved = JSON.parse(localStorage.getItem(STORE_KEY)); if (saved && Array.isArray(saved.lines)) state = { ...state, ...saved, lines: saved.lines.filter(line => line && Number.isInteger(line.qty) && line.qty > 0) }; }
  catch (_) { localStorage.removeItem(STORE_KEY); }
}
function saveState() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (_) { /* storage unavailable */ } }
function fixedMenu(id) { return menuData.fixedMenus.find(item => item.id === id); }
function findItem(id) { return menuData.items.find(item => item.id === id); }
function lineKey(line) { return line.type === 'fixed' ? `fixed:${line.uid}` : `dish:${line.id}`; }
function getLine(key) { return state.lines.find(line => lineKey(line) === key); }
function countItems() { return state.lines.reduce((sum, line) => sum + line.qty, 0); }
function totalCents() { return state.lines.reduce((sum, line) => sum + line.qty * line.price, 0); }
function itemDisplay(item) { return `${item.id} ${item.nome}`; }
function renderAll() { renderHomeFixed(); renderMenu(); renderOrder(); renderCart(); }
function addRevealTargets() { document.querySelectorAll('#home .intro,#home .fixed-promo,#home .gallery-section,#home .specialties,#home .visit-band,#menu-content .menu-category,#ordina .order-category,#contatti .contact-layout,#contatti .service-strip').forEach(element => element.classList.add('reveal-up')); }
function observeRevealTargets() {
  addRevealTargets(); document.documentElement.classList.add('motion-ready');
  const targets = document.querySelectorAll('.reveal-up:not(.is-visible)');
  if (!('IntersectionObserver' in window)) { targets.forEach(target => target.classList.add('is-visible')); return; }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .08, rootMargin: '0px 0px -35px 0px' });
  targets.forEach(target => observer.observe(target));
}
function renderHomeFixed() { document.querySelector('#home-fixed-menus').innerHTML = menuData.fixedMenus.map(menu => `<article class="promo-card"><span class="promo-kicker">MENÙ ${esc(menu.lettera)}</span><h3>${esc(menu.nome)}</h3><p>${esc(menu.descrizione)}</p><strong>${euro(menu.prezzo)}</strong><a href="#ordina" data-order-fixed="${esc(menu.id)}">SCEGLI →</a></article>`).join(''); }
function renderDish(item, mode) {
  const note = [item.surgelato ? '<span class="frozen">* surgelato</span>' : '', item.note && !item.verifica ? esc(item.note) : ''].filter(Boolean).join(' · ');
  const title = `<div class="dish-copy"><span class="dish-number">${esc(item.id)}${item.surgelato ? '*' : ''}</span><div><div class="dish-name">${esc(item.nome)}</div>${note ? `<div class="dish-meta">${note}</div>` : ''}</div></div>`;
  const price = `<span class="dish-price">${euro(item.prezzo)}</span>`;
  if (mode === 'menu') return `<article class="dish-card">${title}<div class="dish-side">${price}<a class="add-order" href="#ordina" data-add-dish="${esc(item.id)}">Aggiungi all'ordine</a></div></article>`;
  const qty = getLine(`dish:${item.id}`)?.qty || 0;
  return `<article class="order-row ${qty ? 'selected' : ''}" data-row-id="${esc(item.id)}">${title}<div class="dish-side">${price}<div class="quantity"><button type="button" data-qty="${esc(item.id)}" data-delta="-1" aria-label="Rimuovi ${esc(item.nome)}">−</button><output>${qty}</output><button type="button" data-qty="${esc(item.id)}" data-delta="1" aria-label="Aggiungi ${esc(item.nome)}">+</button></div></div></article>`;
}
function renderMenu() {
  const categories = [{ id:'menu-fissi', nome:'Menù fissi' }, ...menuData.categories];
  document.querySelector('#menu-tabs').innerHTML = categories.map((category,index) => `<button class="menu-tab ${index===0?'active':''}" type="button" role="tab" aria-selected="${index===0}" data-scroll-category="${esc(category.id)}">${esc(category.nome)}</button>`).join('');
  const fixed = `<section class="fixed-menu-section menu-category" id="menu-fissi" data-section="menu-fissi"><div class="category-heading"><h2>Menù fissi</h2><span>Le combinazioni preferite</span></div>${menuData.fixedMenus.map(menu => `<article class="fixed-menu-card"><div><h3>${esc(menu.lettera)}) ${esc(menu.nome)}</h3><p>${esc(menu.descrizione)}</p></div><strong>${euro(menu.prezzo)}</strong></article>`).join('')}</section>`;
  const dishes = menuData.categories.map(category => { const items=menuData.items.filter(item=>item.categoria===category.id); return `<section class="menu-category" id="${esc(category.id)}" data-section="${esc(category.id)}"><div class="category-heading"><h2>${esc(category.nome)}</h2><span>${items.length} specialità</span></div><div class="dish-list">${items.map(item=>renderDish(item,'menu')).join('')}</div></section>`; }).join('');
  document.querySelector('#menu-content').innerHTML = fixed + dishes;
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => { const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0]; if(!visible)return; document.querySelectorAll('.menu-tab').forEach(tab=>{const active=tab.dataset.scrollCategory===visible.target.id;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));if(active)tab.scrollIntoView({block:'nearest',inline:'center'});}); }, {rootMargin:'-180px 0px -62% 0px',threshold:[0,.1,.3]});
  document.querySelectorAll('#menu-content [data-section]').forEach(section=>observer.observe(section));
}
function secondOptions() { return menuData.items.filter(item=>['carne','pesce'].includes(item.categoria)); }
function supplementFor(item) { if(item.categoria==='pesce'&&/misto di pesce|gamberon/i.test(item.nome))return 250;if(/gamberett|manzo|anatra/i.test(item.nome))return 180;return 0; }
function getFixedChoice(id) { return fixedChoices.get(id)||{rice:'',second:''}; }
function renderFixedOrder(menu) {
  const choices=secondOptions(),selected=getFixedChoice(menu.id);
  const rice=menu.riso?`<label>Variante<select data-fixed-rice="${esc(menu.id)}"><option value="">Scegli il riso</option>${menu.riso.map(name=>`<option ${selected.rice===name?'selected':''}>${esc(name)}</option>`).join('')}</select></label>`:'';
  return `<article class="fixed-menu-order" data-fixed-card="${esc(menu.id)}"><div class="fixed-card-top"><div><h3>Menù ${esc(menu.lettera)}) ${esc(menu.nome)}</h3><p>${esc(menu.descrizione)}</p></div><div class="dish-side"><span class="dish-price">${euro(menu.prezzo)}</span></div></div><div class="fixed-options">${rice}<label class="select-second">Secondo a scelta<select data-fixed-second="${esc(menu.id)}"><option value="">Scegli un secondo</option>${choices.map(item=>`<option value="${esc(item.id)}" ${selected.second===item.id?'selected':''}>${esc(itemDisplay(item))}${supplementFor(item)?` (+ ${euro(supplementFor(item))})`:''}</option>`).join('')}</select></label></div><p class="fixed-summary" data-fixed-summary="${esc(menu.id)}">Scegli le opzioni per comporre il menù.</p><button class="fixed-add" type="button" data-add-fixed="${esc(menu.id)}" disabled>Aggiungi al carrello</button></article>`;
}
function renderOrder() {
  const fixed=`<section class="order-category" id="ordina-fissi"><h2>Menù fissi</h2>${menuData.fixedMenus.map(renderFixedOrder).join('')}</section>`;
  const categories=menuData.categories.map(category=>`<section class="order-category" data-order-section="${esc(category.id)}"><h2>${esc(category.nome)}</h2>${menuData.items.filter(item=>item.categoria===category.id).map(item=>renderDish(item,'order')).join('')}</section>`).join('');
  document.querySelector('#order-content').innerHTML=fixed+categories;refreshFixedStates();
}
function refreshFixedStates() {
  menuData.fixedMenus.forEach(menu=>{const card=document.querySelector(`[data-fixed-card="${menu.id}"]`);if(!card)return;const second=card.querySelector(`[data-fixed-second="${menu.id}"]`).value;const rice=card.querySelector(`[data-fixed-rice="${menu.id}"]`)?.value||'';const item=findItem(second);const supplement=item?supplementFor(item):0;const summary=[rice?`riso: ${rice}`:'',item?`secondo: ${item.nome}`:'',supplement?`supplemento ${euro(supplement)}`:''].filter(Boolean).join(' · ');card.querySelector(`[data-fixed-summary="${menu.id}"]`).textContent=summary||'Scegli le opzioni per comporre il menù.';card.querySelector(`[data-add-fixed="${menu.id}"]`).disabled=!item||!!(menu.riso&&!rice);card.querySelector(`[data-add-fixed="${menu.id}"]`).textContent=`Aggiungi · ${euro(menu.prezzo+supplement)}`;});
}
function renderCart() {
  const container=document.querySelector('#cart-items');
  container.innerHTML=state.lines.length?state.lines.map(line=>`<div class="cart-line"><b>${line.qty}× ${esc(line.label)}</b><small>${esc(line.detail||`(${line.id}) ${line.name}`)}</small><strong>${euro(line.qty*line.price)}</strong><button type="button" data-remove-line="${esc(lineKey(line))}">Rimuovi</button></div>`).join(''):'<p class="cart-empty">Il carrello è ancora vuoto.<br><span>Aggiungi qualcosa di buono!</span></p>';
  document.querySelector('#cart-total').textContent=euro(totalCents());document.querySelector('#mobile-total').textContent=euro(totalCents());document.querySelector('#mobile-items-count').textContent=`${countItems()} ${countItems()===1?'articolo':'articoli'}`;document.querySelector('#send-order').disabled=!state.lines.length;document.querySelector('#customer-name').value=state.name||'';document.querySelector('#customer-notes').value=state.notes||'';refreshFixedStates();
}
function setQuantity(id,delta) { const item=findItem(id);if(!item)return;const key=`dish:${id}`;let line=getLine(key);if(!line&&delta>0){line={type:'dish',id:item.id,name:item.nome,label:`(${item.id}) ${item.nome}`,price:item.prezzo,qty:0};state.lines.push(line)}if(!line)return;line.qty=Math.max(0,line.qty+delta);if(!line.qty)state.lines=state.lines.filter(entry=>lineKey(entry)!==key);saveState();const row=document.querySelector(`[data-row-id="${id}"]`);if(row){row.classList.toggle('selected',line.qty>0);row.querySelector('output').textContent=String(line.qty)}renderCart(); }
function addFixed(menuId,card) { const menu=fixedMenu(menuId),secondId=card.querySelector(`[data-fixed-second="${menuId}"]`).value,rice=card.querySelector(`[data-fixed-rice="${menuId}"]`)?.value||'',second=findItem(secondId);if(!menu||!second||(menu.riso&&!rice))return;const supplement=supplementFor(second),details=[...(menu.include||[])];if(rice)details.push(rice);details.push(`secondo: ${second.nome}${supplement?`, +${euro(supplement)}`:''}`);const detail=details.join(' · '),uid=`${menuId}:${rice}:${secondId}`;let line=state.lines.find(entry=>entry.type==='fixed'&&entry.uid===uid);if(line)line.qty++;else state.lines.push({type:'fixed',uid,menuId,lettera:menu.lettera,name:menu.nome,label:`Menù ${menu.lettera}) ${menu.nome}`,id:`Menù ${menu.lettera})`,detail,secondId,rice,price:menu.prezzo+supplement,qty:1});saveState();renderOrder();renderCart(); }
function setRoute(route,push=true) { const valid=['home','menu','ordina','contatti'].includes(route)?route:'home';currentPage=valid;if(push&&location.hash.slice(1)!==valid)location.hash=valid;document.querySelectorAll('.page').forEach(page=>page.classList.toggle('active',page.id===valid));document.querySelectorAll('.main-nav [data-page]').forEach(link=>link.classList.toggle('active',link.dataset.page===valid));document.querySelector('.main-nav').classList.remove('open');document.querySelector('.nav-toggle').setAttribute('aria-expanded','false');if(valid==='ordina'){renderOrder();renderCart()}observeRevealTargets();window.scrollTo({top:0,behavior:'smooth'}); }
function setupNavigation() {
  document.querySelector('.nav-toggle').addEventListener('click',event=>{const open=document.querySelector('.main-nav').classList.toggle('open');event.currentTarget.setAttribute('aria-expanded',String(open));event.currentTarget.setAttribute('aria-label',open?'Chiudi il menu':'Apri il menu')});
  document.addEventListener('click',event=>{const nav=document.querySelector('.main-nav'),toggle=document.querySelector('.nav-toggle');if(nav.classList.contains('open')&&!nav.contains(event.target)&&!toggle.contains(event.target)){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Apri il menu')}});
  document.querySelectorAll('.main-nav [data-page]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();setRoute(link.dataset.page)}));
  document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{const route=link.getAttribute('href').slice(1);if(!['home','menu','ordina','contatti'].includes(route))return;event.preventDefault();if(location.hash!==`#${route}`)location.hash=route;else setRoute(route,false);if(link.dataset.orderFixed)setTimeout(()=>document.querySelector(`[data-fixed-card="${link.dataset.orderFixed}"]`)?.scrollIntoView({behavior:'smooth',block:'center'}),80)}));
  window.addEventListener('popstate',()=>setRoute(location.hash.slice(1)||'home',false));
  window.addEventListener('hashchange',()=>{const route=location.hash.slice(1);if(['home','menu','ordina','contatti'].includes(route)&&route!==currentPage)setRoute(route,false)});
  document.querySelector('#year').textContent=new Date().getFullYear();
}
function setupEvents() {
  document.querySelector('#menu-tabs').addEventListener('click',event=>{const button=event.target.closest('[data-scroll-category]');if(button)document.getElementById(button.dataset.scrollCategory)?.scrollIntoView({behavior:'smooth',block:'start'})});
  document.querySelector('#menu-search').addEventListener('input',event=>filterMenu(event.target.value));document.querySelector('#order-search').addEventListener('input',event=>filterOrder(event.target.value));
  document.querySelector('#menu-content').addEventListener('click',event=>{const button=event.target.closest('[data-add-dish]');if(!button)return;event.preventDefault();setRoute('ordina');setTimeout(()=>{const item=findItem(button.dataset.addDish);if(item)setQuantity(item.id,1);const row=document.querySelector(`[data-row-id="${button.dataset.addDish}"]`);if(row){row.scrollIntoView({behavior:'smooth',block:'center'});row.querySelector('[data-qty][data-delta="1"]')?.focus()}},80)});
  document.querySelector('#order-content').addEventListener('click',event=>{const quantity=event.target.closest('[data-qty]');if(quantity)setQuantity(quantity.dataset.qty,Number(quantity.dataset.delta));const add=event.target.closest('[data-add-fixed]');if(add&&!add.disabled)addFixed(add.dataset.addFixed,add.closest('[data-fixed-card]'))});
  document.querySelector('#order-content').addEventListener('change',event=>{if(!event.target.matches('[data-fixed-second],[data-fixed-rice]'))return;const card=event.target.closest('[data-fixed-card]'),id=card.dataset.fixedCard;fixedChoices.set(id,{second:card.querySelector(`[data-fixed-second="${id}"]`).value,rice:card.querySelector(`[data-fixed-rice="${id}"]`)?.value||''});refreshFixedStates()});
  document.querySelector('#cart-items').addEventListener('click',event=>{const button=event.target.closest('[data-remove-line]');if(!button)return;state.lines=state.lines.filter(line=>lineKey(line)!==button.dataset.removeLine);saveState();renderOrder();renderCart()});
  document.querySelector('#customer-name').addEventListener('input',event=>{state.name=event.target.value;saveState()});document.querySelector('#customer-notes').addEventListener('input',event=>{state.notes=event.target.value;saveState()});document.querySelector('#send-order').addEventListener('click',sendOrder);  const panel=document.querySelector('#cart-panel'),overlay=document.querySelector('#cart-overlay'),cartTrigger=document.querySelector('#mobile-cart-bar');
  let previousFocus=null;
  const close=()=>{if(!panel.classList.contains('open'))return;panel.classList.remove('open');overlay.classList.remove('open');document.body.style.overflow='';(previousFocus||cartTrigger).focus()};
  cartTrigger.addEventListener('click',()=>{previousFocus=document.activeElement;panel.classList.add('open');overlay.classList.add('open');document.body.style.overflow='hidden';document.querySelector('.cart-close').focus()});
  document.querySelector('.cart-close').addEventListener('click',close);overlay.addEventListener('click',close);
  document.addEventListener('keydown',event=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'&&currentPage==='menu'){event.preventDefault();document.querySelector('#menu-search').focus()}if(event.key==='Escape')close();if(panel.classList.contains('open')&&event.key==='Tab'){const focusable=[...panel.querySelectorAll('button:not(:disabled),input,textarea,select,a[href]')].filter(el=>el.offsetParent!==null);if(!focusable.length)return;const first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}});
}
function filterMenu(query) { const normalized=query.trim().toLocaleLowerCase('it');let count=0;document.querySelectorAll('#menu-content .dish-card').forEach(card=>{const match=!normalized||card.textContent.toLocaleLowerCase('it').includes(normalized);card.hidden=!match;if(match)count++});document.querySelectorAll('#menu-content .menu-category').forEach(section=>{const visible=section.id==='menu-fissi'||[...section.querySelectorAll('.dish-card')].some(card=>!card.hidden);section.hidden=!!normalized&&!visible});let empty=document.querySelector('#menu-content .empty-search');if(normalized&&!count){if(!empty){empty=document.createElement('p');empty.className='empty-search';document.querySelector('#menu-content').append(empty)}empty.textContent=`Nessun piatto trovato per “${query.trim()}”.`}else empty?.remove();const status=document.querySelector('#menu-search-status');if(status)status.textContent=normalized?`${count} ${count===1?'piatto trovato':'piatti trovati'}`:''; }
function filterOrder(query) { const normalized=query.trim().toLocaleLowerCase('it');document.querySelectorAll('#order-content .order-category').forEach(section=>{const rows=[...section.querySelectorAll('.order-row')];let visible=0;rows.forEach(row=>{const match=!normalized||row.textContent.toLocaleLowerCase('it').includes(normalized);row.hidden=!match;if(match)visible++});section.hidden=!!normalized&&rows.length>0&&!visible;if(section.id==='ordina-fissi')section.hidden=!!normalized}); }
function sendOrder() { if(!state.lines.length)return;const lines=['Buongiorno, vorrei ordinare:','',...state.lines.map(line=>line.type==='fixed'?`${line.qty}x ${line.label} (${line.detail}) - ${euro(line.price)}`:`${line.qty}x (${line.id}) ${line.name} - ${euro(line.price*line.qty)}`),'',`Totale: ${euro(totalCents())}`];if(state.name.trim())lines.push(`Nome: ${state.name.trim()}`);if(state.notes.trim())lines.push(`Note: ${state.notes.trim()}`);lines.push('','A che ora è possibile ritirare?');window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(lines.join('\n'))}`,'_blank','noopener'); }
initializeSite();
