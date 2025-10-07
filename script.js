// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

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

// Load comments + replies
function loadComments() {
  const commentsRef = ref(db, "comments");
  onValue(commentsRef, (snapshot) => {
    const data = snapshot.val();
    commentsContainer.innerHTML = "";

    if (!data) {
      commentsContainer.innerHTML = "<p>No comments yet. Be the first!</p>";
      return;
    }

    Object.entries(data).forEach(([commentId, comment]) => {
      const commentBox = createCommentBox(commentId, comment, false);
      commentsContainer.appendChild(commentBox);
    });
  });
}

// Create a comment or reply box
function createCommentBox(id, data, isReply = false) {
  const box = document.createElement("div");
  box.classList.add(isReply ? "reply-box" : "comment-box");

  const text = document.createElement("p");
  text.textContent = data.text;

  const controls = document.createElement("div");
  controls.classList.add("controls");

  const likeBtn = document.createElement("button");
  likeBtn.textContent = `❤️ ${data.likes || 0}`;
  likeBtn.classList.add("like-btn");
  likeBtn.onclick = () => reactToPost(id, isReply, data.parentId);

  const replyBtn = document.createElement("button");
  replyBtn.textContent = "💬 Reply";
  replyBtn.classList.add("reply-btn");
  if (!isReply) replyBtn.onclick = () => showReplyForm(id, box);

  controls.appendChild(likeBtn);
  if (!isReply) controls.appendChild(replyBtn);

  box.appendChild(text);
  box.appendChild(controls);

  // Add replies if exist
  if (data.replies) {
    const repliesContainer = document.createElement("div");
    repliesContainer.classList.add("replies");
    Object.entries(data.replies).forEach(([replyId, replyData]) => {
      const replyBox = createCommentBox(replyId, replyData, true);
      repliesContainer.appendChild(replyBox);
    });
    box.appendChild(repliesContainer);
  }

  return box;
}

// React (like) feature
function reactToPost(id, isReply, parentId = null) {
  let path;
  if (isReply) {
    path = `comments/${parentId}/replies/${id}/likes`;
  } else {
    path = `comments/${id}/likes`;
  }

  const likesRef = ref(db, path);
  update(likesRef, { ".sv": { "increment": 1 } }); // Firebase increment
}

// Add a new main comment
commentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = commentText.value.trim();
  if (!text) return;

  const commentsRef = ref(db, "comments");
  push(commentsRef, {
    text,
    timestamp: new Date().toISOString(),
    likes: 0
  });

  commentText.value = "";
});

// Show reply form inline
function showReplyForm(commentId, commentBox) {
  if (commentBox.querySelector(".reply-form")) return;

  const form = document.createElement("form");
  form.classList.add("reply-form");
  form.innerHTML = `
    <textarea placeholder="Write a reply..." required></textarea>
    <button type="submit">Submit Reply</button>
  `;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const replyText = form.querySelector("textarea").value.trim();
    if (!replyText) return;

    const repliesRef = ref(db, `comments/${commentId}/replies`);
    push(repliesRef, {
      text: replyText,
      timestamp: new Date().toISOString(),
      likes: 0,
      parentId: commentId
    });

    form.remove();
  });

  commentBox.appendChild(form);
}

// Load everything
loadComments();
