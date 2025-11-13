const admin = require('firebase-admin');
admin.initializeApp(); // Cloud Shell or server must have credentials
const uid = process.argv[2];
if (!uid) { console.error("Usage: node set-admin.js <UID>"); process.exit(1); }
admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(()=> { console.log("admin claim set for", uid); process.exit(0); })
  .catch(err=> { console.error(err); process.exit(1); });
