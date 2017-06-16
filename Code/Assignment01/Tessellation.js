//Sean McGlincy
var numberOfIterations = 0;
var degrees = 0;

var isTraingle = false;
var isDebugg = false;
var radian = toRadian(degrees);


var gl;
var points;
var ptarray = [];
var bufferId;
var vPosition;
var program;


function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't avaible");
    }




    // Points
    var a = [-0.5, -0.5];
    var b = [0, 0.5];
    var c = [0.5, -0.5];

    tesselate(a, b, c, numberOfIterations);

    //Flatten and make Float32
    ptarray = flatten(ptarray);

    if (isDebugg) {
        console.log('pt array');
        console.log(ptarray);
        console.log(ptarray.length);
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);

    // Load Shaders
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, ptarray, gl.STATIC_DRAW);

    // associate out shader to data buffer
    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(vPosition);

    // Event Listeners
    document.getElementById("slider1").onchange = function(event) {
        numberOfIterations = parseInt(event.target.value);
    };
    document.getElementById("slider2").onchange = function(event) {
        degrees = parseInt(event.target.value);
        radian = toRadian(degrees);
    };





    render();

};
// Takes array pt of triangles
function appendTriangle(a, b, c) {
    a = rotatePT(a);
    b = rotatePT(b);
    c = rotatePT(c);

    if (isTraingle) {
        ptarray.push(a, b, c);
    } else {
        ptarray.push(
            a, b,
            b, c,
            c, a
        );
    }
}


function tesselate(a, b, c, count) {
    // a = rPT(a);
    // b = rPT(b);
    // c = rPT(c);


    if (count <= 0)
        appendTriangle(a, b, c);
    else {
        var ab = findMidPT(a, b);
        var bc = findMidPT(b, c);
        var ca = findMidPT(c, a);

        count--;

        tesselate(ab, bc, ca, count);
        tesselate(a, ab, ca, count);
        tesselate(b, bc, ab, count);
        tesselate(c, ca, bc, count);

    }
}

// finds midpoint in a line
function findMidPT(pt1, pt2) {
    if (pt1.length != 2)
        alert("Point 1 is not a point");
    if (pt2.length != 2)
        alert("Point 2 is not a point");

    return [
        (( pt1[0] + pt2[0] ) / 2),
        (( pt1[1] + pt2[1] ) / 2)
    ];
}

function rotatePT(point) {
    var x = point[0];
    var y = point[1];

    var pt = [];
    var dist = distance(x, y);
    pt.push(x * Math.cos(dist * radian) - y * Math.sin(dist * radian));
    pt.push(x * Math.sin(dist * radian) + y * Math.cos(dist * radian));
    return pt;
}

function distance(x, y) {
    return Math.sqrt(x * x + y * y);
}
function toRadian(degree) {
    return degree * Math.PI / 180;
}





function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);

    if (isTraingle)
        gl.drawArrays(gl.TRIANGLES, 0, ptarray.length / 2);
    else
        gl.drawArrays(gl.LINES, 0, ptarray.length / 2);
    ptarray = [];
    requestAnimFrame(init);
}

window.onload = init;