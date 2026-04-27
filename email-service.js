// ============================================================
// Billzestpos Email Service — Powered by EmailJS
// ============================================================
// Setup: https://www.emailjs.com/
// 1. Create account → Get Public Key
// 2. Create Email Service → Get Service ID
// 3. Create Email Templates → Get Template IDs
// 4. Replace placeholders below with your real IDs
// ============================================================

const EMAIL_CONFIG = {
    publicKey:        "YOUR_EMAILJS_PUBLIC_KEY",     // From EmailJS → Account → API Keys
    serviceId:        "YOUR_SERVICE_ID",             // From EmailJS → Email Services
    contactTemplateId: "template_contact",           // Template for contact form
    demoTemplateId:   "template_demo",               // Template for demo requests
    invoiceTemplateId: "template_invoice",           // Template for invoice emails
};

// Initialize EmailJS (call this once on page load)
function initEmailService() {
    if (typeof emailjs === 'undefined') {
        console.warn('EmailJS SDK not loaded. Add: <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>');
        return false;
    }
    emailjs.init(EMAIL_CONFIG.publicKey);
    return true;
}

// ── Send Contact Form Email ──────────────────────────────────
async function sendContactEmail({ firstName, lastName, email, phone, restaurantName, message }) {
    if (!initEmailService()) return { success: false, error: 'EmailJS not loaded' };
    try {
        await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.contactTemplateId, {
            from_name:       `${firstName} ${lastName}`,
            from_email:      email,
            phone:           phone || 'N/A',
            restaurant_name: restaurantName || 'N/A',
            message:         message,
            reply_to:        email,
        });
        return { success: true };
    } catch (error) {
        console.error('Contact email failed:', error);
        return { success: false, error: error.text || error.message };
    }
}

// ── Send Demo Request Email ──────────────────────────────────
async function sendDemoRequest({ name, email, restaurantName }) {
    if (!initEmailService()) return { success: false, error: 'EmailJS not loaded' };
    try {
        await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.demoTemplateId, {
            from_name:       name,
            from_email:      email,
            restaurant_name: restaurantName,
            reply_to:        email,
        });
        return { success: true };
    } catch (error) {
        console.error('Demo request email failed:', error);
        return { success: false, error: error.text || error.message };
    }
}

// ── Send Invoice Email ───────────────────────────────────────
async function sendInvoiceEmail({ toEmail, toName, invoiceId, amount, items, date }) {
    if (!initEmailService()) return { success: false, error: 'EmailJS not loaded' };
    try {
        const itemList = items.map(i => `${i.name} x${i.qty} — $${i.price.toFixed(2)}`).join('\n');
        await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.invoiceTemplateId, {
            to_email:    toEmail,
            to_name:     toName,
            invoice_id:  invoiceId,
            amount:      `$${amount.toFixed(2)}`,
            items:       itemList,
            date:        date,
        });
        return { success: true };
    } catch (error) {
        console.error('Invoice email failed:', error);
        return { success: false, error: error.text || error.message };
    }
}
