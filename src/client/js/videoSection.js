const saveBtn = document.querySelector(".saveBtn");
const savedBtn = document.querySelector(".savedBtn");
const moreBtn = document.querySelector(".icon__more");
const shareBtn = document.querySelector(".icon__share");
const videoContainer = document.getElementById("videoContainer");
const videoGrid = document.querySelector(".video__grid");

const handleSaveBtn = async (event) => {
  saveBtn.removeEventListener("click", handleSaveBtn);
  const videoId = videoContainer.dataset.id;
  saveBtn.innerHTML = "Saving";
  saveBtn.disabled = true;

  const response = await fetch(`/api/videos/${videoId}/save`, {
    method: "POST",
  });
  saveBtn.innerHTML = "Saved";
  saveBtn.style.backgroundColor = "black";
  saveBtn.style.color = "white";
  saveBtn.className = "savedBtn";
  saveBtn.addEventListener("click", handleUnsaveBtn);
};

const handleUnsaveBtn = async (event) => {
  saveBtn.removeEventListener("click", handleUnsaveBtn);

  const videoId = videoContainer.dataset.id;
  saveBtn.innerHTML = "Unsaving";
  const response = await fetch(`/api/videos/${videoId}/save`, {
    method: "POST",
  });

  saveBtn.addEventListener("click", handleSaveBtn);
};

if (saveBtn) {
  saveBtn.addEventListener("click", handleSaveBtn);
} else if (savedBtn) {
  savedBtn.addEventListener("click", handleUnsaveBtn);
}
