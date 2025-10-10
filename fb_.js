import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

// muuta.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
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
