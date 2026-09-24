const products = [
  {id:1,name:'Luna Pearl Drops',price:899,category:'Earrings',img:'assets/product-1.svg',badge:'New',desc:'A refined drop earring with a soft pearl-inspired finish for everyday styling.'},
  {id:2,name:'Amara Signet Ring',price:749,category:'Rings',img:'assets/product-2.svg',badge:'Bestseller',desc:'A modern signet silhouette designed for simple stacks and solo wear.'},
  {id:3,name:'Celeste Pendant',price:1099,category:'Necklaces',img:'assets/product-3.svg',badge:'New',desc:'A delicate pendant with a polished focal detail and a clean chain line.'},
  {id:4,name:'Noor Cuff Bracelet',price:999,category:'Bracelets',img:'assets/product-4.svg',badge:'Limited',desc:'A minimal open cuff with a sculptural shape that catches light beautifully.'},
  {id:5,name:'Mira Hoops',price:799,category:'Earrings',img:'assets/product-5.svg',badge:'New',desc:'Softly rounded hoops with a polished finish and easy everyday proportion.'},
  {id:6,name:'Ayla Stack Ring',price:699,category:'Rings',img:'assets/product-6.svg',badge:'Bestseller',desc:'A slim stackable ring designed to mix effortlessly with your current favorites.'},
  {id:7,name:'Sia Layer Chain',price:1199,category:'Necklaces',img:'assets/product-7.svg',badge:'New',desc:'A layered chain look in one easy piece, made for necklines from tees to dresses.'},
  {id:8,name:'Rhea Charm Bracelet',price:949,category:'Bracelets',img:'assets/product-8.svg',badge:'New',desc:'A light charm bracelet that adds movement without feeling busy.'}
];
let cart = [];
let wishlist = new Set();
let quickProduct = null;

const money = n => `₹${n.toLocaleString('en-IN')}`;
const grid = document.getElementById('productGrid');

grid.innerHTML = products.map(p => `
  <article class="product-card reveal">
    <div class="product-media">
      <img src="${p.img}" alt="${p.name} placeholder" />
      <span class="badge">${p.badge}</span>
      <button class="wish" data-wish="${p.id}" aria-label="Add ${p.name} to wishlist">♡</button>
    </div>
    <div class="product-info">
      <h3>${p.name}</h3>
      <div class="product-meta"><span>${p.category}</span><strong>${money(p.price)}</strong></div>
      <button class="quick" data-quick="${p.id}">Quick View</button>
    </div>
  </article>`).join('');

function renderCart(){
  document.getElementById('cartCount').textContent = cart.length;
  const box = document.getElementById('cartItems');
  if(!cart.length){box.innerHTML='<p style="color:#766d70">Your bag is empty.</p>';}
  else box.innerHTML = cart.map((p,i)=>`<div class="cart-row"><img src="${p.img}" alt=""><div><h4>${p.name}</h4><small>${money(p.price)}</small></div><button class="remove" data-remove="${i}">Remove</button></div>`).join('');
  document.getElementById('subtotal').textContent = money(cart.reduce((s,p)=>s+p.price,0));
}
function openDrawer(type){
  const el = type==='cart'?document.getElementById('cartDrawer'):document.getElementById('searchDrawer');
  document.getElementById('backdrop').classList.add('open'); el.classList.add('open'); el.setAttribute('aria-hidden','false');
  if(type==='search') setTimeout(()=>document.getElementById('searchInput').focus(),250);
}
function closeDrawers(){document.getElementById('backdrop').classList.remove('open');document.querySelectorAll('.drawer').forEach(d=>{d.classList.remove('open');d.setAttribute('aria-hidden','true')})}

document.addEventListener('click',e=>{
  const open=e.target.closest('[data-open]'); if(open) openDrawer(open.dataset.open);
  if(e.target.matches('[data-close]')||e.target.id==='backdrop') closeDrawers();
  const q=e.target.closest('[data-quick]'); if(q) openQuick(Number(q.dataset.quick));
  const w=e.target.closest('[data-wish]'); if(w){const id=Number(w.dataset.wish);wishlist.has(id)?wishlist.delete(id):wishlist.add(id);w.classList.toggle('active');w.textContent=wishlist.has(id)?'♥':'♡';}
  const r=e.target.closest('[data-remove]'); if(r){cart.splice(Number(r.dataset.remove),1);renderCart();}
});

function openQuick(id){
  quickProduct=products.find(p=>p.id===id); if(!quickProduct)return;
  document.getElementById('quickImg').src=quickProduct.img; document.getElementById('quickImg').alt=quickProduct.name;
  document.getElementById('quickName').textContent=quickProduct.name; document.getElementById('quickDesc').textContent=quickProduct.desc; document.getElementById('quickPrice').textContent=money(quickProduct.price);
  document.getElementById('quickModal').classList.add('open'); document.getElementById('quickModal').setAttribute('aria-hidden','false');
}
function closeQuick(){document.getElementById('quickModal').classList.remove('open');document.getElementById('quickModal').setAttribute('aria-hidden','true')}
document.getElementById('quickClose').onclick=closeQuick;
document.getElementById('quickModal').addEventListener('click',e=>{if(e.target.id==='quickModal')closeQuick()});
document.getElementById('quickAdd').onclick=()=>{if(quickProduct){cart.push(quickProduct);renderCart();closeQuick();openDrawer('cart')}};

const searchInput=document.getElementById('searchInput');
searchInput.addEventListener('input',()=>{
  const q=searchInput.value.trim().toLowerCase();
  const results=products.filter(p=>`${p.name} ${p.category}`.toLowerCase().includes(q));
  document.getElementById('searchResults').innerHTML=(q?results:products.slice(0,4)).map(p=>`<div class="search-result"><span>${p.name}<small style="display:block;color:#766d70">${p.category}</small></span><strong>${money(p.price)}</strong></div>`).join('') || '<p>No matches found.</p>';
});
searchInput.dispatchEvent(new Event('input'));

const menu=document.getElementById('mobileMenu');
document.getElementById('menuBtn').onclick=()=>{menu.classList.add('open');menu.setAttribute('aria-hidden','false')};
document.getElementById('menuClose').onclick=()=>{menu.classList.remove('open');menu.setAttribute('aria-hidden','true')};
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');menu.setAttribute('aria-hidden','true')}));

document.getElementById('newsletterForm').addEventListener('submit',e=>{e.preventDefault();document.getElementById('newsletterMsg').textContent='Thanks — demo signup captured locally.';e.target.reset()});

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
renderCart();
