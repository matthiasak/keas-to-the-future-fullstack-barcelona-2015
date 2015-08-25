// es5 polyfills, powered by es5-shim
require("es5-shim")

// es6 polyfills, powered by babel
require("babel/polyfill")

let fetch = require('./fetcher')
import {resolver, container, m} from 'mithril-resolver'
import engine from './mithril-slide-engine'

window.addEventListener('load', app)

const arbiter = (_src) => {
    let src = m.prop('')

    if(_src.indexOf('.js') !== -1){
        m.startComputation()
        fetch(_src)
            .then(r => r.text())
            .then(scriptText =>
                src(`./Arbiter/#${escape(scriptText)}`))
            .then(_ => m.endComputation())
            .catch(e => console.log(e))
    }

    return {
        controller: () => {},
        view: () => m('iframe', {src: src()})
    }
}

const frame = (_src) => {
    let src = m.prop('')

    if(_src.indexOf('.js') !== -1){
        m.startComputation()
        fetch(_src)
            .then(r => r.text())
            .then(scriptText =>
                src(`./Arbiter-frame/#${escape(scriptText)}`))
            .then(_ => m.endComputation())
            .catch(e => console.log(e))
    }

    return {
        controller: () => {},
        view: () => m('iframe', {src: src()})
    }
}

let home = {
    controller: () => {

    },
    view: () => {
        return m('.home', [
            m('.hr', 'This talk is called'),
            m('h1', 'Natural Physics Simulations', m('br'), 'and Canvas Hackery'),
            m('.hr', 'With this guy'),
            m('img', {src: './images/me.gif'}),
            m('.hr', [
                m('a', {href:'mkeas.org'}, 'mkeas.org'),
                ' • ',
                m('a', {href:'twitter.com/matthiasak'}, '@matthiasak')
            ])
        ])
    }
}

let warning = () => m('.warning',
    m('h1.zap', {'data-text':'Warning'}, 'Warning'),
    m('hr'),
    m('h2.zap', {'data-text':'An old friend - math - approaches.'}, 'An old friend - math - approaches.')
)

let recap = (bullets) => m('div',
    m('.hr', 'Let\'s Recap'),
    m('ul', bullets.map(bullet => m('li', bullet)))
)

const links = [
    'http://piqnt.com/stage.js/',
    'http://piqnt.com/stage.js/example/game-aero/',
    'http://whitevinyldesign.com/',
    'http://snorpey.github.io/jpg-glitch/',
    'http://pablotheflamingo.com/',
    'http://bytheodore.com/work/simian-ui-montage/',
    'http://gregtatum.com/category/interactive/',
    'https://www.youtube.com/watch?v=n6FKT-KafRk',
    'http://lamberta.github.io/html5-animation/',
    'http://www.toptal.com/game/video-game-physics-part-i-an-introduction-to-rigid-body-dynamics',
    'http://www.toptal.com/game/video-game-physics-part-ii-collision-detection-for-solid-objects',
    'http://www.toptal.com/game/video-game-physics-part-iii-constrained-rigid-body-simulation',
    'http://particulatejs.org/docs/',
    'http://mathinsight.org/thread/vector_algebra#matrices',
    'http://codepen.io/rachsmith/pen/YXaryr',
    'http://natureofcode.com/book/chapter-1-vectors/',
    'http://natureofcode.com/book/chapter-2-forces/',
    'http://natureofcode.com/book/chapter-3-oscillation/',
    'http://ricostacruz.com/cheatsheets/canvas.html',
    'http://codepen.io/ge1doot/pen/wazbjv?editors=001',
    'http://codepen.io/rachsmith/blog/hack-physics-and-javascript-part-3-springs-and-some-other-things',
    'http://www.ichub.io/p/physics',
    'http://codepen.io/aquaism/pen/yyVpJX',
    'http://codepen.io/desandro/pen/yNqNyq', // <-- running person
    'http://codepen.io/desandro/pen/MwPJaL?editors=001', // <-- running with keyboard entry
    'http://codepen.io/FlyC/pen/rVZZzw', // <-- glittery fireworks effect
    'http://codepen.io/zadvorsky/pen/VLGWdr', // <-- beautiful calming waves / rocks
    'http://codepen.io/ge1doot/pen/WvwvOj?editors=001', // <-- canvas and webgl postprocessing
    'https://remysharp.com/2015/07/13/optimising-a-canvas-animation',
    'http://codepen.io/16octets/pen/gpZvqb', //<-- eyeball thingy

    'http://davidscottlyons.com/threejs/presentations/frontporch14/#slide-120', // <-- webgl intro code (general geometries, mesh materials, textures/bitmaps, animation, camera/fov/culling, raycast / mouse interaction)
    'https://github.com/Jam3/math-as-code/blob/master/README.md',
    'http://haxiomic.github.io/GPU-Fluid-Experiments/html5/?q=Medium',
    'http://patriciogonzalezvivo.com/2015/thebookofshaders/07/',
    'https://github.com/stackgl/glsl-lighting-walkthrough',
    'http://ruh.li/CameraViewProjection.html',
    'http://www.codinglabs.net/article_world_view_projection_matrix.aspx',
    'https://www.youtube.com/watch?v=H4c8t6myAWU',
    'http://stack.gl/#learning',
    'http://webglfundamentals.org/'
]

let refs = () => {
    return m('.home',
        m('h2', 'References & Resources'),
        m('hr'),
        m('ul',
            links.map(href => m('li', m('a', {href}, href)))
        )
    )
}

let pause1 = [
    [m('code', 'particle()'), ' -> Just a function that returns an object'],
    [m('code', 'particle()'), ' --> Simple data: ',m('code', '{accel, velocity, position}')],
    [m('code', 'particle()'), ' ---> Could easily hold other data (color?, weight?)'],
    [m('code', 'update()'), ' -> Without accel, it\'s just changing position based on velocity (we have to code the change in velocity, too)'],
    [m('code', 'update()'), ' --> With accel affecting velocity, and "friction" involved, we can have more realistic physics; each particle carries its own data that the engine continues to blindly ', m('code', 'update()'),'.'],
    [m('code', 'update()'), ' ---> This particular mode of updating particles and their positions is approaching a paradigm called Verlet engines. Rename ', m('code', 'update()'), ' to ', m('code','integrate()'), ' and it will make more sense when you consult Wikipedia after this talk. :-)']
]

let orderOfOps = [
    'force',
    'accel & friction',
    'velocity',
    'position'
]

let movement = () => m('div',
    m('.hr', 'Need to move things?'),
    m('pre', `const applyForce = (mass,accel) => accel += mass*mag(accel)`))

function app() {
    let e = engine()
    e.insert(home)
    e.insert(arbiter('./slides/particle.js'))
    e.insert(arbiter('./slides/particleLoop.js'))
    e.insert(arbiter('./slides/particleLoopAccel.js'))
    e.insert(recap(pause1))
    e.insert(recap(orderOfOps))
    e.insert(movement())
    e.insert(warning())
    e.insert(arbiter('./slides/vectors.js'))
    e.insert(arbiter('./slides/chaseTheMouse.js'))
    e.insert(frame('./slides/canvas1.js'))
    e.insert(frame('./slides/canvas-mouse.js'))
    e.insert(frame('./slides/canvas-pointers.js'))
    e.insert(frame('./slides/canvas-gravity.js'))
    e.insert(frame('./slides/relate-to-time.js'))
    e.insert(frame('./slides/planes.js'))
    e.insert(frame('./slides/chain.js'))
    e.insert(refs())

    e.render('html')
}

