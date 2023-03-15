
var canvas = document.getElementById("bugs");   // retrieve canvas element

canvas.height = window.innerHeight;             // fills the screen
canvas.width = window.innerWidth;               // fills the screen
let aspectRatio = canvas.width / canvas.height; //

var ctx = canvas.getContext("webgl");            // rendering context
var program = ctx.createProgram();               // creating the rendering

var positionAttribLocation;                     // position of attribute
var colorUniformLocation;                       //
var scalerAttribLocation;                       //
var triangleVertexBufferObject;                 // vertex buffer

var vertexCount = 64;                           // how many vertices on circle for bacteria to pop up on
let gRate = 0.001;                         // how fast the bacteria grows
let radius = 0.8;                               // radius of inner circle
let circleSpace = 0.2;                          // space between bacteria
let circleRadius = 0.05;                        // bacteria radius

// initialize vertices
var triangleVertices = initVertices(      
  0,
  0,
  radius,
  vertexCount,
  aspectRatio
);

// initialize vertices
var CircleVertices = initVertices(
  0,
  0,
  radius,
  vertexCount,
  aspectRatio
);

// vertex shader program (describes traits of vertices)
var vertexShaderText = [
  "precision mediump float;",                       // precision qualifier
  "attribute vec2 vertPosition;",                   // pass data to frag shader
  "void main()",
  "{",
  "gl_Position = vec4(vertPosition,0.0,1.0);",     // position of vertex
  "	gl_PointSize = 5.0;",                           // size of a point (in pixels)
  "}",
].join("\n");

// fragment shader program (per-fragment processing "lighting")
var fragmentShaderText = [
  "precision mediump float;",                       // precision qualifier
  "uniform vec4 fColor;",                           // uniform variable
  "void main()",
  "{",
  "	gl_FragColor = fColor;",                        // specifies the colour of a fragment
  "}",
].join("\n");

// contains all bacteria
const circleMap = new Map();

function createCircle() {
  // loop through vertices to find space for bacteria to grow
  let x = 0,
    y = 0,
    theta = 0;
  let counter = 0;
  while (true) {
    let okCircle = true;
    theta = Math.floor(Math.random() * 360) + 1;
    y = radius * Math.sin((2 * Math.PI * theta) / 360);
    x = (radius * Math.cos((2 * Math.PI * theta) / 360)) / aspectRatio;
    
    if (okCircle) break;
    counter++;
    if (counter >= 10) {
      break;
    }
  }
  // generate color for bacteria
  let rgbInt = GenerateColor();

  // id for buffer
  let rgbStr = "" + rgbInt[0] + rgbInt[1] + rgbInt[2];
  const clampf = (r, g, b, a) => [r / 255, g / 255, b / 255, a];
  let rgba = clampf(rgbInt[0], rgbInt[1], rgbInt[2], 1.0); 

  // create buffers
  var vertexBuffer = ctx.createBuffer();
  var fragmentBuffer = ctx.createBuffer();

  // return circle 
  return [
    rgbStr,
    {
      x: x,
      y: y,
      r: rgba[0],
      g: rgba[1],
      b: rgba[2],
      a: rgba[3],
      radius: circleRadius,
      vertexBuffer: vertexBuffer,
      fragmentBuffer: fragmentBuffer,
    },
  ];
}

// generate colours for bacteria
function GenerateColor() {
  let rgbVals = new Float32Array(3);
  for (let i = 0; i < 3; i++) {
    let val = Math.floor(Math.random() * 154) + 100;
    rgbVals[i] = val;
  }
  return rgbVals;
}

var main = function () {
  if (!ctx) {
    console.log("webgl not supported, falling back on experimental-webgl");
    ctx = canvas.getContext("experimental-webgl", {
      preserveDrawingBuffer: true,
    });
  }

  if (!ctx) {
    alert("your browser does not support webgl");
  }

  ctx.viewport(0, 0, canvas.width, canvas.height);

  var vertexShader = ctx.createShader(ctx.VERTEX_SHADER);
  var fragmentShader = ctx.createShader(ctx.FRAGMENT_SHADER);

  ctx.shaderSource(vertexShader, vertexShaderText);
  ctx.shaderSource(fragmentShader, fragmentShaderText);
  ctx.compileShader(vertexShader);

  if (!ctx.getShaderParameter(vertexShader, ctx.COMPILE_STATUS)) {
    console.error(
      "Error compiling vertex shader!",
      ctx.getShaderInfoLog(vertexShader)
    );
    return;
  }

  ctx.compileShader(fragmentShader);
  if (!ctx.getShaderParameter(fragmentShader, ctx.COMPILE_STATUS)) {
    console.error(
      "Error compiling vertex shader!",
      ctx.getShaderInfoLog(fragmentShader)
    );
    return;
  }

  ctx.attachShader(program, vertexShader);
  ctx.attachShader(program, fragmentShader);
  ctx.linkProgram(program);

  if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) {
    console.error("Error linking program!", ctx.getProgramInfo(program));
    return;
  }

  ctx.useProgram(program);

  // get the storage location of attribute variable
  positionAttribLocation = ctx.getAttribLocation(program, "vertPosition"); 

  // get the storage location of fColor
  colorUniformLocation = ctx.getUniformLocation(program, "fColor");

  // initialize the bacteria
  for (let i = 0; i < 10; i++) {
    createBacteria();
  }

  // create vertex buffer 
  triangleVertexBufferObject = ctx.createBuffer();
};

