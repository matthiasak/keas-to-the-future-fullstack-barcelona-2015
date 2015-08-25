// 3

const particle = (
    position=[random(), random()],
    velocity=[0,0],
    accel=[0,0]
) => {
    return {accel, velocity, position}
}

const logEm = (a) =>
    a.map( ({position}) => {
          log(`x: ${position[0]}`)
          log(`y: ${position[1]}`)
          log(`-----------`)
    })

const random = (min=0, max=400) =>
    Math.random()*(max-min)+min

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

const requestAnimationFrame = (cb) => {
    setTimeout(() => cb(new Date), 16)
}

// not a "functional" function :P
const paint = (t) => {
    // reset()
    // requestAnimationFrame(paint)
    particles = particles.map(p => update(p, .95))
    logEm(particles)
    log(t)
}

paint()

const scale = ([x,y],n) => [n * x, n * y] // scale the vector with multiplication
const add = (...vx) => vx.reduce((a, v) => [a[0] + v[0], a[1] + v[1]], [0,0]) // add vectors

const applyForce = (v, m, a) => {
    let {accel} = v
    accel = scale(add(accel,a), m)
    return { ...v, accel }
}

// setInterval(() => {
//     particles = particles.map(p =>
//         applyForce(
//             p,
//             1,
//             [random(-50,50),random(-50,50)]
//         ))
// }, 2500)
