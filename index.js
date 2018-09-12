/*global Vertex*/
/*global Edge*/
/*global Face*/
/*global Polyhedron*/
function Ship(x, y, z, size) {
    //Vertices
    const vnose = new Vertex(x, y, z + size / 2);
    const vbodyfl = new Vertex(x - size / 8, y, z);
    const vbodyfu = new Vertex(x, y - size / 8, z);
    const vbodyfr = new Vertex(x + size / 8, y, z);
    const vbodyfd = new Vertex(x, y + size / 8, z);
    const vbodybl = new Vertex(x - size / 8, y, z - size / 2);
    const vbodybu = new Vertex(x, y - size / 8, z - size / 2);
    const vbodybr = new Vertex(x + size / 8, y, z - size / 2);
    const vbodybd = new Vertex(x, y + size / 8, z - size / 2);
    const vlwingf = new Vertex(x - size / 2, y, z);
    const vlwingb = new Vertex(x - size / 4, y, z - size / 2);
    const vlwingr = new Vertex(x - size / 8, y, z - size / 4);
    const vrwingf = new Vertex(x + size / 2, y, z);
    const vrwingb = new Vertex(x + size / 4, y, z - size / 2);
    const vrwingl = new Vertex(x + size / 8, y, z - size / 4);
    //Edges
    const enosel = new Edge(vnose, vbodyfl, "#F00");
    const enoseu = new Edge(vnose, vbodyfu, "#F00");
    const enoser = new Edge(vnose, vbodyfr, "#F00");
    const enosed = new Edge(vnose, vbodyfd, "#F00");
    const ebodyflu = new Edge(vbodyfl, vbodyfu, "#0F0");
    const ebodyfur = new Edge(vbodyfu, vbodyfr, "#0F0");
    const ebodyfrd = new Edge(vbodyfr, vbodyfd, "#0F0");
    const ebodyfdl = new Edge(vbodyfd, vbodyfl, "#0F0");
    const ebodyl = new Edge(vbodyfl, vbodybl, "#0F0");
    const ebodyu = new Edge(vbodyfu, vbodybu, "#0F0");
    const ebodyr = new Edge(vbodyfr, vbodybr, "#0F0");
    const ebodyd = new Edge(vbodyfd, vbodybd, "#0F0");
    const ebodyblu = new Edge(vbodybl, vbodybu, "#0F0");
    const ebodybur = new Edge(vbodybu, vbodybr, "#0F0");
    const ebodybrd = new Edge(vbodybr, vbodybd, "#0F0");
    const ebodybdl = new Edge(vbodybd, vbodybl, "#0F0");
    const elwingl = new Edge(vlwingf, vlwingb, "#00F");
    const elwingf = new Edge(vlwingr, vlwingf, "#00F");
    const elwingr = new Edge(vbodybl, vlwingr, "#00F");
    const elwingb = new Edge(vlwingb, vbodybl, "#00F");
    const erwingl = new Edge(vrwingf, vrwingb, "#00F");
    const erwingf = new Edge(vrwingl, vrwingf, "#00F");
    const erwingr = new Edge(vbodybr, vrwingl, "#00F");
    const erwingb = new Edge(vrwingb, vbodybr, "#00F");
    //Model
    return new Polyhedron([
        //Nose
        new Face([enosel, ebodyflu, enoseu]),
        new Face([enoseu, ebodyfur, enoser]),
        new Face([enoser, ebodyfrd, enosed]),
        new Face([enosed, ebodyfdl, enosel]),
        //Body
        new Face([ebodyflu, ebodyu, ebodyblu, ebodyl]),
        new Face([ebodyfur, ebodyr, ebodybur, ebodyu]),
        new Face([ebodyfrd, ebodyd, ebodybrd, ebodyr]),
        new Face([ebodyfdl, ebodyl, ebodybdl, ebodyd]),
        new Face([ebodyblu, ebodybur, ebodybrd, ebodybdl]),
        //Wings
        new Face([elwingl, elwingf, elwingr, elwingb]),
        new Face([erwingl, erwingf, erwingr, erwingb])
    ]);
}



//Key tracker
let Keys = {};
window.onkeydown = function(event) { Keys[event.key] = true; };
window.onkeyup = function(event) { Keys[event.key] = false; };
//Constant
const keyBinds = {
    "q": "ty-",
    "w": "tz-",
    "e": "ty+",
    "a": "tx+",
    "s": "tz+",
    "d": "tx-",
    "u": "rz-",
    "i": "rx+",
    "o": "rz+",
    "j": "ry+",
    "k": "rx-",
    "l": "ry-",
    " ": "ty-",
    "Shift": "ty+"
};

//Create world object
let World = [Ship(0, 0, 0, 1)];

//Loop
function loop() {
    //Loop
    window.requestAnimationFrame(loop);

    //Move camera
    Object.getOwnPropertyNames(Keys).forEach(function(key) {
        if (Keys[key] && keyBinds.hasOwnProperty(key)) {
            //Data from key binding
            const val = keyBinds[key].split("");
            //Type of movement
            const transformation = (val[0] == "t") ? "translate" : "rotate";
            //Amount of movement
            const transformScalar = 1e-2 * (val[2] == "+" ? 1 : -1);
            const transformIndex = val[1].charCodeAt() - 120;
            let transformVector = [0, 0, 0];
            transformVector[Number(transformIndex)] = transformScalar;
            //Transform world
            World.forEach(function(item) {
                item[transformation](...transformVector);
            });
        }
    });

    //Clear screen
    let ctx = document.getElementById("canvas").getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(-window.innerWidth / 2, -window.innerHeight / 2, window.innerWidth, window.innerHeight);
    //Render
    ctx.strokeStyle =
        World.forEach(function(item) {
            item.draw();
        });
}
//Loop
loop();
