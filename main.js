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
    // Inject dynamic branding
    document.querySelectorAll('[data-brand="name"]').forEach(el => el.innerText = AppConfig.brandName);
    document.querySelectorAll('[data-brand="email"]').forEach(el => el.innerText = AppConfig.email);
    document.querySelectorAll('[data-brand="phone"]').forEach(el => el.innerText = AppConfig.phone);
    
    document.querySelectorAll('[data-brand="email-link"]').forEach(el => {
        el.href = `mailto:${AppConfig.email}`;
        el.innerText = AppConfig.email;
    });
    document.querySelectorAll('[data-brand="phone-link"]').forEach(el => {
        el.href = `tel:${AppConfig.phone.replace(/\s/g, '')}`;
        el.innerText = AppConfig.phone;
    });

    // Inject Global Floating Buttons if they don't exist
    if (!document.getElementById('global-actions')) {
        const actions = document.createElement('div');
        actions.id = 'global-actions';
        actions.className = 'floating-actions-global';
        actions.innerHTML = `
            <button class="float-btn float-ai" onclick="window.toggleGlobalChat()"><i data-lucide="message-square"></i></button>
            <a href="${AppConfig.whatsapp}" target="_blank" class="float-btn float-whatsapp"><i data-lucide="message-circle"></i></a>
        `;
        document.body.appendChild(actions);

        const chat = document.createElement('div');
        chat.id = 'global-chatbot';
        chat.className = 'chatbot-global';
        chat.innerHTML = `
            <div class="chat-header">
                <div style="display:flex; align-items:center; gap:8px;"><i data-lucide="bot"></i> <span>Billzest AI</span></div>
                <button onclick="window.toggleGlobalChat()" style="background:none; border:none; color:white; cursor:pointer;"><i data-lucide="x"></i></button>
            </div>
            <div class="chat-messages" id="global-chat-messages">
                <div class="chat-msg bot-msg">Hi! I'm your Billzestpos assistant. How can I help you today?</div>
            </div>
            <div class="chat-input-area">
                <input type="text" id="global-chat-input" placeholder="Type a message..." onkeypress="if(event.key==='Enter') window.sendGlobalMsg()">
                <button class="chat-send-btn" onclick="window.sendGlobalMsg()"><i data-lucide="send"></i></button>
            </div>
        `;
        document.body.appendChild(chat);
    }

    // PWA & Lucide
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(()=>{}));
    }
    if (window.lucide) window.lucide.createIcons();
}

window.toggleGlobalChat = () => {
    document.getElementById('global-chatbot').classList.toggle('active');
};

window.sendGlobalMsg = () => {
    const input = document.getElementById('global-chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    const msgs = document.getElementById('global-chat-messages');
    msgs.innerHTML += `<div class="chat-msg user-msg">${msg}</div>`;
    input.value = '';
    msgs.scrollTop = msgs.scrollHeight;

    setTimeout(() => {
        msgs.innerHTML += `<div class="chat-msg bot-msg">Thanks! One of our experts will get back to you soon regarding "${msg}".</div>`;
        msgs.scrollTop = msgs.scrollHeight;
        if (window.lucide) window.lucide.createIcons();
    }, 1000);
};

document.addEventListener('DOMContentLoaded', injectSharedComponents);

window.BillzestApp = {
    config: AppConfig,
    formatCurrency
};
