var verticalPosition = [];
var normalData = [];
var textureCoordData = [];

var latitudeBands = 30;
var longitudeBands = 30;
radius = 2;
var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
];



function drawSphere() {

// Generate Points
    for(var latNumber = 0; latNumber <= latitudeBands; latNumber++){
        var theta = latNumber * Math.PI / latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for(var longNumber = 0; longNumber <= longitudeBands; longNumber++){
            var phi = longNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinTheta * sinPhi;

            // var u = 1 - (longNumber /longitudeBands);
            // var v = 1- (latNumber / latitudeBands);
            //
            // normalData.push(x);
            // normalData.push(y);
            // normalData.push(z);
            //
            // textureCoordData.push(u);
            // textureCoordData.push(v);

            verticalPosition.push([radius * x, radius * y, radius * z, 1.0]);

            // Test
            // verticalPosition.push(radius * x);
            // verticalPosition.push(radius * y);
            // verticalPosition.push(radius * z);

            // var c =0;
            // pointsArray.push(first);
            // colorsArray.push(vertexColors[c]);
            // pointsArray.push(second);
            // colorsArray.push(vertexColors[c]);
            // pointsArray.push(first + 1);
            // colorsArray.push(vertexColors[c]);
            //
            // pointsArray.push(second);
            // colorsArray.push(vertexColors[c]);
            // pointsArray.push(second + 1);
            // colorsArray.push(vertexColors[c]);
            // pointsArray.push(first + 1);
            // colorsArray.push(vertexColors[c]);

        }
    }

// Generate Indices
    var indexData = [];
    for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
        for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
            var first = (latNumber * (longitudeBands + 1)) + longNumber;
            var second = first + longitudeBands + 1;

            /**
             *
             * Pattern uses triangles to make square
             * abc  // First triangle
             * bdb  // Second triangle
             *
             * a = first
             * b = first++
             * c = second
             * d = second ++
             */

            var ptColor =0;
            var a = first;
            var b = first + 1;
            var c = second;
            var d = second + 1;

            // First Triangle
            pointsArray.push(verticalPosition[a]);
            pointsArray.push(verticalPosition[c]);
            pointsArray.push(verticalPosition[b]);

            colorsArray.push(vertexColors[ptColor]);
            colorsArray.push(vertexColors[ptColor]);
            colorsArray.push(vertexColors[ptColor]);

            // Second Triangle
            pointsArray.push(verticalPosition[c]);
            pointsArray.push(verticalPosition[d]);
            pointsArray.push(verticalPosition[b]);

            colorsArray.push(vertexColors[ptColor]);
            colorsArray.push(vertexColors[ptColor]);
            colorsArray.push(vertexColors[ptColor]);





            // indexData.push(first);
            // indexData.push(second);
            // indexData.push(first + 1);
            //
            // indexData.push(second);
            // indexData.push(second + 1);
            // indexData.push(first + 1);

            // Push First Triangle
            // pointsArray.push(first);
            // pointsArray.push(second);
            // pointsArray.push(first + 1);
            //
            // pointsArray.push(second);
            // pointsArray.push(second + 1);
            // pointsArray.push(first + 1);
        }
    }


}
