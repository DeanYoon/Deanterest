const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

const muteIcon = muteBtn.querySelector("i");
const playIcon = playBtn.querySelector("i");
const fullScreenIcon = fullScreenBtn.querySelector("i");

let controlsTimeout = null;
let volumeValue = 0.5;
let controlsMovementTimeout = null;
let fullscreen = document.fullscreenElement;
let textarea = false;

video.volume = volumeValue;

const handlePlay = () => {
  //if the video is playing, pause it
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playIcon.className = video.paused ? "fas fa-play" : "fas fa-pause";
};
const handleMute = () => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteIcon.className = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolume = (e) => {
  video.volume = e.target.value;
  volumeValue = video.volume;
  if (video.volume === 0) {
    video.muted = true;
  } else {
    video.muted = false;
  }
  muteIcon.className = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
};

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substring(14, 19);

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};
/*
if (video.readyState >= 2) {
  console.log(video.readyState);
}
function getmetadata() {
  handleLoadedMetadata();
} 중간중간 00:00 으로 뜰때*/

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};
const handleFullscreen = () => {
  fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
  } else {
    videoContainer.requestFullscreen();
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleByKeyboard = (event) => {
  if (event.code == "Escape") {
    document.exitFullscreen();
    fullscreen = document.fullscreenElement;
    fullScreenIcon.className = "fas fa-expand-alt";
  }
};

const handleExample = (event) => {
  const fullscreen = document.fullscreenElement;
  fullScreenIcon.className = fullscreen
    ? "fas fa-compress-alt"
    : "fas fa-expand-alt";
};

const handleKey = (event) => {
  if (!textarea) {
    if (event.code === "KeyF") {
      handleFullscreen();
    } else if (event.code == "Space") {
      handlePlay();
    } else if (event.code == "Escape") {
      document.exitFullscreen();
    } else if (event.code == "KeyM") {
      handleMute();
    } else if (event.code == "ArrowRight") {
      handleMouseMove();
      video.currentTime += 1;
      timeline.value += 1;
    } else if (event.code == "ArrowLeft") {
      handleMouseMove();
      video.currentTime -= 1;
      timeline.value -= 1;
    }
  }
};

const unhideVolume = () => {
  setTimeout(volumeRange.classList.remove("hidden"), 10000);
};
const hideVolume = () => {
  volumeRange.classList.add("hidden");
};

const handleEnded = async () => {
  playIcon.className = video.paused ? "fas fa-play" : "fas fa-pause";
  const { id } = videoContainer.dataset;
  await fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};
const windowClicked = (e) => {
  const target = e.target.localName;
  if (target === "textarea") {
    textarea = true;
  } else {
    textarea = false;
  }
};

video.addEventListener("click", handlePlay);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
video.addEventListener("dblclick", handleFullscreen);
video.addEventListener("ended", handleEnded);
playBtn.addEventListener("click", handlePlay);
muteBtn.addEventListener("click", handleMute);
muteBtn.addEventListener("mouseover", unhideVolume);
muteBtn.addEventListener("mouseleave", hideVolume);
volumeRange.addEventListener("mouseover", unhideVolume);
volumeRange.addEventListener("mouseleave", hideVolume);
volumeRange.addEventListener("input", handleVolume);
timeline.addEventListener("input", handleTimelineChange);
timeline.addEventListener("mousemove", handleMouseMove);
fullScreenBtn.addEventListener("click", handleFullscreen);

document.addEventListener("fullscreenchange", handleExample);
window.addEventListener("keydown", handleKey);
window.addEventListener("click", windowClicked);
