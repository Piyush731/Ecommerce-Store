document.addEventListener('DOMContentLoaded', () => {
    const products = [
        { id: 1, name: 'Product 1', price: 10.00, image: 'Product1.jpg' },
        { id: 2, name: 'Product 2', price: 20.00, image: 'Product2.jpg' },
        { id: 3, name: 'Product 3', price: 15.00, image: 'Product3.jpg' },
        { id: 4, name: 'Product 4', price: 25.00, image: 'Product4.jpg' }
    ];

    // Cart will be stored in localStorage, so we load it from there or initialize as empty
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const productsContainer = document.getElementById('products');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    const searchInput = document.getElementById('search');
    const sortSelect = document.getElementById('sort');

    // Render the products on the products page
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

    // Update the cart on the cart page
    function updateCart() {
        if (cartItems) {
            cartItems.innerHTML = '';
            let total = 0;

            // Get cart from localStorage
            const storedCart = JSON.parse(localStorage.getItem('cart')) || [];

            storedCart.forEach(item => {
                const cartItem = document.createElement('li');
                cartItem.textContent = `${item.name} - $${item.price.toFixed(2)} x ${item.quantity}`;
                cartItems.appendChild(cartItem);
                total += item.price * item.quantity;
            });

            cartTotal.textContent = `Total: $${total.toFixed(2)}`;
            if (cartCount) {
                cartCount.textContent = storedCart.length;
            }

            // Show an empty cart message if there are no items
            if (storedCart.length === 0) {
                document.getElementById('empty-cart-message').style.display = 'block';
            } else {
                document.getElementById('empty-cart-message').style.display = 'none';
            }
        }
    }

    // Add product to the cart
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) {
            console.error(`Product with ID ${productId} not found`);
            return;
        }

        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        // Save the updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('Cart updated:', cart);
    }

    // Filter and sort products
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

    // Add event listeners
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

    // Initial rendering of products
    if (productsContainer) {
        renderProducts(products);
    }

    // On the cart page, update the cart on load
    updateCart();

    // Checkout functionality
    const checkoutButton = document.getElementById('checkout');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            localStorage.removeItem('cart');
            alert('Checkout complete!');
            window.location.reload();
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        // Initialize EmailJS
        emailjs.init("Piyushkashyap3247@gmail.com"); // Replace with your EmailJS user ID
    
        const contactForm = document.getElementById('contact-form');
        
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent the form from submitting the traditional way
            
            const formData = new FormData(contactForm);
    
            // Create a data object for EmailJS
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };
    
            // Send the email using EmailJS
            emailjs.send("service_lnkoqcj", "template_d4azjol", data)
                .then((response) => {
                    console.log('Success:', response);
                    alert('Your message has been sent!');
                    contactForm.reset(); // Clear the form
                }, (error) => {
                    console.error('Error:', error);
                    alert('There was a problem sending your message.');
                });
        });
    });
    
});
