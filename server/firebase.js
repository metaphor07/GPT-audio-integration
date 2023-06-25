const firebase = require("firebase/compat/app");
require("firebase/compat/auth");
require("firebase/compat/firestore");
// import firebase from "firebase/app";
require("firebase/compat/storage");

const firebaseConfig = {
  apiKey: "AIzaSyAlfXRUCngB7XSN8TXiySbT0-Oqt1MwiNo",
  authDomain: "voice-assistance-44bf6.firebaseapp.com",
  projectId: "voice-assistance-44bf6",
  storageBucket: "voice-assistance-44bf6.appspot.com",
  messagingSenderId: "318455382511",
  appId: "1:318455382511:web:ac29a46658bfb05fa0f61a",
};
firebase.initializeApp(firebaseConfig);
// const storage = firebase.storage();
const storage = firebase.storage();
// module.exports = storage;

const upload = (item, label, filename) => {
  return new Promise((resolve, reject) => {
    const fileName = new Date().getTime() + label + filename;
    const uploadTask = storage
      .ref(`/items/${fileName}`)
      .put(item, { contentType: "audio/mpeg" });
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.log(error);
        reject(error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          resolve(url);
        });
      }
    );
  });
};

module.exports = upload;
