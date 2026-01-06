// Compute Inventory Data - GPU and RAM only
const computeInventory = [
    {
        name: 'RTX 5090',
        type: 'GPU',
        price: 5000,
        stock: 1,
        status: { rented: 0, warehouse: 1, shipping: 0 }
    },
    {
        name: 'RTX 5080',
        type: 'GPU',
        price: 1300,
        stock: 0,
        status: { rented: 0, warehouse: 0, shipping: 0 }
    },
    {
        name: 'RTX 4090',
        type: 'GPU',
        price: 2750,
        stock: 0,
        status: { rented: 0, warehouse: 0, shipping: 0 }
    },
    {
        name: 'NVIDIA A100 80GB',
        type: 'GPU',
        price: 15000,
        stock: 0,
        status: { rented: 0, warehouse: 0, shipping: 0 }
    },
    {
        name: 'AMD Instinct MI300X',
        type: 'GPU',
        price: 18000,
        stock: 0,
        status: { rented: 0, warehouse: 0, shipping: 0 }
    },
    {
        name: 'Kingston 96GB DDR5 SDRAM',
        type: 'RAM',
        price: 840,
        stock: 0,
        status: { rented: 0, warehouse: 0, shipping: 0 }
    },
    {
        name: 'Corsair VENGEANCE DDR5 Memory',
        type: 'RAM',
        price: 240,
        stock: 0,
        status: { rented: 0, warehouse: 0, shipping: 0 }
    }
];

let currentFilter = 'all';
let searchQuery = '';

// Generate Inventory List
function generateInventoryList(items = computeInventory) {
    const list = document.getElementById('inventoryList');
    list.innerHTML = '';

    // Filter items
    let filteredItems = items.filter(item => {
        const matchesFilter = currentFilter === 'all' || item.type === currentFilter;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             item.type.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (filteredItems.length === 0) {
        list.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 40px;">No items found</div>';
        updateStats([]);
        return;
    }

    filteredItems.forEach((item, index) => {
        const itemCard = document.createElement('div');
        itemCard.className = 'inventory-item';
        itemCard.style.animationDelay = `${index * 0.05}s`;

        itemCard.innerHTML = `
            <div class="item-row">
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <span class="item-type">${item.type}</span>
                </div>
                <div class="item-price-stock">
                    <div class="item-price">$${item.price.toLocaleString()}</div>
                    <div class="item-stock">${item.stock} units</div>
                </div>
            </div>
            <div class="status-row">
                <div class="status-item">
                    <div class="status-dot blue"></div>
                    <span>Rented: ${item.status.rented}</span>
                </div>
                <div class="status-item">
                    <div class="status-dot orange"></div>
                    <span>Warehouse: ${item.status.warehouse}</span>
                </div>
                <div class="status-item">
                    <div class="status-dot red"></div>
                    <span>Shipping: ${item.status.shipping}</span>
                </div>
            </div>
        `;

        list.appendChild(itemCard);
    });

    updateStats(filteredItems);
}

// Calculate and update statistics based on filtered items
function updateStats(filteredItems = computeInventory) {
    let totalValue = 0;
    let totalUnits = 0;
    let rentedUnits = 0;
    let warehouseUnits = 0;

    filteredItems.forEach(item => {
        totalValue += item.price * item.stock;
        totalUnits += item.stock;
        rentedUnits += item.status.rented;
        warehouseUnits += item.status.warehouse;
    });

    // Update counters without animation
    document.getElementById('totalValue').textContent = `$${totalValue.toLocaleString()}`;
    document.getElementById('totalUnits').textContent = totalUnits;
    document.getElementById('rentedUnits').textContent = rentedUnits;
    document.getElementById('warehouseUnits').textContent = warehouseUnits;
}

// Filter functionality
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            // Update filter
            currentFilter = btn.getAttribute('data-filter');
            // Regenerate list
            generateInventoryList();
        });
    });
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        generateInventoryList();
    });
}

// CA Copy functionality
function setupCACopy() {
    const copyBtn = document.getElementById('caCopyBtn');
    const caAddress = document.getElementById('caAddress');
    const copiedMsg = document.getElementById('caCopied');

    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(caAddress.textContent);

            // Show copied message
            copiedMsg.classList.add('show');

            // Hide after 2 seconds
            setTimeout(() => {
                copiedMsg.classList.remove('show');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    });
}

// Modal functionality
function setupModal() {
    const modal = document.getElementById('howItWorksModal');
    const btn = document.getElementById('howItWorksBtn');
    const closeBtn = document.getElementById('modalClose');

    btn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });
}

// Smooth animations on scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe animated elements
    document.querySelectorAll('.stat-card, .inventory-item').forEach(el => {
        observer.observe(el);
    });
}

// Random inventory highlight animation - Removed for cleaner look

// Status dots - No animation needed for professional look

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    generateInventoryList();
    setupFilters();
    setupSearch();
    setupCACopy();
    setupModal();
    setupScrollAnimations();

    console.log('CMX6900 - Compute Index initialized');
    console.log(`Total Inventory Items: ${computeInventory.length}`);
});

// Add smooth transitions to all interactive elements
window.addEventListener('load', () => {
    // Add loading complete animation
    document.body.style.opacity = '1';

    // Trigger initial stats animation
    setTimeout(() => {
        updateStats();
    }, 300);
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Recalculate any dynamic positions if needed
        console.log('Window resized');
    }, 250);
});
