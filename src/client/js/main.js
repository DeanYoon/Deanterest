import "../scss/styles.scss";

const loggedIn = document.querySelector(".header__btn");

const handleWindow = (event) => {
  if (!loggedIn) {
    var width = -650 + window.innerWidth;
  } else {
    var width = -450 + window.innerWidth;
  }
  document.documentElement.style.setProperty("--search-width", `${width}px`);
  if (window.innerWidth > 1500) {
    document.documentElement.style.setProperty("--columns", "5");
  } else if (window.innerWidth > 1200 && window.innerWidth < 1500) {
    document.documentElement.style.setProperty("--columns", "4");
  } else if (window.innerWidth < 1200 && window.innerWidth > 850) {
    document.documentElement.style.setProperty("--columns", "3");
  } else if (window.innerWidth < 850 && window.innerWidth > 550) {
    document.documentElement.style.setProperty("--columns", "2");
  } else if (window.innerWidth < 550) {
    document.documentElement.style.setProperty("--columns", "1");
  }
  //   console.log();
};

handleWindow();
window.addEventListener("resize", handleWindow);
