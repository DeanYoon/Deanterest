const isHeroku = process.env.NODE_ENV === "production";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const icons = document.querySelectorAll("#more");
const editBtns = document.querySelectorAll("#editComment");
const deleteBtns = document.querySelectorAll("#deleteComment");
const commentLength = document.querySelector(".comment__length");
const commentLikeBtns = document.querySelectorAll("#like");
const commentLikedBtns = document.querySelectorAll("#liked");

const HIDDEN = "hidden";
let currentClickedCommentBox;
let editCommentId;
let editCommentTime;
let currentTime = new Date().getTime();

setTimeout(() => {
  currentTime = new Date().getTime();
}, 1000);

const addComment = (text, id, owner, dataTime = new Date().getTime()) => {
  const comments = document.querySelectorAll(".video__comments ul li");

  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");

  const userLink = document.createElement("a");
  const userImg = document.createElement("img");
  const userName = document.createElement("span");

  const commentText = document.createElement("span");

  const commentTimeElapsed = document.createElement("span");

  const iconBox = document.createElement("span");
  const iconMore = document.createElement("i");
  const iconLike = document.createElement("i");
  const likeNum = document.createElement("span");

  const box = document.createElement("div");
  const editBtn = document.createElement("a");
  const deleteBtn = document.createElement("a");

  userLink.href = `/users/${owner._id}`;
  userImg.className = "commentAvatar";
  if (owner.avatarUrl.startsWith("http")) {
    userImg.src = isHeroku ? `${owner.avatarUrl}` : `${owner.avatarUrl}`;
  } else {
    userImg.src = isHeroku ? `${owner.avatarUrl}` : `/${owner.avatarUrl}`;
  }

  userName.className = "commentOwner";
  userName.innerText = owner.name;

  commentText.id = "commentText";
  commentText.innerText = `${text}`;

  commentTimeElapsed.innerText = "0 m";
  commentTimeElapsed.id = "commentTimeElapsed";
  if (editCommentTime) {
    const elapsedTime = Math.floor(
      (currentTime - editCommentTime) / (1000 * 60)
    );
    if (elapsedTime < 60) {
      commentTimeElapsed.innerText = `${elapsedTime} m`;
    } else if (elapsedTime < 60 * 24) {
      commentTimeElapsed.innerText = `${Math.floor(elapsedTime / 60)} h`;
    } else {
      commentTimeElapsed.innerText = `${Math.floor(elapsedTime / 60 / 24)} d`;
    }
  }

  iconBox.className = "iconBox";
  iconMore.className = "fas fa-ellipsis-h";
  iconMore.id = "more";
  iconLike.className = "far fa-thumbs-up";
  iconLike.id = "like";
  likeNum.id = "likedNum";
  likeNum.innerText = "0";

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

  iconBox.appendChild(iconLike);
  iconBox.appendChild(likeNum);
  iconBox.appendChild(iconMore);

  newComment.className = "video__comment";
  newComment.dataset.id = id;
  newComment.dataset.time = dataTime;

  newComment.appendChild(userLink);
  newComment.appendChild(commentText);
  newComment.appendChild(commentTimeElapsed);
  newComment.appendChild(iconBox);
  newComment.appendChild(box);

  commentLength.innerText = `${comments.length + 1} ${
    comments.length === 0 ? "comment" : "comments"
  }`;

  var numCheck = 0;
  comments.forEach((comment) => {
    if (comment.dataset.time > dataTime) {
      numCheck += 1;
    }
  });
  videoComments.insertBefore(newComment, videoComments.children[numCheck]);

  iconMore.addEventListener("click", handleMoreBtn);
  deleteBtn.addEventListener("click", handleDeleteBtn);
  iconLike.addEventListener("click", handleLikeBtn);
  editBtn.addEventListener("click", handleEditBtn);
  editCommentTime = "";
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
const hideBox = () => {
  const boxes = document.querySelectorAll(".video__comments ul li div");

  boxes.forEach((box) => {
    box.className = HIDDEN;
  });
};

const handleMoreBtn = (event) => {
  hideBox();
  li = event.target.parentElement.parentElement;
  const buttons = li.querySelector("div");

  buttons.className = "";
};

const addHidden = (event) => {
  li = event.target.parentElement.parentElement;
  const buttons = li.querySelector("#buttonBox");
};

const handleEditBtn = async (event) => {
  form.removeEventListener("submit", handleSubmit);
  form.addEventListener("submit", editCommentPost);

  const textarea = form.querySelector("textarea");
  const li = event.target.parentElement.parentElement;
  const commentText = li.querySelector("li>span");
  const commentId = li.dataset.id;
  const commentTime = li.dataset.time;
  editCommentId = commentId;
  editCommentTime = commentTime;

  textarea.value = commentText.innerHTML;
  li.remove();
};

const editCommentPost = async (event) => {
  const form = document.getElementById("commentForm");
  form.removeEventListener("submit", editCommentPost);
  form.addEventListener("submit", handleSubmit);
  event.preventDefault();

  const textarea = form.querySelector("textarea");
  const text = textarea.value.trim();
  const videoId = videoContainer.dataset.id;

  if (!text) {
    return;
  }
  const response = await fetch(
    `/api/videos/${videoId}/comment/${editCommentId}/edit`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    }
  );

  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId, owner } = await response.json();
    addComment(text, newCommentId, owner, editCommentTime);
  }
};

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
      comments.length < 3 ? "comment" : "comments"
    }`;
  }
};
const handleLikeBtn = async (event) => {
  const li = event.target.parentElement.parentElement;
  const likeIcon = event.target;
  likeIcon.className = "fas fa-thumbs-up";
  likeIcon.removeEventListener("click", handleLikeBtn);
  const commentId = li.dataset.id;
  const likedNum = li.querySelector("#likedNum");
  const currentLikedNum = Number(likedNum.innerHTML);
  const response = await fetch(`/api/videos/${commentId}/comment/liked`, {
    method: "POST",
  });
  likeIcon.id = "liked";
  likedNum.innerHTML = currentLikedNum + 1;
  if (response.status === 200) {
    likeIcon.addEventListener("click", undoLikedBtn);
  }
};
const undoLikedBtn = async (event) => {
  const li = event.target.parentElement.parentElement;
  const likedIcon = event.target;
  likedIcon.className = "far fa-thumbs-up";
  likedIcon.removeEventListener("click", undoLikedBtn);
  const commentId = li.dataset.id;
  const likedNum = li.querySelector("#likedNum");
  const currentLikedNum = Number(likedNum.innerHTML);
  likedIcon.id = "like";
  likedNum.innerHTML = currentLikedNum - 1;
  const response = await fetch(`/api/videos/${commentId}/comment/undoLiked`, {
    method: "POST",
  });

  if (response.status === 200) {
    likedIcon.addEventListener("click", handleLikeBtn);
  }
};

const closeMoreBtn = (event) => {
  if (
    event.target.id !== "editComment" &&
    event.target.id !== "buttonBox" &&
    event.target.id !== "deleteComment" &&
    event.target.id !== "more"
  ) {
    hideBox();
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
  if (commentLikeBtns) {
    commentLikeBtns.forEach((commentLikeBtn) => {
      commentLikeBtn.addEventListener("click", handleLikeBtn);
    });
  }
  if (commentLikedBtns) {
    commentLikedBtns.forEach((commentLikedBtn) => {
      commentLikedBtn.addEventListener("click", undoLikedBtn);
    });
  }
}

window.addEventListener("click", closeMoreBtn);
