"use strict";

var canvas;
var gl;


var debug = false;
// Arrays
var pointsArray = [];
var normalsArray = [];

var shapeArray = [];  // CUBE, SPHERE, CONE: [START, END POINTS]
var renderCube = 0;
var renderSphere = 1;
var renderCone = 2;
var historyArray = [];
var colorsArray = [];

// Movement
var axis = 0;
var rotateAxis = [ 0.0, 0.0, 0.0 ]; //Theta X,Y,Z
var trans = [ 1.0, 0.0, 0.0 ];


//   Perspective
var near = 0.1;
var far = 30.0;
var radius = 4.0;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

// Aspect Ratio
var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect;       // Viewport aspect ratio

// Model View
var mvMatrix;
var pMatrix;
var modelView;
var projection;

// Eye
// var eye;
var eye = vec3(0.0, 0.0, 8.0);
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

// Lighting
var ambientColor, diffuseColor, specularColor;

var lightPosition = vec4(5.0, 0.0, 10.0, 0.0 );
var lightAmbient = vec4( 0.75, 0.75, 0.75, 1.0 );
// var lightAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 1.0, 1.0, 1.0);
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 100.0;


// Color
var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
    vec4( 1.0, 1.0, 1.0, 1.0 )  // white
];

window.onload = function init() {

    ///////////////  INIT PROGRAM   //////////////////////
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.9, 0.9, 0.9, 1.0 );
    gl.enable(gl.DEPTH_TEST);


    var program = initShaders( gl, "light-shader",  "fragment-shader" );
    gl.useProgram( program );

    ///////////////  DRAW SHAPES   //////////////////////
    // Imported from Cube File
    // Pass Draw Functions into helper function
    shapeMapper(drawCube, pointsArray.length);
    shapeMapper(drawSphere, pointsArray.length);
    shapeMapper(drawCone, pointsArray.length);

    // MODEL VIEW AND CAMERA
    aspect =  canvas.width/canvas.height;



    ///////////////  LIGHTING   //////////////////////
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);



    ///////////////  COLOR BUFFER   //////////////////////
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    ///////////////  NORMAL VECTORS BUFFER   ///////////////
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    ///////////////  VERTEX BUFFER   //////////////////////
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    ///////////////  UNIFORM VARIABLES   //////////////////////
    modelView = gl.getUniformLocation( program, "modelView" );
    projection = gl.getUniformLocation( program, "projection" );
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition) );
    gl.uniform1f(gl.getUniformLocation(program, "shininess"),materialShininess);





// buttons for viewing parameters
    // document.getElementById("Button1").onclick = function(){near  *= 1.1; far *= 1.1;};
    // document.getElementById("Button2").onclick = function(){near *= 0.9; far *= 0.9;};
    // document.getElementById("Button3").onclick = function(){radius *= 2.0;};
    // document.getElementById("Button4").onclick = function(){radius *= 0.5;};
    // document.getElementById("Button5").onclick = function(){theta += dr;};
    // document.getElementById("Button6").onclick = function(){theta -= dr;};
    // document.getElementById("Button7").onclick = function(){phi += dr;};
    // document.getElementById("Button8").onclick = function(){phi -= dr;};
    document.getElementById("button-canvas").onclick =
        function () {
            canvas.width += 100;
            canvas.height += 100;
            gl.viewport(0, 0, canvas.width, canvas.height);

        };

    render();
};


var render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // eye = vec3(radius*Math.sin(theta)*Math.cos(phi), radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
    var look = lookAt(eye, at , up);
    pMatrix = perspective(fovy, aspect, near, far);

    // Matrix Manipulation
    rotateAxis[axis] += 2.0; // x axis
    rotateAxis[1] += 2.0;  // y axis
    rotateAxis[2] += 2.0;  // y axis

    trans[0] += 0.1;

    // Cube
    mvMatrix = mult(look, scalem(1.0, 1.0, 1.0) );
    mvMatrix = mult(mvMatrix, translate(-2, 2, 0.0) );
    mvMatrix = mult(mvMatrix, rotateZ(rotateAxis[2] ));
    mvMatrix = mult(mvMatrix, rotateY(rotateAxis[1] ));
    mvMatrix = mult(mvMatrix, rotateX(rotateAxis[0] ));
    renderObject(shapeArray[renderCube]);


    //  Sphere
    mvMatrix = mult(look, scalem(1.0, 1.0, 1.0) );
    mvMatrix = mult(mvMatrix, translate(-2, 0.0, 0.0) );
    mvMatrix = mult(mvMatrix, rotateZ(rotateAxis[2] ));
    mvMatrix = mult(mvMatrix, rotateY(rotateAxis[1] ));
    mvMatrix = mult(mvMatrix, rotateX(rotateAxis[0] ));
    renderObject(shapeArray[renderSphere]);

    // // Second Object
    mvMatrix = mult(look, scalem(1.0, 1.0, 1.0) );
    mvMatrix = mult(mvMatrix, translate(-2, -2, 0.0) );
    mvMatrix = mult(mvMatrix, rotateZ(rotateAxis[2] ));
    mvMatrix = mult(mvMatrix, rotateY(rotateAxis[1] ));
    mvMatrix = mult(mvMatrix, rotateX(rotateAxis[0] ));
    renderObject(shapeArray[renderCone]);


    requestAnimFrame(render);
};

function renderObject(indexArray) {
    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
    gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );
    gl.drawArrays( gl.TRIANGLES, indexArray[0], indexArray[1] );
}

// Pass a function 'funk' which draws a shape
// Map the starting point and offset to shapes array
function shapeMapper(funk,  startIndex) {
    funk();
    var offset = pointsArray.length - startIndex;
    shapeArray.push([startIndex, offset]);



}