"use strict";
function sliderControl(sliderSelector, minValue, maxValue, functionValue) {
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
            if (x >= circalRadius && x <= w - circalRadius) {
                x -= circalRadius
                circal.style.left = x + "px";
                w -= circalRadius * 2;
                let result = (x / w * (maxValue - minValue) + minValue) * 1.5;
                functionValue(result);
            }
        }
    }
    slider.onmouseup = () => { mousemove = false; };
}
sliderControl("#slider-control", 1, 40, (value) => {
    window.brushSize = value;
    linePreview(window.color, value);
});

function linePreview(color, size) {
    const canvas = document.querySelector("#line-preview");
    let cx = canvas.getContext("2d");
    let displayWidth = canvas.width = canvas.parentElement.clientWidth;
    let displayHeight = canvas.height = canvas.parentElement.clientHeight;

    cx.clearRect(0, 0, displayWidth, displayHeight);
    let k = displayWidth / displayHeight;
    let BgRect = Math.floor(displayWidth / 100 * k);
    let numColorRGB, cl1, cl2

    cx.globalAlpha = 0.6;
    color.replace(/(\d+),(\d+),(\d+)/, (str) => { numColorRGB = str; })
    let numsColorRgbArray = numColorRGB.split(",").map(Number);
    let max = Math.max(...numsColorRgbArray);

    if (max > 147) {
        cl1 = "grey";
        cl2 = "black";
    } else {
        cl1 = "white";
        cl2 = "grey";
    }
    for (let Y = 0; Y < displayHeight; Y += BgRect) {
        for (let X = 0; X < displayWidth; X += BgRect) {
            let condition = Y % (BgRect * 2) === 0 ? X % (BgRect * 2) !== 0 : X % (BgRect * 2) === 0;
            if (condition) {
                cx.fillStyle = cl1;
                cx.fillRect(X, Y, BgRect, BgRect)
            } else {
                cx.fillStyle = cl2;
                cx.fillRect(X, Y, BgRect, BgRect)
            }
        }
    }

    cx.globalAlpha = 1;
    cx.beginPath();
    cx.moveTo(displayWidth / 10, displayHeight / 1.5);
    cx.bezierCurveTo(
        displayWidth / 2.5, -15,            // first condition
        displayWidth / 1.9, displayHeight + 15,    // second condition
        displayWidth - displayWidth / 10, displayHeight / 2 // finish point
    );

    cx.lineWidth = size;
    cx.lineCap = "round";
    cx.strokeStyle = color;
    cx.stroke()
    cx.closePath();
}
linePreview("rgb(0,0,0)", 2);