// initialize vertices 
function initVertices(x, y, radius, numOfSides) {
  let origin = { x, y };
  let pi = Math.PI;
  x = new Float32Array(numOfSides * 2);
  y = new Float32Array(numOfSides * 2);
  vertices = new Float32Array(numOfSides * 4);
 
  for (let i = 0; i <= numOfSides; i += 2) {
    vertices[i] = x[i];
    vertices[i + 1] = y[i];
  }
  return vertices;
}

// draw call 
function Draw() {
  ctx.bindBuffer(ctx.ARRAY_BUFFER, triangleVertexBufferObject);   // bind vertex buffer

	 // write data into buffer object
  ctx.bufferData(
    ctx.ARRAY_BUFFER,
    new Float32Array(triangleVertices),
    ctx.STATIC_DRAW
  );

  // assign buffer object to position variable
  ctx.vertexAttribPointer(
    positionAttribLocation, 
    2, 
    ctx.FLOAT,
    ctx.FALSE,
    2 * Float32Array.BYTES_PER_ELEMENT, 
    0 * Float32Array.BYTES_PER_ELEMENT 
  );

  ctx.enableVertexAttribArray(positionAttribLocation);     // enable assignment to position
  ctx.uniform4f(colorUniformLocation, 0, 0, 0, 0);         // pass the color of a point to fColor variable
  ctx.drawArrays(ctx.TRIANGLE_FAN, 0, vertexCount);         // vertex shader draws shapes

  // write data into buffer object
  ctx.bufferData(
    ctx.ARRAY_BUFFER,
    new Float32Array(CircleVertices),
    ctx.STATIC_DRAW
  );

   // assign buffer object to position variable
  ctx.vertexAttribPointer(
    positionAttribLocation,
    2, 
    ctx.FLOAT,
    ctx.FALSE,
    2 * Float32Array.BYTES_PER_ELEMENT, // individual vertex size
    0 * Float32Array.BYTES_PER_ELEMENT  // offset from vertex to this attribute
  );

  ctx.enableVertexAttribArray(positionAttribLocation);        // enable assignment to position
  ctx.uniform4f(colorUniformLocation, 0, 0, 0, 0);           // pass the color of a point to fColor variable
  ctx.drawArrays(ctx.TRIANGLE_FAN, 0, vertexCount);           // vertex shader draws shapes
}

function newDrawCircle(circle, drawType) {
  x = new Float32Array(vertexCount * 2);
  y = new Float32Array(vertexCount * 2);
  vertices = new Float32Array(vertexCount * 4);

  // each vertex in the circle
  for (let i = 0; i < vertexCount * 2; i++) {
    y[i] = circle.y + circle.radius * Math.sin((2 * Math.PI * i) / vertexCount);
    x[i] =
      circle.x +
      (circle.radius / aspectRatio) * Math.cos((2 * Math.PI * i) / vertexCount);
  }
  for (let i = 0; i <= vertexCount; i += 2) {
    vertices[i + 1] = y[i];
    vertices[i] = x[i];
  }

  // bind vertex buffer
  ctx.bindBuffer(ctx.ARRAY_BUFFER, circle.vertexBuffer);

  // write data into buffer object
  ctx.bufferData(ctx.ARRAY_BUFFER, vertices, ctx.DYNAMIC_DRAW);

   // assign buffer object to position variable
  ctx.vertexAttribPointer(
    positionAttribLocation, // attribute location
    2, // num per attribute
    ctx.FLOAT,
    ctx.FALSE,
    2 * Float32Array.BYTES_PER_ELEMENT, // individual vertex size
    0 * Float32Array.BYTES_PER_ELEMENT // offset from vertex to this attribute
  );

  ctx.enableVertexAttribArray(positionAttribLocation);                            // enable assignment to position
  ctx.uniform4f(colorUniformLocation, circle.r, circle.g, circle.b, circle.a);   // pass the color of a point to fColor variable
  ctx.drawArrays(drawType, 0, vertexCount);                                      // vertex shader draws shapes
}

//logic loop
var loop = function () {
  Draw();
  drawCircleArray();
  requestAnimationFrame(loop);      // request that the browser calls loop
};
requestAnimationFrame(loop);        // request that the browser calls loop

// draw bacteria
function drawCircleArray() {
  for (const [key1, circle1] of circleMap.entries()) {
    for (const [key2, circle2] of circleMap.entries()) {
      if (key1 === key2) continue;
      let deltaX = (circle1.x - circle2.x) * 1.1;
      let deltaY = (circle1.y - circle2.y) * 1.1;
      let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      var newRadius = Math.sqrt(
        Math.pow(circle1.radius, 2),
        Math.pow(circle2.radius, 2)
      );
    }
  }

  for (const [key, value] of circleMap.entries()) {
    value.radius = value.radius + gRate;
    newDrawCircle(value, ctx.TRIANGLE_FAN);
  }
}

// function to create new bacteria
function createBacteria() {
  let circle = createCircle();
  circleMap.set(circle[0], circle[1]);
}
