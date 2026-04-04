// Sample products
const products = [
  { id: 1, name: "Wireless Headphones", price: 1200, img: "https://via.placeholder.com/220x200?text=Headphones" },
  { id: 2, name: "Smart Watch", price: 2000, img: "https://via.placeholder.com/220x200?text=Smart+Watch" },
  { id: 3, name: "Bluetooth Speaker", price: 1500, img: "https://via.placeholder.com/220x200?text=Speaker" },
  { id: 4, name: "Laptop Bag", price: 900, img: "https://via.placeholder.com/220x200?text=Laptop+Bag" },
  { id: 5, name: "Gaming Mouse", price: 700, img: "https://via.placeholder.com/220x200?text=Mouse" },
];

const productList = document.getElementById("product-list");
const cartModal = document.getElementById("cart-modal");
const cartBtn = document.getElementById("cart-btn");
const closeCart = document.getElementById("close-cart");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");

let cart = [];

// Display products
products.forEach(product => {
  const div = document.createElement("div");
  div.classList.add("product");
  div.innerHTML = `
    <img src="${product.img}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p>₹${product.price}</p>
    <button onclick="addToCart(${product.id})">Add to Cart</button>
  `;
  productList.appendChild(div);
});

// Add to cart
function addToCart(id) {
  const item = products.find(p => p.id === id);
  const existing = cart.find(p => p.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  updateCart();
}

// Update cart display
function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} x${item.qty}
      <span>₹${item.price * item.qty}</span>
    `;
    cartItems.appendChild(li);
  });

  cartTotal.textContent = total;
  cartCount.textContent = cart.length;
}

// Open and close cart modal
cartBtn.addEventListener("click", () => {
  cartModal.style.display = "flex";
});

closeCart.addEventListener("click", () => {
  cartModal.style.display = "none";
});