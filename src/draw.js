"use script";

function canvas() {
    let canvas = document.querySelector("#canvas");
    let cx = canvas.getContext("2d");
    let draw = false;
    let startingPoint;
    let displayWidth = canvas.clientWidth;
    let displayHeight = canvas.clientHeight;
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
    canvas.addEventListener("mousedown", (event) => {
        draw = true;
        startingPoint = [event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop]
    })
    canvas.addEventListener("mousemove", (event) => {
        if (draw == true) {
            let x = event.clientX - canvas.offsetLeft;
            let y = event.clientY - canvas.offsetTop;
            cx.moveTo(...startingPoint);
            console.log(startingPoint)
            cx.lineTo(x, y);
            cx.stroke();
            startingPoint = [x, y];
            console.log(startingPoint)
        }
    })
    canvas.addEventListener("mouseup", (event) => {
        draw = false;
    })
}
canvas();