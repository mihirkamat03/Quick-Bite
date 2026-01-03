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