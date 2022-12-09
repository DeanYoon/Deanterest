import regeneratorRuntime from "regenerator-runtime";
import "../scss/styles.scss";

const handleWindowSize = (event) => {
  console.log(event.target.innerWidth);
};

window.addEventListener("resize", handleWindowSize);
