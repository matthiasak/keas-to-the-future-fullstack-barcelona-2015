// pseudo-persistent data structure
//
// ------------
//

const last = (arr) => arr[arr.length-1]
const push = (arr, val) => arr.push(val)

export default (initialValue) => {
    let states = [initialValue]
    const result = function(value) {
        arguments.length && push(states, value)
        return last(states)
    }
    result.states = () => states
    result.prev = () => states[states.length-2]
    return result
}