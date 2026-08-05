const menuItems = [
  {
    id: "food-001",
    name: "Lẩu Thái Hải Sản",
    category: "Món chính",
    price: 289000,
    description: "Vị chua cay, dùng kèm tôm, mực và rau tươi.",
    image: "images/Lauthaihaisan.png",
  },
  {
    id: "food-002",
    name: "Bò Cuộn Nấm",
    category: "Món chính",
    price: 99000,
    description:
      "Thịt bò mềm cuộn nấm kim châm, dùng kèm sốt đặc biệt.",
    image: "images/bocuonnam.jpg",
  },
  {
    id: "food-003",
    name: "Cơm Chiên Hải Sản",
    category: "Món chính",
    price: 79000,
    description: "Cơm chiên cùng tôm, mực, trứng và rau củ.",
    image: "images/comchienhaisan.jpg",
  },
  {
    id: "food-004",
    name: "Cơm Tấm",
    category: "Món chính",
    price: 45000,
    description:
      "Cơm tấm sườn nướng ăn kèm bì, chả và đồ chua.",
    image: "images/comtam.jpg",
  },
  {
    id: "food-005",
    name: "Bún Bò Huế",
    category: "Món chính",
    price: 50000,
    description:
      "Bún bò Huế đậm đà với thịt bò, chả và nước dùng cay nhẹ.",
    image: "images/bunboHue.jpg",
  },
  {
    id: "drink-001",
    name: "Trà Đào",
    category: "Đồ uống",
    price: 39000,
    description: "Trà đào thanh mát, dùng kèm lát đào ngâm.",
    image: "images/tradao.jpg",
  },
  {
    id: "drink-002",
    name: "Nước Cam",
    category: "Đồ uống",
    price: 45000,
    description: "Nước cam tươi, vị chua ngọt tự nhiên.",
    image: "images/nuoccam.jpg",
  },
  {
    id: "drink-003",
    name: "Nước Lọc",
    category: "Đồ uống",
    price: 10000,
    description: "Nước suối tinh khiết, phục vụ mát lạnh.",
    image: "images/nuocloc.jpg",
  },
  {
    id: "drink-004",
    name: "Trà Đá",
    category: "Đồ uống",
    price: 3000,
    description: "Trà đá thanh mát, dùng kèm theo bữa ăn.",
    image: "images/trada.jpg",
  },
  {
    id: "dessert-001",
    name: "Panna Cotta",
    category: "Tráng miệng",
    price: 49000,
    description: "Panna cotta mềm mịn, dùng cùng sốt dâu.",
    image: "images/pannacotta.jpg",
  },
  {
    id: "dessert-002",
    name: "Kem Xoài Sữa Chua",
    category: "Tráng miệng",
    price: 25000,
    description:
      "Kem xoài kết hợp sữa chua mát lạnh, thơm béo và thanh vị.",
    image: "images/kemxoaisuachua.jpg",
  },
  {
    id: "dessert-003",
    name: "Thạch Rau Câu",
    category: "Tráng miệng",
    price: 20000,
    description:
      "Thạch rau câu giòn mát, nhiều màu sắc hấp dẫn.",
    image: "images/thachraucau.jpg",
  },
  {
    id: "dessert-004",
    name: "Bánh Flan",
    category: "Tráng miệng",
    price: 15000,
    description:
      "Bánh flan mềm mịn, thơm vị trứng sữa và caramel.",
    image: "images/banhflan.jpg",
  },
];

/* ===== TRẠNG THÁI ỨNG DỤNG ===== */

let selectedCategory = "Tất cả";
let cart = [];
let isSubmittingOrder = false;

/* ===== LẤY CÁC PHẦN TỬ HTML ===== */

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

/* ===== HÀM HỖ TRỢ ===== */

function formatCurrency(value) {
  const formattedValue = new Intl.NumberFormat("vi-VN").format(
    Number(value) || 0
  );

  return `${formattedValue} VND`;
}

function showToast(message) {
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add("visible");

  window.setTimeout(() => {
    toast.classList.remove("visible");
  }, 2000);
}

/* ===== DANH MỤC ===== */

function getCategories() {
  const categories = menuItems.map((item) => item.category);

  return ["Tất cả", ...new Set(categories)];
}

