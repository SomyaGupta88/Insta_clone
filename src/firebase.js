import firebase from 'firebase';

  const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDTKiP57_bn73UfeypQGPPrwdOCxxAnuJ4",
    authDomain: "instagram-clone-83636.firebaseapp.com",
    databaseURL: "https://instagram-clone-83636.firebaseio.com",
    projectId: "instagram-clone-83636",
    storageBucket: "instagram-clone-83636.appspot.com",
    messagingSenderId: "751286555448",
    appId: "1:751286555448:web:b764c87d125ca9f8d7e7cd",
    measurementId: "G-LJ6MXP9CHG"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export { db, auth, storage };