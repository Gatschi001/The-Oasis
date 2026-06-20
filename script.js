const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const closeModal = document.getElementById('closeModal');
const addCart = document.getElementById('addCart');
const cartCount = document.getElementById('cartCount');
let cart = 2;

document.querySelectorAll('.details').forEach(btn => {
  btn.addEventListener('click', () => {
    modalTitle.textContent = btn.dataset.product;
    modal.classList.add('show');
  });
});

document.querySelectorAll('.heart').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('liked');
    btn.textContent = btn.classList.contains('liked') ? '♥' : '♡';
  });
});

addCart.addEventListener('click', () => {
  cart++;
  cartCount.textContent = cart;
  addCart.textContent = 'Added ✓';
  setTimeout(() => addCart.textContent = 'Add to Cart', 1200);
});

closeModal.addEventListener('click', () => modal.classList.remove('show'));
modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('show'); });

document.getElementById('searchBtn').addEventListener('click', () => alert('Search feature coming soon!'));
document.getElementById('contactBtn').addEventListener('click', () => alert('Email: your-email@example.com'));

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });
revealItems.forEach(item => observer.observe(item));


/* Product details image switch */
document.addEventListener("DOMContentLoaded", () => {
  const modalImg = document.getElementById("modalImg") || document.querySelector(".modal-img");
  const detailsButtons = document.querySelectorAll(".details");

  detailsButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productName = button.dataset.product || "";

      if (!modalImg) return;

      if (productName.toLowerCase().includes("t-shirt") || productName.toLowerCase().includes("tshirt")) {
        modalImg.classList.add("show-shirt");
      } else {
        modalImg.classList.remove("show-shirt");
      }
    });
  });
});
