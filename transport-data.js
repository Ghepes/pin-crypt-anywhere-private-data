/* Studio Wromo v1.0.3 MIT - trasport-data.js  Execute only with BACKEND URL request method for All type of backend to Send or GET data to web local storage  */
const CloudSyncWidget = {
  // Default settings overridden by init
  config: {
    appsScriptUrl: null,
    storageKey: "xyz_private_encrypted",
    uidKey: "xyz_uid" // default value
  },

  // We take the desired name
  init(options) {
    if (options.appsScriptUrl) this.config.appsScriptUrl = options.appsScriptUrl;
    if (options.storageKey) this.config.storageKey = options.storageKey;
    if (options.uidKey) this.config.uidKey = options.uidKey; // We take the desired name
  },

  getUid() {
    // Read the value from localStorage using the NAME set in the configuration
    const uid = localStorage.getItem(this.config.uidKey);
    if (!uid) {
      alert(`You must log in! (The key is missing: ${this.config.uidKey})`);
    }
    return uid;
  },

  async sendToCloud() {
    const uid = this.getUid();
    if (!uid) return;
    
    if (!this.config.appsScriptUrl) {
      console.error("Error: BACKEND_URL was not configured");
      return;
    }

    const encryptedData = localStorage.getItem(this.config.storageKey);
    if (!encryptedData) {
      console.warn("There is no locally encrypted data to send.");
      return;
    }

    // Clean JSON, no extra layers of arrays
    const payloadObj = {
      uid: uid,
      payload: encryptedData,
      type: "private"
    };

    try {
      const response = await fetch(this.config.appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payloadObj)
      });
      
      const result = await response.json();
      alert("Data successfully saved under ID: " + uid);
    } catch (error) {
      console.error("Error sending:", error);
    }
  },

  async getFromCloud() {
    const uid = this.getUid();
    if (!uid) return;
    
    if (!this.config.appsScriptUrl) {
      console.error("Error: BACKEND_URL was not configured");
      return;
    }

    const url = `${this.config.appsScriptUrl}?uid=${uid}&type=private`;

    try {
      const response = await fetch(url);
      const result = await response.json();

      if (result.payload) {
        localStorage.setItem(this.config.storageKey, result.payload);
        alert("Data restored! Now use the PIN to decrypt it.");
      } else {
        alert("No saved data was found for your account.");
      }
    } catch (error) {
      console.error("Download error:", error);
    }
  }
};

// We protect the export of NPM
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CloudSyncWidget;
}

