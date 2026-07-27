# pin-crypt-anywhere-private-data
pin encrypt anywhere user private data : return crypto Key PBKDF2 salt SHA-256 AES-GCM encrypt decrypt

In this NPM Widgets logic there are two separate logics:
1. Transport encrypted files to global cloud or upload
2. Total deletion of user dashboard data from local storage (Dashboard must save all data in a single KEY Name JSON)

## v1.0.1

encryptedKey: "xxx_xyz_enkrypt", =  storageKey: "xxx_xyz_enkrypt"


CDN mode:
Do not use defer> to js url 
Widget code: must be called after page load




## Install NPM :
```
npm i pin-crypt-anywhere-private-data

```
## After install NPM:
```
// Dacă are nevoie de ambele:
import { PrivateDataAnywhere, CloudSyncWidget } from 'pin-crypt-anywhere-private-data';

// Encryption initialization (with UI)
PrivateDataAnywhere.init({
  dashboardKey: "date_dashboard",
  encryptedKey: "date_crypt",
  uidKey: "id_user"
});

// Transport initialization (with UI)
CloudSyncWidget.init({
  appsScriptUrl: "https://script.google.com/...",
  storageKey: "date_crypt"
});
```

## 1. CDN :
```
<script src="https://cdn.jsdelivr.net/npm/pin-crypt-anywhere-private-data@1.0.1/transport-data.js"></script>
```

## 1. Web Dashboard connect your URL, storage Key end UID user. Example:
```
<script>
  // Inițializezi pachetul cu datele tale specifice
  CloudSyncWidget.init({
    appsScriptUrl: "https://script.google.com/macros/s/AKxxxxxxxxxxxxxxxxKO7AlaABBB66665oLS7BDKYNjrLImgIqJ-k-Wjt8xUR_WeiF/exec",
    storageKey: "intp_dashboard_private_encrypted"
    // uid is omitted here because the getUid() function will automatically pull it from localStorage ("wromo_uid")
  });
</script>

<!-- Buttons for transferring or uploading data: Appears in the Webpage dashboard -->
<div id="cloud-sync-widget">
  <button onclick="CloudSyncWidget.sendToCloud()">⬆️ Send to Cloud Storage Bucket</button>
  <button onclick="CloudSyncWidget.getFromCloud()">⬇️ Request from Cloud to Local Storage</button>
</div>
```
## 1. transport-data.js : the transport from local to cloud and back, after it was encrypted! User data leaves localhost only Encrypted in cloud public.



## 2. Encrypt of data local storage:

## 2. CDN :
```
<script src="https://cdn.jsdelivr.net/npm/pin-crypt-anywhere-private-data@1.0.1/crypto-widget.js"></script> 
```

## Web Dashbord :

```
<!-- a. Upload your published package -->
<script src="https://cdn.jsdelivr.net/npm/pin-crypt-anywhere-private-data@1.0.1/crypto-widget.js"></script> 

<!-- b. Start the widget with your keys of local storage Key page -->
<script>
  PrivateDataAnywhere.init({
    dashboardKey: "my_custom_name_for_clear_data",
    encryptedKey: "my_custom_name_for_encryption",
    uidKey: "user_session_id" 
  });
</script>
```

## INFO

Merge 1. transport-data.js and 2. crypto-widget.js into the same page: the buttons will automatically appear: Encryption/Decryption and Transport Send/Uploud Buttons.





## Test Real Demo in web dashboard, via static index.html:
```
https://cdn.jsdelivr.net/npm/pin-crypt-anywhere-private-data@1.0.1/dash/index.html
```
Copy the index.html code and test it locally to understand the encryption logic between user local data web page  storage and its encryption.


For a quick solution to the uid data issue, I suggest adding Login via Magic Links from Firebase: https://www.npmjs.com/package/magic-link-signin-wromo