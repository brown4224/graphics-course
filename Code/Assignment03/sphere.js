var s_verticalPosition = [];
var normalData = [];
var textureCoordData = [];

var s_latitudeBands = 30;
var s_longitudeBands = 30;
var s_radius = 0.5;
var s_color = 0;




function drawSphere() {

// Generate Points
    for(var latNumber = 0; latNumber <= s_latitudeBands; latNumber++){
        var s_theta = latNumber * Math.PI / s_latitudeBands;
        var sinTheta = Math.sin(s_theta);
        var cosTheta = Math.cos(s_theta);

        for(var longNumber = 0; longNumber <= s_longitudeBands; longNumber++){
            var s_phi = longNumber * 2 * Math.PI / s_longitudeBands;
            var sinPhi = Math.sin(s_phi);
            var cosPhi = Math.cos(s_phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinTheta * sinPhi;

            s_verticalPosition.push([s_radius * x, s_radius * y, s_radius * z, 1.0]);

        }
    }

// Generate Indices
    var indexData = [];
    for (var latNumber = 0; latNumber < s_latitudeBands; latNumber++) {
        for (var longNumber = 0; longNumber < s_longitudeBands; longNumber++) {
            var first = (latNumber * (s_longitudeBands + 1)) + longNumber;
            var second = first + s_longitudeBands + 1;

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


            var a = first;
            var b = first + 1;
            var c = second;
            var d = second + 1;


            // First Triangle
            pointsArray.push(s_verticalPosition[a]);
            pointsArray.push(s_verticalPosition[c]);
            pointsArray.push(s_verticalPosition[b]);

            sphereColor();
            sphereColor();
            sphereColor();

            // Second Triangle
            pointsArray.push(s_verticalPosition[c]);
            pointsArray.push(s_verticalPosition[d]);
            pointsArray.push(s_verticalPosition[b]);

            sphereColor();
            sphereColor();
            sphereColor();
        }
    }

    function sphereColor() {
        colorsArray.push(vertexColors[s_color]);
        s_color = ++s_color % 3;
    }

    if(debug){
        console.log("verticalPosition: " + s_verticalPosition.length);
        console.log(s_verticalPosition);
        console.log("points array: " + pointsArray.length);
        console.log(pointsArray);
    }



}
