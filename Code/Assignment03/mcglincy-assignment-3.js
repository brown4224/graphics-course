/**
 * Sean McGlincy
 * Graphics
 * Assignment 3
 * Summer 2017
 *
 * All files are included in this folder including libraries.
 *
 * The assignment has been broken up into multiple JS scripts for organization.
 * The shapes each have their own file and there are two spheres.
 * The first is the one that I used.  It uses a longitude and latitude coordinate system.
 * The 'sphere alt' is the example from the book.
 *
 * User can create Cubes, Sphere and Cone.  The user can pick to use the lighting shader or
 * just the vertex shader.  The program always calls the same shader but passes a shader flag to the shader
 * to determine what calculations to make.  Shaders do not have boolean logic, so the shader uses 0.0 or 1.0.
 *
 * The user can move the light source, color, camera and manipulate the two spheres. The user can adjust the
 * sphere's rotation to a limit.  The rotation speed can be adjusted in the render function for each axis.
 */

"use strict";
var canvas;
var program;
var gl;
var shaderFlag;
var flag = true;
var debug = false;
var random = 0;

// Arrays
var pointsArray = [];
var normalsArray = [];

var shapeArray = [];  // CUBE, SPHERE, CONE: [START, END POINTS]
var renderCube = 0;
var renderSphere = 1;
var renderCone = 2;
var current = 0;
var historyArray = [];
var colorsArray = [];

// Movement
var axis = 0;
var rotateAxis = [0.0, 0.0, 0.0]; //Theta X,Y,Z


//   Perspective
var near = 0.1;
var far = 30.0;
var radius = 8.0;
var theta = 0.0;
var phi = 0.0;
var dr = 10.0 * Math.PI / 180.0;

// Aspect Ratio
var fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var aspect;       // Viewport aspect ratio

// Model View
var mvMatrix;
var pMatrix;
var modelView;
var projection;

// Eye
var look;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

// Rotate
var xAxis = 0;
var yAxis = 0;
var zAxis = 0;

// Lighting
var ambientColor, diffuseColor, specularColor;

// Lighting Color
var red = 1.0;
var green = 1.0;
var blue = 1.0;

var lightPosition = vec4(5.0, 0.0, 10.0, 0.0);
var lightAmbient;
var lightDiffuse;
var lightSpecular;

var materialAmbient = vec4(1.0, 1.0, 1.0, 1.0);
var materialDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var materialShininess = 100.0;

// Default Spheres
var sphereScale = [];
var sphereTranslate = [];
var sphereRotate = [];
var sphereSelect = 0;


// Color
var vertexColors = [
    vec4(0.0, 0.0, 0.0, 1.0),  // black
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 1.0, 1.0, 1.0),  // cyan
    vec4(1.0, 1.0, 1.0, 1.0)  // white
];

