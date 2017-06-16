
var gl;
var points;
var vArray =[];
var cArray =[];

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    // var vertices = new Float32Array([-1, -1, 0, 1, 1, -1, 1, 1, 0, -1, -1, 1]);
    var a = [-1, -1];
    var b = [0, 1];
    var c = [1, -1];
    var d = [1, 1];
    var e = [0, -1];
    var f = [-1, 1];


    var red = vec3(1, 0, 0);
    var green = vec3(0, 1, 0);
    var blue = vec3(0, 0, 1);

    solidColor(a, b, c, blue);
    muliColor(d, red);
    muliColor(e, green);
    muliColor(f, blue);
    //  Configure WebGL

    console.log(flatten(vArray));

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(cArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER,flatten(vArray), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

function solidColor(a, b, c, color) {
    cArray.push(color, color, color);
    vArray.push(a, b, c);
}
function muliColor(a, color) {
    cArray.push(color);
    vArray.push(a);
}


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, vArray.length );
}
