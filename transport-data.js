const CloudSyncWidget = {
  // Default (empty) settings that will be overwritten from the dashboard: by Studio Wromo 2026 MIT
  config: {
    appsScriptUrl: null,
    storageKey: "intp_dashboard_private_encrypted", // a default value
    uid: null
  },

  // The function through which the npm package user enters data
  init(options) {
    if (options.appsScriptUrl) this.config.appsScriptUrl = options.appsScriptUrl;
    if (options.storageKey) this.config.storageKey = options.storageKey;
    if (options.uid) this.config.uid = options.uid;
  },

  getUid() {
    // Takes the manually injected UID OR the one from localStorage
    const uid = this.config.uid || localStorage.getItem("wromo_uid");
    if (!uid) {
      alert("You must log in before syncing data!");
    }
    return uid;
  },

  async sendToCloud() {
    const uid = this.getUid();
    if (!uid) return;
    
    if (!this.config.appsScriptUrl) {
      console.error("Error: APPS_SCRIPT_URL was not configured by .init()");
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
      console.error("Error: APPS_SCRIPT_URL was not configured via .init()");
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
// Export for NPM
// module.exports = CloudSyncWidget; (for CommonJS)
// or: export default CloudSyncWidget; (for ES Modules)
// Export pentru NPM
// În loc de: module.exports = CloudSyncWidget;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CloudSyncWidget;
}
