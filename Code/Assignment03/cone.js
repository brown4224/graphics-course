var c_radius = 0.5;
var c_height = 2.0;

function drawCone() {
    // Variables
    var c_verticalPosition = [];
    var normalData = [];
    var textureCoordData = [];

    var c_color = 0;
    var c_degree = 5;
    var c_organ = vec4(0.0, 0.0, 0.0, 1);
    var c_top = add(c_organ, vec4(0, c_height, 0, 1));


    // Generate Points
    var c_count = 0;
    var c_radian = c_degree * Math.PI / 180;
    var fullCircle = 2 * Math.PI;

    // Make Circle
    var first = pointsArray.length;
    for(var i=0; i<= fullCircle; i += c_radian){
        var x = c_radius * Math.cos(i);
        var y = c_radius * 0;  // zero height
        var z = c_radius * Math.sin(i);

        var pt = vec4(x, y, z, 1);
        c_verticalPosition.push(pt);

        pointsArray.push(pt);
        // normalsArray.push(pt);
        addColor();

        if (c_count > 0){
            pointsArray.push(c_organ);
            pointsArray.push(pt);


            // normalsArray.push(pt);
            // normalsArray.push(pt);

            addColor();
            addColor();
        }
        c_count++;
    }
    var last = pointsArray.length;
    // Remove Extra Point
    pointsArray.pop();
    // normalsArray.pop();
    colorsArray.pop();

    // Make normals for bottom of cone
    var a = vec4(c_radius, 0, 0, 1);
    var b = c_organ;
    var c = vec4(0, c_radius, 0, 1);
    var normal = makeNormal(a, b, c);
    for (i = 0; i< last - first; i++){
        normalsArray.push(normal);
    }

    // var c_size = pointsArray.length;
    // for (var i = first; i< c_size; i++){
    //     var a = pointsArray[i -1];
    //     var b = c_organ;
    //     var c = pointsArray[i];
    // }
    //
    //
    // var c = pointsArray[i -1];
    // var b = c_organ;
    // var a = pointsArray[i];


    var c_first = c_verticalPosition[c_count -1];
    var c_last = c_verticalPosition[0];

    var a = c_first;
    var b = c_top;
    var c = c_last;
    normal = makeNormal(a, b, c );

    // Connect last triangle to first
    pointsArray.push(c_last);
    normalsArray.push(normal);
    // normalsArray.push(c_last);
    addColor();
    pointsArray.push(c_top);
    normalsArray.push(normal);
    // normalsArray.push(top);
    addColor();
    pointsArray.push(c_first);
    normalsArray.push(normal);
    // normalsArray.push(c_first);
    addColor();
    pointsArray.push(c_first);
    // normalsArray.push(c_first);
    var previous = c_first;
    addColor();
    c_verticalPosition.pop();
    c_count--;



    for (var i = 0; i< c_count; i++){
        var pt = c_verticalPosition.pop();
        normal = makeNormal(pt, c_top, previous);

        pointsArray.push(pt);
        normalsArray.push(normal);

        // normalsArray.push(pt);
        addColor();

        pointsArray.push(c_top);
        normalsArray.push(normal);

        // normalsArray.push(c_top);
        addColor();

        pointsArray.push(pt);
        normalsArray.push(normal);

        // normalsArray.push(pt);
        addColor();
        previous = pt;

    }

    function makeNormal(a, b, c) {
        // Normal Vector
        var t1 = subtract(b, a);
        var t2 = subtract(c, b);
        var normal = cross(t1, t2);
        return vec3(normal);
    }

    c_verticalPosition = [];

    function addColor() {
        colorsArray.push(vertexColors[c_color]);
        c_color = ++c_color % 3;
    }


}

