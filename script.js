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

// Available reactions
const reactions = ["👍", "😂", "😍", "😢", "😮", "😡", "😀"];

// Store comments
let comments = [];

commentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = commentText.value.trim();
  if (!text) return;

  const comment = {
    id: Date.now(),
    text,
    replies: [],
    reactions: {},
  };

  comments.unshift(comment);
  commentText.value = "";
  renderComments();
});

function renderComments() {
  commentsContainer.innerHTML = "";

  if (comments.length === 0) {
    commentsContainer.innerHTML = "<p>No comments yet. Be the first!</p>";
    return;
  }

  comments.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    commentsContainer.appendChild(commentElement);
  });
}

function createCommentElement(comment, isReply = false) {
  const box = document.createElement("div");
  box.classList.add(isReply ? "reply-box" : "comment-box");

  const text = document.createElement("p");
  text.textContent = comment.text;
  box.appendChild(text);

  // Controls
  const controls = document.createElement("div");
  controls.classList.add("controls");

  // Reaction options (left)
  const reactionContainer = document.createElement("div");
  reactionContainer.classList.add("reaction-options");

  reactions.forEach((emoji) => {
    const span = document.createElement("span");
    span.textContent = emoji;
    span.classList.add("reaction");

    // Show reaction count if exists
    if (comment.reactions[emoji]) {
      span.textContent = `${emoji} ${comment.reactions[emoji]}`;
    }

    span.addEventListener("click", () => {
      comment.reactions[emoji] = (comment.reactions[emoji] || 0) + 1;
      renderComments();
    });

    reactionContainer.appendChild(span);
  });

  controls.appendChild(reactionContainer);

  // Reply button (right)
  const replyBtn = document.createElement("button");
  replyBtn.textContent = "💬 Reply";
  replyBtn.classList.add("reply-btn");
  controls.appendChild(replyBtn);

  box.appendChild(controls);

  // Reply form
  const replyForm = document.createElement("form");
  replyForm.classList.add("reply-form");
  replyForm.style.display = "none";

  const replyInput = document.createElement("textarea");
  replyInput.placeholder = "Write a reply...";
  const replySubmit = document.createElement("button");
  replySubmit.textContent = "Post Reply";

  replyForm.appendChild(replyInput);
  replyForm.appendChild(replySubmit);
  box.appendChild(replyForm);

  replyBtn.addEventListener("click", () => {
    replyForm.style.display =
      replyForm.style.display === "none" ? "block" : "none";
  });

  replyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const replyText = replyInput.value.trim();
    if (!replyText) return;

    const reply = {
      id: Date.now(),
      text: replyText,
      reactions: {},
      replies: [],
    };

    comment.replies.push(reply);
    replyInput.value = "";
    replyForm.style.display = "none";
    renderComments();
  });

  // Replies container
  if (comment.replies.length > 0) {
    const repliesDiv = document.createElement("div");
    repliesDiv.classList.add("replies");

    comment.replies.forEach((reply) => {
      const replyElement = createCommentElement(reply, true);
      repliesDiv.appendChild(replyElement);
    });

    box.appendChild(repliesDiv);
  }

  return box;
}

renderComments();
