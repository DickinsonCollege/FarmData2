const { BCalendar } = require('bootstrap-vue')
let BCalendarDateSelection = {
    template: `
            <span>
                <slot></slot>
                <bcalendar data-cy='date-select'
                locale="en-US"></bcalendar>
            </span>`,
    props: {
        dateValue: {
            type: String,
            required: true,
        }
    },
    data(){
        return {
            selectedDate: this.dateValue,
        } 
    },
    component: {
        'bcalendar': BCalendar,
    },  
}

try {
    module.exports = {
        BCalendarDateSelection
    }
}
catch {}

// import Vue from 'vue';
// import { BCalendar } from 'bootstrap-vue';
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap-vue/dist/bootstrap-vue.css';

// const CalendarComponent = Vue.component('calendar-component', {
//     components: {
//         BCalendar,
//     },
//     data() {
//         return {
//             selectedDate: null,
//             locale: 'en', // set the locale to English
//         };
//     },
//     template: `
//     <div>
//         <h2>Select a date:</h2>
//         <b-calendar v-model="selectedDate" :locale="locale"></b-calendar>
//         <p>You selected: {{ selectedDate }}</p>
//     </div>
//     `,
//     });
// try {
//     module.exports = {
//         CalendarComponent
//     }
// }
// catch {}
