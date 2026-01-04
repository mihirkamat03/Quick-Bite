// --- 1. FIREBASE CONFIGURATION ---
// REPLACE THESE WITH YOUR ACTUAL KEYS FROM FIREBASE CONSOLE
const firebaseConfig = {
    apiKey: "AIzaSyCtuzk9qJa1zQXskLqVX9OfOmk01wvWtKo",
    authDomain: "quickbite-d830f.firebaseapp.com",
    projectId: "quickbite-d830f",
    storageBucket: "quickbite-d830f.firebasestorage.app",
    messagingSenderId: "279810717556",
    appId: "1:279810717556:web:d1fbede1d1c6e58b7f5e21",
    databaseURL: "https://quickbite-d830f-default-rtdb.firebaseio.com"
};

// Initialize Firebase (Check if already initialized to prevent errors)
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Global Variables
const auth = typeof firebase !== 'undefined' ? firebase.auth() : null;
const db = typeof firebase !== 'undefined' ? firebase.database() : null;

// --- 2. GLOBAL UI LOGIC (Sidebar, etc.) ---
document.addEventListener("DOMContentLoaded", () => {
    // Active Link Highlighter
    const currentPath = window.location.pathname.split("/").pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
});


// --- 3. CART LOGIC (LocalStorage) ---
function addToCart(name, price, image, type = 'Veg') {
    let cart = JSON.parse(localStorage.getItem('quickbite_cart')) || { items: [], total: 0 };

    // Check if item exists
    const existingItem = cart.items.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.items.push({
            name: name,
            price: parseInt(price),
            image: image,
            type: type,
            quantity: 1
        });
    }

    // Recalculate Total
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    localStorage.setItem('quickbite_cart', JSON.stringify(cart));
    alert(`${name} added to cart!`);
    updateCartUI(); // Helper if on a page with cart UI
}

function updateCartUI() {
    // This function can be overridden by specific pages
    console.log("Cart updated");
}





// --- Global Notification System ---
function showNotification(type, title, message, redirectUrl = null) {
    // 1. Create HTML Structure if it doesn't exist
    if (!document.getElementById('customDialog')) {
        const dialogHTML = `
            <div id="customDialog" class="custom-dialog-overlay">
                <div class="custom-dialog-box">
                    <i id="dialogIcon" class="fa-solid dialog-icon"></i>
                    <h3 id="dialogTitle" class="dialog-title"></h3>
                    <p id="dialogMsg" class="dialog-msg"></p>
                    <button id="dialogBtn" class="dialog-btn">Okay</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', dialogHTML);
    }

    const overlay = document.getElementById('customDialog');
    const icon = document.getElementById('dialogIcon');
    const h3 = document.getElementById('dialogTitle');
    const p = document.getElementById('dialogMsg');
    const btn = document.getElementById('dialogBtn');

    // 2. Reset Classes
    icon.className = 'fa-solid dialog-icon';
    btn.style.display = 'inline-block';

    // 3. Configure Content based on Type
    h3.innerText = title;
    p.innerText = message;

    if (type === 'loading') {
        icon.classList.add('fa-circle-notch', 'loading');
        btn.style.display = 'none'; // Hide button for loading
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

    // 4. Show Dialog
    overlay.classList.add('active');
}