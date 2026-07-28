const products = [
    {
        id: 1,
        name: 'Laptop Pro 15"',
        category: 'laptops',
        price: 1299.99,
        description: 'Potente laptop para profesionales',
        emoji: '💻'
    },
    {
        id: 2,
        name: 'Auriculares Inalámbricos',
        category: 'auriculares',
        price: 149.99,
        description: 'Sonido cristalino con cancelación de ruido',
        emoji: '🎧'
    },
    {
        id: 3,
        name: 'Smartphone Premium',
        category: 'smartphones',
        price: 899.99,
        description: 'Último modelo con cámara de 50MP',
        emoji: '📱'
    },
    {
        id: 4,
        name: 'Tablet 12"',
        category: 'tablets',
        price: 599.99,
        description: 'Pantalla OLED de alta resolución',
        emoji: '📱'
    },
    {
        id: 5,
        name: 'Laptop Ultrabook',
        category: 'laptops',
        price: 1499.99,
        description: 'Delgada, ligera y potente',
        emoji: '💻'
    },
    {
        id: 6,
        name: 'Auriculares Gaming',
        category: 'auriculares',
        price: 199.99,
        description: 'Micrófono integrado, sonido 7.1',
        emoji: '🎧'
    },
    {
        id: 7,
        name: 'Smartphone Mid-Range',
        category: 'smartphones',
        price: 399.99,
        description: 'Excelente relación precio-rendimiento',
        emoji: '📱'
    },
    {
        id: 8,
        name: 'Tablet Básica',
        category: 'tablets',
        price: 249.99,
        description: 'Ideal para lectura y multimedia',
        emoji: '📱'
    },
    {
        id: 9,
        name: 'Laptop Gamer',
        category: 'laptops',
        price: 1799.99,
        description: 'GPU dedicada para juegos',
        emoji: '💻'
    },
    {
        id: 10,
        name: 'Auriculares Deportivos',
        category: 'auriculares',
        price: 89.99,
        description: 'Resistentes al agua, IP67',
        emoji: '🎧'
    },
    {
        id: 11,
        name: 'Smartphone Básico',
        category: 'smartphones',
        price: 199.99,
        description: 'Confiable y de fácil uso',
        emoji: '📱'
    },
    {
        id: 12,
        name: 'Tablet Pro',
        category: 'tablets',
        price: 799.99,
        description: 'Para diseñadores y creadores',
        emoji: '📱'
    }
];

const state = {
    cart: [],
    filteredProducts: [...products],
    filterCategory: '',
    filterPrice: 1000,
    sortBy: 'default'
};

const productsGrid = document.getElementById('products-grid');
const cartModal = document.getElementById('cart-modal');
const cartLink = document.getElementById('cart-link');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const filterCategory = document.getElementById('filter-category');
const filterPrice = document.getElementById('filter-price');
const priceValue = document.getElementById('price-value');
const resetFilters = document.getElementById('reset-filters');
const sortSelect = document.getElementById('sort-select');
const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');
const clearCartBtn = document.getElementById('clear-cart');
const checkoutBtn = document.getElementById('checkout');

function renderProducts() {
    productsGrid.innerHTML = '';

    if (state.filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No hay productos que coincidan con los filtros.</p>';
        return;
    }

    state.filteredProducts.forEach(product => {
        const card = createProductCard(product);
        productsGrid.appendChild(card);
    });
}

function createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.setAttribute('data-product-id', product.id);

    const cartItem = state.cart.find(item => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    card.innerHTML = `
        <div class="product-image">${product.emoji}</div>
        <div class="product-body">
            <span class="product-category">${product.category}</span>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-footer">
                <div class="product-qty">
                    <button class="qty-minus" data-product-id="${product.id}">−</button>
                    <input type="number" class="qty-input" data-product-id="${product.id}" value="${quantity}" min="0" readonly>
                    <button class="qty-plus" data-product-id="${product.id}">+</button>
                </div>
                <button class="btn btn-primary btn-small add-to-cart" data-product-id="${product.id}">
                    ${quantity > 0 ? 'En Carrito' : 'Agregar'}
                </button>
            </div>
        </div>
    `;

    const minusBtn = card.querySelector('.qty-minus');
    const plusBtn = card.querySelector('.qty-plus');
    const addBtn = card.querySelector('.add-to-cart');

    minusBtn.addEventListener('click', () => decreaseQuantity(product.id));
    plusBtn.addEventListener('click', () => increaseQuantity(product.id));
    addBtn.addEventListener('click', () => handleAddToCart(product.id));

    return card;
}

