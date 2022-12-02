const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const icons = document.querySelectorAll(".video__comments ul li i");

const HIDDEN = "hidden";
let currentClickedCommentBox;

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  const icon = document.createElement("i");
  const box = document.createElement("div");
  const editBtn = document.createElement("button");
  const deleteBtn = document.createElement("button");
  icon.className = "fas fa-ellipsis-h";
  editBtn.innerHTML = "Edit";
  deleteBtn.innerHTML = "Delete";

  editBtn.id = "editComment";
  deleteBtn.id = "deleteComment";

  box.classList.add("hidden");
  box.id = "buttonBox";
  box.appendChild(editBtn);
  box.appendChild(deleteBtn);

  newComment.dataset.id = id;
  const span = document.createElement("span");
  newComment.appendChild(span);
  newComment.appendChild(icon);
  newComment.appendChild(box);

  span.innerText = `${text}`;
  newComment.className = "video__comment";
  videoComments.prepend(newComment);
  icon.addEventListener("click", handleMoreBtn);
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
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const handleMoreBtn = (event) => {
  const icons = document.querySelectorAll(".video__comments ul li i");
  const boxes = document.querySelectorAll(".video__comments ul li div");
  const deleteBtn = document.querySelectorAll("#deleteComment");
  const editBtn = document.querySelectorAll("#editComment");

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

if (form) {
  form.addEventListener("submit", handleSubmit);
}

icons.forEach((icon) => {
  icon.addEventListener("click", handleMoreBtn);
});
//window.addEventListener("click", handleMoreBtn);
