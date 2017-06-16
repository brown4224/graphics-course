
var gl;
var points;
var ptarray = [];
var bufferId;
var vPosition;
var program;

window.onload = function init()
{
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl){alert("WebGL isn't avaible");}

    // Points
    var a = [-1, -1];
    var b = [0, 1];
    var c = [1, -1];

    // Line Segments
    ptarray.push(
        a,b,
        b,c,
        c,a
    );


    //Flatten and make Float32
    ptarray = flatten(ptarray);
    intecies = ptarray.length / 2;   // Lines = 2  Triangles = 3


    console.log('pt array');
    console.log(ptarray);
    console.log(ptarray.length);

    // Config WebGL
    //  viewport (x, y, width, height)
    gl.viewport(0,0, canvas.width, canvas.height);
    gl.clearColor( 0.0, 0.0, 0.0, 0.0 );

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

    render();

};


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.LINES, 0, intecies);
}