window.onload = function init() {

    ///////////////  INIT PROGRAM   //////////////////////
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.9, 0.9, 0.9, 1.0);
    gl.enable(gl.DEPTH_TEST);

    program = initShaders(gl, "light-shader", "fragment-shader");
    gl.useProgram(program);
    aspect = canvas.width / canvas.height;


    ///////////////  DRAW SHAPES   //////////////////////
    // Imported from Cube File
    // Pass Draw Functions into helper function
    shapeMapper(drawCube, pointsArray.length);
    shapeMapper(drawSphere, pointsArray.length);
    shapeMapper(drawCone, pointsArray.length);

    // ///////////////  PREPARE FOR RENDERING   //////////////////////
    // Sphere -- Vertex shader
    sphereScale.push(vec3(1.0, 1.0, 1.0));
    sphereTranslate.push([2.0, 0.0, 0.0]);
    historyArray.push([shapeArray[renderSphere], false, sphereScale[0], sphereTranslate[0], randomAxis()]);

    // Sphere -- Lighting shader
    sphereScale.push(vec3(1.0, 1.0, 1.0));
    sphereTranslate.push([-2, 1.0, 0.0]);
    historyArray.push([shapeArray[renderSphere], true, sphereScale[1], sphereTranslate[1], randomAxis()]);


    ///////////////  COLOR BUFFER   //////////////////////
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    ///////////////  NORMAL VECTORS BUFFER   ///////////////
    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    ///////////////  VERTEX BUFFER   //////////////////////
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelView = gl.getUniformLocation(program, "modelView");
    projection = gl.getUniformLocation(program, "projection");
    gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);


    updateLight();
    updateLightPosition();
    function updateLight() {
        ///////////////  LIGHTING   //////////////////////
        lightAmbient = vec4(red, green, blue, 1.0);
        lightDiffuse = vec4(red, green, blue, 1.0);
        lightSpecular = vec4(red, green, blue, 1.0);

        var ambientProduct = mult(lightAmbient, materialAmbient);
        var diffuseProduct = mult(lightDiffuse, materialDiffuse);
        var specularProduct = mult(lightSpecular, materialSpecular);

        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));


        var str = "RGB: " + red + ", " + green + ", " + blue;
        document.getElementById("rgb").innerHTML = str;
    }

    function updateLightPosition() {
        ///////////////  LIGHTING Position   //////////////////////
        gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));

        var str = "Light Postiion: " + lightPosition[0] + ", " + lightPosition[1] + ", " + lightPosition[2];
        document.getElementById("light-bulb").innerHTML = str;
    }


    ///////////////  BUTTONS   //////////////////////
    ///////////////  BUTTONS  Canvas   //////////////////////
    document.getElementById("button-canvas").onclick =
        function () {
            canvas.width += 100;
            canvas.height += 100;
            gl.viewport(0, 0, canvas.width, canvas.height);

        };

    ///////////////  BUTTONS  Shape   //////////////////////
    document.getElementById("menu-shape").addEventListener("click", function () {
        // Change Cube, Sphere, Cone
        switch (this.selectedIndex) {
            case 0:
                current = renderCube;
                break;
            case 1:
                current = renderSphere;
                break;
            case 2:
                current = renderCone;
                break;
            default:
                current = renderCube;
        }

    });
    ///////////////  BUTTONS  Shader   //////////////////////
    document.getElementById("menu-shader").addEventListener("click", function () {
        // Switches Rendering Intent
        switch (this.selectedIndex) {
            case 0:
                flag = true;
                break;
            case 1:
                flag = false;
                break;
        }

    });

    ///////////////  BUTTONS  Create Object   //////////////////////
    document.getElementById("button-create").addEventListener("click", function () {
        /**
         * Grab X, Y, Z values.
         * Perform some kind of check to make sure they will show
         * Add to our history buffer for latter processing
         *
         */

        var x = document.getElementById("x").value;
        var y = document.getElementById("y").value;
        var z = document.getElementById("z").value;

        //  Check the bounds
        // Should be between -3 to 3
        x = numberCheck(x);
        y = numberCheck(y);
        z = numberCheck(z);

        var userScale = [1.0, 1.0, 1.0];

        historyArray.push([shapeArray[current], flag, userScale, [x, y, z], randomAxis()]);

    });

    ///////////////  BUTTONS  Light Color   //////////////////////
    document.getElementById("button-light-red-plus").onclick = function () {
        if (red < 1.0)
            red += 0.1;
        updateLight()
    };
    document.getElementById("button-light-red-minus").onclick = function () {
        if (red > 0.0)
            red -= 0.1;
        updateLight();
    };
    document.getElementById("button-light-green-plus").onclick = function () {
        if (green < 1.0)
            green += 0.1;
        updateLight();
    };
    document.getElementById("button-light-green-minus").onclick = function () {
        if (green > 0.0)
            green -= 0.1;
        updateLight();
    };
    document.getElementById("button-light-blue-plus").onclick = function () {
        if (blue < 1.0)
            blue += 0.1;
        updateLight();
    };
    document.getElementById("button-light-blue-minus").onclick = function () {
        if (blue > 0.0)
            blue -= 0.1;
        updateLight();
    };

    ///////////////  BUTTONS  Light Position   //////////////////////
    document.getElementById("button-light-position-x-plus").onclick = function () {
        lightPosition = vec4(++lightPosition[0], lightPosition[1], lightPosition[2], 1.0);
        updateLightPosition();
    };
    document.getElementById("button-light-position-x-minus").onclick = function () {
        lightPosition = vec4(--lightPosition[0], lightPosition[1], lightPosition[2], 1.0);
        updateLightPosition();
    };
    document.getElementById("button-light-position-y-plus").onclick = function () {
        lightPosition = vec4(lightPosition[0], ++lightPosition[1], lightPosition[2], 1.0);
        updateLightPosition();
    };
    document.getElementById("button-light-position-y-minus").onclick = function () {
        lightPosition = vec4(lightPosition[0], --lightPosition[1], lightPosition[2], 1.0);
        updateLightPosition();
    };
    document.getElementById("button-light-position-z-plus").onclick = function () {
        lightPosition = vec4(lightPosition[0], lightPosition[1], ++lightPosition[2], 1.0)
        updateLightPosition()
    };
    document.getElementById("button-light-position-z-minus").onclick = function () {
        lightPosition = vec4(lightPosition[0], lightPosition[1], --lightPosition[2], 1.0)
        updateLightPosition()
    };

    ///////////////  BUTTONS  Camera   //////////////////////
    document.getElementById("button-near-increase").onclick = function () {
        near *= 1.1;
        far *= 1.1;
    };
    document.getElementById("button-near-minus").onclick = function () {
        near *= 0.9;
        far *= 0.9;
    };
    document.getElementById("button-radius-plus").onclick = function () {
        radius += 1.0;
    };
    document.getElementById("button-radius-minus").onclick = function () {
        radius -= 1.0;
    };
    document.getElementById("button-theta-increase").onclick = function () {
        theta += dr;
    };
    document.getElementById("button-theta-decrease").onclick = function () {
        theta -= dr;
    };
    document.getElementById("button-phi-increase").onclick = function () {
        phi += dr;
    };
    document.getElementById("button-phi-decrease").onclick = function () {
        phi -= dr;
    };

    ///////////////  BUTTONS  Sphere Select   //////////////////////
    document.getElementById("menu-sphere-select").addEventListener("click", function () {
        // Switches Rendering Intent
        switch (this.selectedIndex) {
            case 0:
                sphereSelect = 0;
                break;
            case 1:
                sphereSelect = 1;
                break;
        }

    });
    ///////////////  BUTTONS  Sphere Scale   //////////////////////
    document.getElementById("button-sphere-scale").addEventListener("click", function () {
        /**
         * Grab X, Y, Z values.
         * Perform some kind of check to make sure they will show
         * Use Sphere Select to choose the current sphere
         * Update the history array
         *
         */

        var x = document.getElementById("spherex").value;
        var y = document.getElementById("spherey").value;
        var z = document.getElementById("spherez").value;

        if (x < 0)
            x = 0;
        if (y < 0)
            y = 0;
        if (z < 0)
            z = 0;

        var i = sphereSelect;
        historyArray[i][2] = [x, y, z];
    });
    document.getElementById("button-sphere-trans").addEventListener("click", function () {
        /**
         * Grab X, Y, Z values.
         * Perform some kind of check to make sure they will show
         * Use Sphere Select to choose the current sphere
         * Update the history array
         *
         */
        console.log("Translate Button");


        var x = document.getElementById("spherex").value;
        var y = document.getElementById("spherey").value;
        var z = document.getElementById("spherez").value;

        x = numberCheck(x);
        y = numberCheck(y);
        z = numberCheck(z);

        var i = sphereSelect;
        historyArray[i][3] = vec3(x, y, z);
    });
    ///////////////  BUTTONS  Sphere Rotate   //////////////////////
    document.getElementById("button-sphere-rotate-x").onclick = function () {
        historyArray[sphereSelect][4][0] = true;
    };
    document.getElementById("button-sphere-stop-x").onclick = function () {
        historyArray[sphereSelect][4][0] = false;
    };
    document.getElementById("button-sphere-rotate-y").onclick = function () {
        historyArray[sphereSelect][4][1] = true;
    };
    document.getElementById("button-sphere-stop-y").onclick = function () {
        historyArray[sphereSelect][4][1] = false;
    };
    document.getElementById("button-sphere-rotate-z").onclick = function () {
        historyArray[sphereSelect][4][2] = true;
    };
    document.getElementById("button-sphere-stop-z").onclick = function () {
        historyArray[sphereSelect][4][2] = false;
    };

    render();
};


