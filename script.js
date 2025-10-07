// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBi0DtNzX0niHbV4LtId7PaxLoD8Pphy6U",
  authDomain: "comment-on-isrt-8a634.firebaseapp.com",
  databaseURL: "https://comment-on-isrt-8a634-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "comment-on-isrt-8a634",
  storageBucket: "comment-on-isrt-8a634.firebasestorage.app",
  messagingSenderId: "173989173917",
  appId: "1:173989173917:web:613693b2c98c4c121e9274"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

document.addEventListener('DOMContentLoaded', () => {
    const commentForm = document.getElementById('commentForm');
    const commentText = document.getElementById('commentText');
    const commentsContainer = document.getElementById('commentsContainer');

    // Function to load and display comments
    function loadComments() {
        // Retrieve comments from localStorage, or start with an empty array
        const comments = JSON.parse(localStorage.getItem('isrtComments')) || [];
        
        // Clear the current container content
        commentsContainer.innerHTML = ''; 

        if (comments.length === 0) {
            commentsContainer.innerHTML = '<p>No comments yet. Be the first!</p>';
            return;
        }

        // Display comments in reverse chronological order (newest first)
        comments.slice().reverse().forEach((comment, index) => {
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('comment');
            
            // Format the timestamp nicely
            const date = new Date(comment.timestamp);
            const formattedDate = date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();

            commentDiv.innerHTML = `
                <p>${comment.text}</p>
                <small>Posted Anonymously on ${formattedDate}</small>
            `;
            commentsContainer.appendChild(commentDiv);
        });
    }

    // Function to handle form submission
    commentForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission (page reload)

        const newCommentText = commentText.value.trim();

        if (newCommentText) {
            // Create the new comment object
            const newComment = {
                text: newCommentText,
                timestamp: new Date().toISOString() // Use ISO format for easy storage and parsing
            };

            // Get existing comments, add the new one, and save back to localStorage
            const comments = JSON.parse(localStorage.getItem('isrtComments')) || [];
            comments.push(newComment);
            localStorage.setItem('isrtComments', JSON.stringify(comments));

            // Clear the textarea and refresh the displayed comments
            commentText.value = '';
            loadComments();
        }
    });

    // Load comments immediately when the page loads
    loadComments();
});
