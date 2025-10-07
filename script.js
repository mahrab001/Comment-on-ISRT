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

// Load comments (with replies)
function loadComments() {
  const commentsRef = ref(db, "comments");
  onValue(commentsRef, (snapshot) => {
    const data = snapshot.val();
    commentsContainer.innerHTML = "";

    if (!data) {
      commentsContainer.innerHTML = "<p>No comments yet. Be the first!</p>";
      return;
    }

    // Convert to array and sort newest first
    const commentsArray = Object.entries(data).sort(
      (a, b) => new Date(b[1].timestamp) - new Date(a[1].timestamp)
    );

    commentsArray.forEach(([commentId, comment]) => {
      const commentDiv = document.createElement("div");
      commentDiv.classList.add("comment");

      const date = new Date(comment.timestamp);
      const formattedDate =
        date.toLocaleDateString() + " at " + date.toLocaleTimeString();

      commentDiv.innerHTML = `
        <p>${comment.text}</p>
        <small>Posted Anonymously on ${formattedDate}</small>
        <button class="reply-btn" data-id="${commentId}">💬 Reply</button>
        <div class="replies"></div>
      `;

      // Add replies if they exist
      const repliesDiv = commentDiv.querySelector(".replies");
      if (comment.replies) {
        const repliesArray = Object.values(comment.replies).sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
        repliesArray.forEach((reply) => {
          const replyDiv = document.createElement("div");
          replyDiv.classList.add("reply");
          const replyDate = new Date(reply.timestamp);
          const formattedReplyDate =
            replyDate.toLocaleDateString() +
            " at " +
            replyDate.toLocaleTimeString();
          replyDiv.innerHTML = `
            <p>${reply.text}</p>
            <small>Replied on ${formattedReplyDate}</small>
          `;
          repliesDiv.appendChild(replyDiv);
        });
      }

      commentsContainer.appendChild(commentDiv);
    });

    // Add reply button functionality
    document.querySelectorAll(".reply-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const commentId = e.target.getAttribute("data-id");
        showReplyForm(commentId, e.target);
      });
    });
  });
}

// Add a new main comment
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

// Show inline reply form
function showReplyForm(commentId, replyButton) {
  // Prevent multiple reply forms
  if (replyButton.nextElementSibling?.classList.contains("reply-form")) return;

  const form = document.createElement("form");
  form.classList.add("reply-form");
  form.innerHTML = `
    <textarea placeholder="Write your reply..." required></textarea>
    <button type="submit">Submit Reply</button>
  `;

  replyButton.insertAdjacentElement("afterend", form);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = form.querySelector("textarea").value.trim();
    if (!text) return;

    const replyRef = ref(db, `comments/${commentId}/replies`);
    push(replyRef, {
      text,
      timestamp: new Date().toISOString()
    });

    form.remove(); // Hide the form after submission
  });
}

// Load comments on page start
loadComments();
