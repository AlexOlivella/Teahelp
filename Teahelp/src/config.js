import * as firebase from 'firebase'
import 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyB1XnqSnvTm1Qt_tRVbnquELd5OvZ65zWE",
  authDomain: "teahelp-2c2af.firebaseapp.com",
  databaseURL: "https://teahelp-2c2af.firebaseio.com",
  projectId: "teahelp-2c2af",
  storageBucket: "teahelp-2c2af.appspot.com",
  messagingSenderId: "156554199357",
  appId: "1:156554199357:web:9717d1b4ee3d610b84c554"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
