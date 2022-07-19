let colorPickerResult = {};
export function colorPicker(box, resultSetterFunction) {
    box.insertAdjacentHTML("afterbegin", `
    <div class="color-picker">
        <div class="saturation-block">
            <div class="circal" height="15" width="15"></div>
            <canvas id="saturation-canvas"></canvas>
        </div>
        <div class="color-block">
            <div class="circal" height="15" width="15"></div>
            <canvas id="gradient-canvas"></canvas>
        </div>
        <div class="opasity-block">
            <div class="circal" height="15" width="15"></div>
            <canvas id="opasity-canvas"></canvas>
        </div>
    </div>`);
    colorPickerResult = {
        set Result(value) {
            resultSetterFunction(value);
        }
    }
    window.S = 0;
    window.V = 100;
    window.H = 0;
    window.opasity = 1;
    HueSelection();
    SaturationAndValueSelection(`rgba(${HueToRgb(0, 100, 100, 1)})`);
    opasityCanvas()

    //color picker состоит из двух блоков один для получения цветового тона ,а другой для получения
    //насыщенности и яркости
}

function HueSelection() {
    //w - width canvas, h - heigth canvas
    let canvas = document.querySelector("#gradient-canvas");
    let cx = canvas.getContext("2d");
    let w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w; canvas.height = h;
    let gradientBg = cx.createLinearGradient(w / 2, 0, w / 2, h);
    let hue = [[225, 0, 0], [225, 225, 0], [0, 225, 0], [0, 225, 225], [0, 0, 225], [225, 0, 225], [225, 0, 0]];
    for (let i = 0; i <= 6; i++) {
        let color = `rgb(${hue[i][0]},${hue[i][1]},${hue[i][2]})`
        gradientBg.addColorStop(i * 1 / 6, color);
    };
    cx.fillStyle = gradientBg;
    cx.fillRect(0, 0, w, h);

    let moveCircal = false;
    let block = document.querySelector(".color-block");
    let circalBlock = document.querySelector(".color-block .circal");
    let circalDiametr = circalBlock.offsetWidth;
    block.onmousedown = () => {
        moveCircal = true;
    }
    block.onmousemove = (event) => {
        if (moveCircal) {
            let y = Math.floor(event.clientY - block.offsetTop);
            if (y <= h - (circalDiametr / 2) && y >= (circalDiametr / 2)) {
                y -= Math.floor(circalDiametr / 2);
                circalBlock.style.top = y + "px";
                window.H = Math.floor(y / (h - circalDiametr) * 360);
                SaturationAndValueSelection(`rgba(${HueToRgb(window.H, 100, 100, 1)})`);

                colorPickerResult.Result = `rgba(${HueToRgb(window.H, window.S, window.V, window.opasity)})`;
            }
        }
    }
    block.onmouseup = () => {
        moveCircal = false;
    }
}