var render = function () {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // CAMERA AND MODEL VIEW
    eye = vec3(radius * Math.sin(theta) * Math.cos(phi), radius * Math.sin(theta) * Math.sin(phi), radius * Math.cos(theta));
    look = lookAt(eye, at, up);
    pMatrix = perspective(fovy, aspect, near, far);

    // Rotation
    rotateAxis[xAxis] += 1.0; // x axis
    rotateAxis[yAxis] += 1.0;  // y axis
    rotateAxis[zAxis] += 1.0;  // z axis


    ///////////////  Render Objects   //////////////////////
    /**
     *
     * Pull objects from the history array.
     * Position 0 & 1 are default spheres
     *
     * arr[0]:  Type of shape, pulls from the shapes array.
     *             CUBE, SPHERE, CONE: [START, OFF Set]
     *             The shapes array represents each object by the
     *             vertex start position and off set.
     *             For example the cube might start at postion 0 and sphere at 36.
     *             The cube's value will then be [0, 36] and represent positions
     *             0 to 35.  Position 36 is where the cube starts
     * arr[1]:  Flag for shader.  Passed into shader and represents if lighting is used.
     * arr[2]:  Vec3:   Scale values for matrix multiplication
     * arr[3]:  Vec3:   Translation values for matrix multiplication
     * arr[4]:  Vec3:   Boolan Flag for rotation
     *                  Each axis can rotate at different speeds.
     *                  This flag determine which axis will be rotated.
     */
    var size = historyArray.length;
    for (var i = 0; i < size; i++) {
        var arr = historyArray[i];
        renderObject(arr[0], arr[1], arr[2], arr[3], arr[4]);
    }


    requestAnimFrame(render);
};

