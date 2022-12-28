
const canvas = document.querySelector("canvas");

const ctx = canvas.getContext("2d");
let isDrawing = false,
  brushwidth = 5;
let prevMouseX;
let prevMouseY;
let snapshot;
let newColor = "#000";

let selectedTool = "pen";
// console.log(selectedTool);
const toolBtn = document.querySelectorAll(".tool");
const fillColor = document.querySelector("#fill-color");
const sizeSlider = document.querySelector("#size-slider");
const changeColor = document.querySelector("#favcolor");
const clear = document.querySelector(".clear-canvas");
const saveImg = document.querySelector(".save-image");

// console.log(changeColor.value);

//setting to canvas width and height offsetwidth/height returns vievable width/height
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanBack();
});
const drawRect = (e) => {
  if (!fillColor.checked) {
    return ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  }

  ctx.fillRect(
    e.offsetX,
    e.offsetY,
    prevMouseX - e.offsetX,
    prevMouseY - e.offsetY
  );
};
const drawCircle = (e) => {
  ctx.beginPath(); //start drqw pointer
  let radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
  ); //calculate radius of circle
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); //draw circle with the help of arc functions
  fillColor.checked ? ctx.fill() : ctx.stroke();
};
const drawTriangle = (e) => {
  ctx.beginPath(); //start pointer for draw tiangle
  ctx.moveTo(prevMouseX, prevMouseY); //moving triangle to mouse
  ctx.lineTo(e.offsetX, e.offsetY); //creating first line according to mousepointer
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); //creating bottom line to triangle
  ctx.closePath(); //closing the path of triangle so the third line draw automaticlly
  fillColor.checked ? ctx.fill() : ctx.stroke();
};
const setCanBack = () => {
  //setting whole canvas background to white so the download img backgroundColor will be white
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = newColor;
};
const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  ctx.beginPath(); // creating new path to draw
  ctx.lineWidth = brushwidth; //passing brush size
  ctx.strokeStyle = newColor;
  ctx.fillStyle = newColor;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};
const drawing = (e) => {
  if (!isDrawing) return;
  ctx.putImageData(snapshot, 0, 0); //adding copied canvas data on to this canvas
  if (selectedTool === "pen" || selectedTool === "eraser") {
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : newColor;
    ctx.lineTo(e.offsetX, e.offsetY); //creating the line according to the mouse pointer

    ctx.stroke();
  } else if (selectedTool === "rectangle") {
    drawRect(e);
  } else if (selectedTool === "circle") {
    drawCircle(e);
  } else if (selectedTool === "triangle") {
    drawTriangle(e);
  }
};
toolBtn.forEach((btn) => {
  //adding click event to all tool option
  btn.addEventListener("click", () => {
    //remove previeous tools and add active new tools
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
    console.log(selectedTool);
  });
});
sizeSlider.addEventListener("change", () => {
  brushwidth = sizeSlider.value; //passing slider value
  console.log(brushwidth);
});
changeColor.addEventListener("change", () => {
  newColor = changeColor.value;
});
clear.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // clear all the canvas
  setCanBack();
});
saveImg.addEventListener("click", () => {
  const link = document.createElement("a"); //creating <a> element
  link.download = `${Date.now()}.png`; //passing current data as link download value
  link.href = canvas.toDataURL(); //passing canvasData as link href value
  link.click();
});

canvas.addEventListener("mousedown", startDraw);

canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => (isDrawing = false));