function SaturationAndValueSelection(color) {
    let canvas = document.querySelector("#saturation-canvas");
    let w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = w; canvas.height = h;
    let cx = canvas.getContext("2d");
    cx.clearRect(0, 0, w, h)
    let gradientBg = cx.createLinearGradient(0, h / 2, w, h / 2);

    gradientBg.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradientBg.addColorStop(0.8, color);
    cx.fillStyle = gradientBg;
    cx.fillRect(0, 0, w, h);
    gradientBg = cx.createLinearGradient(w / 2, 0, w / 2, h);

    gradientBg.addColorStop(0, "rgba(0,0,0, 0)");
    gradientBg.addColorStop(0.7, "rgba(0,     0,   0, 0.7)");
    gradientBg.addColorStop(0.8, "rgba(0,     0,   0, 0.8)");
    gradientBg.addColorStop(0.9, "rgba(0,     0,   0, 0.9)");
    gradientBg.addColorStop(1, "rgba(0,     0,   0, 1)");
    cx.fillStyle = gradientBg;
    cx.fillRect(0, 0, w, h);

    let block = document.querySelector(".saturation-block");
    let moveCircal = false;
    let y, x;
    let circalBlock = document.querySelector(".saturation-block .circal");
    let circalDiametr = circalBlock.offsetWidth;

    block.onmousedown = () => {
        moveCircal = true;
    }
    block.onmousemove = (event) => {
        if (moveCircal) {
            y = event.clientY - block.offsetTop;
            x = event.clientX - block.offsetLeft;
            let condition1 = (y <= h - circalDiametr / 2 && y - circalDiametr / 2 >= 0);
            let condition2 = (x <= w - circalDiametr / 2 && x - circalDiametr / 2 >= 0)
            if (condition1 && condition2) {
                y = Math.floor(y - circalDiametr / 2);
                x = Math.floor(x - circalDiametr / 2);
                circalBlock.style.top = y + "px";
                circalBlock.style.left = x + "px";
                window.S = x / (h - circalDiametr) * 100;
                window.V = (100 - y / (h - circalDiametr) * 100);
                window.S = window.S < 0 ? -window.S : window.S;
                window.V = window.V < 0 ? -window.V : window.V;
                colorPickerResult.Result = `rgba(${HueToRgb(window.H, window.S, window.V, window.opasity)})`;
            }
        }
    }
    block.onmouseup = () => {
        moveCircal = false;
    }
}

function HueToRgb(H, S, V, op) {
    let f, p, q, t, lh, R, G, B;
    H = H == 360 ? 0 : H;
    S /= 100;
    V /= 100;
    lh = Math.floor(H / 60);
    f = H / 60 - lh;
    p = V * (1 - S);
    q = V * (1 - S * f);
    t = V * (1 - (1 - f) * S);
    switch (lh) {
        case 0: R = V; G = t; B = p; break;
        case 1: R = q; G = V; B = p; break;
        case 2: R = p; G = V; B = t; break;
        case 3: R = p; G = q; B = V; break;
        case 4: R = t; G = p; B = V; break;
        case 5: R = V; G = p; B = q; break;
    }
    window.ColorPickerresult = [Math.floor(R * 255), Math.floor(G * 255), Math.floor(B * 255), op];
    return window.ColorPickerresult;
}

function opasityCanvas() {
    let canvas = document.querySelector("#opasity-canvas");
    let w = canvas.width = canvas.clientWidth;
    let h = canvas.height = canvas.clientHeight;
    let cx = canvas.getContext("2d");
    let gradientBg = cx.createLinearGradient(w / 2, 0, w / 2, h);
    cx.fillStyle = "rgb(255,255,255)";
    cx.fillRect(0, 0, w, h);

    gradientBg.addColorStop(0, "rgba(0,0,0,1)");
    gradientBg.addColorStop(0.5, "rgba(0,0,0,0.5)");
    gradientBg.addColorStop(1, "rgba(0,0,0,0)");
    cx.fillStyle = gradientBg;
    cx.fillRect(0, 0, w, h);

    let moveCircal = false;
    let block = document.querySelector(".opasity-block");
    let circalBlock = document.querySelector(".opasity-block .circal");
    let circalDiametr = circalBlock.offsetWidth;
    block.onmousedown = () => {
        moveCircal = true;
    }
    block.onmousemove = (event) => {
        if (moveCircal) {
            let y = Math.floor(event.clientY - block.offsetTop);
            if (y <= h - (circalDiametr / 2) && y >= (circalDiametr / 2)) {
                y -= Math.floor(circalDiametr / 2);
                circalBlock.style.top = y + "px";
                window.opasity = 1 - y / (h - circalDiametr);
                colorPickerResult.Result = `rgba(${HueToRgb(window.H, window.S, window.V, window.opasity)})`;
            }
        }
    }
    block.onmouseup = () => {
        moveCircal = false;
    }
}