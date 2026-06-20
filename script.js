
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const searchBtn = document.getElementById("searchBtn");
const searchPanel = document.getElementById("searchPanel");
const closeSearch = document.getElementById("closeSearch");
const cartBtn = document.getElementById("cartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const closeCart = document.getElementById("closeCart");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const modalImg = document.getElementById("modalImg") || document.querySelector(".modal-img");
const addCart = document.getElementById("addCart");
const toast = document.getElementById("toast");
const checkoutBtn = document.getElementById("checkoutBtn");

let cart = [];
let currentProduct = null;

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => navMenu.classList.toggle("show"));
}

if (searchBtn && searchPanel) {
  searchBtn.addEventListener("click", () => searchPanel.classList.add("show"));
}

if (closeSearch && searchPanel) {
  closeSearch.addEventListener("click", () => searchPanel.classList.remove("show"));
}

if (cartBtn && cartDrawer) {
  cartBtn.addEventListener("click", () => cartDrawer.classList.add("show"));
}

if (closeCart && cartDrawer) {
  closeCart.addEventListener("click", () => cartDrawer.classList.remove("show"));
}

document.querySelectorAll(".heart").forEach((heart) => {
  heart.addEventListener("click", () => {
    heart.classList.toggle("liked");
    heart.textContent = heart.classList.contains("liked") ? "♥" : "♡";
  });
});

document.querySelectorAll(".details").forEach((button) => {
  if (button.classList.contains("add-to-cart")) return;

  button.addEventListener("click", () => {
    const product = button.dataset.product || "The Oasis Product";
    const priceText = button.dataset.price || "$0.00";
    const price = Number(priceText.replace("$", "")) || 0;
    const image = product.toLowerCase().includes("t-shirt") || product.toLowerCase().includes("tshirt")
      ? "oasis-tshirt-model.png"
      : "oasis-design-reference.png";

    currentProduct = { name: product, price, image };

    if (modalTitle) modalTitle.textContent = product;
    if (modalPrice) modalPrice.textContent = priceText;

    if (modalImg) {
      modalImg.classList.toggle("show-shirt", image === "oasis-tshirt-model.png");
    }

    if (modal) modal.classList.add("show");
  });
});

document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    addItemToCart({
      name: button.dataset.product || "The Oasis Product",
      price: Number(button.dataset.price) || 0,
      image: button.dataset.image || "oasis-design-reference.png"
    });

    if (cartDrawer) cartDrawer.classList.add("show");
  });
});

if (addCart) {
  addCart.addEventListener("click", () => {
    if (!currentProduct) return;
    addItemToCart(currentProduct);
    if (modal) modal.classList.remove("show");
    if (cartDrawer) cartDrawer.classList.add("show");
  });
}

if (closeModal && modal) {
  closeModal.addEventListener("click", () => modal.classList.remove("show"));
}

if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) modal.classList.remove("show");
  });
}

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (!cart.length) {
      showToast("Your cart is empty");
      return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const summary = cart
      .map((item) => `${item.qty}x ${item.name}`)
      .join(", ");

    showToast(`Checkout ready: $${total.toFixed(2)}`);
    alert(`Checkout Preview\\n\\nItems: ${summary}\\nTotal: $${total.toFixed(2)}\\n\\nConnect Stripe, Shopify, or PayPal later to collect payments.`);
  });
}

function addItemToCart(item) {
  const existing = cart.find((cartItem) => cartItem.name === item.name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
      name: item.name,
      price: item.price,
      image: item.image,
      qty: 1
    });
  }

  updateCart();
  showToast("Added to cart ✓");
}

function changeQuantity(id, direction) {
  const item = cart.find((cartItem) => cartItem.id === id);
  if (!item) return;

  item.qty += direction;

  if (item.qty <= 0) {
    cart = cart.filter((cartItem) => cartItem.id !== id);
    showToast("Removed from cart");
  } else {
    showToast(direction > 0 ? "Quantity increased" : "Quantity decreased");
  }

  updateCart();
}

function removeItem(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCart();
  showToast("Removed from cart");
}

function updateCart() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (cartCount) cartCount.textContent = totalQty;
  if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
  if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;

  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
    return;
  }

  cartItems.innerHTML = cart.map((item) => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-top">
          <div>
            <h4>${item.name}</h4>
            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
          </div>
          <button class="remove-item" data-id="${item.id}" aria-label="Remove ${item.name}">×</button>
        </div>

        <div class="qty-row">
          <div class="qty-controls">
            <button class="qty-btn minus" data-id="${item.id}" aria-label="Decrease ${item.name}">−</button>
            <span class="qty-number">${item.qty}</span>
            <button class="qty-btn plus" data-id="${item.id}" aria-label="Increase ${item.name}">+</button>
          </div>
          <strong>$${(item.price * item.qty).toFixed(2)}</strong>
        </div>
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".qty-btn.plus").forEach((button) => {
    button.addEventListener("click", () => changeQuantity(button.dataset.id, 1));
  });

  document.querySelectorAll(".qty-btn.minus").forEach((button) => {
    button.addEventListener("click", () => changeQuantity(button.dataset.id, -1));
  });

  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", () => removeItem(button.dataset.id));
  });
}

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1700);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

document.querySelectorAll("[data-tilt]").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -7;
    const rotateY = ((x / rect.width) - 0.5) * 7;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

updateCart();
