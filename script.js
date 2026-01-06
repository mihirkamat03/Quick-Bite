// --- 1. FIREBASE CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyCtuzk9qJa1zQXskLqVX9OfOmk01wvWtKo",
    authDomain: "quickbite-d830f.firebaseapp.com",
    projectId: "quickbite-d830f",
    storageBucket: "quickbite-d830f.firebasestorage.app",
    messagingSenderId: "279810717556",
    appId: "1:279810717556:web:d1fbede1d1c6e58b7f5e21",
    databaseURL: "https://quickbite-d830f-default-rtdb.firebaseio.com"
};

if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = typeof firebase !== 'undefined' ? firebase.auth() : null;
const db = typeof firebase !== 'undefined' ? firebase.database() : null;


// --- 2. GLOBAL UI LOGIC ---
document.addEventListener("DOMContentLoaded", () => {
    // A. Highlight Active Navbar Link
    const currentPath = window.location.pathname.split("/").pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // B. SYNC MENU QUANTITIES (The Fix for your issue)
    // This checks if we are on the menu page and updates buttons to match the cart
    if (document.querySelector('.food-card')) {
        syncMenuWithCart();
    }
});


// --- 3. SYNC LOGIC (New Function) ---
function syncMenuWithCart() {
    const cart = JSON.parse(localStorage.getItem('quickbite_cart')) || { items: [] };
    
    // Loop through every card on the screen
    document.querySelectorAll('.food-card').forEach(card => {
        const name = card.getAttribute('data-name');
        
        // Check if this item is in the cart
        const itemInCart = cart.items.find(item => item.name === name);
        
        // Update the number display
        const qtyDisplay = card.querySelector('.qty-display');
        if (qtyDisplay) {
            qtyDisplay.innerText = itemInCart ? itemInCart.quantity : 0;
        }
    });
}


// --- 4. BUTTON INTERACTION LOGIC ---

function toggleFav(btn) {
    btn.classList.toggle('active');
    const icon = btn.querySelector('i');
    if (btn.classList.contains('active')) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
    } else {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
    }
}

function updateQty(btn, change) {
    const container = btn.parentElement;
    const display = container.querySelector('.qty-display');
    const card = btn.closest('.food-card');
    
    // Get Data
    const name = card.getAttribute('data-name');
    const price = parseInt(card.getAttribute('data-price'));
    const img = card.getAttribute('data-img');
    
    let currentQty = parseInt(display.innerText);
    let newQty = currentQty + change;
    if (newQty < 0) newQty = 0;

    // Update UI immediately
    display.innerText = newQty;

    // Update Storage
    if (change > 0) {
        addToCart(name, price, img);
    } else if (change < 0) {
        removeFromCart(name);
    }
}


// --- 5. CART DATA LOGIC ---

function addToCart(name, price, image, type = 'Veg') {
    let cart = JSON.parse(localStorage.getItem('quickbite_cart')) || { items: [], total: 0 };
    const existingItem = cart.items.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.items.push({ name, price, image, type, quantity: 1 });
    }

    saveCart(cart);
}

function removeFromCart(name) {
    let cart = JSON.parse(localStorage.getItem('quickbite_cart')) || { items: [], total: 0 };
    const existingItem = cart.items.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity -= 1;
        
        // Remove item if 0
        if (existingItem.quantity <= 0) {
            cart.items = cart.items.filter(item => item.name !== name);
        }
        saveCart(cart);
    }
}

function saveCart(cart) {
    // Recalculate Total
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    localStorage.setItem('quickbite_cart', JSON.stringify(cart));
    console.log("Cart Updated:", cart);
}


// --- 6. NOTIFICATION SYSTEM ---
function showNotification(type, title, message, redirectUrl = null) {
    if (!document.getElementById('customDialog')) {
        const dialogHTML = `
            <div id="customDialog" class="custom-dialog-overlay">
                <div class="custom-dialog-box">
                    <i id="dialogIcon" class="fa-solid dialog-icon"></i>
                    <h3 id="dialogTitle" class="dialog-title"></h3>
                    <p id="dialogMsg" class="dialog-msg"></p>
                    <button id="dialogBtn" class="dialog-btn">Okay</button>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', dialogHTML);
    }

    const overlay = document.getElementById('customDialog');
    const icon = document.getElementById('dialogIcon');
    const h3 = document.getElementById('dialogTitle');
    const p = document.getElementById('dialogMsg');
    const btn = document.getElementById('dialogBtn');

    icon.className = 'fa-solid dialog-icon';
    btn.style.display = 'inline-block';
    h3.innerText = title;
    p.innerText = message;

    if (type === 'loading') {
        icon.classList.add('fa-circle-notch', 'loading');
        btn.style.display = 'none';
    } else if (type === 'success') {
        icon.classList.add('fa-circle-check', 'success');
        btn.onclick = () => {
            overlay.classList.remove('active');
            if (redirectUrl) window.location.href = redirectUrl;
        };
    } else if (type === 'error') {
        icon.classList.add('fa-circle-xmark', 'error');
        btn.onclick = () => overlay.classList.remove('active');
    }
    overlay.classList.add('active');
}