// Base URL for API
const API_URL = 'http://localhost:5000/api';
const img1="./images/Product1.jpg";

// DOM elements
const productsContainer = document.getElementById('products');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');
const checkoutBtn = document.getElementById('checkout');
const emptyCartMessage = document.getElementById('empty-cart-message');

// Initialize the application
async function init() {
  // Check if user is logged in
  checkAuth();

  // Initialize based on current page
  const currentPage = window.location.pathname;

  if (currentPage.includes('products.html') || currentPage === '/' || currentPage.includes('index.html')) {
    await loadProducts();
    setupProductEventListeners();
  }

  if (currentPage.includes('cart.html')) {
    updateCartDisplay();
    setupCartEventListeners();
  }

  if (currentPage.includes('checkout.html')) {
    updateOrderSummary();
    setupCheckoutEventListeners();
  }
}

// Define products array at the top of script.js
let products = [
    {
      _id: '1',
      name: 'Product 1',
      price: 29.99,
      image: img1,
      description: 'This is product 1'
    },
    {
      _id: '2',
      name: 'Product 2',
      price: 19.99,
      image: "./images/Product2.jpg",
      description: 'This is product 2'
    },
    {
        _id: '3',
        name: 'Product 3',
        price: 19.99,
        image: "./images/Product3.jpg",
        description: 'This is product 3'
      },
      {
        _id: '4',
        name: 'Product 4',
        price: 19.99,
        image: "./images/Product4.jpg",
        description: 'This is product 4'
      },
    // Add more products as needed
  ];
  

// Check if user is authenticated
function checkAuth() {
  const token = localStorage.getItem('token');
  const userInfo = document.getElementById('user-info');

  if (token && userInfo) {
    const user = JSON.parse(localStorage.getItem('user'));
    userInfo.innerHTML = `
      <span>Welcome, ${user.name}</span>
      <button id="logout-btn">Logout</button>
    `;
    
    document.getElementById('logout-btn').addEventListener('click', logout);
  }
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

// Load products from API
async function loadProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    const products = await response.json();
    
    if (products.length > 0) {
      // Store products in localStorage for quick access
      localStorage.setItem('products', JSON.stringify(products));
      
      // Render products
      renderProducts(products);
    }
  } catch (error) {
    console.error('Error loading products:', error);
    console.log('Using local product data');
    renderProducts(products); 
  }
}

