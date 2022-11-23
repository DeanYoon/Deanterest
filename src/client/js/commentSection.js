const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const button = form.querySelector("button");

const handleSubmit = async (event) => {
  event.preventDefault();
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    body: {
      text,
    },
  });
};

form.addEventListener("submit", handleSubmit);
