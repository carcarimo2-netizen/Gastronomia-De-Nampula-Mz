// Menu mobile toggle + modal, lightbox, reserva storage, contact demo
document.addEventListener('DOMContentLoaded', () => {
  // burger toggle
  document.querySelectorAll('.burger').forEach(btn => {
    btn.addEventListener('click', () => {
      const mobile = document.getElementById('mobile-menu');
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      if (mobile) mobile.hidden = open;
    });
  });

  // ESC close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDish(); closeLightbox();
    }
  });

  // load reservas from localStorage
  renderReservas();
});

// DISH data
const DISHES = {
  'matapa': {title:'Matapa', desc:'Folhas de mandioca com amendoim e leite de coco.', price:'MZN 250'},
  'caril': {title:'Caril de Camarão', desc:'Camarão fresco com molho de coco e especiarias.', price:'MZN 450'},
  'xima': {title:'Xima com Peixe', desc:'Xima de milho com peixe grelhado.', price:'MZN 300'},
  'frango': {title:'Frango à Zambeziana', desc:'Frango marinado com piri-piri e leite de coco.', price:'MZN 400'},
  'feijoada': {title:'Feijoada Moçambicana', desc:'Feijoada ao estilo moçambicano, rica e saborosa.', price:'MZN 350'},
  'cocoarroz': {title:'Arroz de Coco', desc:'Arroz cozido em leite de coco, cremoso.', price:'MZN 200'},
  'mandioca': {title:'Mandioca Frita', desc:'Mandioca crocante servida com molhos.', price:'MZN 150'}
};

// open dish modal
function openDish(key){
  const data = DISHES[key];
  if(!data) return;
  const modal = document.getElementById('dishModal');
  modal.querySelector('#dishTitle').textContent = data.title;
  modal.querySelector('#dishDesc').textContent = data.desc;
  modal.querySelector('#dishPrice').textContent = data.price;
  modal.setAttribute('aria-hidden','false');
}
function closeDish(){
  const modal = document.getElementById('dishModal');
  if(modal) modal.setAttribute('aria-hidden','true');
}

/* Lightbox gallery */
const GALLERY = [
  'imagens/image_search_1761987406537.jpg',
  'imagens/image_search_1761987435422.jpg',
  'imagens/image_search_1761987469574.jpg',
  'imagens/image_search_1761987529779.jpg',
  'imagens/image_search_1761989682351.jpg',
  'imagens/image_search_1761989705916.jpg',
  'imagens/image_search_1761989723415.jpg'
];
let current = 0;
function openLightbox(idx){
  current = idx;
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  img.src = GALLERY[idx];
  img.alt = '';
  lb.setAttribute('aria-hidden','false');
}
function closeLightbox(){
  const lb = document.getElementById('lightbox');
  if(lb) lb.setAttribute('aria-hidden','true');
}
function prevImg(){ current = (current - 1 + GALLERY.length) % GALLERY.length; document.getElementById('lightboxImg').src = GALLERY[current]; }
function nextImg(){ current = (current + 1) % GALLERY.length; document.getElementById('lightboxImg').src = GALLERY[current]; }

/* Contact form demo */
function submitContact(e){
  e.preventDefault();
  const form = e.target;
  const name = (form.name && form.name.value) ? form.name.value : 'Amigo';
  alert(`Obrigado ${name}! Mensagem recebida (simulação).`);
  form.reset();
}

/* Reserva form: guarda em localStorage */
function submitReserva(e){
  e.preventDefault();
  const f = document.getElementById('reservaForm');
  const data = {
    id: Date.now(),
    name: f.name.value,
    phone: f.phone.value,
    dish: f.dish.value,
    quantity: f.quantity.value,
    date: f.date.value,
    time: f.time.value,
    note: f.note.value
  };
  const arr = JSON.parse(localStorage.getItem('reservas') || '[]');
  arr.unshift(data);
  localStorage.setItem('reservas', JSON.stringify(arr));
  alert(`Obrigado ${data.name}! Reserva/Pedido registado (simulação).`);
  f.reset();
  renderReservas();
}

/* render reservas */
function renderReservas(){
  const container = document.getElementById('reservasList');
  if(!container) return;
  const arr = JSON.parse(localStorage.getItem('reservas') || '[]');
  container.innerHTML = '';
  if(arr.length === 0){
    container.innerHTML = '<p class="muted">Sem reservas/pedidos ainda.</p>';
    return;
  }
  arr.forEach(r => {
    const el = document.createElement('div');
    el.className = 'reserva-card';
    el.innerHTML = `<strong>${escapeHtml(r.name)}</strong> — ${escapeHtml(r.dish)} (${r.quantity}) <br>
      <small>${r.date} ${r.time ? r.time : ''} • ${escapeHtml(r.phone)}</small>
      <p>${escapeHtml(r.note || '')}</p>`;
    container.appendChild(el);
  });
}

/* helper simple escape */
function escapeHtml(str){ return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s])); }
