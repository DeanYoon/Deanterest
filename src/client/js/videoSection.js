const saveBtn = document.querySelector(".saveBtn");
const savedBtn = document.querySelector(".savedBtn");
const moreBtn = document.querySelector(".icon__more");
const shareBtn = document.querySelector(".icon__share");
const videoContainer = document.getElementById("videoContainer");
const videoGrid = document.querySelector(".video__grid");
const videoId = videoContainer.dataset.id;

const handleSaveBtn = async (event) => {
  const saveBtn = document.querySelector(".saveBtn");
  saveBtn.addEventListener("click", handleUnsaveBtn);

  saveBtn.innerHTML = "Saving";
  saveBtn.disabled = true;

  const response = await fetch(`/api/videos/${videoId}/save`, {
    method: "POST",
  });
  saveBtn.innerHTML = "Saved";
  saveBtn.style.backgroundColor = "black";
  saveBtn.style.color = "white";
  saveBtn.className = "savedBtn";
  saveBtn.disabled = false;

  saveBtn.addEventListener("click", handleUnsaveBtn);
};

const handleUnsaveBtn = async (event) => {
  const savedBtn = document.querySelector(".savedBtn");
  savedBtn.removeEventListener("click", handleUnsaveBtn);

  savedBtn.innerHTML = "Unsaving";
  savedBtn.disabled = true;

  const response = await fetch(`/api/videos/${videoId}/unsave`, {
    method: "POST",
  });

  savedBtn.innerHTML = "Save";
  savedBtn.style.backgroundColor = "red";
  savedBtn.style.color = "white";
  savedBtn.className = "saveBtn";
  savedBtn.disabled = false;

  savedBtn.addEventListener("click", handleSaveBtn);
};

if (saveBtn) {
  saveBtn.addEventListener("click", handleSaveBtn);
} else if (savedBtn) {
  savedBtn.addEventListener("click", handleUnsaveBtn);
}
