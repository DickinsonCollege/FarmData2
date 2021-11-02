var Vue = require("./vue.js")
//possibly using an import or a reqire to get Vue defined as it is not in the event bus file
let EventBus = new Vue();
try {
    module.exports = {
        EventBus: EventBus
    }
}catch {}