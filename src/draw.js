"use strict";
import { colorPicker } from '../colorPicker/colorPicker.js';

colorPicker(document.querySelector(".color-picker-box"), (value) => {
    window.color = value;
    linePreview(window.color, window.brushSize);
});
(function Canvas() {
    const canvas = document.querySelector("#canvas");
    let cx = canvas.getContext("2d");
    let draw = false;
    let startingPoint;
    window.brushSize = 2;
    window.color = "#000";

    let displayWidth = canvas.width = canvas.parentElement.clientWidth;
    let displayHeight = canvas.height = displayWidth / 16 * 9;
    canvas.style.height = displayHeight + "px";

    canvas.addEventListener("mousedown", (event) => {
        draw = true;
        startingPoint = [event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop];
    })
    canvas.addEventListener("mousemove", (event) => {
        if (draw) {
            cx.beginPath();
            let x = event.clientX - canvas.offsetLeft;
            let y = event.clientY - canvas.offsetTop;
            cx.lineWidth = window.brushSize;
            cx.lineCap = "round";
            cx.moveTo(...startingPoint);
            cx.lineTo(x, y);
            cx.strokeStyle = window.color;
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
window.onresize = () => resize();

function resize() {
    const canvas = document.querySelector("#canvas");
    let cx = canvas.getContext("2d");
    let displayWidth = canvas.parentElement.clientWidth;
    let lastWidth = canvas.width;
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