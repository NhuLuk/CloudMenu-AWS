const menuItems = [
  {
    id: "food-001",
    name: "Lẩu Thái Hải Sản",
    category: "Món chính",
    price: 289000,
    description: "Vị chua cay, dùng kèm tôm, mực và rau tươi.",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "food-002",
    name: "Bò Cuộn Nấm",
    category: "Món chính",
    price: 99000,
    description: "Thịt bò mềm cuộn nấm kim châm, dùng kèm sốt đặc biệt.",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "food-003",
    name: "Cơm Chiên Hải Sản",
    category: "Món chính",
    price: 79000,
    description: "Cơm chiên cùng tôm, mực, trứng và rau củ.",
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "drink-001",
    name: "Trà Đào",
    category: "Đồ uống",
    price: 39000,
    description: "Trà đào thanh mát, dùng kèm lát đào ngâm.",
    image:
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "drink-002",
    name: "Nước Cam",
    category: "Đồ uống",
    price: 45000,
    description: "Nước cam tươi, vị chua ngọt tự nhiên.",
    image:
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "dessert-001",
    name: "Panna Cotta",
    category: "Tráng miệng",
    price: 49000,
    description: "Panna cotta mềm mịn, dùng cùng sốt dâu.",
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80",
  },
];

let selectedCategory = "Tất cả";
let cart = [];

const menuList = document.querySelector("#menu-list");
const menuCount = document.querySelector("#menu-count");
const searchInput = document.querySelector("#search-input");
const categoryList = document.querySelector("#category-list");
const cartButton = document.querySelector("#cart-button");
const cartCount = document.querySelector("#cart-count");
const cartPanel = document.querySelector("#cart-panel");
const closeCartButton = document.querySelector("#close-cart");
const overlay = document.querySelector("#overlay");
const cartItems = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const submitOrderButton = document.querySelector("#submit-order");
const toast = document.querySelector("#toast");

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

function getCategories() {
  return ["Tất cả", ...new Set(menuItems.map((item) => item.category))];
}

function renderCategories() {
  categoryList.innerHTML = getCategories()
    .map(
      (category) => `
        <button
          class="category-button ${
            category === selectedCategory ? "active" : ""
          }"
          data-category="${category}"
        >
          ${category}
        </button>
      `
    )
    .join("");
}

function getFilteredMenu() {
  const keyword = searchInput.value.trim().toLowerCase();

  return menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "Tất cả" ||
      item.category === selectedCategory;

    const matchesSearch =
      item.name.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword);

    return matchesCategory && matchesSearch;
  });
}

function renderMenu() {
  const filteredItems = getFilteredMenu();

  menuCount.textContent = `${filteredItems.length} món`;

  menuList.innerHTML = filteredItems
    .map(
      (item) => `
        <article class="menu-card">
          <img src="${item.image}" alt="${item.name}" />

          <div class="menu-content">
            <p class="eyebrow">${item.category}</p>
            <h3>${item.name}</h3>
            <p class="menu-description">${item.description}</p>

            <div class="menu-footer">
              <span class="price">${formatCurrency(item.price)}</span>

              <button
                class="add-button"
                data-add-item="${item.id}"
              >
                Thêm món
              </button>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  if (filteredItems.length === 0) {
    menuList.innerHTML =
      '<p class="empty-cart">Không tìm thấy món phù hợp.</p>';
  }
}

function addToCart(itemId) {
  const existingItem = cart.find((item) => item.id === itemId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const menuItem = menuItems.find((item) => item.id === itemId);

    cart.push({
      ...menuItem,
      quantity: 1,
    });
  }

  renderCart();
  showToast("Đã thêm món vào giỏ");
}

function updateQuantity(itemId, change) {
  const item = cart.find((cartItem) => cartItem.id === itemId);

  if (!item) {
    return;
  }

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter((cartItem) => cartItem.id !== itemId);
  }

  renderCart();
}

function getCartQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal() {
  return cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}

function renderCart() {
  cartCount.textContent = getCartQuantity();
  cartTotal.textContent = formatCurrency(getCartTotal());

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p class="empty-cart">Giỏ hàng đang trống.</p>';
    submitOrderButton.disabled = true;
    return;
  }

  submitOrderButton.disabled = false;

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <div>
            <h4>${item.name}</h4>
            <p>${formatCurrency(item.price * item.quantity)}</p>
          </div>

          <div class="quantity-controls">
            <button data-change="-1" data-item-id="${item.id}">−</button>
            <span>${item.quantity}</span>
            <button data-change="1" data-item-id="${item.id}">+</button>
          </div>
        </div>
      `
    )
    .join("");
}

function openCart() {
  cartPanel.classList.add("open");
  overlay.classList.add("visible");
}

function closeCart() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("visible");
}

async function submitOrder() {
  if (cart.length === 0) {
    return;
  }

  const order = {
    orderId: `ORD-${Date.now()}`,
    tableNumber: "05",
    items: cart.map((item) => ({
      itemId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
    totalAmount: getCartTotal(),
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };

  try {
    const response = await fetch(
      "https://zcbix27iq9.execute-api.us-east-1.amazonaws.com/order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      }
    );

    const result = await response.json();
    console.log("API Response:", result);

    if (!response.ok) {
      throw new Error(result.message || "Đặt món thất bại");
    }

    // Vẫn lưu local để order.html hiển thị
    localStorage.setItem(
      "cloudmenu-order",
      JSON.stringify(order)
    );

    cart = [];
    renderCart();
    closeCart();

    window.location.href = "order.html";

  } catch (error) {
    console.error(error);
    alert("Không thể gửi đơn hàng!");
  }
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");

  window.setTimeout(() => {
    toast.classList.remove("visible");
  }, 2000);
}

categoryList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");

  if (!button) {
    return;
  }

  selectedCategory = button.dataset.category;
  renderCategories();
  renderMenu();
});

menuList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add-item]");

  if (!button) {
    return;
  }

  addToCart(button.dataset.addItem);
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-change]");

  if (!button) {
    return;
  }

  updateQuantity(
    button.dataset.itemId,
    Number(button.dataset.change)
  );
});

searchInput.addEventListener("input", renderMenu);
cartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
submitOrderButton.addEventListener("click", submitOrder);

renderCategories();
renderMenu();
renderCart();