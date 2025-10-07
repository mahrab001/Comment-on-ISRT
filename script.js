function createCommentElement(comment, isReply = false, parentId = null) {
  const box = document.createElement("div");
  box.classList.add(isReply ? "reply-box" : "comment-box");

  const text = document.createElement("p");
  text.textContent = comment.text;
  box.appendChild(text);

  // Controls container
  const controls = document.createElement("div");
  controls.classList.add("controls");

  // Reply button
  const replyBtn = document.createElement("button");
  replyBtn.textContent = "💬 Reply";
  replyBtn.classList.add("reply-btn");
  controls.appendChild(replyBtn);
  box.appendChild(controls);

  // Reactions container
  const reactionContainer = document.createElement("div");
  reactionContainer.classList.add("reaction-options");

  reactions.forEach((emoji) => {
    const span = document.createElement("span");
    const count = comment.reactions?.[emoji] || 0;
    span.textContent = count > 0 ? `${emoji} ${count}` : emoji;
    span.classList.add("reaction");

    // ✅ Fix: Prevent reply form toggle and multiple boxes
    span.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation(); // stops from triggering reply toggle or parent click

      const path = parentId
        ? `comments/${parentId}/replies/${comment.id}/reactions`
        : `comments/${comment.id}/reactions`;

      const newReactions = { ...comment.reactions };
      newReactions[emoji] = (newReactions[emoji] || 0) + 1;

      // ✅ Update Firebase reactions only (not full comment)
      set(ref(db, path), newReactions);

      // ✅ Update only this emoji’s display instantly
      span.textContent = `${emoji} ${newReactions[emoji]}`;
    });

    reactionContainer.appendChild(span);
  });

  box.appendChild(reactionContainer);

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

  // ✅ Only toggle reply form if clicked directly on the button
  replyBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    replyForm.style.display =
      replyForm.style.display === "none" ? "block" : "none";
  });

  // Handle reply submit
  replyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const replyText = replyInput.value.trim();
    if (!replyText) return;

    const reply = {
      id: Date.now().toString(),
      text: replyText,
      timestamp: Date.now(),
      replies: [],
      reactions: {},
    };

    const repliesRef = ref(db, `comments/${comment.id}/replies`);
    push(repliesRef, reply);

    replyInput.value = "";
    replyForm.style.display = "none";
  });

  // Render replies (recursive)
  if (comment.replies) {
    const repliesDiv = document.createElement("div");
    repliesDiv.classList.add("replies");

    Object.entries(comment.replies).forEach(([replyId, reply]) => {
      repliesDiv.appendChild(
        createCommentElement({ id: replyId, ...reply }, true, comment.id)
      );
    });

    box.appendChild(repliesDiv);
  }

  return box;
}
