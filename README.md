# pin-crypt-anywhere-private-data
pin encrypt anywhere user private data : return crypto Key PBKDF2 salt SHA-256 AES-GCM encrypt decrypt

In this NPM Widgets logic there are two separate logics:
1. Transport encrypted files to global cloud or upload
2. Total deletion of user dashboard data from local storage (Dashboard must save all data in a single KEY Name JSON)

## v1.0.5
Correcting README.md Current integrity number:
You can use the integrity formula yourself to find the correct hash number.

```
node -e "console.log('sha512-' + require('crypto').createHash('sha512').update(require('fs').readFileSync('ADD__FILE__EXAMPLE.js')).digest('base64'))"
```
List the integrity number of that file: a simple change of letter changes the integrity number, which is no longer related to the real file from NPM CDN packages: therefore it must be identical!

EACH FILE HAS ITS OWN INTEGRITY!!!

There is also an integrity hash on the entire NPM project: that number is only per TOTAL NPM Packaging: And it is not used on a single file.

The command used for packaging Total NPM is:
where the project is formed in json Maps and lists the data of each file and what size,  the project is packaged in gz file format
```
npm pack --json
```

## v1.0.4
Rearrange README.md


## v1.0.3
README.md

## v1.0.2
In version v1.0.2: 
- a new file with the "GET public data" logic was added: wigets-get-public-data.js
- Added uidKey also in transport-data.js
- globally you can combine having the get button from: wigets-get-public-data.js



1. Sending (One universal execution) to BACKEND :
Sending to a single standard method. It doesn't matter if you have Google Apps Script, Cloud Run, serverless or something else behind it.

The mandatory pattern that the backend must respect:

Accept an HTTP POST (or PUT) request.

Be able to read a body in JSON format with the fixed structure:

{ "uid": "value_id", "payload": "date_encrypted_long", "type": "private" }

Once the backend receives this standard package, it is responsible for the internal logic (where it writes the data, how it formats it). Local script only does the sending.

2. Receiving (Private vs. Public)
A. Private data url, the server thinks and only gives you your package. 
B. Public data url, you download entire registry (the entire database), the local script looks for the UID and extracts it.

Here are the 4 different ways to get data:

A. Private Get (1 way)

API GET (Backend fetches): You make a request fetch(url_backend?uid=your_ID). The backend checks the identity/parameter and returns a clean JSON with just your data (ex: { "payload": "..." }).

B. Public Get (4 ways)

This method only about public data like products, blog posts and others, or maps.json: all in one json!
Pure JSON (Bucket / R2): You do fetch(url_public.json). You download a huge array/object. The local script iterates through it, finds the row where wromo_uid matches and extracts the payload.

For specific uid data for a specific user, this method is used: Pure JSON (Bucket / R2): You do fetch(wromo_uid.json) specifically to a domain bucket where you already know it is located the wromo_uid.json, on request only asks for the user's json uid. You download only the specific array/object_uid json.

Google Sheets Gviz (Hidden Endpoint): You do fetch(url_gviz). Google gives you the data, but corrupts it by adding executable text (/*O_o*/). Here the code is completely different because it has to cut off the unnecessary text, parse the JSON and navigate through the table.rows.

<head> Inject (Global Variable) Method: As you may have noticed in DevTools, public data is attached directly to the HTML (e.g. <script src="database.js"></script> containing const GLOBAL_DATA = [...]). In this case, fetch() is no longer used. Your code simply reads the GLOBAL_DATA variable directly from the page's memory, finds the UID, and "Swaps" it directly into localStorage.



## v1.0.1
Same name for encryptedKey: "...", or storageKey: "..."


CDN mode:
Do not use defer> to js url 
Widget code: must be called after page load




## Install NPM :
```
npm i pin-crypt-anywhere-private-data

```
## After install NPM:
```
// all:
import { PrivateDataAnywhere, CloudSyncWidget } from 'pin-crypt-anywhere-private-data';

// Encryption initialization (with UI)
PrivateDataAnywhere.init({
  dashboardKey: "date_dashboard",
  encryptedKey: "example_xyz_private_encrypted",
  uidKey: "id_user"
});

// Transport initialization (with UI)
CloudSyncWidget.init({
  appsScriptUrl: "https://script.google.com/...bucket",
  storageKey: "example_xyz_private_encrypted"
  uidKey: "id_user"
});
```


