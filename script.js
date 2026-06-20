
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  const searchBtn = document.getElementById("searchBtn");
  const searchPanel = document.getElementById("searchPanel");
  const closeSearch = document.getElementById("closeSearch");

  const cartBtn = document.getElementById("cartBtn");
  const cartDrawer = document.getElementById("cartDrawer");
  const closeCart = document.getElementById("closeCart");
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");

  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalPrice = document.getElementById("modalPrice");
  const modalImg = document.getElementById("modalImg") || document.querySelector(".modal-img");
  const addCart = document.getElementById("addCart");

  const toast = document.getElementById("toast");

  let cart = [];
  let currentProduct = null;

  menuToggle?.addEventListener("click", () => {
    navMenu?.classList.toggle("show");
  });

  searchBtn?.addEventListener("click", () => {
    searchPanel?.classList.add("show");
  });

  closeSearch?.addEventListener("click", () => {
    searchPanel?.classList.remove("show");
  });

  cartBtn?.addEventListener("click", () => {
    cartDrawer?.classList.add("show");
  });

  closeCart?.addEventListener("click", () => {
    cartDrawer?.classList.remove("show");
  });

  document.querySelectorAll(".heart").forEach((heart) => {
    heart.addEventListener("click", () => {
      heart.classList.toggle("liked");
      heart.textContent = heart.classList.contains("liked") ? "♥" : "♡";
    });
  });

  document.querySelectorAll(".details:not(.add-to-cart)").forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.dataset.product || "The Oasis Product";
      const priceText = button.dataset.price || "$0.00";
      const price = Number(priceText.replace("$", "")) || 0;
      const isShirt = name.toLowerCase().includes("shirt");
      const image = isShirt ? "oasis-tshirt-model.png" : "oasis-design-reference.png";

      currentProduct = { name, price, image };

      if (modalTitle) modalTitle.textContent = name;
      if (modalPrice) modalPrice.textContent = `$${price.toFixed(2)}`;

      if (modalImg) {
        modalImg.classList.toggle("show-shirt", isShirt);
        modalImg.classList.toggle("show-tumbler", !isShirt);
      }

      modal?.classList.add("show");
    });
  });

  closeModal?.addEventListener("click", () => {
    modal?.classList.remove("show");
  });

  modal?.addEventListener("click", (event) => {
    if (event.target === modal) modal.classList.remove("show");
  });

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      addItemToCart({
        name: button.dataset.product || "The Oasis Product",
        price: Number(button.dataset.price) || 0,
        image: button.dataset.image || "oasis-design-reference.png"
      });

      cartDrawer?.classList.add("show");
    });
  });

  addCart?.addEventListener("click", () => {
    if (!currentProduct) return;

    addItemToCart(currentProduct);
    modal?.classList.remove("show");
    cartDrawer?.classList.add("show");
  });

  checkoutBtn?.addEventListener("click", () => {
    if (!cart.length) {
      showToast("Your cart is empty");
      return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    alert(`Checkout coming soon!\n\nTotal: $${total.toFixed(2)}`);
  });

  function addItemToCart(product) {
    const existing = cart.find((item) => item.name === product.name);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: Date.now() + Math.random(),
        name: product.name,
        price: product.price,
        image: product.image,
        qty: 1
      });
    }

    updateCart();
    showToast("Added to cart ✓");
  }

  function increaseQuantity(id) {
    const item = cart.find((item) => item.id == id);
    if (!item) return;

    item.qty += 1;
    updateCart();
  }

  function decreaseQuantity(id) {
    const item = cart.find((item) => item.id == id);
    if (!item) return;

    item.qty -= 1;

    if (item.qty <= 0) {
      cart = cart.filter((item) => item.id != id);
    }

    updateCart();
  }

  function removeItem(id) {
    cart = cart.filter((item) => item.id != id);
    updateCart();
  }

  function updateCart() {
    const itemCount = cart.reduce((total, item) => total + item.qty, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    if (cartCount) cartCount.textContent = itemCount;
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
      button.addEventListener("click", () => increaseQuantity(button.dataset.id));
    });

    document.querySelectorAll(".qty-btn.minus").forEach((button) => {
      button.addEventListener("click", () => decreaseQuantity(button.dataset.id));
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
    }, 1600);
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });

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
});
