const time = document.getElementById("time")
const btn = document.getElementById("btn")

let state = "idle"
let startTime = null
let tick = null

function fmt(sec) {
    sec = Math.max(0, Math.floor(sec))
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${String(s).padStart(2, '0')}`
}

function render() {
    if (state === "idle") {
        time.textContent = "0:00"
        btn.textContent = "Focus"
    } else if (state === "focus")
        btn.textContent = "Break"
}

function start() {
    state = "focus"
    render()
    startTime = Date.now()
    tick = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000
        time.textContent = fmt(elapsed)
    }, 200)
}

function end() {
    state = "idle"
    render()
    clearInterval(tick)
    tick = null
}

btn.addEventListener("click", () => {
    if (state === "idle")
        start()
    else if (state === "focus")
        end()
})
