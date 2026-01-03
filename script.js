document.addEventListener("DOMContentLoaded", () => {
    
    // --- Active Link Logic ---
    const currentPath = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if(link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // --- Modal Logic ---
    window.openModal = function(categoryName) {
        const modal = document.getElementById('foodModal');
        const title = document.getElementById('modalTitle');
        if(modal && title) {
            title.innerText = `Select ${categoryName}`;
            modal.style.display = 'flex';
        }
    }

    window.closeModal = function() {
        const modal = document.getElementById('foodModal');
        if(modal) {
            modal.style.display = 'none';
        }
    }

    // Close modal if clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('foodModal');
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // --- Add to Cart Animation ---
    const addBtns = document.querySelectorAll('.btn-icon');
    addBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check"></i>';
            btn.style.background = '#4CAF50';
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
            }, 1000);
        });
    });
});


// --- Filter Chips Logic ---
    const chips = document.querySelectorAll(".filter-chip");
    
    chips.forEach(chip => {
        chip.addEventListener("click", () => {
            // Remove active class from all
            chips.forEach(c => c.classList.remove("active"));
            // Add to clicked
            chip.classList.add("active");
            
            // Optional: You can filter the grid items here based on text content
            const filterValue = chip.textContent.trim();
            console.log("Filtering by:", filterValue);
        });
    });


    // Global Cart State
let cart = {
    items: [],
    total: 0
};

document.addEventListener("DOMContentLoaded", () => {
    // ... Existing active link logic ...

    // Listen for "Add" button clicks in the Modal
    const modalAddBtns = document.querySelectorAll('.modal-content .btn-icon');
    
    modalAddBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Get item details from the parent element
            const itemElement = this.closest('.cart-item');
            const name = itemElement.querySelector('h4').innerText;
            const price = parseInt(itemElement.querySelector('.price').innerText.replace('₹', ''));
            const image = itemElement.querySelector('img').src;

            addToCart(name, price, image);
            
            // Visual feedback on the button
            this.innerHTML = '<i class="fa-solid fa-check"></i>';
            this.style.background = '#4CAF50';
            setTimeout(() => {
                this.innerHTML = '<i class="fa-solid fa-plus"></i>';
                this.style.background = '';
            }, 800);
        });
    });
});

function addToCart(name, price, image) {
    // Check if item already exists to increment quantity
    const existingItem = cart.items.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.items.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }

    updateFloatingBar();
}

function updateFloatingBar() {
    const bar = document.getElementById('floatingCartBar');
    const countText = document.getElementById('cartCountText');
    const totalText = document.getElementById('cartTotalPrice');

    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    countText.innerText = `${totalItems} Item${totalItems > 1 ? 's' : ''} Added`;
    totalText.innerText = `₹${totalPrice}`;

    // Show the bar if items exist
    if (totalItems > 0) {
        bar.classList.add('show');
    }
}



function checkCode() {
    const code = document.getElementById('codeInput').value;
    const overlay = document.getElementById('loadingOverlay');
    const spinner = document.querySelector('.custom-spinner');
    const successIcon = document.getElementById('successIcon');
    const statusTitle = document.getElementById('statusTitle');
    const statusDesc = document.getElementById('statusDesc');

    if (!code) {
        alert("Please enter a valid campus code.");
        return;
    }

    // Show Overlay
    overlay.style.display = 'flex';

    // Fake Verification Delay
    setTimeout(() => {
        spinner.classList.add('hidden');
        successIcon.classList.remove('hidden');
        statusTitle.innerText = "Verified!";
        statusDesc.innerText = "Welcome to QuickBite TSEC Hub.";

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);
    }, 2500);
}