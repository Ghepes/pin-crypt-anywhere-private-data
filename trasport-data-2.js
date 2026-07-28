window.CloudSyncWidget = (function () {
  const config = {
    appsScriptUrl: null,
    publicUrl: null,
    storageKey: "intp_dashboard_private_encrypted",
    uidKey: "wromo_uid"
  };

  return {
    init(options) {
      if (options.appsScriptUrl) config.appsScriptUrl = options.appsScriptUrl;
      if (options.publicUrl) config.publicUrl = options.publicUrl;
      if (options.storageKey) config.storageKey = options.storageKey;
      if (options.uidKey) config.uidKey = options.uidKey;
    },

    getUid() {
      const uid = localStorage.getItem(config.uidKey);
      if (!uid) alert("Trebuie să te autentifici înainte de a sincroniza datele!");
      return uid;
    },

    async sendToCloud() {
      const uid = this.getUid();
      if (!uid || !config.appsScriptUrl) return;

      const encryptedData = localStorage.getItem(config.storageKey);
      if (!encryptedData) {
        console.warn("Nu există date criptate local pentru a fi trimise.");
        return;
      }

      const payloadObj = {
        uid: uid,
        payload: encryptedData,
        type: "private"
      };

      try {
        await fetch(config.appsScriptUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payloadObj)
        });
        alert("Date salvate cu succes în Cloud sub ID-ul: " + uid);
      } catch (error) {
        console.error("Eroare la trimitere:", error);
      }
    },

    async getFromCloud() {
      const uid = this.getUid();
      if (!uid) return;

      // 1. Dacă folosim URL-ul global public ("cârnatul" JSON)
      if (config.publicUrl) {
        try {
          const response = await fetch(config.publicUrl);
          const allData = await response.json(); // Descărcăm toată lista

          let foundPayload = null;

          // Căutăm UID-ul în JSON-ul uriaș
          if (Array.isArray(allData)) {
            // Caută rândul care are UID-ul curent (suportă format array [uid, payload] sau obiect {uid: ..., payload: ...})
            const userRow = allData.find(row => row === uid || row[0] === uid || row.uid === uid);
            if (userRow) {
              foundPayload = userRow.payload || userRow[1];
            }
          } else if (typeof allData === "object" && allData[uid]) {
            // Dacă JSON-ul este un obiect mare cu UID-urile pe post de chei
            foundPayload = allData[uid].payload || allData[uid];
          }

          if (foundPayload) {
            localStorage.setItem(config.storageKey, foundPayload);
            alert("Swap reușit! Datele au fost extrase din baza publică și restaurate local.");
          } else {
            alert("UID-ul tău nu a fost găsit în arhiva publică.");
          }
        } catch (error) {
          console.error("Eroare la citirea URL-ului public:", error);
          alert("A eșuat extragerea datelor publice.");
        }
        return; // Oprim execuția aici dacă am folosit publicUrl
      }

      // 2. Fallback: Dacă folosim backend-ul Apps Script (cere doar datele specifice)
      if (config.appsScriptUrl) {
        try {
          const fetchUrl = `${config.appsScriptUrl}?uid=${uid}&type=private`;
          const response = await fetch(fetchUrl);
          const textResult = await response.text();

          let finalData = textResult;
          try {
            const parsed = JSON.parse(textResult);
            if (parsed.payload) finalData = parsed.payload;
          } catch (e) {}

          localStorage.setItem(config.storageKey, finalData);
          alert("Date restaurate din backend! Acum folosește PIN-ul pentru a le decripta.");
        } catch (error) {
          console.error("Eroare la descărcare backend:", error);
        }
      } else {
        console.error("Eroare: Niciun URL de descărcare configurat.");
      }
    }
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CloudSyncWidget;
}
