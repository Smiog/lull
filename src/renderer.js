const app = document.getElementById("app")

const MIN_FOCUS_MS = 25 * 60 * 1000
const MIN_BREAK_MS = 3 * 1000

let state = "idle" // idle | focus | warn | break
let startTime // focus start timestamp (ms)
let endTime // break end timestamp (ms)
let tick // interval handle

function getTime(mode) {
    if (mode === "elapsed")
        return Date.now() - startTime
    else if (mode === "remaining")
        return endTime - Date.now()
}

function fmt(sec, format) {
    sec = Math.max(0, Math.floor(sec))
    const m = Math.floor(sec / 60)
    const s = sec % 60
    if (format === "short")
        return `${m}:${String(s).padStart(2, '0')}`
    else if (format === "long")
        return m > 0 ? `${m}m ${s}s` : `${s}s`
}

function bind() {
    document.getElementById("start")?.addEventListener("click", startFocus)
    document.getElementById("stop")?.addEventListener("click", stopFocus)
    document.getElementById("continue")?.addEventListener("click", continueFocus)
    document.getElementById("force")?.addEventListener("click", forceBreak)
    document.getElementById("skip")?.addEventListener("click", skipBreak)
}

function setHTML(html) {
    app.innerHTML = html
    bind()
}

function render() {
    if (state === "idle")
        setHTML(`<div class="title">Lull</div><div class="sub">A silent pomodoro</div><button id="start" class="btn">Focus</button>`)
    else if (state === "focus")
        setHTML(`<div class="title">Focusing</div><div class="time">${fmt(getTime("elapsed") / 1000, "short")}</div><button id="stop" class="btn danger">Stop</button>`)
    else if (state === "warn")
        setHTML(`<div class="title">Only ${fmt(getTime("elapsed") / 1000, "long")} of focus</div><div class="sub">Less than 25m — keep going?</div><div class="row"><button id="continue" class="btn">Keep focusing</button><button id="force" class="btn ghost">Force break</button></div>`)
    else if (state === "break")
        setHTML(`<div class="title break">Break</div><div class="time" id="cd">${fmt(Math.max(0, Math.round(getTime("remaining") / 1000)), "short")}</div><button id="skip" class="btn ghost small">Skip break</button>`)
}

function focusTick() {
    clearInterval(tick)
    tick = setInterval(() => {
        if (state !== "focus")
            return
        const time = document.querySelector(".time")
        if (time)
            time.textContent = fmt(getTime("elapsed") / 1000, "short")
    }, 200)
}

function startBreak(elapsed) {
    endTime = Date.now() + Math.max(MIN_BREAK_MS, elapsed / 5)
    state = "break"
    render()
    clearInterval(tick)
    tick = setInterval(() => {
        if (state !== "break")
            return
        const cd = document.getElementById("cd")
        if (cd)
            cd.textContent = fmt(Math.max(0, Math.round(getTime("remaining") / 1000)), "short")
        if (getTime("remaining") <= 0) {
            clearInterval(tick)
            state = "idle"
            render()
        }
    }, 200)
}

function startFocus() {
    state = "focus"
    startTime = Date.now()
    render()
    focusTick()
}

function stopFocus() {
    if (state !== "focus")
        return
    clearInterval(tick)
    const elapsed = getTime("elapsed")
    if (elapsed < MIN_FOCUS_MS) {
        state = "warn"
        render()
    } else
        startBreak(elapsed)
}

function continueFocus() {
    if (state !== "warn")
        return
    state = "focus"
    render()
    focusTick()
}

function forceBreak() {
    if (state !== "warn")
        return
    startBreak(getTime("elapsed"))
}

function skipBreak() {
    clearInterval(tick)
    state = "idle"
    render()
}

render()
