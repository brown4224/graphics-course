var verticalPosition = [];
var normalData = [];
var textureCoordData = [];

var latitudeBands = 30;
var longitudeBands = 30;
var s_radius = 0.5;
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
        var s_theta = latNumber * Math.PI / latitudeBands;
        var sinTheta = Math.sin(s_theta);
        var cosTheta = Math.cos(s_theta);

        for(var longNumber = 0; longNumber <= longitudeBands; longNumber++){
            var s_phi = longNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(s_phi);
            var cosPhi = Math.cos(s_phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinTheta * sinPhi;

            verticalPosition.push([s_radius * x, s_radius * y, s_radius * z, 1.0]);
            // Test
            // verticalPosition.push(s_radius * x);
            // verticalPosition.push(s_radius * y);
            // verticalPosition.push(s_radius * z);

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

            var ptColor = 1;
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

        }
    }
    console.log("verticalPosition: " + verticalPosition.length);
    console.log(verticalPosition);
    console.log("points array: " + pointsArray.length);
    console.log(pointsArray);


}
