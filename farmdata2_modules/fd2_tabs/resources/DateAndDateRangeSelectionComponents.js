let DateSelectionComponent = {
    template: `<div>
            <slot></slot>
            <input data-cy="date-select" type="date" :min="earliestDate" :max="latestDate" id="date" v-model="selectedDate" @change="dateChanged" @focusout="checkBounds">
            </div>`,
    props: {
        defaultDate: {
            type: String,
            required: true,
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
        checkBounds() {
            if (this.selectedDate > this.latestDate) {
                this.selectedDate = this.latestDate;
            }
            else if (this.selectedDate < this.earliestDate) {
                this.selectedDate = this.earliestDate;
            }
        }
    },
}
 
let DateRangeSelectionComponent = {
    template: `<div>
                <date-selection data-cy="start-date-select" :defaultDate="defaultStartDate" :latestDate="latestStartDate" @dateChanged="startDateChange">
                    Start Date:
                </date-selection>
                <date-selection data-cy="end-date-select" :defaultDate="defaultEndDate" :earliestDate="earliestEndDate" @dateChanged="endDateChange">
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
        startDateChange(selectedDate){
            this.earliestEndDate=selectedDate
        },
        endDateChange(selectedDate){
            this.latestStartDate=selectedDate
        },
    },
}

try {
    module.exports = DateSelectionComponent
    module.exports = DateRangeSelectionComponent
}
catch(err) {}