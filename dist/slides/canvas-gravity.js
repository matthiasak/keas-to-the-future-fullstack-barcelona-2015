// 8
const random = (min=0, max=400) =>
    Math.random()*(max-min)+min

const vector = (x=random(),y=random()) => [x,y]

const degToRad = deg => deg * Math.PI / 180
const radToDeg = rad => rad*180 / Math.PI
const add = (...vx) => vx.reduce((a, v) => [a[0] + v[0], a[1] + v[1]], [0,0]) // add vectors
const sub = (...vx) => vx.reduce((a, v) => [a[0] - v[0], a[1] - v[1]]) // subtract vectors
const scale = ([x,y],n) => [n * x, n * y] // scale the vector with multiplication
const dot = ([x1,y1],[x2,y2]) => x1*x2 + y1*y2 // The "projection of a onto b" -> dot product of 2 vectors (0 means perpendicular)
// Cross product not needed here; creates a vector in the 3d space perpendicular to two input vectors. Since it is a 3d vector, we're going to ignore it.
const rotate = ([x,y],deg) => { // rotate a 2D vector by an angle
    let r = degToRad(deg),
        [cos, sin] = [Math.cos(r), Math.sin(r)]
    return [cos*x - sin*y, sin*x + cos*y]
}
const normalize = v => scale(v,1/mag(v)) // transform into a unit vector of mag 1
const mag = ([x,y]) => Math.sqrt(x*x + y*y) // calculate magnitude of a vector
const dist = ([x1,y1], [x2,y2]) => Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2)) // calculate Euclidean distance between two vectors (as points)
const heading = (v, angle=angleBetween(v,[0,-1*mag(v)]) ) => v[0] < 0 ? 360-angle : angle // the 2d heading of a vector, represented as an angle in degrees from "North heading"
const angleBetween = (v1,v2) => radToDeg(Math.acos( dot(v1,v2) / (mag(v1)*mag(v2)) ))// find angle between two intersecting vectors

const particle = (
    position=vector(),
    velocity=vector(),
    accel=vector()
) => {
    return {accel, velocity, position} // <-- add a random mass
}

// GIVE ME THE JUICE!
//
// velocity += accel_______
// velocity *= 1-friction _|---> part a
// position += velocity--------> part b

const update = (p, friction) => {
    let [[px,py], [vx,vy], [ax,ay]] = [p.position, p.velocity, p.accel]
    vx = (vx+ax) * (1-friction) // part a (x component)
    vy = (vy+ay) * (1-friction) // part a (y component)
    let position = [px + vx, py + vy], // part b
        accel = [0,0],
        velocity = [vx,vy]
    return { ...p, position, accel, velocity }
}

// f(particle, number, vector) -> vector
const applyForce = (p, m, a) => {
    let {accel} = p
    accel = add(accel, scale(a,m))
    return { ...p, accel }
}

/**
 * LET THE REVOLUTION BEGIN
 *
 * GIMME THE JUITH!
 */

let canvas = document.createElement('canvas'),
    {body} = document,
    c = canvas.getContext('2d')

body.appendChild(canvas)
const setSize = () => {
    canvas.width = body.offsetWidth
    canvas.height = body.offsetHeight
}
setSize()
window.onresize = setSize

// define particles

const orb = (mass, [px,py]) => {
    return {...particle([px,py], [0,0], [0,0]), mass}
}

let orbs = []

// the mouse
let mouse = [0,0]
window.addEventListener('mousemove', ({clientX, clientY}) => mouse = [clientX, clientY])
window.addEventListener('mousedown', ({clientX, clientY}) => {
    orbs.push(orb(random(10,40), [clientX,clientY]))
})

/**
 * PHYSICS UPDATES
 */

const WORLD_FRICTION = .1
const loop = () => {
    requestAnimationFrame(loop)
    orbs = orbs.map(p => update(p, WORLD_FRICTION))
}
loop()

const gravity = () => {
    requestAnimationFrame(gravity)
    orbs = orbs.map(p => applyForce(p, 1, [0,3.2]))
}
gravity()

const checkCollision = () => {
    requestAnimationFrame(checkCollision)
    orbs = orbs.map(p => {
        return (p.position[1] + .5*p.mass) >= canvas.height ?
            { ...p, accel:[0,0], velocity: [p.velocity[0], p.velocity[1]*-1] } :
            p
    })
}
checkCollision()

/**
 * DRAW UPDATES
 */

// draw every 16ms
const paint = (t) => {
    requestAnimationFrame(paint)

    // draw black box
    c.fillStyle = '#000'
    c.fillRect(0,0,canvas.width,canvas.height)

    // draw orbs
    c.fillStyle = 'red'
    orbs.forEach(({position, mass}) => {
        let [x,y] = position
        c.beginPath()
        c.arc(x, y, mass/2, 0, 2*Math.PI)
        c.fill()
    })

    // draw mouse
    c.fillStyle = '#fff'
    let mouse_size = 10,
        half = mouse_size/2,
        [x,y] = mouse
    c.fillRect(x-half,y-half,mouse_size,mouse_size)
}

paint()