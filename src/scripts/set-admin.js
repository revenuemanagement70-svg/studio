// This script MUST be run in a secure server environment
// (like Google Cloud Shell) with proper admin credentials.
// DO NOT expose this code or your service account credentials
// in your client-side application.

const admin = require('firebase-admin');

// When running in Cloud Shell or another Google Cloud environment,
// initializeApp() automatically uses the environment's default credentials.
admin.initializeApp();

const uid = process.argv[2];

if (!uid) {
  console.error("Usage: node src/scripts/set-admin.js <UID>");
  console.error("Please provide the Firebase User ID of the user you want to make an admin.");
  process.exit(1);
}

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`Successfully set admin claim for user: ${uid}`);
    console.log("The user must sign out and sign back in for the changes to take effect.");
    process.exit(0);
  })
  .catch(err => {
    console.error("Error setting custom user claims:", err);
    process.exit(1);
  });
