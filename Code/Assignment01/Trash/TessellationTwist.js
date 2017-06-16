
var numberOfIterations = 2;
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

    tesselate(a, b, c, numberOfIterations);

    //Flatten and make Float32
    ptarray = flatten(ptarray);

    // console.log('pt array');
    // console.log(ptarray);
    // console.log(ptarray.length);


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
// Takes array pt of triangles
function appendTriangle(a, b, c) {
    ptarray.push(
        a,b,
        b,c,
        c,a
    );
}


    function tesselate(a, b, c, count) {

        if(count <= 0)
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
        if(pt1.length != 2)
            alert("Point 1 is not a point");
        if(pt2.length != 2)
            alert("Point 2 is not a point");

        return [
            (( pt1[0] + pt2[0] )/2),
            (( pt1[1] + pt2[1] )/2)
        ];
    }

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.LINES, 0, ptarray.length / 2 );
    gl.drawArrays( gl.TRIANGLES, 0, ptarray.length / 3 );
    ptarray = [];
}