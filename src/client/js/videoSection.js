const saveBtn = document.querySelector(".saveBtn");
const moreBtn = document.querySelector(".icon__more");
const shareBtn = document.querySelector(".icon__share");
const videoContainer = document.getElementById("videoContainer");
const videoGrid = document.querySelector(".video__grid");

const handleSaveBtn = async (event) => {
  const videoId = videoContainer.dataset.id;
  const response = await fetch(`/api/videos/${videoId}/save`, {
    method: "POST",
  });
  saveBtn.innerHTML = "Saved";
  saveBtn.style.backgroundColor = "black";
  saveBtn.style.color = "white";
};

saveBtn.addEventListener("click", handleSaveBtn);
