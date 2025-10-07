// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBi0DtNzX0niHbV4LtId7PaxLoD8Pphy6U",
  authDomain: "comment-on-isrt-8a634.firebaseapp.com",
  databaseURL: "https://comment-on-isrt-8a634-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "comment-on-isrt-8a634",
  storageBucket: "comment-on-isrt-8a634.firebasestorage.app",
  messagingSenderId: "173989173917",
  appId: "1:173989173917:web:613693b2c98c4c121e9274",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
  const commentForm = document.getElementById("commentForm");
  const commentText = document.getElementById("commentText");
  const commentsContainer = document.getElementById("commentsContainer");

  // Function to display comments from Firebase
  function loadComments() {
    const commentsRef = ref(database, "comments");
    onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      commentsContainer.innerHTML = "";

      if (!data) {
        commentsContainer.innerHTML = "<p>No comments yet. Be the first!</p>";
        return;
      }

      // Convert to array and reverse for newest first
      const commentsArray = Object.values(data).sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      commentsArray.forEach((comment) => {
        const commentDiv = document.createElement("div");
        commentDiv.classList.add("comment");

        const date = new Date(comment.timestamp);
        const formattedDate =
          date.toLocaleDateString() + " at " + date.toLocaleTimeString();

        commentDiv.innerHTML = `
          <p>${comment.text}</p>
          <small>Posted Anonymously on ${formattedDate}</small>
        `;
        commentsContainer.appendChild(commentDiv);
      });
    });
  }

  // Handle new comment submission
  commentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = commentText.value.trim();
    if (!text) return;

    const newComment = {
      text,
      timestamp: new Date().toISOString(),
    };

    const commentsRef = ref(database, "comments");
    push(commentsRef, newComment);

    commentText.value = "";
  });

  // Load comments when page loads
  loadComments();
});
