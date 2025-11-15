const names = ["lantics", "scitnal", "lantiics", "a cat"];
function nameScatter() {
  const nameElement = document.getElementById("introduction-name");
  let nameIndex = 0;
  let firstIteration = true;

  let nums = [];
  function scatter() {
    let currentName = names[nameIndex];
    let text = nameElement.innerText.split("");

    if (firstIteration === true) {
      for (let i = 0; i < currentName.length; i++) {
        let randomNum = Math.floor(Math.random() * currentName.length);
        if (!nums.includes(randomNum)) {
          nums.push(randomNum);
        }
      }
    }
    if (nums.length === currentName.length) {
      firstIteration = false;
    }
    // console.log(nums);
    let randomNum = nums[0];
    // console.log(randomNum);
    if (nameElement.innerText[randomNum] != currentName[randomNum]) {
      let randomChar = currentName.charAt(randomNum);

      text[randomNum] = randomChar;
      nameElement.innerText = text.join("");
    }
    nums.shift();

    if (nameElement.innerText.length > currentName.length) {
      if (nameElement.innerText.slice(0, currentName.length) === currentName) {
        nameElement.innerText = nameElement.innerText.slice(0, -1);
      }
    }
    if (
      nameElement.innerText.length < currentName.length &&
      nums[randomNum] == undefined
    ) {
      nameElement.innerText =
        nameElement.innerText +
        currentName.charAt(nameElement.innerText.length + 1);
    }
    // FINAL CHECKS
    if (
      nameElement.innerText === currentName ||
      (nums.length === 0 &&
        firstIteration === false &&
        nameElement.innerText.length < currentName.length)
    ) {
      firstIteration = true;
      nameIndex = (nameIndex + 1) % names.length;
      nums = [];

      setTimeout(scatter, 4000);
    } else {
      setTimeout(scatter, 60);
    }
  }
  scatter();
}
document.addEventListener("DOMContentLoaded", nameScatter);
