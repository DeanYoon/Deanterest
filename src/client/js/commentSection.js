const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const icons = document.querySelectorAll(".video__comments ul li i");
const editBtns = document.querySelectorAll("#editComment");
const deleteBtns = document.querySelectorAll("#deleteComment");
const commentLength = document.querySelector(".comment__length");

const HIDDEN = "hidden";
let currentClickedCommentBox;

const addComment = (text, id, owner) => {
  const comments = document.querySelectorAll(".video__comments ul li");

  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");

  const userLink = document.createElement("a");
  const userImg = document.createElement("img");
  const userName = document.createElement("span");

  const span = document.createElement("span");

  const icon = document.createElement("i");

  const box = document.createElement("div");
  const editBtn = document.createElement("a");
  const deleteBtn = document.createElement("a");

  userLink.href = `/users/${owner._id}`;
  userImg.className = "commentAvatar";
  userImg.src = `${owner.avatarUrl}`;
  userName.className = "commentOwner";
  userName.innerText = owner.name;

  icon.className = "fas fa-ellipsis-h";

  box.classList.add("hidden");
  box.id = "buttonBox";

  editBtn.id = "editComment";
  deleteBtn.id = "deleteComment";

  editBtn.innerHTML = "Edit";
  deleteBtn.innerHTML = "Delete";

  userLink.appendChild(userImg);
  userLink.appendChild(userName);

  box.appendChild(editBtn);
  box.appendChild(deleteBtn);

  newComment.dataset.id = id;
  newComment.appendChild(userLink);
  newComment.appendChild(span);
  newComment.appendChild(icon);
  newComment.appendChild(box);

  commentLength.innerText = `${comments.length + 1} ${
    comments.length === 0 ? "comment" : "comments"
  }`;
  span.innerText = `${text}`;
  newComment.className = "video__comment";
  videoComments.prepend(newComment);

  icon.addEventListener("click", handleMoreBtn);
  deleteBtn.addEventListener("click", handleDeleteBtn);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value.trim();
  const videoId = videoContainer.dataset.id;
  if (!text) {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId, owner } = await response.json();
    addComment(text, newCommentId, owner);
  }
};

const handleMoreBtn = (event) => {
  const icons = document.querySelectorAll(".video__comments ul li i");
  const boxes = document.querySelectorAll(".video__comments ul li div");

  icons.forEach((icon) => {
    icon.addEventListener("click", handleMoreBtn);
  });

  boxes.forEach((box) => {
    box.className = HIDDEN;
  });
  li = event.target.parentElement;
  const buttons = li.querySelector("div");
  buttons.classList.toggle(HIDDEN);
};

const addHidden = (event) => {
  li = event.target.parentElement.parentElement;
  const buttons = li.querySelector("#buttonBox");
};

const handleEditBtn = async (event) => {};
const handleDeleteBtn = async (event) => {
  const li = event.target.parentElement.parentElement;
  const commentId = li.dataset.id;
  const comments = document.querySelectorAll(".video__comments ul li");

  const response = await fetch(`/api/videos/comment/${commentId}/delete`, {
    method: "POST",
  });

  if (response.status === 200) {
    li.remove();
    commentLength.innerText = `${comments.length - 1} ${
      comments.length === 2 || 1 ? "comment" : "comments"
    }`;
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
if (icons) {
  icons.forEach((icon) => {
    icon.addEventListener("click", handleMoreBtn);
  });
  editBtns.forEach((editBtn) => {
    editBtn.addEventListener("click", handleEditBtn);
  });
  deleteBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", handleDeleteBtn);
  });
}
//window.addEventListener("click", handleMoreBtn);
