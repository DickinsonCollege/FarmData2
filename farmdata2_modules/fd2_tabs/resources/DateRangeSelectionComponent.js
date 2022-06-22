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
 * @vue-prop {String} setStartDate - the start date to be displayed (YYYY-MM-DD).
 * @vue-prop {String} setEndDate - the end date to be displayed (YYYY-MM-DD).
 * @vue-prop {Boolean} [disabled=false] - true to disable both start and end date selection elements, false otherwise.
 *
 * @vue-event click - Emits an event with no payload when when one of the date selection elements is clicked.  This event does not necessarily indicate a change in date.
 * @vue-event {String} start-date-changed - Emits the selected date (YYYY-MM-DD) when a start date is entered, chosen, component is mounted, prop is changed, and the start date selection element loses focus.
 * @vue-event {String} end-date-changed - Emits the selected date (YYYY-MM-DD) when an end date is entered, chosen, component is mounted, prop is changed, and the end date selection element loses focus.
 */
let DateRangeSelectionComponent = {
    template: `<div>
                <date-selection data-cy="start-date-select" :setDate="setStartDate" :latestDate="latestStartDate" @date-changed="startDateChange" 
                @click="click" :disabled="isDisabled">>
                    Start Date:
                </date-selection>
                <br>
                <date-selection data-cy="end-date-select" :setDate="setEndDate" :earliestDate="earliestEndDate" @date-changed="endDateChange"
                @click="click" :disabled="isDisabled">
                    End Date:
                </date-selection>
            </div>
            `,
    props: { 
        setStartDate:{
            type: String,
            required: true
        },
        setEndDate:{
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        } 
    },
    components: {
        'date-selection': DateSelectionComponent,
    },
    data() {
        return{
            earliestEndDate: this.setStartDate,
            latestStartDate: this.setEndDate,
            isDisabled: this.disabled
        }
    },
    methods: {
        click(){
            this.$emit('click')
        },
        startDateChange(selectedDate) {
            this.earliestEndDate = selectedDate
            this.$emit('start-date-changed', selectedDate)
        },
        endDateChange(selectedDate) {
            this.latestStartDate = selectedDate
            this.$emit('end-date-changed', selectedDate)
        },
    },
    mounted() {
        this.startDateChange(this.earliestEndDate)
        this.endDateChange(this.latestStartDate)
    },
    watch: {
        setStartDate(newStartDate) {
            this.startDateChange(newStartDate);
        },
        setEndDate(newEndDate) {
            this.endDateChange(newEndDate);
        },
        disabled(newBool) {
            this.isDisabled = newBool;
        }
    }
}

try {
    module.exports = {
        DateRangeSelectionComponent: DateRangeSelectionComponent
    }
}
catch {}