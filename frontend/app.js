const API_URL =
  "https://zcbix27iq9.execute-api.us-east-1.amazonaws.com";

/* ===== MENU DATA ===== */

const menuItems = [
  {
    id: "food-001",
    name: "Lẩu Thái Hải Sản",
    category: "Món chính",
    price: 289000,
    description:
      "Vị chua cay, dùng kèm tôm, mực và rau tươi.",
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
    description:
      "Cơm chiên cùng tôm, mực, trứng và rau củ.",
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
    description:
      "Trà đào thanh mát, dùng kèm lát đào ngâm.",
    image: "images/tradao.jpg",
  },
  {
    id: "drink-002",
    name: "Nước Cam",
    category: "Đồ uống",
    price: 45000,
    description:
      "Nước cam tươi, vị chua ngọt tự nhiên.",
    image: "images/nuoccam.jpg",
  },
  {
    id: "drink-003",
    name: "Nước Lọc",
    category: "Đồ uống",
    price: 10000,
    description:
      "Nước suối tinh khiết, phục vụ mát lạnh.",
    image: "images/nuocloc.jpg",
  },
  {
    id: "drink-004",
    name: "Trà Đá",
    category: "Đồ uống",
    price: 3000,
    description:
      "Trà đá thanh mát, dùng kèm theo bữa ăn.",
    image: "images/trada.jpg",
  },
  {
    id: "dessert-001",
    name: "Panna Cotta",
    category: "Tráng miệng",
    price: 49000,
    description:
      "Panna cotta mềm mịn, dùng cùng sốt dâu.",
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

/* ===== TABLE ACCESS FROM QR ===== */

const allowedTables = [
  "01",
  "02",
  "03",
  "04",
  "05",
];

const urlParams =
  new URLSearchParams(window.location.search);

const rawTableParam =
  urlParams.get("table");

function normalizeTableNumber(value) {
  if (!value) {
    return null;
  }

  const trimmedValue =
    String(value).trim();

  if (!/^\d+$/.test(trimmedValue)) {
    return null;
  }

  return trimmedValue.padStart(2, "0");
}

const normalizedTableNumber =
  normalizeTableNumber(rawTableParam);

const tableNumber =
  allowedTables.includes(normalizedTableNumber)
    ? normalizedTableNumber
    : null;

/* ===== APPLICATION STATE ===== */

let selectedCategory = "Tất cả";
let cart = [];
let isSubmittingOrder = false;

/* ===== DOM ELEMENTS ===== */

const qrRequiredScreen =
  document.querySelector(
    "#qr-required-screen"
  );

const appContent =
  document.querySelector(
    "#app-content"
  );

const tableLabel =
  document.querySelector(
    "#table-label"
  );

const cartTableLabel =
  document.querySelector(
    "#cart-table-label"
  );

const menuList =
  document.querySelector(
    "#menu-list"
  );

const menuCount =
  document.querySelector(
    "#menu-count"
  );

const searchInput =
  document.querySelector(
    "#search-input"
  );

const categoryList =
  document.querySelector(
    "#category-list"
  );

const cartButton =
  document.querySelector(
    "#cart-button"
  );

const cartCount =
  document.querySelector(
    "#cart-count"
  );

const cartPanel =
  document.querySelector(
    "#cart-panel"
  );

const closeCartButton =
  document.querySelector(
    "#close-cart"
  );

const overlay =
  document.querySelector(
    "#overlay"
  );

const cartItems =
  document.querySelector(
    "#cart-items"
  );

const cartTotal =
  document.querySelector(
    "#cart-total"
  );

const submitOrderButton =
  document.querySelector(
    "#submit-order"
  );

const toast =
  document.querySelector(
    "#toast"
  );

/* ===== ACCESS CONTROL ===== */

function validateTableAccess() {
  if (!tableNumber) {
    qrRequiredScreen.classList.add(
      "visible"
    );

    appContent.classList.add(
      "hidden"
    );

    return false;
  }

  qrRequiredScreen.classList.remove(
    "visible"
  );

  appContent.classList.remove(
    "hidden"
  );

  return true;
}

function updateTableLabels() {
  const label =
    `Bàn số ${tableNumber}`;

  tableLabel.textContent = label;
  cartTableLabel.textContent = label;
}

/* ===== HELPER FUNCTIONS ===== */

function formatCurrency(value) {
  const formattedValue =
    new Intl.NumberFormat("vi-VN").format(
      Number(value) || 0
    );

  return `${formattedValue} VND`;
}

function showToast(message) {
  toast.textContent = message;

  toast.classList.add(
    "visible"
  );

  window.setTimeout(() => {
    toast.classList.remove(
      "visible"
    );
  }, 2200);
}

/* ===== CATEGORY FUNCTIONS ===== */

function getCategories() {
  return [
    "Tất cả",
    ...new Set(
      menuItems.map(
        (item) => item.category
      )
    ),
  ];
}

function renderCategories() {
  categoryList.innerHTML =
    getCategories()
      .map(
        (category) => `
          <button
            type="button"
            class="category-button ${
              category === selectedCategory
                ? "active"
                : ""
            }"
            data-category="${category}"
          >
            ${category}
          </button>
        `
      )
      .join("");
}

/* ===== MENU FUNCTIONS ===== */

function getFilteredMenu() {
  const keyword =
    searchInput.value
      .trim()
      .toLowerCase();

  return menuItems.filter(
    (item) => {
      const matchesCategory =
        selectedCategory === "Tất cả" ||
        item.category ===
          selectedCategory;

      const matchesSearch =
        item.name
          .toLowerCase()
          .includes(keyword) ||
        item.description
          .toLowerCase()
          .includes(keyword);

      return (
        matchesCategory &&
        matchesSearch
      );
    }
  );
}

function renderMenu() {
  const filteredItems =
    getFilteredMenu();

  menuCount.textContent =
    `${filteredItems.length} món`;

  if (
    filteredItems.length === 0
  ) {
    menuList.innerHTML = `
      <p class="empty-cart">
        Không tìm thấy món phù hợp.
      </p>
    `;

    return;
  }

  menuList.innerHTML =
    filteredItems
      .map(
        (item) => `
          <article class="menu-card">
            <img
              src="${item.image}"
              alt="${item.name}"
              loading="lazy"
            />

            <div class="menu-content">
              <p class="eyebrow">
                ${item.category}
              </p>

              <h3>
                ${item.name}
              </h3>

              <p class="menu-description">
                ${item.description}
              </p>

              <div class="menu-footer">
                <span class="price">
                  ${formatCurrency(
                    item.price
                  )}
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

/* ===== CART FUNCTIONS ===== */

function addToCart(itemId) {
  const menuItem =
    menuItems.find(
      (item) =>
        item.id === itemId
    );

  if (!menuItem) {
    return;
  }

  const existingItem =
    cart.find(
      (item) =>
        item.id === itemId
    );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...menuItem,
      quantity: 1,
    });
  }

  renderCart();

  showToast(
    `Đã thêm ${menuItem.name} vào giỏ`
  );
}

function updateQuantity(
  itemId,
  change
) {
  const cartItem =
    cart.find(
      (item) =>
        item.id === itemId
    );

  if (!cartItem) {
    return;
  }

  cartItem.quantity += change;

  if (
    cartItem.quantity <= 0
  ) {
    cart = cart.filter(
      (item) =>
        item.id !== itemId
    );
  }

  renderCart();
}

function getCartQuantity() {
  return cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );
}

function getCartTotal() {
  return cart.reduce(
    (total, item) =>
      total +
      item.price *
        item.quantity,
    0
  );
}

function renderCart() {
  cartCount.textContent =
    getCartQuantity();

  cartTotal.textContent =
    formatCurrency(
      getCartTotal()
    );

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <p class="empty-cart">
        Giỏ hàng đang trống.
      </p>
    `;

    submitOrderButton.disabled =
      true;

    return;
  }

  submitOrderButton.disabled =
    isSubmittingOrder;

  cartItems.innerHTML =
    cart
      .map(
        (item) => `
          <div class="cart-item">
            <div>
              <h4>
                ${item.name}
              </h4>

              <p>
                ${formatCurrency(
                  item.price *
                    item.quantity
                )}
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

              <span>
                ${item.quantity}
              </span>

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
  cartPanel.classList.add(
    "open"
  );

  overlay.classList.add(
    "visible"
  );
}

function closeCart() {
  cartPanel.classList.remove(
    "open"
  );

  overlay.classList.remove(
    "visible"
  );
}

/* ===== SUBMIT ORDER ===== */

async function submitOrder() {
  if (!tableNumber) {
    return;
  }

  if (
    cart.length === 0 ||
    isSubmittingOrder
  ) {
    return;
  }

  const order = {
    orderId:
      `ORD-${Date.now()}`,

    tableNumber,

    items: cart.map(
      (item) => ({
        itemId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })
    ),

    totalAmount:
      getCartTotal(),

    status: "PENDING",

    createdAt:
      new Date().toISOString(),
  };

  isSubmittingOrder = true;

  submitOrderButton.disabled =
    true;

  submitOrderButton.textContent =
    "Đang gửi đơn...";

  try {
    const response =
      await fetch(
        `${API_URL}/order`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body:
            JSON.stringify(order),
        }
      );

    let result = {};

    try {
      result =
        await response.json();
    } catch (parseError) {
      result = {};
    }

    if (!response.ok) {
      throw new Error(
        result.message ||
          `Máy chủ trả về lỗi ${response.status}`
      );
    }

    localStorage.setItem(
      "cloudmenu-order",
      JSON.stringify(order)
    );

    cart = [];

    renderCart();
    closeCart();

    window.location.href =
  `order.html?table=${encodeURIComponent(
    tableNumber
  )}&orderId=${encodeURIComponent(
    order.orderId
  )}`;

    showToast(
      error.message ||
        "Không thể gửi đơn hàng"
    );
  } finally {
    isSubmittingOrder = false;

    submitOrderButton.textContent =
      "Gửi đơn gọi món";

    renderCart();
  }
}

/* ===== EVENT LISTENERS ===== */

categoryList.addEventListener(
  "click",
  (event) => {
    const button =
      event.target.closest(
        "[data-category]"
      );

    if (!button) {
      return;
    }

    selectedCategory =
      button.dataset.category;

    renderCategories();
    renderMenu();
  }
);

menuList.addEventListener(
  "click",
  (event) => {
    const button =
      event.target.closest(
        "[data-add-item]"
      );

    if (!button) {
      return;
    }

    addToCart(
      button.dataset.addItem
    );
  }
);

cartItems.addEventListener(
  "click",
  (event) => {
    const button =
      event.target.closest(
        "[data-change]"
      );

    if (!button) {
      return;
    }

    updateQuantity(
      button.dataset.itemId,
      Number(
        button.dataset.change
      )
    );
  }
);

searchInput.addEventListener(
  "input",
  renderMenu
);

cartButton.addEventListener(
  "click",
  openCart
);

closeCartButton.addEventListener(
  "click",
  closeCart
);

overlay.addEventListener(
  "click",
  closeCart
);

submitOrderButton.addEventListener(
  "click",
  submitOrder
);

document.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Escape") {
      closeCart();
    }
  }
);

/* ===== INITIALIZATION ===== */

const hasValidTable =
  validateTableAccess();

if (hasValidTable) {
  updateTableLabels();
  renderCategories();
  renderMenu();
  renderCart();
}