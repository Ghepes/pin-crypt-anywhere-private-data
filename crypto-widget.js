window.PrivateDataAnywhere = (function () {
  // Default settings be overridden to dashboard : INFO to NPM pin-crypt-anywhere-private-data: by Studio Wromo 2026 MIT 
  const config = {
    dashboardKey: "intp_dashboard_user",
    encryptedKey: "intp_dashboard_private_encrypted",
    uidKey: "wromo_uid"
  };

  const ITERATIONS = 210000;
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  function bytesToBase64(bytes) {
    let binary = "";
    bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary);
  }

  function base64ToBytes(value) {
    return Uint8Array.from(atob(value), c => c.charCodeAt(0));
  }

  async function deriveKey(uid, pin, salt) {
    const material = await crypto.subtle.importKey(
      "raw", encoder.encode(`${uid}:${pin}`), "PBKDF2", false, ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
      material, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]
    );
  }

  async function encryptData(pin) {
    const uid = (localStorage.getItem(config.uidKey) || "").trim();
    if (!uid) throw new Error(`Missing UID key (${config.uidKey}). Log in first!`);
    if (pin.length < 4) throw new Error("The PIN must have at least 6 characters.");

    const rawData = localStorage.getItem(config.dashboardKey) || "{}";
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const key = await deriveKey(uid, pin, salt);
    const ciphertext = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv }, key, encoder.encode(rawData)
    );

    const envelope = {
      version: 3, algorithm: "AES-GCM", kdf: "PBKDF2-SHA-256",
      iterations: ITERATIONS, encrypted_at: new Date().toISOString(),
      salt: bytesToBase64(salt), iv: bytesToBase64(iv),
      ciphertext: bytesToBase64(new Uint8Array(ciphertext))
    };

    localStorage.setItem(config.encryptedKey, JSON.stringify(envelope));
    return "Full encryption. Global package is ready.";
  }

  async function decryptData(pin) {
    const uid = (localStorage.getItem(config.uidKey) || "").trim();
    if (!uid) throw new Error(`Missing UID key (${config.uidKey}).`);

    const envelopeRaw = localStorage.getItem(config.encryptedKey);
    if (!envelopeRaw) throw new Error(`There is no encrypted data on the key: ${config.encryptedKey}.`);
    const envelope = JSON.parse(envelopeRaw);

    const salt = base64ToBytes(envelope.salt);
    const key = await deriveKey(uid, pin, salt);
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: base64ToBytes(envelope.iv) },
      key, base64ToBytes(envelope.ciphertext)
    );

    localStorage.setItem(config.dashboardKey, decoder.decode(plaintext));
    return "Decriptare reușită. Datele locale au fost rescrise.";
  }

  function injectUI() {
    if (document.getElementById("intp-crypto-widget")) return;

    const container = document.createElement("div");
    container.id = "intp-crypto-widget";
    container.innerHTML = `
      <div style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; display: flex; gap: 10px; background: rgba(13,28,24,0.9); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        <button id="btn-intp-encrypt" style="background: #f0b84b; color: #172016; font-weight: bold; padding: 10px 15px; border: none; border-radius: 8px; cursor: pointer;">🔒 Encrypt</button>
        <button id="btn-intp-decrypt" style="background: #19382f; color: #e5eee9; font-weight: bold; padding: 10px 15px; border: 1px solid #f0b84b; border-radius: 8px; cursor: pointer;">🔑 Decrypt</button>
      </div>

      <div id="intp-pin-modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 10000; align-items: center; justify-content: center; backdrop-filter: blur(5px);">
        <div style="background: #10251f; padding: 25px; border-radius: 16px; width: 300px; border: 1px solid rgba(255,255,255,0.1);">
          <h3 id="intp-modal-title" style="color: #f1f5ed; margin-top: 0; font-family: sans-serif;">PIN Securitate</h3>
          <input type="password" id="intp-pin-input" placeholder="Enter PIN..." style="width: 100%; padding: 10px; margin-bottom: 15px; border-radius: 8px; border: 1px solid #ccc; background: #000; color: #fff; box-sizing: border-box;">
          <div style="color: #ff7a73; font-size: 12px; margin-bottom: 15px; display: none;" id="intp-pin-error"></div>
          <div style="display: flex; gap: 10px;">
            <button id="btn-intp-cancel" style="flex: 1; padding: 10px; background: transparent; color: #e5eee9; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; cursor: pointer;">Cancel</button>
            <button id="btn-intp-confirm" style="flex: 1; padding: 10px; background: #f0b84b; color: #172016; font-weight: bold; border: none; border-radius: 8px; cursor: pointer;">Confirm</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(container);
    attachEvents();
  }

  function attachEvents() {
    let currentMode = "encrypt"; 
    const modal = document.getElementById("intp-pin-modal");
    const title = document.getElementById("intp-modal-title");
    const pinInput = document.getElementById("intp-pin-input");
    const errorMsg = document.getElementById("intp-pin-error");

    document.getElementById("btn-intp-encrypt").onclick = () => {
      currentMode = "encrypt";
      title.innerText = "Criptează Datele";
      pinInput.value = ""; errorMsg.style.display = "none"; modal.style.display = "flex"; pinInput.focus();
    };

    document.getElementById("btn-intp-decrypt").onclick = () => {
      currentMode = "decrypt";
      title.innerText = "Decrypt & Restore";
      pinInput.value = ""; errorMsg.style.display = "none"; modal.style.display = "flex"; pinInput.focus();
    };

    document.getElementById("btn-intp-cancel").onclick = () => modal.style.display = "none";

    document.getElementById("btn-intp-confirm").onclick = async () => {
      try {
        errorMsg.style.display = "none";
        const msg = currentMode === "encrypt" 
          ? await encryptData(pinInput.value) 
          : await decryptData(pinInput.value);
        
        alert(msg);
        modal.style.display = "none";
        if (currentMode === "decrypt") window.location.reload(); // Reload to read restored data
      } catch (err) {
        errorMsg.innerText = err.message || "Error.";
        errorMsg.style.display = "block";
      }
    };
  }

  // We only return the function that allows the user to set the keys and start the widget
  return {
    init: function (customKeys = {}) {
      if (customKeys.dashboardKey) config.dashboardKey = customKeys.dashboardKey;
      if (customKeys.encryptedKey) config.encryptedKey = customKeys.encryptedKey;
      if (customKeys.uidKey) config.uidKey = customKeys.uidKey;
      
      // Inject UI only after configuration is complete
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", injectUI);
      } else {
        injectUI();
      }
    }
  };
})();

  // Export npm data
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PrivateDataAnywhere;
}
