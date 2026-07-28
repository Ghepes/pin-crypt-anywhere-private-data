/* Studio Wromo v1.0.2 MIT - wigets-get-public-data.js  Execute only the public GET data request method for sheet or any type of bucket url */
window.PublicDataFetcher = (function () {
  const config = {
    uidKey: "id_user", 
    storageKey: "intp_dashboard_private_encrypted",
    publicUrl: null, // For Bucket / R2
    sheetId: null,   // For Google Sheets Gviz
    sheetTab: "Sheet1" // Optional sheet name, if the tab is not the first
  };

  return {
    init(options) {
      if (options.uidKey) config.uidKey = options.uidKey;
      if (options.storageKey) config.storageKey = options.storageKey;
      if (options.publicUrl) config.publicUrl = options.publicUrl;
      if (options.sheetId) config.sheetId = options.sheetId;
      if (options.sheetTab) config.sheetTab = options.sheetTab;
    },

    getUid() {
      const uid = localStorage.getItem(config.uidKey);
      if (!uid) {
        console.error(`Error: No value found in localStorage for key '${config.uidKey}'.`);
      }
      return uid;
    },

    async fetchPublicData() {
      const uid = this.getUid();
      if (!uid) return;

      // 1. BUCKET METHOD / R2 (Dedicated JSON file)
      if (config.publicUrl) {
        try {
          // We clean the slash at the end if there is one, then we add /UID.json
          const baseUrl = config.publicUrl.replace(/\/$/, "");
          const targetUrl = `${baseUrl}/${uid}.json`;
          
          const response = await fetch(targetUrl);
          
          if (!response.ok) throw new Error("Fișierul utilizatorului nu a fost găsit în Bucket.");
          
          const result = await response.json();
          // We assume that the useful data is returned as a complete object or has a payload property
          const finalData = typeof result === "string" ? result : JSON.stringify(result);
          
          localStorage.setItem(config.storageKey, finalData);
          console.log(`Datele au fost extrase din Bucket (${uid}.json) și salvate în '${config.storageKey}'.`);
          
        } catch (error) {
          console.error("Error in the Bucket method:", error);
        }
        return;
      }

      // 2. METHOD GOOGLE SHEETS GVIZ
      if (config.sheetId) {
        try {
          const gvizUrl = `https://docs.google.com/spreadsheets/d/${config.sheetId}/gviz/tq?tqx=out:json&sheet=${config.sheetTab}`;
          const response = await fetch(gvizUrl);
          const textResult = await response.text();
          
          // We clean the executable text added by Google
          const jsonString = textResult.substring(textResult.indexOf('{'), textResult.lastIndexOf('}') + 1);
          const allData = JSON.parse(jsonString);

          let foundPayload = null;

          if (allData.table && allData.table.rows) {
            const rows = allData.table.rows;
            for (let i = 0; i < rows.length; i++) {
              const row = rows[i];
              // row.c[0].v = Column A (UID), row.c[1].v = Column B (Data)
              if (row.c && row.c[0] && String(row.c[0].v) === uid) {
                if (row.c[1] && row.c[1].v) {
                  foundPayload = row.c[1].v;
                }
                break;
              }
            }
          }

          if (foundPayload) {
            localStorage.setItem(config.storageKey, foundPayload);
            console.log(`Datele au fost extrase din Sheet și salvate în '${config.storageKey}'.`);
          } else {
            console.warn(`UID '${uid}' was not found in Sheet.`);
          }
        } catch (error) {
          console.error("Error in Sheet Gviz method:", error);
        }
        return;
      }

      console.error("Error: Not configured 'publicUrl' (Bucket) or 'sheetId' (Google Sheets ID).");
    }
  };
})();

// Export for NPM
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PublicDataFetcher;
}
