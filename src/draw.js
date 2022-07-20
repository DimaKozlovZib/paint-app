"use script";
import { colorPicker } from '../colorPicker/colorPicker.js';

colorPicker(document.querySelector(".color-picker-box"), (value) => {
    document.querySelector(".wrapper").style.background = value;
});
(function Canvas() {
    const canvas = document.querySelector("#canvas");
    let cx = canvas.getContext("2d");
    let draw = false;
    let startingPoint;
    let displayWidth = canvas.parentElement.clientWidth;
    let displayHeight = displayWidth / 16 * 9;
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    canvas.style.height = displayHeight + "px";
    canvas.addEventListener("mousedown", (event) => {
        draw = true;
        startingPoint = [event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop];
    })
    canvas.addEventListener("mousemove", (event) => {
        if (draw == true) {
            let x = event.clientX - canvas.offsetLeft;
            let y = event.clientY - canvas.offsetTop;
            cx.lineWidth = window.brushSize;
            cx.moveTo(...startingPoint);
            cx.lineTo(x, y);
            cx.stroke();
            startingPoint = [x, y];
        }
    })
    function drawFinish() {
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

function sliderControl(sliderSelector, maxValue, functionValue) {
    const slider = document.querySelector(sliderSelector);
    const circal = document.querySelector(`${sliderSelector} [class*="circal"]`);
    let circalRadius = circal.offsetWidth / 2;
    let mousemove = false;

    slider.onmousedown = () => {
        mousemove = true;

    }
    slider.onmousemove = (event) => {
        if (mousemove) {
            let x = Math.floor(event.clientX - slider.offsetLeft);
            let w = slider.offsetWidth;
            console.log(x)
            if (x >= circalRadius && x <= w - circalRadius) {
                x -= circalRadius
                circal.style.left = x + "px";
                w -= circalRadius * 2;
                functionValue(x / w * maxValue);
            }
        }
    }
    slider.onmouseup = () => { mousemove = false; };
}
sliderControl("#slider-control", 40, (value) => {
    window.brushSize = value;
})