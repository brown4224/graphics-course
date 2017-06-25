var verticalPosition = [];
var normalData = [];
var textureCoordData = [];


var c_radius = 0.5;
var c_color = 0;
var degree = 10;
var organ = vec4(0.0, 0.0, 0.0, 1);




function drawCone() {

// Generate Points
    var c_count = 0;
    var c_radian = degree * Math.PI / 180;
    var fullCircle = 2 * Math.PI;
    for(var i=0; i<= fullCircle; i += c_radian){
        var x = Math.cos(i);
        var y = Math.sin(i);
        var z = c_radius;

        // verticalPosition.push(vec4(x, y, z, 1));
        var pt = vec4(x, y, z, 1);

        pointsArray.push(pt);
        sphereColor();
        if (c_count > 0){
            pointsArray.push(organ);
            sphereColor();
            pointsArray.push(pt);
            sphereColor();
        }

        c_count++;
    }





    //
    // for(var latNumber = 0; latNumber <= latitudeBands; latNumber++){
    //     var c_theta = latNumber * Math.PI / latitudeBands;
    //     var sinTheta = Math.sin(c_theta);
    //     var cosTheta = Math.cos(c_theta);
    //
    //     for(var longNumber = 0; longNumber <= longitudeBands; longNumber++){
    //         var c_phi = longNumber * 2 * Math.PI / longitudeBands;
    //         var sinPhi = Math.sin(c_phi);
    //         var cosPhi = Math.cos(c_phi);
    //
    //         // var x = cosPhi * sinTheta;
    //         // var y = 1;
    //         // var z = cosTheta;
    //
    //         var x = cosPhi * sinTheta;
    //         var y = cosTheta;
    //         var z = sinTheta * sinPhi;
    //         var pt = vec4(s_radius * x, s_radius * y, s_radius * z, 1.0);
    //         // verticalPosition.push([s_radius * x, s_radius * y, s_radius * z, 1.0]);
    //
    //         // First Triangle
    //         if(c_i % 3 == 0) {
    //             pointsArray.push(organ);
    //             c_i++;
    //             sphereColor();
    //
    //         }
    //
    //
    //         pointsArray.push(pt);
    //         sphereColor();
    //         c_i++;
    //
    //
    //     }
    // }
//
// // Generate Indices
//     var indexData = [];
//     for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
//         for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
//             var first = (latNumber * (longitudeBands + 1)) + longNumber;
//             var second = first + longitudeBands + 1;
//
//             /**
//              *
//              * Pattern uses triangles to make square
//              * abc  // First triangle
//              * bdb  // Second triangle
//              *
//              * a = first
//              * b = first++
//              * c = second
//              * d = second ++
//              */
//
//
//             var a = first;
//             var b = first + 1;
//             var c = second;
//             var d = second + 1;
//
//
//             // First Triangle
//             pointsArray.push(verticalPosition[a]);
//             pointsArray.push(verticalPosition[c]);
//             pointsArray.push(verticalPosition[b]);
//
//             sphereColor();
//             sphereColor();
//             sphereColor();
//
//             // Second Triangle
//             pointsArray.push(verticalPosition[c]);
//             pointsArray.push(verticalPosition[d]);
//             pointsArray.push(verticalPosition[b]);
//
//             sphereColor();
//             sphereColor();
//             sphereColor();
//         }


    if(debug){
        console.log("verticalPosition: " + verticalPosition.length);
        console.log(verticalPosition);
        console.log("points array: " + pointsArray.length);
        console.log(pointsArray);
    }



}

function sphereColor() {
    colorsArray.push(vertexColors[c_color]);
    c_color = ++c_color % 3;
}