function renderObject(indexArray, flag, scaler, trans, axis) {
    // False: Use Vertex Shader
    // True: Use Light Shader
    // Flag is passed into the shader as a float
    var flagValue = 0.0;
    if (flag) {
        flagValue = 1.0;
    }


    // Look, Scale, Translate
    // Look: Resets the position for each object
    mvMatrix = mult(look, scalem(scaler[0], scaler[1], scaler[2]));
    mvMatrix = mult(mvMatrix, translate(trans));


    if (axis[0])
        mvMatrix = mult(mvMatrix, rotateX(rotateAxis[xAxis]));
    if (axis[1])
        mvMatrix = mult(mvMatrix, rotateY(rotateAxis[yAxis]));
    if (axis[2])
        mvMatrix = mult(mvMatrix, rotateZ(rotateAxis[zAxis]));


    // All that work:  Lets Render!
    gl.uniform1f(gl.getUniformLocation(program, "shaderFlag"), flagValue);
    gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
    gl.uniformMatrix4fv(projection, false, flatten(pMatrix));
    gl.drawArrays(gl.TRIANGLES, indexArray[0], indexArray[1]);
}

// Pass a function 'funk' which draws a shape
// Map the starting point and offset to shapes array
function shapeMapper(funk, startIndex) {
    funk();
    var offset = pointsArray.length - startIndex;
    shapeArray.push([startIndex, offset]);
}

function randomAxis() {
    // var axis = Math.floor(Math.random() * 3);
    axis = random % 3;
    random++
    var ans;
    switch (axis) {
        case 0:
            ans = [true, false, false];
            break;
        case 1:
            ans = [false, true, false];
            break;
        case 2:
            ans = [false, false, true];
            break;
    }
    return ans;
}
function numberCheck(num) {
    if (num > 3)
        num = 3;
    if (num < -3)
        num = -3
    return num;

}
