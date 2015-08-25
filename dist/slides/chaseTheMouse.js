// 5
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
    return {accel, velocity, position, mass:random(1,50)} // <-- add a random mass
}

const logEm = (a) =>
    a.map( p => {
          log(`x: ${p.position[0]}`)
          log(`y: ${p.position[1]}`)
          log(`mass: ${p.mass}`) // <-- report the mass
          log(`velocity: ${mag(p.velocity).toFixed(2)}`) // <-- ... and velocity
          log(`heading: ${heading(p.velocity)}`)
          log(`-----------`)
    })

let particles = Array(1)
    .fill(true)
    .map(_ => particle())

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

// f(vector, number, vector) -> vector
const applyForce = (v, m, a) => {
    let {accel} = v
    accel = add(accel, scale(a,m))
    return { ...v, accel }
}

const requestAnimationFrame = (cb) => {
    setTimeout(() => cb(new Date), 16)
}

/**
 * PHYSICS UPDATES
 */

// the regular loop
const WORLD_FRICTION = .95
const loop = () => {
    requestAnimationFrame(loop)
    particles = particles.map(p => update(p, WORLD_FRICTION))
}
loop()

// the mouse

let mouse = [0,0],
    mouse_step = 0,
    corners = [[0,0], [400,0], [400,400], [0,400]]

// every 5 seconds, the mouse goes to a new corner
setInterval(() => {
    mouse_step = mouse_step === corners.length-1 ? 0 : mouse_step+1
    mouse = corners[mouse_step]
}, 5000)

// chase the mouse by continually applying/adjusting force to each particle
const chaseTheMouse = () => {
    requestAnimationFrame(chaseTheMouse)
    particles = particles.map(p => {
        // find directional difference b/w mouse and this particle
        let dir = sub(mouse, p.position)
        // normalize it (make the unit length 1)
        dir = normalize(dir)
        // apply movement to the particle in the direction of the mouse
        return applyForce(p, p.mass, dir) //<-- use the mass
    })
}
chaseTheMouse()

/**
 * DRAW UPDATES
 */

// not a "functional" function :P
const paint = (t) => {
    reset()
    requestAnimationFrame(paint)
    logEm(particles)
    log({mouse})
    log('-----------')
    log(t)
}
paint()