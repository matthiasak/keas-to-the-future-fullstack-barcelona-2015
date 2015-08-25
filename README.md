### Keas to the Future

> Natural Physics Simulations and Canvas Hackery

Talk given at Full Stack Fest in Barcelona, Sept 2015.

Slide engine built with Mithril.js; makes heavy use of [Arbiter](http://matthiasak.github.io/Arbiter/) and [Arbiter-frame](http://matthiasak.github.io/arbiter-frame/dist/), which run on React and Mithril.

---

Extra notes (to self):

```
const clone = (data) => typeof data === ‘undefined’ ? data : JSON.parse(JSON.stringify(data))
const concat = (arr, x) => arr.concat([x])
const compose = (f, g) => (x) => f(g(x))
const each = (c, cb) => c.forEach(cb)
const c = compose
const map = (c, transform) => c.map(transform)
const reduce = (c, reducer, initial) => c.reduce(reducer, initial)
const filter = (c, pred) => c.filter(pred)
const ident = (x) => x
const until = (c, pred, hasBeenReached = false) =>
    c.reduce((a, v) => {
        !hasBeenReached && !(hasBeenReached = pred(v)) && a.push(v)
        return a
    }, [])
const last = (c) => c[c.length > 1 ? c.length-1 : 0]
const head = (c) => c[0]
const rest = (c) => c.slice(1)
const find = (c, pred) => {
    for(var i = 0, len = c.length; i < len; i++) {
        let r = c[i]
        if(pred(r)) return r
    }
    return null
}
const concatAll = (cc) => [].concat(…cc)
const ignores = (c, ignore) => filter(c, (x) => ignore.indexOf(x) === -1)

const lerp = () => {} // linear interpolate to another vector


/**
 * Keas to the Future
 * > to the audio of https://soundcloud.com/bassnectar/bassnectar-mixtape-13?in=mattreb210/sets/groovin-at-work
 */

// Object Pools (recycling objects saves memory and gc time)
```