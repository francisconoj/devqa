import * as firebase from 'firebase';
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB95j8bTcv5n7cIJUFRQ-3amOK9-eH0ssc",
  authDomain: "devola-1376e.firebaseapp.com",
  projectId: "devola-1376e",
  storageBucket: "devola-1376e.appspot.com",
  messagingSenderId: "800013144201",
  appId: "1:800013144201:web:afb2188c24b36baa63b658",
  measurementId: "G-4K64YV676Z"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

export { firestore, firebase };