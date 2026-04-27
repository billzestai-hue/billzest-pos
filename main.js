/**
 * Billzestpos Main UI Controller
 * Centralizes branding, navigation, and shared components.
 */

const AppConfig = {
    brandName: "Billzestpos",
    email: "billzestai@gmail.com",
    phone: "+966 550 898978",
    whatsapp: "https://wa.me/966550898978",
    social: {
        twitter: "#",
        facebook: "#",
        instagram: "#"
    }
};

// ── Shared UI Injections ───────────────────────────────────────

function injectSharedComponents() {
    // Inject dynamic branding to any element with data-brand
    document.querySelectorAll('[data-brand="name"]').forEach(el => el.innerText = AppConfig.brandName);
    document.querySelectorAll('[data-brand="email"]').forEach(el => el.innerText = AppConfig.email);
    document.querySelectorAll('[data-brand="phone"]').forEach(el => el.innerText = AppConfig.phone);
    
    // Auto-link email and phone
    document.querySelectorAll('[data-brand="email-link"]').forEach(el => {
        el.href = `mailto:${AppConfig.email}`;
        el.innerText = AppConfig.email;
    });
    document.querySelectorAll('[data-brand="phone-link"]').forEach(el => {
        el.href = `tel:${AppConfig.phone.replace(/\s/g, '')}`;
        el.innerText = AppConfig.phone;
    });

    // PWA Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(err => console.log("SW Fail:", err));
        });
    }

    // Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// ── Global Helper Functions ────────────────────────────────────

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

// ── Initialization ──────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', injectSharedComponents);

window.BillzestApp = {
    config: AppConfig,
    formatCurrency
};
