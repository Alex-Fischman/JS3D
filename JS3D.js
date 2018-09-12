//Center drawing context and make it available to primitive objects
const ctx = document.getElementById("canvas").getContext("2d");
ctx.translate(window.innerWidth / 2, window.innerHeight / 2);

//Primitive classes
class Vertex {
    constructor(x, y, z, color = "#000000") {
        this.pos = [x, y, z];
        this.color = color;
    }
    draw() {
        if (this.visible()) {
            ctx.strokeStyle = this.color;
            ctx.strokeRect(...this.get2D(), 1, 1);
        }
    }
    translate(x, y, z) {
        this.pos = [this.pos[0] + x, this.pos[1] + y, this.pos[2] + z];
    }
    rotate(x, y, z) {
        //Rotate around X axis
        this.pos = [
            this.pos[0],
            (this.pos[1] * Math.cos(x)) + (this.pos[2] * -Math.sin(x)),
            (this.pos[1] * Math.sin(x)) + (this.pos[2] * Math.cos(x))
        ];
        //Rotate around Y axis
        this.pos = [
            (this.pos[0] * Math.cos(y)) + (this.pos[2] * Math.sin(y)),
            this.pos[1],
            (this.pos[0] * -Math.sin(y)) + (this.pos[2] * Math.cos(y))
        ];
        //Rotate around Z axis
        this.pos = [
            (this.pos[0] * Math.cos(z)) + (this.pos[1] * -Math.sin(z)),
            (this.pos[0] * Math.sin(z)) + (this.pos[1] * Math.cos(z)),
            this.pos[2]
        ];
    }
    dist(vertex) {
        return Math.sqrt(
            Math.pow(this.pos[0] - vertex.pos[0], 2) +
            Math.pow(this.pos[1] - vertex.pos[1], 2) +
            Math.pow(this.pos[2] - vertex.pos[2], 2)
        );
    }
    get2D() {
        const minDim = Math.min(window.innerWidth, window.innerHeight);
        const maxDim = Math.max(window.innerWidth, window.innerHeight);
        const newZ = this.pos[2] > 0 ? (1 / this.pos[2]) : maxDim;
        return [(this.pos[0] * newZ) * minDim, (this.pos[1] * newZ) * minDim * -1];
    }
    visible() {
        return this.pos[2] > 0;
    }
}

class Edge {
    constructor(vertex1, vertex2, color = "#000000") {
        this.start = new Vertex(...vertex1.pos, vertex1.color);
        this.end = new Vertex(...vertex2.pos, vertex2.color);
        this.color = color;
    }
    draw() {
        if (this.start.visible() || this.end.visible()) {
            ctx.beginPath();
            ctx.moveTo(...this.start.get2D());
            ctx.lineTo(...this.end.get2D());
            ctx.closePath();
            ctx.strokeStyle = this.color;
            ctx.stroke();
        }
    }
    translate(x, y, z) {
        Iterate([this.start, this.end], "translate", [x, y, z]);
    }
    rotate(x, y, z) {
        Iterate([this.start, this.end], "rotate", [x, y, z]);
    }
}

class Face {
    constructor(edges, color = "#000000") {
        this.edges = edges.map(function(edge) {
            return new Edge(edge.start, edge.end, edge.color);
        });
        this.color = color;
    }
    draw() {
        Iterate(this.edges, "draw");
    }
    translate(x, y, z) {
        Iterate(this.edges, "translate", [x, y, z]);
    }
    rotate(x, y, z) {
        Iterate(this.edges, "rotate", [x, y, z]);
    }
}

class Polyhedron {
    constructor(faces) {
        this.faces = faces.map(function(face) {
            return new Face(face.edges, face.color);
        });
    }
    draw() {
        Iterate(this.faces, "draw");
    }
    translate(x, y, z) {
        Iterate(this.faces, "translate", [x, y, z]);
    }
    rotate(x, y, z) {
        Iterate(this.faces, "rotate", [x, y, z]);
    }
}

//Helper function
//Iterate over all items in an array by calling one of their methods
function Iterate(arr, op, args = []) {
    arr.forEach(function(a) { a[op](...args); });
}
