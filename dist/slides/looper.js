const looper = fn => {
    let cb = (time) => {
        requestAnimationFrame(cb)
        let diff = ~~(time - (cb.time || 0)),
            seconds_passed = diff/1000
        fn(seconds_passed)
        cb.time = time
    }
    return cb
}

// looper(() => {
    // do something each "frame"
// })() <-- run


// --> update loops go from this:
// ------------------------
//
// const update_physics = () => {
//     requestAnimationFrame(update_physics)
//     particles = particles.map(p => update(p))
// }
// update_physics()

// setInterval(t => {
//     reset()
//     logEm(particles)
//     log(t)
// })
//
// to this:
// ------------------------

let d = new Date,
    _t = null

looper((t) => {
    d = new Date
    _t = t
})()

setInterval(t => {
    reset()
    // log(t)
    log(new Date)
})
