import firebase from "firebase";

firebase.initializeApp({
   apiKey: "OsiKPDNjfO6JxxqxzCzNtroa0P9CO2NPX5KO8YRB",
   databaseURL: "https://apx-m6-ff667-default-rtdb.firebaseio.com",
   projectId: "apx-m6-ff667",
   authDomain: "apx-m6-ff667.firebaseapp.com",
});

// Conectar Realtime Database
const rtdb = firebase.database();

export { rtdb };
