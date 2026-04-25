// email-service.js
// EmailJS configuration for Invoice System

// 🔥 YAHAN APNI DETAILS DAALO 🔥
const EMAIL_CONFIG = {
    PUBLIC_KEY: "YOUR_EMAILJS_PUBLIC_KEY",     // EmailJS se copy karo
    SERVICE_ID: "YOUR_EMAILJS_SERVICE_ID",     // Service ID (jaise: service_gmail)
    TEMPLATE_ID: "YOUR_EMAILJS_TEMPLATE_ID"    // Template ID (jaise: template_invoice)
};

// Company GST Details (Aapki company ke)
const COMPANY_DETAILS = {
    name: "BillzestPOS",
    gst: "22AAAAA0000A1Z",
    pan: "AAAAA1234A",
    email: "billing@billzestpos.com",
    phone: "+966550898978",
    address: "Riyadh, Saudi Arabia"
};

// GST Rate (India: 18%, Saudi: 15%)
const GST_RATE = 18; // Change as per your country

// Function to send invoice email
async function sendInvoiceEmail(customerData, subscriptionData) {
    // Check if EmailJS is loaded
    if (typeof emailjs === 'undefined') {
        console.log("EmailJS not loaded yet");
        return false;
    }
    
    // Calculate GST
    const subtotal = parseFloat(subscriptionData.amount);
    const gstAmount = (subtotal * GST_RATE) / 100;
    const totalAmount = subtotal + gstAmount;
    const invoiceNo = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Template parameters
    const templateParams = {
        // Customer Details
        customer_name: customerData.fullName,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        customer_gst: customerData.gstNumber || 'Not registered',
        customer_address: customerData.address || 'Not provided',
        
        // Invoice Details
        invoice_no: invoiceNo,
        date: new Date().toLocaleDateString('en-IN'),
        
        // Subscription Details
        plan_name: subscriptionData.plan,
        billing_cycle: subscriptionData.billingCycle,
        amount: subtotal.toFixed(2),
        
        // GST Details
        gst_percent: GST_RATE,
        gst_amount: gstAmount.toFixed(2),
        total_amount: totalAmount.toFixed(2),
        
        // Company Details
        company_name: COMPANY_DETAILS.name,
        company_gst: COMPANY_DETAILS.gst,
        company_pan: COMPANY_DETAILS.pan,
        company_email: COMPANY_DETAILS.email,
        company_phone: COMPANY_DETAILS.phone,
        company_address: COMPANY_DETAILS.address,
        
        // Payment Status
        status: subscriptionData.status || 'pending',
        payment_link: `https://billzestpos.com/pay/${invoiceNo}`
    };
    
    try {
        const response = await emailjs.send(
            EMAIL_CONFIG.SERVICE_ID,
            EMAIL_CONFIG.TEMPLATE_ID,
            templateParams,
            EMAIL_CONFIG.PUBLIC_KEY
        );
        
        console.log("Invoice email sent!", response);
        
        // Save invoice to localStorage for record
        saveInvoiceToLocal({
            invoiceNo: invoiceNo,
            customerName: customerData.fullName,
            customerEmail: customerData.email,
            plan: subscriptionData.plan,
            amount: subtotal,
            gst: gstAmount,
            total: totalAmount,
            date: new Date().toISOString(),
            status: 'sent'
        });
        
        return true;
    } catch (error) {
        console.error("Email send failed:", error);
        return false;
    }
}

// Save invoice to localStorage
function saveInvoiceToLocal(invoice) {
    let invoices = JSON.parse(localStorage.getItem('email_invoices') || '[]');
    invoices.push(invoice);
    localStorage.setItem('email_invoices', JSON.stringify(invoices));
}

// Function to send payment confirmation
async function sendPaymentConfirmation(customerEmail, customerName, invoiceNo) {
    const templateParams = {
        customer_name: customerName,
        customer_email: customerEmail,
        invoice_no: invoiceNo,
        company_name: COMPANY_DETAILS.name
    };
    
    try {
        await emailjs.send(
            EMAIL_CONFIG.SERVICE_ID,
            "template_payment_confirmation",  // Separate template for confirmation
            templateParams,
            EMAIL_CONFIG.PUBLIC_KEY
        );
        return true;
    } catch (error) {
        console.error("Payment confirmation failed:", error);
        return false;
    }
}

// Export functions
window.sendInvoiceEmail = sendInvoiceEmail;
window.sendPaymentConfirmation = sendPaymentConfirmation;
