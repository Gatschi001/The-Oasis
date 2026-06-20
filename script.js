const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const closeModal = document.getElementById('closeModal');
const addCart = document.getElementById('addCart');
const cartCount = document.getElementById('cartCount');
const toast = document.getElementById('toast');
const searchPanel = document.getElementById('searchPanel');
const cartDrawer = document.getElementById('cartDrawer');
let cart = 2;

function showToast(text) {
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1600);
}

document.querySelectorAll('.details').forEach(btn => {
  btn.addEventListener('click', () => {
    modalTitle.textContent = btn.dataset.product;
    modalPrice.textContent = btn.dataset.price;
    modal.classList.add('show');
  });
});

document.querySelectorAll('.heart').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('liked');
    btn.textContent = btn.classList.contains('liked') ? '♥' : '♡';
    showToast(btn.classList.contains('liked') ? 'Saved to favorites ♥' : 'Removed from favorites');
  });
});

addCart.addEventListener('click', () => {
  cart++;
  cartCount.textContent = cart;
  showToast('Added to cart ✓');
  addCart.textContent = 'Added ✓';
  setTimeout(() => addCart.textContent = 'Add to Cart', 1200);
});

closeModal.addEventListener('click', () => modal.classList.remove('show'));
modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('show'); });

document.getElementById('searchBtn').addEventListener('click', () => searchPanel.classList.add('show'));
document.getElementById('closeSearch').addEventListener('click', () => searchPanel.classList.remove('show'));
document.getElementById('searchInput').addEventListener('input', e => {
  if (e.target.value.length > 1) showToast(`Searching: ${e.target.value}`);
});

document.getElementById('cartBtn').addEventListener('click', () => cartDrawer.classList.add('show'));
document.getElementById('closeCart').addEventListener('click', () => cartDrawer.classList.remove('show'));
document.getElementById('accountBtn').addEventListener('click', () => showToast('Account feature coming soon'));
document.getElementById('contactBtn').addEventListener('click', () => showToast('Email: your-email@example.com'));
document.getElementById('quickLook').addEventListener('click', () => document.querySelector('.details').click());
document.getElementById('menuToggle').addEventListener('click', () => document.getElementById('navMenu').classList.toggle('show'));

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });
revealItems.forEach(item => observer.observe(item));

document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = ((y / r.height) - .5) * -6;
    const ry = ((x / r.width) - .5) * 6;
    card.style.transform = `translateY(-8px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave', () => card.style.transform = '');
});

document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    btn.style.transform = `translate(${(e.clientX - r.left - r.width/2)*.12}px, ${(e.clientY - r.top - r.height/2)*.12}px) translateY(-4px)`;
  });
  btn.addEventListener('mouseleave', () => btn.style.transform = '');
});
