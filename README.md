# Billzestpos — Restaurant Management SaaS

> The all-in-one POS, inventory, and analytics platform for modern restaurants.

[![Live Site](https://img.shields.io/badge/Live-billzestpos.com-4f46e5?style=flat-square)](https://billzestpos.com)
[![Firebase](https://img.shields.io/badge/Auth-Firebase_v10-orange?style=flat-square)](https://firebase.google.com)

---

## 📁 Project Structure

```
billzestpos/
├── index.html              # Landing page (hero, features, POS demo)
├── solutions.html          # Feature showcase
├── hardware.html           # Hardware catalog
├── pricing.html            # Pricing plans with toggle
├── contact.html            # Contact form
├── login.html              # Firebase Email + Google login
├── register.html           # New account registration
├── forgot-password.html    # Password reset via Firebase
├── dashboard.html          # Operator dashboard (charts, orders)
├── admin-panel.html        # Super-admin panel
├── customer-dashboard.html # Customer portal
├── kitchen.html            # Kitchen Display System (KDS)
├── invoice-template.html   # Printable invoice
├── payment-request.html    # Send/receive payment links
├── thank-you.html          # Post-action confirmation
├── 404.html                # Custom error page
├── offline.html            # PWA offline fallback
├── privacy.html            # Privacy policy
├── terms.html              # Terms of service
├── firebase-config.js      # Firebase SDK config & exports
├── email-service.js        # EmailJS wrapper
├── sw.js                   # Service Worker (PWA)
├── manifest.json           # PWA manifest
├── favicon.svg             # SVG favicon
├── robots.txt              # SEO robots
├── sitemap.xml             # XML sitemap
└── CNAME                   # GitHub Pages custom domain
```

---

## 🚀 Quick Setup

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/billzestpos.git
cd billzestpos
```

### 2. Configure Firebase
Open `firebase-config.js` and your credentials are already set. To change:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Project Settings → Web App → Copy config object
3. Replace values in `firebase-config.js`

**Enable these in Firebase Console:**
- Authentication → Sign-in methods → **Email/Password** ✅
- Authentication → Sign-in methods → **Google** ✅
- Authentication → Settings → Authorized domains → add your domain ✅

### 3. Configure EmailJS (Contact Form)
Open `email-service.js` and replace:
```js
publicKey:        "YOUR_EMAILJS_PUBLIC_KEY",
serviceId:        "YOUR_SERVICE_ID",
contactTemplateId: "template_contact",
```
Get these from [emailjs.com](https://www.emailjs.com/)

### 4. Deploy to GitHub Pages
```bash
git add .
git commit -m "Initial deploy"
git push origin main
```
Then in GitHub → Settings → Pages → Source: `main` branch → `/ (root)`

Add your domain to `CNAME` file and set DNS:
```
CNAME → username.github.io
```

---

## 🔥 Features
- ✅ Firebase Authentication (Email + Google)
- ✅ Interactive POS Demo on homepage
- ✅ Kitchen Display System (KDS)
- ✅ Revenue Chart (Chart.js)
- ✅ Pricing Toggle (Monthly/Yearly)
- ✅ AI Chatbot Widget
- ✅ WhatsApp Float Button
- ✅ PWA (installable, offline support)
- ✅ Fully Responsive (mobile-first)
- ✅ AOS Scroll Animations

---

## 📞 Contact
- Email: billzestai@gmail.com
- WhatsApp: +966 550 898978
- Website: https://billzestpos.com

---

© 2026 Billzestpos Software. All rights reserved.
