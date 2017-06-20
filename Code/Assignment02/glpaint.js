var gl;
var index = 0;
var undo = [];
var undoCount = 0;
var clickCount = 0;
// var clickData = [];
var firstClick;
var erase = false;

var bufferSize = 4 * 100000;
var varray = new Array(bufferSize);
var carray = new Array(2 * bufferSize);

// Colors
var red = vec4(1, 0, 0, 1);
var green = vec4(0, 1, 0, 1);
var blue = vec4(0, 0, 1, 1);
var background = vec4(0.8, 0.8, 0.8, 1.0);
var color = red;   // Current Color

//Shapes
var lineSize = 1;
var shape = 0;

// Buffer
var vBuffer;
var vPosition;
var cBuffer;
var vColor;

// var vBuffer2;
// var vPosition2;
// var cBuffer2;
// var vColor2;


window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    //  Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(background[0], background[1], background[2], background[3]);

    //  Load shader and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    console.log("Sending to Buffer");
    createBuffer();


    // Buttions
    document.getElementById("button-canvas-width").onclick =
        function () {
            canvas.width *= 1.10
        };
    document.getElementById("button-canvas-height").onclick =
        function () {
            canvas.height *= 1.10
        };
    document.getElementById("button-canvas-clear").onclick =
        function () {
            index = 0;
        };
    document.getElementById("button-undo").onclick =
        function () {
            if (undoCount > 0) {
                index = undo.pop();
                undoCount--;
            }
        };


    // Menu
    document.getElementById("paint-erase").addEventListener("click", function () {
        switch (this.selectedIndex) {
            case 0:
                erase = false;
                break;
            case 1:
                erase = true;
                break;
        }
    });
    document.getElementById("menu-color").addEventListener("click", function () {
        switch (this.selectedIndex) {
            case 0:
                color = red;
                break;
            case 1:
                color = green;
                break;
            case 2:
                color = blue;
                break;
            default:
                color = red;
        }
    });
    document.getElementById("menu-line-size").addEventListener("click", function () {
        switch (this.selectedIndex) {
            case 0:
                lineSize = 1;
                break;
            case 1:
                lineSize = 3;
                break;
            case 2:
                lineSize = 5;
                break;
            default:
                lineSize = 1;
        }
    });
    document.getElementById("menu-shape").addEventListener("click", function () {

        switch (this.selectedIndex) {
            case 0:
                shape = 0;  // Line
                break;
            case 1:
                shape = 1;  // Line Triangle
                break;
            case 2:
                shape = 2;  // Solid Triangle
                break;
            case 3:
                shape = 3;  // Line Rectangle
                break;
            case 4:
                shape = 4;  // Circle
                break;
            default:
                shape = 0;
        }
        //
        clickCount = 0;
        // createBuffer();
        // render();

    });

    // Draw points and Graphics
    function getPoints(event) {
        return vec2(2 * event.clientX / canvas.width - 1,
            2 * (canvas.height - event.clientY) / canvas.height - 1);
    }
    function drawBlankPoint() {
        var points = vec2(NaN, NaN);
        var colors = vec4(NaN, NaN, NaN, NaN);
        updateBuffer(points, colors);

    }
    function draw(points) {

        // console.log("point Added: ");
        // console.log(points);
        // console.log(erase);
        if(!erase){
            updateBuffer(points, color);

        } else {
            updateBuffer(points, background);
        }

    }
    function drawLineTriangle(points) {
        /*
         Pattern for trinagle
         a, b,
         b, c,
         c, a
         */
        switch (clickCount % 3) {
            case 0:  // click 0:  write a
                firstClick = points;
                draw(points);
                break;
            case 1:  // click 1:  write b b
                draw(points);
                draw(points);
                break;
            case 2: // click 2:  write c c a  (BLANK)
                draw(points);
                draw(points);
                draw(firstClick);
                drawBlankPoint();
                break;
        }
    }
    function drawRectangle(points){
        if(clickCount % 2 == 0) {
            firstClick = points;
        } else{
            // Draw a rectangle
            var p1 = firstClick;
            var p2 = vec2(firstClick[0], points[1]);
            var p3 = points;
            var p4 = vec2(points[0], firstClick[1]);
            // firstClick = null;

            /*
            Pattern for Square
            p1 -> p2
            p2 -> p3
            p3 -> p4
            p4 -> p1
            nan
             */
            draw(p1); draw(p2);  // line 1
            draw(p2); draw(p3);  // line 2
            draw(p3); draw(p4);  // line 3
            draw(p4); draw(p1);  // line 4
            drawBlankPoint();
        }
    }


    // EVENT Listeners
    // Mouse Clicks
    var gc = document.getElementById("gl-canvas");
    gc.addEventListener("mousedown", function (event) {
        undo.push(index);
        var points = getPoints(event);


        switch (shape) {
            case 0: // Lines
                gc.onmousemove = function (event) {
                    points = getPoints(event);
                    draw(points);
                };
                break;
            case 1: // Line Triangle
                drawLineTriangle(points);
                break;
            case 2: // Solid Triangle
                draw(points);
            break;
            case 3: // Solid Triangle
                drawRectangle(points);
                break;
            default:
                alert("An error occurred");
        }
        clickCount++;
        undoCount++;

    });


    gc.addEventListener("mouseup", function (e) {
        if (shape == 0) {
            canvas.onmousemove = null;
            drawBlankPoint();
        }

    });

    function createBuffer() {
        // Load the data into the GPU
        vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(varray), gl.STATIC_DRAW);

        // Associate out shader variables with our data buffer
        vPosition = gl.getAttribLocation(program, "vPosition");
        gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        // Load the data into the GPU
        cBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(carray), gl.STATIC_DRAW);

        // Associate out shader variables with our data buffer
        vColor = gl.getAttribLocation(program, "vColor");
        gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);

    }


    // Use buffer subdata:  memory location, offset, data
    function updateBuffer(pointArray, colorArray) {
        // console.log("Update buffer");
        // console.log("Buffer Array: ");
        // console.log(gl.ARRAY_BUFFER);


        // Pointer Array
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(pointArray));

        // Color Array
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * index, flatten(colorArray));


        console.log("index: " + index);
        index++;
    }


    render();
};


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.LINE_STRIP, 0, index);

    // switch (shape) {
    //     case 0:  // Line
    //     case 1:  // Wire
    //         gl.drawArrays(gl.LINE_STRIP, 0, index);
    //         break;
    //     case 2:  // Solid TRIANGLES
    //         gl.drawArrays(gl.TRIANGLES, 0, index);
    //         break;
    //     case 3:  // RECTANGLES
    //         gl.drawArrays(gl.TRIANGLE_STRIP, 0, index);
    //         break;
    //     case 4:
    //         gl.drawArrays(gl.TRIANGLE_FAN, 0, index);
    //         break;
    //     default:
    //         gl.drawArrays(gl.LINE_STRIP, 0, index);
    //
    // }
    window.requestAnimationFrame(render);

}




