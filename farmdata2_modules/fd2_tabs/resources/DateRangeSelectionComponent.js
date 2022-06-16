try {
    FarmData2
}
catch(err) {
    var DateComps = require("./DateSelectionComponent.js")
    DateSelectionComponent = DateComps.DateSelectionComponent
}

/**
 * A Vue component for selecting a range of dated (i.e. start and end dates).  The component ensures that the user cannot choose a start date after the end date and vice versa.
 * 
 * <p><b>data-cy attributes</b></p>
 * <table>
 * <thead><tr><th>Value</th>        <th>Descripion</th></tr></thead>
 * <tbody>
 * <tr><td>start-date-select</td>   <td>The date input element for the start date.</td></tr>
 * <tr><td>end-date-select</td>   <td>The date input element for the end date.</td></tr>
 * </tbody>
 * </table>
 * 
 * @vue-prop {String} defaultStartDate - the initial start date to be displayed (YYYY-MM-DD).
 * @vue-prop {String} defaultEndDate - the initial end date to be displayed (YYYY-MM-DD).
 * 
 * @vue-event click - Emits an event with no payload when when one of the date selection elements is clicked.  This event does not necessarily indicate a change in date.
 * @vue-event {String} start-date-changed - Emits the selected date (YYYY-MM-DD) when a start date is entered or chosen and the start date selection element loses focus.
 * @vue-event {String} end-date-changed - Emits the selected date (YYYY-MM-DD) when an end date is entered or chosen and the end date selection element loses focus.
 */
let DateRangeSelectionComponent = {
    template: `<div>
                <date-selection data-cy="start-date-select" :setDate="defaultStartDate" :latestDate="latestStartDate" @date-changed="startDateChange" 
                @click="click">
                    Start Date:
                </date-selection>
                <br>
                <date-selection data-cy="end-date-select" :setDate="defaultEndDate" :earliestDate="earliestEndDate" @date-changed="endDateChange"
                @click="click">
                    End Date:
                </date-selection>
            </div>
            `,
    props: { 
        defaultStartDate:{
            type: String,
            required: true
        },
        defaultEndDate:{
            type: String,
            required: true
        }
    },
    components: {
        'date-selection': DateSelectionComponent,
    },
    data(){
        return{
            earliestEndDate: this.defaultStartDate,
            latestStartDate: this.defaultEndDate,
        }
    },
    methods: {
        click(){
            this.$emit('click')
        },
        startDateChange(selectedDate){
            this.earliestEndDate = selectedDate
            this.$emit('start-date-changed', selectedDate)
        },
        endDateChange(selectedDate){
            this.latestStartDate=selectedDate
            this.$emit('end-date-changed', selectedDate)
        },
    },
}

try {
    module.exports = {
        DateRangeSelectionComponent: DateRangeSelectionComponent
    }
}
catch {}