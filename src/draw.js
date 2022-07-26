"use strict";
import { colorPicker } from '../colorPicker/colorPicker.js';
window.eraser = false;

colorPicker(document.querySelector(".color-picker-box"), (value) => {
    window.color = value;
    linePreview(window.color, window.brushSize);
});
(function Canvas() {
    const canvas = document.querySelector("#canvas");
    const canvasParent = canvas.parentElement;
    let cx = canvas.getContext("2d");
    let draw = false;
    let startingPoint;
    window.brushSize = 2;
    window.color = "rgb(0,0,0)";
    console.log(canvas.offsetWidth)
    let displayWidth = canvas.width = canvas.offsetWidth;
    let displayHeight = canvas.height = displayWidth / 16 * 9;

    canvas.addEventListener("mousedown", (event) => {
        draw = true;
        let x = (event.clientX - canvas.offsetLeft) - canvasParent.offsetLeft;
        let y = (event.clientY - canvas.offsetTop) - canvasParent.offsetTop;
        startingPoint = [x, y];
    })
    canvas.addEventListener("mousemove", (event) => {
        if (draw) {
            cx.globalCompositeOperation = "source-over";
            if (window.eraser) {
                cx.globalCompositeOperation = 'destination-out';
                cx.strokeStyle = "rgba(0, 0, 0, 0)";
            }
            cx.beginPath();
            cx.strokeStyle = window.color;
            cx.lineCap = "round";
            cx.lineWidth = window.brushSize;


            console.log(cx.globalCompositeOperation)
            let x = (event.clientX - canvas.offsetLeft) - canvasParent.offsetLeft;
            let y = (event.clientY - canvas.offsetTop) - canvasParent.offsetTop;

            cx.moveTo(...startingPoint);
            cx.lineTo(x, y);
            cx.stroke();
            startingPoint = [x, y];
        }
    })
    function drawFinish() {
        cx.closePath();
        draw = false;
    }
    canvas.addEventListener("mouseup", drawFinish);
    canvas.addEventListener("mouseout", drawFinish);
}())
window.onresize = () => resize(
    document.querySelector("#canvas").parentElement.clientWidth,
    document.querySelector("#canvas").width
);

function resize(w, h) {
    const canvas = document.querySelector("#canvas");
    let cx = canvas.getContext("2d");
    let displayWidth = w;
    let lastWidth = h;
    let displayHeight = displayWidth / 16 * 9;
    let buffer = document.querySelector("#bufer");
    let bufferCx = buffer.getContext("2d");

    buffer.width = displayWidth;
    buffer.height = displayHeight;
    buffer.style.height = displayHeight + "px";

    bufferCx.drawImage(canvas, 0, 0); //Make a copy of the canvas to hidden buffer

    canvas.width = displayWidth;
    canvas.height = displayHeight;
    canvas.style.height = displayHeight + "px";

    cx.drawImage(buffer, 0, 0); //Draw it back to canvas
}