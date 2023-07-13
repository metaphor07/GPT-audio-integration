const firebase = require("firebase/compat/app");
require("firebase/compat/auth");
require("firebase/compat/firestore");
require("firebase/compat/storage");

// Here, is the firebase configuration with my details
const firebaseConfig = {
  apiKey: "AIzaSyAlfXRUCngB7XSN8TXiySbT0-Oqt1MwiNo",
  authDomain: "voice-assistance-44bf6.firebaseapp.com",
  projectId: "voice-assistance-44bf6",
  storageBucket: "voice-assistance-44bf6.appspot.com",
  messagingSenderId: "318455382511",
  appId: "1:318455382511:web:ac29a46658bfb05fa0f61a",
};
firebase.initializeApp(firebaseConfig); // Initialize Firebase with the provided configuration
const storage = firebase.storage(); // Access the Firebase storage service

const upload = (item, label, filename) => {
  return new Promise((resolve, reject) => {
    const fileName = new Date().getTime() + label + filename;

    // Upload the item (file buffer) to Firebase storage
    const uploadTask = storage
      .ref(`/items/${fileName}`)
      .put(item, { contentType: "audio/mpeg" });

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // This is an optional event listener
        // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.log(error);
        reject(error); // If an error occurs during upload, reject the promise with the error
      },
      () => {
        // When the upload is complete, get the download URL of the uploaded file
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          resolve(url); // Resolve the promise with the download URL
        });
      }
    );
  });
};

module.exports = upload;  // Export the upload function to be used in other modules
