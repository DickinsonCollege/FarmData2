let DatePicker = {
    template: `<div>
            <slot></slot>
            <input date-cy="date-select" type="date" v-bind:min="earliestDate" v-bind:max="latestDate" id="date" v-model="selectedDate" @change="dateChanged">
            </div>`,
    props: {
        defaultDate: {
            type: String,
            default: dayjs().format('YYYY-MM-DD').toString(),
        },
        earliestDate: {
            type: String,
        },
        latestDate: {
            type: String,
        },
    },
    data(){
        return {
            selectedDate: this.defaultDate,
        }
    },
    methods: {
        dateChanged() {
            this.$emit('dateChanged', this.selectedDate)
        },
    },
}

let DateRangePicker = {
    template: `<div>
                <date-picker :defaultDate="defaultStartDate" :latestDate="latestStartDate" @dateChanged="startDateChange">
                Start Date:
                </date-picker>
                <date-picker :earliestDate="earliestEndDate" @dateChanged="endDateChange">
                End Date:
                </date-picker>
                </div>
                `,
    components: {
        'date-picker': DatePicker,
    },
    data(){
        return{
            earliestEndDate: dayjs().startOf  ('year').format('YYYY-MM-DD').toString(),
            latestStartDate: dayjs().format('YYYY-MM-DD').toString(),
            currentYear: dayjs().year(),
            defaultStartDate: dayjs().startOf('year').format('YYYY-MM-DD').toString(),
        }
    },
    methods: {
        startDateChange(selectedDate){
            this.earliestEndDate=selectedDate
        },
        endDateChange(selectedDate){
            this.latestStartDate=selectedDate
        },
    },
}

new Vue({
    el: '#app',
    components:{
        'date-picker': DatePicker,
        'date-range-picker': DateRangePicker,
    },
})

try{
    module.export = DatePicker
}
catch(err) {}