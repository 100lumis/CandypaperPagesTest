import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

// tarvittavat
const firebaseConfig = {
  apiKey: "AIzaSyBH9Eb9mRWeSx4ySuyasPf0cQ0I0JZdm2s",
  authDomain: "candypaperdb-69758.firebaseapp.com",
  projectId: "candypaperdb-69758",
  storageBucket: "candypaperdb-69758.firebasestorage.app",
  messagingSenderId: "805331025403",
  appId: "1:805331025403:web:6bf883ad174a1886f49f5e"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const fakeEmail = username + "@mygame.com"; // Firebase needs an email

  try {
    // kirjautumisyritys
    const userCredential = await signInWithEmailAndPassword(auth, fakeEmail, password);
    const user = userCredential.user;
    console.log("Logged in:", user.uid);

    // Load or create player data
    const userDocRef = doc(db, "players", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      // Create new user doc with default score
      await setDoc(userDocRef, {
        username: username,
        score: 0
      });
      console.log("New player created!");
    } else {
      console.log("Welcome back,", userDocSnap.data().username);
    }

    // Redirect to game or show message
    alert("Kirjautuminen onnistui!");

  } catch (error) {
    // If login fails, try to register
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, fakeEmail, password);
      const user = userCredential.user;

      await setDoc(doc(db, "players", user.uid), {
        username: username,
        score: 0
      });

      alert("Uusi käyttäjä luotu ja kirjautunut!");
    } catch (err) {
      console.error("Login/Register failed:", err.message);
      alert("Virhe: " + err.message);
    }
  }
});
