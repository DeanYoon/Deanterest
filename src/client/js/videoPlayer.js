const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volume = document.getElementById("volume");

const handlePlay = (e) => {
  //if the video is playing, pause it
  if (video.paused) {
    video.play();
    playBtn.innerText = "Pause";
  } else {
    video.pause();
    playBtn.innerText = "Play";
  }
  // else, play it
};
const handleMute = (e) => {
  // mute the volume
};

play.addEventListener("click", handlePlay);
mute.addEventListener("click", handleMute);
