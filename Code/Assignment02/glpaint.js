
var gl;
var index = 0;
var undo = [];
var clickCount = 0;
// var isClicked = false;
// var varray = [];
// var carray = [];
var bufferSize = 4 * 100000;  // 1000 lines

// Colors
var red = vec4(1, 0, 0, 1);
var green = vec4(0, 1, 0, 1);
var blue = vec4(0, 0, 1, 1);
var color = red;

window.onload = function init()
{

    for (var i = 0; i < 5; i++){
        undo.push(0);
    }
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    //  Configure WebGL

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    gl.enableVertexAttribArray( vColor );

    console.log("Sending to Buffer");

    // Load the data into the GPU
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, bufferSize, gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Load the data into the GPU
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, 2 * bufferSize, gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    // Buttions
    document.getElementById("button-canvas-width").onclick =
        function() { canvas.width *= 1.10 };
    document.getElementById("button-canvas-height").onclick =
        function() { canvas.height *= 1.10 };
    document.getElementById("button-canvas-clear").onclick =
        function() {index = 0;  };
    document.getElementById("button-undo").onclick =
        function() {
            if(clickCount > 0){
                var update = index - undo[clickCount];
                console.log(clickCount);
                index = undo[clickCount];
                clickCount--;

                for(var i=0; i< update; i++){
                    var points = vec2(NaN, NaN);
                    var colors =  vec4(NaN, NaN, NaN, NaN);
                    updateBuffer(points, colors);
                }

            }
        };


    // Menu
    document.getElementById("menu-color").addEventListener("click", function () {
        switch (this.selectedIndex){
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


    // Event Listeners
    function draw(event) {
        var points = vec2(2 * event.clientX / canvas.width - 1,
            2 * (canvas.height - event.clientY) / canvas.height - 1);

        updateBuffer(points, color);
        console.log("index: " +index);
        index++;
    }


    canvas.addEventListener("mousedown", function(event){
        draw(event);


        canvas.onmousemove = function(event) {
            undo[clickCount % 5] = index;
            clickCount++;

            draw(event);
        }
    });

    canvas.addEventListener("mouseup", function(e){
        canvas.onmousemove = null;
        var points = vec2(NaN, NaN);
        var colors =  vec4(NaN, NaN, NaN, NaN);
        updateBuffer(points, colors);
        console.log("index: " +index);
        index++;
    });


    // Use buffer subdata:  memory location, offset, data
    function updateBuffer(pointArray, colorArray) {
        console.log("Update buffer");
        // Pointer Array
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(pointArray));

        // Color Array
        gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 16*index, flatten(colorArray));

        // console.log("index: " +index);
        // index++;
    }

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINE_STRIP, 0, index );
    window.requestAnimationFrame(render);
}




