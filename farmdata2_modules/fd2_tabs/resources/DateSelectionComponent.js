/**
 * A Vue component for selecting a date.
 *
 * <p><b>data-cy attributes</b></p>
 * <table>
 * <thead><tr><th>Value</th>        <th>Descripion</th></tr></thead>
 * <tbody>
 * <tr><td>date-select</td>  <td>The date input element.</td></tr>
 * </tbody>
 * </table>
 * 
 * @vue-prop {String} setDate - the date to be displayed in the component (YYYY-MM-DD).
 * @vue-prop {String} [earliestDate] - the earliest date will be able to be chosen (YYYY-MM-DD).  If not specified, there will be no limit on the earliest date that can be chosen.
 * @vue-prop {String} [latestDate] - the latest date that will be able to be chosen (YYYY-MM-DD). If not specfied, there will be no limit (including future dates) that can be chosen.
 * @vue-prop {Boolean} [disabled=false] - true to disable the date selection element, false otherwise.
 *
 * @vue-event click - Emits an event with no payload when when the date input element is clicked.  This event does not necessarily indicate a change in date.
 * @vue-event {String} date-changed - Emits the selected date (YYYY-MM-DD) when a date is entered, chosen, setDate in prop is changed by the parent, the component is mounted, and the date input element loses focus.
 */ 
let DateSelectionComponent = {
    template: `<span>
            <slot></slot>
            <input data-cy="date-select" type="date" :min="earliestDate" :max="latestDate" id="date" v-model="selectedDate" @click="click" @focusout="checkBounds" :disabled="isDisabled">
            </span>`,
    props: {
        setDate: {
            type: String,
            required: true,
        },
        earliestDate: {
            type: String,
        },
        latestDate: {
            type: String, 
        },
        disabled: {
            type: Boolean,
            default: false,
        }
    },
    data(){
        return {
            selectedDate: this.setDate,
            isDisabled: this.disabled
        } 
    },
    mounted() {
        this.checkBounds()
    },
    methods: {
        click(){
            this.$emit('click')
        },
        checkBounds() {
            if (this.selectedDate > this.latestDate) {
                this.selectedDate = this.latestDate;
            }
            else if (this.selectedDate < this.earliestDate) {
                this.selectedDate = this.earliestDate;
            }
            this.$emit('date-changed', this.selectedDate)
        },
    },
    watch: {
        setDate(newDate) {
            this.selectedDate = newDate;
            this.checkBounds();
        },
        disabled(newBool) {
            this.isDisabled = newBool;
        }
    }
    
}

try {
    module.exports = {
        DateSelectionComponent: DateSelectionComponent
    }
}
catch {}