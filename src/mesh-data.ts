var cubeVertices: number[] = [
    -1.0, -1.0,  1.0,
    1.0, -1.0,  1.0,
    1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0, -1.0, -1.0,

    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
    1.0,  1.0,  1.0,
    1.0,  1.0, -1.0,

    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    1.0, -1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0,  1.0,  1.0,
    1.0, -1.0,  1.0,

    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0
];


var indices: number[] = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23    // left
];

var uvMap: number[] = [
    // Front
    0.0,  0.0, 0, 0,
    1.0,  0.0, 0, 0,
    1.0,  1.0, 0, 0,
    0.0,  1.0, 0, 0,
    // Back
    0.0,  0.0, 0, 0,
    1.0,  0.0, 0, 0,
    1.0,  1.0, 0, 0,
    0.0,  1.0, 0, 0,
    // Top
    0.0,  0.0, 0, 0,
    1.0,  0.0, 0, 0,
    1.0,  1.0, 0, 0,
    0.0,  1.0, 0, 0,
    // Bottom
    0.0,  0.0, 0, 0,
    1.0,  0.0, 0, 0,
    1.0,  1.0, 0, 0,
    0.0,  1.0, 0, 0,
    // Right
    0.0,  0.0, 0, 0,
    1.0,  0.0, 0, 0,
    1.0,  1.0, 0, 0,
    0.0,  1.0, 0, 0,
    // Left
    0.0,  0.0, 0, 0,
    1.0,  0.0, 0, 0,
    1.0,  1.0, 0, 0,
    0.0,  1.0, 0, 0
];

export class CubeBase {
    vertices: number[] = [].concat(cubeVertices);
    indices: number[] = [].concat(indices);
    uvMap: number[] = [].concat(uvMap);
    
    applyBounds(bounds: {widthX: number, widthY: number, ground: number, height: number, scale: number}): void {
        for(var i = 0; i < cubeVertices.length / 3; i++) {
            var xNumber = 0 + i * 3;
            var yNumber = 1 + i * 3;
            var zNumber = 2 + i * 3;
            
            this.vertices[xNumber] = bounds.scale * cubeVertices[xNumber] * bounds.widthX / 2;
            this.vertices[yNumber] = bounds.scale * cubeVertices[yNumber] * bounds.widthY / 2;
            this.vertices[zNumber] = bounds.scale * (bounds.ground + (cubeVertices[zNumber] + 1) * bounds.height / 2);
        }
    }
}