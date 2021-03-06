/**
 * Sean McGlincy
 * Graphics
 * Assignment 2
 *
 * This uses a line which uses a line segment and a line with that uses tiangle_strip
 */


var gl;
var index = 0;
var undo = [];
var undoCount = 0;
var clickCount = 0;
var firstClick;
var secondClick;
var erase = false;


// Colors
var red = vec4(1, 0, 0, 1);
var green = vec4(0, 1, 0, 1);
var blue = vec4(0, 0, 1, 1);
var background = vec4(0.8, 0.8, 0.8, 1.0);
var color = red;   // Current Color

//Shapes
var lineSize = 1.0;
var shape = 0;   // line, triangle, circle
var currentRender;
var shapeArray = [];
var shapeArraySize = 0;


// Buffer Array
var bufferSize = 4 * 100000;
var varray = new Array(bufferSize);
var carray = new Array(2 * bufferSize);

// Buffer
var vBuffer;
var vPosition;
var cBuffer;
var vColor;


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

    // Create buffer and start array of objects
    // Shapes array allows for dynamic rendering
    console.log("Sending to Buffer");
    createBuffer();
    currentRender = gl.LINE_STRIP;


    // Buttions
    document.getElementById("button-canvas").onclick =
        function () {
            canvas.width += 100;
            canvas.height += 100;
            gl.viewport(0, 0, canvas.width, canvas.height);

        };
    document.getElementById("button-canvas-clear").onclick =
        function () {
            // Zero Variables
            undo = [];
            shapeArray = [];
            index = 0;
            undoCount = 0;
            clickCount = 0;
            firstClick = 0;
            shapeArraySize = 0;

            createBuffer();

        };
    document.getElementById("button-undo").onclick =
        function () {
            console.log('undo');
            if (shapeArraySize > 0) {
                var lastIndex = shapeArray.pop();
                shapeArraySize--;

                if (shapeArraySize > 0)
                    index = lastIndex[1];
                else
                    index = 0;

                if (clickCount > 0)
                    clickCount--;
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


        // Changes the shape and render primative
        switch (this.selectedIndex) {
            case 0:
                shape = 0;  // Line
                currentRender = gl.LINE_STRIP;
                break;
            case 1:
                shape = 1;  // Line Width
                currentRender = gl.TRIANGLE_STRIP;
                break;
            case 2:
                shape = 2;  // Line Triangle
                currentRender = gl.LINE_STRIP;
                break;
            case 3:
                shape = 3;  // Solid Rectangle
                currentRender = gl.TRIANGLE_STRIP;
                break;
            case 4:
                shape = 4;  // Line Rectangle
                currentRender = gl.LINE_STRIP;
                break;
            case 5:
                shape = 5;  // Solid Rectangle
                currentRender = gl.TRIANGLE_STRIP;
                break;
            case 6:
                shape = 6;  // Line Circle
                currentRender = gl.LINE_STRIP;
                break;
            case 7:
                shape = 7;  // Solid Circle
                currentRender = gl.TRIANGLE_FAN;
                break;
            default:
                shape = 0;
        }

        clickCount = 0;
        firstClick = null;
    });

    // Draw points and Graphics
    function getPoints(event) {

        // offset window scrolling
        var top = this.scrollY;
        var left = this.scrollX;

        top *= 2;
        left *= 2;
        return vec2(((2 * event.clientX + left) /  canvas.width  - 1),
            (((2 * (canvas.height - event.clientY)) - top   ) / canvas.height - 1));
    }
    function drawBlankPoint() {
        var points = vec2(NaN, NaN);
        var colors = vec4(NaN, NaN, NaN, NaN);
        updateBuffer(points, colors);

    }
    function draw(points) {

        if (!erase) {
            updateBuffer(points, color);

        } else {
            updateBuffer(points, background);
        }

    }
    function drawLineWidth(lastPoint, currentPoint) {
        offset = 0.005 * lineSize;
        var pt1 = vec2(lastPoint[0] - offset, lastPoint[1] + offset);
        var pt2 = vec2(lastPoint[0] - offset, lastPoint[1] - offset);
        var pt3 = vec2(currentPoint[0] + offset, currentPoint[1] + offset);
        var pt4 = vec2(currentPoint[0] + offset, currentPoint[1] - offset);

        draw(pt1);
        draw(pt3);
        draw(pt2);
        draw(pt4);
    }
    function drawLineTriangle(points) {
        /*
         Pattern for trinagle
         a, b,
         b, c,
         c, a
         */
        switch (clickCount % 3) {
            case 0:
                firstClick = points;
                break;
            case 1:
                secondClick = points;

                break;
            case 2:
                history();
                draw(firstClick); // click 0:  write a

                draw(secondClick);
                draw(secondClick);   // click 1:  write b b

                draw(points);  // click 2:  write c c a  (BLANK)
                draw(points);
                draw(firstClick);
                drawBlankPoint();
                break;
        }
    }
    function drawSolidTriangle(points) {
        switch (clickCount % 3) {
            case 0:
                firstClick = points;
                break;
            case 1:
                secondClick = points;
                break;
            case 2:
                history();
                draw(firstClick);
                draw(secondClick);
                draw(points);
                break;
        }

    }
    function drawRectangle(points) {
        if (clickCount % 2 == 0) {
            firstClick = points;
        } else {
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
            history();
            draw(p1);
            draw(p2);  // line 1
            draw(p2);
            draw(p3);  // line 2
            draw(p3);
            draw(p4);  // line 3
            draw(p4);
            draw(p1);  // line 4
            drawBlankPoint();
        }
    }
    function drawSolidRectangle(points) {
        if (clickCount % 2 == 0) {
            firstClick = points;
        } else {
            // Draw a rectangle
            var p1 = firstClick;
            var p2 = vec2(firstClick[0], points[1]);
            var p3 = vec2(points[0], firstClick[1]);
            var p4 = points;
            // firstClick = null;

            /*
             Pattern for Square
             p1 -> p2
             p2 -> p3
             p3 -> p4
             */
            history();
            draw(p1);
            draw(p2);
            draw(p3);
            draw(p4);
            drawBlankPoint();

        }
    }
    function drawCircle(point) {
        if (clickCount % 2 == 0) {
            firstClick = point;

        } else {
            history();
            if (shape == 7) { // Circle Sold
                // Place first click in center and use traingle fan
                draw(firstClick);
            }


            var organ = firstClick;

            // Get Distance
            var x = organ[0] - point[0];
            var y = organ[1] - point[1];
            var dist = distance(x, y);

            x = organ[0];
            y = organ[1];

            for (var i = 0; i <= 360; i++) {
                // Spin Circle
                var radian = toRadian(i);
                var pt = vec2(x + dist * Math.cos(radian), y + dist * Math.sin(radian));
                // Draw Points
                draw(pt);
            }
            drawBlankPoint();
        }

    }
    function distance(x, y) {
        return Math.sqrt(x * x + y * y);
    }
    function toRadian(degree) {
        return degree * Math.PI / 180;
    }

    function history() {
        // Works with the undo function and render()
        // Call when drawing each shape.
        shapeArray.push([currentRender, index, 0]);
        shapeArraySize++;
    }

    // EVENT Listeners
    // Mouse Clicks
    var gc = document.getElementById("gl-canvas");
    gc.addEventListener("mousedown", function (event) {

        var points = getPoints(event);
        var lastPoint = points;  // Line witdth

        switch (shape) {
            case 0: // Lines
                history();
                gc.onmousemove = function (event) {
                    points = getPoints(event);
                    draw(points);
                };
                break;
            case 1: // Line Width
                history();
                gc.onmousemove = function (event) {
                    points = getPoints(event);
                    drawLineWidth(lastPoint, points);
                    lastPoint = points;
                };
                break;

            case 2: // Line Triangle
                drawLineTriangle(points);
                break;
            case 3: // Solid Triangle
                drawSolidTriangle(points);
                break;
            case 4: // Line Rectangle
                drawRectangle(points);
                break;
            case 5: // Solid Rectangle
                drawSolidRectangle(points);
                break;
            case 6: // Line Circle
                drawCircle(points);
                break;
            case 7: // Solid Circle
                drawCircle(points);
                break;
            default:
                alert("An error occurred");
        }
    });
    document.addEventListener("mouseup", function (e) {
        // Line & Line-Width
        // Add blank point to break line segment
        if (shape <= 1) {
            canvas.onmousemove = null;
            drawBlankPoint();
        }
        clickCount++;
    });

    //  BUFFER
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
    function updateBuffer(pointArray, colorArray) {
        // Pointer Array
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(pointArray));

        // Color Array
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * index, flatten(colorArray));
        index++;
        shapeArray[shapeArraySize - 1][2]++;

    }
    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (var i = 0; i < shapeArraySize; i++) {
        gl.drawArrays(shapeArray[i][0], shapeArray[i][1], shapeArray[i][2] );
    }
    window.requestAnimationFrame(render);
}