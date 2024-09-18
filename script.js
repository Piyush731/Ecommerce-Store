document.addEventListener('DOMContentLoaded', () => {
    const products = [
        { id: 1, name: 'Product 1', price: 10.00, image: 'Product1.jpg' },
        { id: 2, name: 'Product 2', price: 20.00, image: 'Product2.jpg' },
        { id: 3, name: 'Product 3', price: 15.00, image: 'Product3.jpg' },
        { id: 4, name: 'Product 4', price: 25.00, image: 'Product4.jpg' }
    ];
    const cart = [];
    const productsContainer = document.getElementById('products');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    const searchInput = document.getElementById('search');
    const sortSelect = document.getElementById('sort');

    function renderProducts(filteredProducts) {
        if (productsContainer) {
            productsContainer.innerHTML = '';
            filteredProducts.forEach(product => {
                const productEl = document.createElement('div');
                productEl.classList.add('product');
                productEl.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>$${product.price.toFixed(2)}</p>
                    <button data-id="${product.id}">Add to Cart</button>
                `;
                productsContainer.appendChild(productEl);
            });
        }
    }

    function updateCart() {
        if (cartItems) {
            cartItems.innerHTML = '';
            let total = 0;
            cart.forEach(item => {
                const cartItem = document.createElement('li');
                cartItem.textContent = `${item.name} - $${item.price.toFixed(2)} x ${item.quantity}`;
                cartItems.appendChild(cartItem);
                total += item.price * item.quantity;
            });
            cartTotal.textContent = `Total: $${total.toFixed(2)}`;
            cartCount.textContent = cart.length;
        }
    }

    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
    }

    function filterProducts() {
        const searchText = searchInput ? searchInput.value.toLowerCase() : '';
        const sortValue = sortSelect ? sortSelect.value : 'default';
        let filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchText));
        
        if (sortValue === 'price-asc') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortValue === 'price-desc') {
            filteredProducts.sort((a, b) => b.price - a.price);
        }

        renderProducts(filteredProducts);
    }

    if (productsContainer) {
        productsContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const productId = parseInt(e.target.getAttribute('data-id'), 10);
                addToCart(productId);
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', filterProducts);
    }

    // Initial render
    if (productsContainer) {
        renderProducts(products);
    }
});
