import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyD1ZlFQnxPEL9s7L7m-ogCVG4pVEBi_sbo",
  authDomain: "ccs-career-cred-13.firebaseapp.com",
  projectId: "ccs-career-cred-13",
  storageBucket: "ccs-career-cred-13.firebasestorage.app",
  messagingSenderId: "300669506553",
  appId: "1:300669506553:web:626487cd320eede5ba6328"
};
var app = initializeApp(firebaseConfig);
var auth = getAuth(app);
var db = initializeFirestore(
  app,
  {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  },
  "ccs-db"
);
//#endregion
export { auth, db, app, firebaseConfig };
