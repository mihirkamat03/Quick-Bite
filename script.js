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
        // Handle "Home" link active state specifically
        if (link.getAttribute('href') === currentPath || (currentPath === '' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });

    // B. SYNC MENU QUANTITIES
    if (document.querySelector('.food-card')) {
        syncMenuWithCart();
    }
});


// --- 3. SYNC LOGIC ---
function syncMenuWithCart() {
    const cart = JSON.parse(localStorage.getItem('quickbite_cart')) || { items: [] };
    document.querySelectorAll('.food-card').forEach(card => {
        const name = card.getAttribute('data-name');
        const itemInCart = cart.items.find(item => item.name === name);
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

    const name = card.getAttribute('data-name');
    const price = parseInt(card.getAttribute('data-price'));
    const img = card.getAttribute('data-img');

    let currentQty = parseInt(display.innerText);
    let newQty = currentQty + change;
    if (newQty < 0) newQty = 0;

    display.innerText = newQty;

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
        if (existingItem.quantity <= 0) {
            cart.items = cart.items.filter(item => item.name !== name);
        }
        saveCart(cart);
    }
}

function saveCart(cart) {
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    localStorage.setItem('quickbite_cart', JSON.stringify(cart));
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


// --- 7. AUTH & PAGE SPECIFIC LOGIC ---
if (auth) {
    auth.onAuthStateChanged(user => {
        // A. If logged in
        if (user) {
            // Check if we are on the PROFILE page before running profile code
            if (document.getElementById('userName')) {
                loadProfileData(user);
            }
        } 
        // B. If NOT logged in
        else {
            const path = window.location.pathname;
            // Only redirect if NOT on login, signup, or campus code pages
            if (!path.includes('login-signup.html') && !path.includes('campus-code.html')) {
                window.location.href = 'login-signup.html';
            }
        }
    });
}

// Helper function to load profile data (Moved out to be cleaner)
function loadProfileData(user) {
    db.ref('users/' + user.uid).on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
            if(document.getElementById('userName')) document.getElementById('userName').innerText = data.username || "Student";
            if(document.getElementById('userEmail')) document.getElementById('userEmail').innerText = user.email;
            if(document.getElementById('walletBalance')) document.getElementById('walletBalance').innerText = "₹" + (data.wallet || 0);
            if(document.getElementById('avatarInitial')) document.getElementById('avatarInitial').innerText = (data.username || "U")[0].toUpperCase();
        }
    });

    db.ref('orders').orderByChild('userId').equalTo(user.uid).on('value', snapshot => {
        const list = document.getElementById('historyList');
        if (!list) return; // Exit if history list doesn't exist (e.g. on Home page)
        
        list.innerHTML = '';
        const data = snapshot.val();
        if (data) {
            const orders = Object.values(data).reverse();
            if(document.getElementById('totalOrders')) document.getElementById('totalOrders').innerText = orders.length;

            orders.forEach(order => {
                const date = new Date(order.timestamp).toLocaleDateString();
                const itemNames = order.items.map(i => i.name).join(", ");
                list.innerHTML += `
                    <div class="history-card">
                        <div>
                            <h4 style="margin-bottom:5px;">#${order.queueNumber || '00'} - ₹${order.total}</h4>
                            <p style="color:gray; font-size:0.85rem; width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                                ${itemNames}
                            </p>
                            <small style="color:#ccc;">${date}</small>
                        </div>
                        <span class="order-badge badge-${order.status}">${order.status}</span>
                    </div>`;
            });
        } else {
            list.innerHTML = '<p style="color:gray; text-align:center;">No past orders.</p>';
        }
    });
}

function logout() {
    firebase.auth().signOut().then(() => window.location.href = 'login-signup.html');
}