function renderCategories() {
  if (!categoryList) {
    return;
  }

  categoryList.innerHTML = getCategories()
    .map(
      (category) => `
        <button
          type="button"
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

/* ===== THỰC ĐƠN ===== */

function getFilteredMenu() {
  const keyword = searchInput
    ? searchInput.value.trim().toLowerCase()
    : "";

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
  if (!menuList || !menuCount) {
    return;
  }

  const filteredItems = getFilteredMenu();

  menuCount.textContent = `${filteredItems.length} món`;

  if (filteredItems.length === 0) {
    menuList.innerHTML = `
      <p class="empty-cart">
        Không tìm thấy món phù hợp.
      </p>
    `;

    return;
  }

  menuList.innerHTML = filteredItems
    .map(
      (item) => `
        <article class="menu-card">
          <img
            src="${item.image}"
            alt="${item.name}"
            loading="lazy"
          />

          <div class="menu-content">
            <p class="eyebrow">${item.category}</p>

            <h3>${item.name}</h3>

            <p class="menu-description">
              ${item.description}
            </p>

            <div class="menu-footer">
              <span class="price">
                ${formatCurrency(item.price)}
              </span>

              <button
                type="button"
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
}

/* ===== GIỎ HÀNG ===== */

function addToCart(itemId) {
  const menuItem = menuItems.find((item) => item.id === itemId);

  if (!menuItem) {
    return;
  }

  const existingItem = cart.find((item) => item.id === itemId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...menuItem,
      quantity: 1,
    });
  }

  renderCart();
  showToast(`Đã thêm ${menuItem.name} vào giỏ`);
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
  return cart.reduce(
    (totalQuantity, item) => totalQuantity + item.quantity,
    0
  );
}

function getCartTotal() {
  return cart.reduce(
    (totalPrice, item) =>
      totalPrice + item.price * item.quantity,
    0
  );
}

function renderCart() {
  if (
    !cartCount ||
    !cartTotal ||
    !cartItems ||
    !submitOrderButton
  ) {
    return;
  }

  cartCount.textContent = getCartQuantity();
  cartTotal.textContent = formatCurrency(getCartTotal());

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <p class="empty-cart">
        Giỏ hàng đang trống.
      </p>
    `;

    submitOrderButton.disabled = true;
    return;
  }

  submitOrderButton.disabled = isSubmittingOrder;

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <div>
            <h4>${item.name}</h4>

            <p>
              ${formatCurrency(item.price * item.quantity)}
            </p>
          </div>

          <div class="quantity-controls">
            <button
              type="button"
              data-change="-1"
              data-item-id="${item.id}"
              aria-label="Giảm số lượng ${item.name}"
            >
              −
            </button>

            <span>${item.quantity}</span>

            <button
              type="button"
              data-change="1"
              data-item-id="${item.id}"
              aria-label="Tăng số lượng ${item.name}"
            >
              +
            </button>
          </div>
        </div>
      `
    )
    .join("");
}

function openCart() {
  if (!cartPanel || !overlay) {
    return;
  }

  cartPanel.classList.add("open");
  overlay.classList.add("visible");
}

function closeCart() {
  if (!cartPanel || !overlay) {
    return;
  }

  cartPanel.classList.remove("open");
  overlay.classList.remove("visible");
}

/* ===== GỬI ĐƠN LÊN AWS ===== */

async function submitOrder() {
  if (
    cart.length === 0 ||
    isSubmittingOrder ||
    !submitOrderButton
  ) {
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

  isSubmittingOrder = true;
  submitOrderButton.disabled = true;
  submitOrderButton.textContent = "Đang gửi đơn...";

  try {
    const response = await fetch(
      "https://zcbix27iq9.execute-api.us-east-1.amazonaws.com/order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(order),
      }
    );

    let result = {};

    try {
      result = await response.json();
    } catch (parseError) {
      result = {};
    }

    if (!response.ok) {
      throw new Error(
        result.message ||
          `Không thể gửi đơn. Mã lỗi: ${response.status}`
      );
    }

    /*
      Giữ một bản đơn hàng trong localStorage
      để order.html có thể hiển thị ngay.
    */
    localStorage.setItem(
      "cloudmenu-order",
      JSON.stringify(order)
    );

    cart = [];
    renderCart();
    closeCart();

    window.location.href = "order.html";
  } catch (error) {
    console.error("SUBMIT ORDER ERROR:", error);

    showToast(
      error.message || "Không thể gửi đơn hàng"
    );
  } finally {
    isSubmittingOrder = false;

    submitOrderButton.textContent = "Gửi đơn gọi món";

    renderCart();
  }
}

/* ===== SỰ KIỆN DANH MỤC ===== */

if (categoryList) {
  categoryList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");

    if (!button) {
      return;
    }

    selectedCategory = button.dataset.category;

    renderCategories();
    renderMenu();
  });
}

/* ===== SỰ KIỆN THÊM MÓN ===== */

if (menuList) {
  menuList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-add-item]");

    if (!button) {
      return;
    }

    addToCart(button.dataset.addItem);
  });
}

/* ===== SỰ KIỆN THAY ĐỔI SỐ LƯỢNG ===== */

if (cartItems) {
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
}

/* ===== CÁC SỰ KIỆN KHÁC ===== */

if (searchInput) {
  searchInput.addEventListener("input", renderMenu);
}

if (cartButton) {
  cartButton.addEventListener("click", openCart);
}

if (closeCartButton) {
  closeCartButton.addEventListener("click", closeCart);
}

if (overlay) {
  overlay.addEventListener("click", closeCart);
}

if (submitOrderButton) {
  submitOrderButton.addEventListener("click", submitOrder);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
  }
});

/* ===== KHỞI TẠO GIAO DIỆN ===== */

renderCategories();
renderMenu();
renderCart();