function increaseQuantity(productId) {
    const cartItem = state.cart.find(item => item.id === productId);
    
    if (cartItem) {
        cartItem.quantity++;
    } else {
        const product = products.find(p => p.id === productId);
        state.cart.push({ ...product, quantity: 1 });
    }

    updateUI();
}

function decreaseQuantity(productId) {
    const cartItem = state.cart.find(item => item.id === productId);
    
    if (cartItem && cartItem.quantity > 0) {
        cartItem.quantity--;
        
        if (cartItem.quantity === 0) {
            state.cart = state.cart.filter(item => item.id !== productId);
        }
    }

    updateUI();
}

function handleAddToCart(productId) {
    const cartItem = state.cart.find(item => item.id === productId);
    
    if (!cartItem) {
        increaseQuantity(productId);
        showNotification(`Producto agregado al carrito`);
    }
}

function applyFilters() {
    state.filteredProducts = products.filter(product => {
        const categoryMatch = !state.filterCategory || product.category === state.filterCategory;
        const priceMatch = product.price <= state.filterPrice;
        return categoryMatch && priceMatch;
    });

    applySorting();
    renderProducts();
}

function applySorting() {
    switch (state.sortBy) {
        case 'price-asc':
            state.filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            state.filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            state.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            break;
    }
}

function renderCart() {
    if (state.cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">El carrito está vacío</p>';
        return;
    }

    cartItemsContainer.innerHTML = state.cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.emoji}</div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-qty">
                    <button data-product-id="${item.id}" class="cart-qty-minus">−</button>
                    <span>${item.quantity}</span>
                    <button data-product-id="${item.id}" class="cart-qty-plus">+</button>
                </div>
                <div class="cart-item-remove" data-product-id="${item.id}">Remover</div>
            </div>
            <div class="cart-item-subtotal">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');

    document.querySelectorAll('.cart-qty-minus').forEach(btn => {
        btn.addEventListener('click', (e) => decreaseQuantity(parseInt(e.target.dataset.productId)));
    });

    document.querySelectorAll('.cart-qty-plus').forEach(btn => {
        btn.addEventListener('click', (e) => increaseQuantity(parseInt(e.target.dataset.productId)));
    });

    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => removeFromCart(parseInt(e.target.dataset.productId)));
    });
}

function updateCartSummary() {
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    taxEl.textContent = `$${tax.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;

    cartCount.textContent = state.cart.reduce((sum, item) => sum + item.quantity, 0);
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    updateUI();
}
function clearCart() {
    if (state.cart.length > 0) {
        if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
            state.cart = [];
            updateUI();
            showNotification('Carrito vaciado');
        }
    }
}

function handleCheckout() {
    if (state.cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.15;
    alert(`¡Compra procesada! Total: $${total.toFixed(2)}\n\nGracias por tu compra.`);
    state.cart = [];
    updateUI();
    closeCartModal();
}

function openCartModal() {
    cartModal.classList.add('active');
}

function closeCartModal() {
    cartModal.classList.remove('active');
}
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function updateUI() {
    renderCart();
    updateCartSummary();
    renderProducts();
}

function resetAllFilters() {
    state.filterCategory = '';
    state.filterPrice = 1000;
    state.sortBy = 'default';
    filterCategory.value = '';
    filterPrice.value = 1000;
    priceValue.textContent = 1000;
    sortSelect.value = 'default';
    applyFilters();
}

filterCategory.addEventListener('change', (e) => {
    state.filterCategory = e.target.value;
    applyFilters();
});

filterPrice.addEventListener('input', (e) => {
    state.filterPrice = parseInt(e.target.value);
    priceValue.textContent = state.filterPrice;
    applyFilters();
});

resetFilters.addEventListener('click', resetAllFilters);

sortSelect.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    applySorting();
    renderProducts();
});

cartLink.addEventListener('click', (e) => {
    e.preventDefault();
    openCartModal();
});

closeCart.addEventListener('click', closeCartModal);

cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        closeCartModal();
    }
});

clearCartBtn.addEventListener('click', clearCart);
checkoutBtn.addEventListener('click', handleCheckout);

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartSummary();
});