// Render products to DOM
function renderProducts(products) {
  if (!productsContainer) return;
  
  productsContainer.innerHTML = '';
  
  products.forEach(product => {
    const productEl = document.createElement('div');
    productEl.classList.add('product');
    productEl.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <button data-id="${product._id}">Add to Cart</button>
    `;
    productsContainer.appendChild(productEl);
  });
}

// Add product to cart
function addToCart(productId) {
  // Get products and cart from localStorage
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  // Find the product
  const product = products.find(p => p._id === productId);
  
  if (!product) {
    console.error(`Product with ID ${productId} not found`);
    return;
  }
  
  // Check if product is already in cart
  const existingItem = cart.find(item => item._id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }
  
  // Save updated cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Show confirmation message
  alert(`${product.name} added to cart!`);
}

// Update cart display
function updateCartDisplay() {
  if (!cartItems || !cartTotal) return;
  
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  if (cart.length === 0) {
    if (emptyCartMessage) {
      emptyCartMessage.style.display = 'block';
    }
    cartItems.innerHTML = '';
    cartTotal.textContent = 'Total: $0.00';
    return;
  }
  
  if (emptyCartMessage) {
    emptyCartMessage.style.display = 'none';
  }
  
  cartItems.innerHTML = '';
  let total = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    const li = document.createElement('li');
    li.innerHTML = `
      <div>
        <img src="${item.image}" alt="${item.name}" width="50">
        <span>${item.name} - $${item.price.toFixed(2)} x ${item.quantity}</span>
      </div>
      <div>
        <button class="quantity-btn" data-id="${item._id}" data-action="decrease">-</button>
        <span>${item.quantity}</span>
        <button class="quantity-btn" data-id="${item._id}" data-action="increase">+</button>
        <button class="remove-btn" data-id="${item._id}">Remove</button>
      </div>
    `;
    cartItems.appendChild(li);
  });
  
  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Update the order summary on checkout page
function updateOrderSummary() {
  const orderSummary = document.getElementById('order-summary');
  if (!orderSummary) return;
  
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const summaryItems = document.getElementById('summary-items');
  const summaryTotal = document.getElementById('summary-total');
  
  summaryItems.innerHTML = '';
  let total = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    const li = document.createElement('li');
    li.textContent = `${item.name} x ${item.quantity} - $${itemTotal.toFixed(2)}`;
    summaryItems.appendChild(li);
  });
  
  summaryTotal.textContent = `$${total.toFixed(2)}`;
}

// Filter and sort products
function filterProducts() {
  if (!searchInput || !sortSelect) return;
  
  const searchText = searchInput.value.toLowerCase();
  const sortValue = sortSelect.value;
  const products = JSON.parse(localStorage.getItem('products') || '[]');
  
  let filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchText)
  );

  if (sortValue === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortValue === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }
  
  renderProducts(filteredProducts);
}

// Set up event listeners for product page
function setupProductEventListeners() {
  // Add to cart button click
  document.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON' && e.target.dataset.id) {
      addToCart(e.target.dataset.id);
    }
  });
  
  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', filterProducts);
  }
  
  // Sort select
  if (sortSelect) {
    sortSelect.addEventListener('change', filterProducts);
  }
}

// Set up event listeners for cart page
function setupCartEventListeners() {
  if (!cartItems) return;
  
  // Quantity change and remove buttons
  cartItems.addEventListener('click', function(e) {
    if (e.target.classList.contains('quantity-btn')) {
      const id = e.target.dataset.id;
      const action = e.target.dataset.action;
      updateCartItemQuantity(id, action);
    }
    
    if (e.target.classList.contains('remove-btn')) {
      const id = e.target.dataset.id;
      removeCartItem(id);
    }
  });
  
  // Checkout button
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to checkout');
        window.location.href = 'login.html';
        return;
      }
      
      window.location.href = 'checkout.html';
    });
  }
}

// Set up event listeners for checkout page
function setupCheckoutEventListeners() {
  const checkoutForm = document.getElementById('checkout-form');
  if (!checkoutForm) return;
  
  checkoutForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(checkoutForm);
    const shippingAddress = {
      address: formData.get('address'),
      city: formData.get('city'),
      postalCode: formData.get('postalCode'),
      country: formData.get('country')
    };
    
    const paymentMethod = formData.get('paymentMethod');
    
    // Get cart items
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    // Calculate total
    let totalPrice = 0;
    const orderItems = cart.map(item => {
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;
      
      return {
        name: item.name,
        qty: item.quantity,
        image: item.image,
        price: item.price,
        product: item._id
      };
    });
    
    // Create order object
    const order = {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice
    };
    
    try {
      // Get token for auth
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to complete order');
        window.location.href = 'login.html';
        return;
      }
      
      // Submit order to API
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(order)
      });
      
      const data = await response.json();
      
      if (data._id) {
        // Clear cart
        localStorage.removeItem('cart');
        
        // Redirect to order confirmation
        window.location.href = `order-confirmation.html?id=${data._id}`;
      } else {
        alert('There was a problem creating your order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('There was a problem processing your order');
    }
  });
}

// Update cart item quantity
function updateCartItemQuantity(id, action) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const itemIndex = cart.findIndex(item => item._id === id);
  
  if (itemIndex === -1) return;
  
  if (action === 'increase') {
    cart[itemIndex].quantity += 1;
  } else if (action === 'decrease') {
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity -= 1;
    } else {
      // Remove item if quantity would be less than 1
      cart.splice(itemIndex, 1);
    }
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay();
}

// Remove item from cart
function removeCartItem(id) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart = cart.filter(item => item._id !== id);
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);