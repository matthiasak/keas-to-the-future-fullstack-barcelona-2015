// 2

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

const random = (min=0, max=400) => Math.random()*(max-min)+min

let particles = Array(1).fill(true).map(_ => particle())

// ------------ new stuff

const update = (p) => {
    let [[px,py], [vx,vy]] = [p.position, p.velocity],
        position = [px + vx, py + vy]

    return { ...p, position }
}

const requestAnimationFrame = (cb) => {
    setTimeout(() => cb(new Date), 16)
}

const paint = (t) => {
    // reset()
    //requestAnimationFrame(paint)
    particles = particles.map(p => update(p))
    logEm(particles)
    // log(t)
}

//paint()