## 1. CDN :
## 1. transport-data.js : the transport from local to cloud and back, after it was encrypted! User data leaves localhost only Encrypted in cloud public.
## 1. Web Dashboard connect your URL, storage Key end UID user. Example:
```
<script src="https://cdn.jsdelivr.net/npm/pin-crypt-anywhere-private-data@1.0.5/transport-data.js" integrity="sha512-TUsB5Nr9YqHG1ddtnyHFKtkoplls2BlJ72jWCmqLfpZSBWQTXOsEN0wj/tayoVKv2FJsPTvov2ePeuQqxJAC5A==" crossorigin="anonymous"></script>
<script>
  <!-- Add your keys global storage: appsScriptUrl, storageKey, uidKey  -->
  CloudSyncWidget.init({
    appsScriptUrl: "https://my_domain.com/data",
    storageKey: "example_xyz_private_encrypted",
    uidKey: "user_session_id"
  });
</script>

<!-- Buttons for transferring or uploading data: Appears in the Webpage dashboard -->
<div id="cloud-sync-widget">
  <button onclick="CloudSyncWidget.sendToCloud()">⬆️ Send to Storage</button>
  <button onclick="CloudSyncWidget.getFromCloud()">⬇️ Request to Local Storage</button>
</div>
```




## 2. Encrypt of data local storage:

## 2. CDN :
## Web Dashbord encryption/decryption buttons :

```
<!-- crypto widget local storage -->
<script src="https://cdn.jsdelivr.net/npm/pin-crypt-anywhere-private-data@1.0.5/crypto-widget.js" integrity="sha512-AGOzyn30V6tXWLrlTOqhUboEuxW7z9/+ZgTgzd7SKEVjHpWtPTWRZ6emVd587L3UBgwGi8UtEcsHVQqUcrCNnQ==" crossorigin="anonymous"></script>

<!-- Add your keys local storage: dashboardKey, encryptedKey, uidKey  -->
<script>
  PrivateDataAnywhere.init({
    dashboardKey: "example_data_localstorage",
    encryptedKey: "example_xyz_private_encrypted",
    uidKey: "user_session_id" 
  });
</script>
```

## INFO

1. transport-data.js and 2. crypto-widget.js into the same page: the buttons will automatically appear: Encryption/Decryption and Transport Send/Uploud Buttons.





##  wigets-get-public-data.js : Execute only the public GET data request - method for sheet or any type of bucket url */

## For public Google Sheet:

```
<script src="https://cdn.jsdelivr.net/npm/pin-crypt-anywhere-private-data@1.0.5/wigets-get-public-data.js" integrity="sha512-6nDO1trJF8lgWWZn6LKTvZNe/hMOOtcbDZ2bEItXfDJQE6SLpXg3VkyENTo+ZBZq+vx3qjL+dWec3zRZdrn7gw==" crossorigin="anonymous"></script>
<script>
PublicDataFetcher.init({
uidKey: "user_id",
storageKey: "example_xyz_private_encrypted",
sheetId: "13KqImbXXXXxxx-i-GXZzxrm-sIICC5ZE",
sheetTab: "Date_Private"
});

</script>

<div id="public-data-fetcher">
<!-- Call the PublicDataFetcher object and the fetchPublicData function -->
<button onclick="PublicDataFetcher.fetchPublicData()">⬇️ Request to Local</button>
</div>

```

## For all public Bucket url:

```
<script src="https://cdn.jsdelivr.net/npm/pin-crypt-anywhere-private-data@1.0.5/wigets-get-public-data.js" integrity="sha512-6nDO1trJF8lgWWZn6LKTvZNe/hMOOtcbDZ2bEItXfDJQE6SLpXg3VkyENTo+ZBZq+vx3qjL+dWec3zRZdrn7gw==" crossorigin="anonymous"></script>
<script>
PublicDataFetcher.init({
uidKey: "xyz_uid",
storageKey: "example_xyz_private_encrypted",
publicUrl: "https://pub.domain-your.com/date/"
});

</script>

<div id="public-data-fetcher">
<!-- Call the PublicDataFetcher object and the fetchPublicData function -->
<button onclick="PublicDataFetcher.fetchPublicData()">⬇️ Request to Local</button>
</div> 
```

To add the ⬆️ Send option: you must include the backend options below via transport-data.js


## Test Real Demo in web dashboard, via static index.html:

```
https://cdn.jsdelivr.net/npm/pin-crypt-anywhere-private-data@1.0.5/dash/index.html
```
Copy the index.html code and test it locally to understand the encryption logic between user local data web page  storage and its encryption.


For a quick solution to the uid data issue, I suggest adding Login via Magic Links from Firebase: https://www.npmjs.com/package/magic-link-signin-wromo


## Private Data safe: The user is sure that no one can read their private data, even if it were in the Public Cloud. No one can decrypt and read the users data! Decrypted visible data remains in local storage: and does not leave the users device. When private data leaves the device: it is 100% encrypted.
## This way, companies use a simple UID code from the login: and that's all they have from the user.
## If Hackers copy the data, they have no way to decrypt it.
## Companies can use: Cookie tracking - But without losing sensitive data

![Pin/Encryption](<./dash/Screenshot_pin-crypt-anywhere-private-data.png>)
![User Dashboard](<./dash/Screenshot_pin-crypt-anywhere-private.png>)