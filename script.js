// Import Firebase SDKs from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBi0DtNzX0niHbV4LtId7PaxLoD8Pphy6U",
  authDomain: "comment-on-isrt-8a634.firebaseapp.com",
  databaseURL: "https://comment-on-isrt-8a634-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "comment-on-isrt-8a634",
  storageBucket: "comment-on-isrt-8a634.appspot.com",
  messagingSenderId: "173989173917",
  appId: "1:173989173917:web:613693b2c98c4c121e9274"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM elements
const commentForm = document.getElementById("commentForm");
const commentText = document.getElementById("commentText");
const commentsContainer = document.getElementById("commentsContainer");

// Function to load and display comments
function loadComments() {
  const commentsRef = ref(db, "comments");

  onValue(commentsRef, (snapshot) => {
    const data = snapshot.val();
    commentsContainer.innerHTML = "";

    if (!data) {
      commentsContainer.innerHTML = "<p>No comments yet. Be the first!</p>";
      return;
    }

    // Convert data object to array
    const commentsArray = Object.values(data).sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    commentsArray.forEach((comment) => {
      const div = document.createElement("div");
      div.classList.add("comment");
      const date = new Date(comment.timestamp);
      const formatted = `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
      div.innerHTML = `<p>${comment.text}</p><small>Posted anonymously on ${formatted}</small>`;
      commentsContainer.appendChild(div);
    });
  });
}

// Handle new comment submission
commentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = commentText.value.trim();
  if (!text) return;

  const commentsRef = ref(db, "comments");
  push(commentsRef, {
    text,
    timestamp: new Date().toISOString()
  });

  commentText.value = "";
});

// Load comments when page opens
loadComments();
