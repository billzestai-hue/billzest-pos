/**
 * Billzestpos Main UI Controller
 * Centralizes branding, navigation, and shared components.
 */

const AppConfig = {
    brandName: "Billzestpos",
    email: "billzestai@gmail.com",
    phone: "+966 550 898978",
    whatsapp: "https://wa.me/966550898978",
    currencies: {
        'USD': { symbol: '$', rate: 1, name: 'USD' },
        'SAR': { symbol: 'ر.س', rate: 3.75, name: 'SAR' },
        'AED': { symbol: 'د.إ', rate: 3.67, name: 'AED' }
    },
    languages: {
        'en': { name: 'English', dir: 'ltr' },
        'ar': { name: 'العربية', dir: 'rtl' }
    }
};

const Translations = {
    'en': {
        'home': 'Home', 'solutions': 'Solutions', 'pricing': 'Pricing', 'contact': 'Contact Us',
        'login': 'Login', 'dashboard': 'Dashboard', 'logout': 'Logout', 'overview': 'Overview',
        'orders': 'Orders', 'menu': 'Menu Items', 'customers': 'Customers', 'reports': 'Reports',
        'settings': 'Settings', 'total_sales': "Today's Sales", 'new_order': 'New Order'
    },
    'ar': {
        'home': 'الرئيسية', 'solutions': 'حلولنا', 'pricing': 'الأسعار', 'contact': 'اتصل بنا',
        'login': 'دخول', 'dashboard': 'لوحة التحكم', 'logout': 'خروج', 'overview': 'نظرة عامة',
        'orders': 'الطلبات', 'menu': 'قائمة الطعام', 'customers': 'العملاء', 'reports': 'التقارير',
        'settings': 'الإعدادات', 'total_sales': 'مبيعات اليوم', 'new_order': 'طلب جديد'
    }
};

// ── Shared UI Injections ───────────────────────────────────────

function injectSharedComponents() {
    const currentLang = localStorage.getItem('app_lang') || 'en';
    const currentCurr = localStorage.getItem('app_curr') || 'USD';
    
    document.documentElement.lang = currentLang;
    document.body.dir = AppConfig.languages[currentLang].dir;
    if (currentLang === 'ar') document.body.classList.add('rtl-mode');
    else document.body.classList.remove('rtl-mode');

    // Inject dynamic branding
    document.querySelectorAll('[data-brand="name"]').forEach(el => el.innerText = AppConfig.brandName);
    document.querySelectorAll('[data-brand="email"]').forEach(el => el.innerText = AppConfig.email);
    document.querySelectorAll('[data-brand="phone"]').forEach(el => el.innerText = AppConfig.phone);
    
    // Localization
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (Translations[currentLang][key]) el.innerText = Translations[currentLang][key];
    });

    // Auto-link email and phone
    document.querySelectorAll('[data-brand="email-link"]').forEach(el => {
        el.href = `mailto:${AppConfig.email}`;
        el.innerText = AppConfig.email;
    });

    // Inject Switcher (Only if not already present)
    if (!document.getElementById('global-switcher')) {
        const switcher = document.createElement('div');
        switcher.id = 'global-switcher';
        switcher.style.cssText = "position:fixed; bottom:20px; left:20px; z-index:9999; display:flex; gap:8px;";
        switcher.innerHTML = `
            <select onchange="window.BillzestApp.setLanguage(this.value)" style="padding:8px; border-radius:8px; border:1px solid #cbd5e1; background:white; font-weight:600; cursor:pointer;">
                <option value="en" ${currentLang==='en'?'selected':''}>EN</option>
                <option value="ar" ${currentLang==='ar'?'selected':''}>AR</option>
            </select>
            <select onchange="window.BillzestApp.setCurrency(this.value)" style="padding:8px; border-radius:8px; border:1px solid #cbd5e1; background:white; font-weight:600; cursor:pointer;">
                <option value="USD" ${currentCurr==='USD'?'selected':''}>USD ($)</option>
                <option value="SAR" ${currentCurr==='SAR'?'selected':''}>SAR (ر.س)</option>
                <option value="AED" ${currentCurr==='AED'?'selected':''}>AED (د.إ)</option>
            </select>
        `;
        document.body.appendChild(switcher);
    }

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch(err => console.log("SW Fail:", err));
        });
    }

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// ── Global Helper Functions ────────────────────────────────────

function formatCurrency(amount) {
    const code = localStorage.getItem('app_curr') || 'USD';
    const c = AppConfig.currencies[code];
    const converted = amount * c.rate;
    return `${c.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

function setLanguage(lang) {
    localStorage.setItem('app_lang', lang);
    location.reload();
}

function setCurrency(curr) {
    localStorage.setItem('app_curr', curr);
    location.reload();
}

// ── Initialization ──────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', injectSharedComponents);

window.BillzestApp = {
    config: AppConfig,
    formatCurrency,
    setLanguage,
    setCurrency
};
