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
  console.log(muteIcon);
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
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};
const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

const handleByKeyboard = (event) => {
  if (event.code == "Escape") {
    console.log("now!");
    document.exitFullscreen();
    fullscreen = document.fullscreenElement;
    fullScreenIcon.className = "fas fa-expand-alt";
  }
};

const handleExample = (event) => {
  const fullscreen = document.fullscreenElement;
  console.log(fullscreen);
  fullScreenIcon.className = fullscreen
    ? "fas fa-compress-alt"
    : "fas fa-expand-alt";
};

const unhideVolume = () => volumeRange.classList.remove("hidden");
const hideVolume = () => volumeRange.classList.add("hidden");

video.addEventListener("click", handlePlay);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
playBtn.addEventListener("click", handlePlay);
muteBtn.addEventListener("click", handleMute);
muteBtn.addEventListener("mouseover", unhideVolume);
muteBtn.addEventListener("mouseleave", hideVolume);
volumeRange.addEventListener("mouseover", unhideVolume);
volumeRange.addEventListener("mouseleave", hideVolume);
volumeRange.addEventListener("input", handleVolume);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);
window.addEventListener("keyup", handleByKeyboard);
document.addEventListener("fullscreenchange", handleExample);
