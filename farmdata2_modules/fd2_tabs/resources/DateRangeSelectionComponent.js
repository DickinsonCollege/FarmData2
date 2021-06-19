try {
    FarmData2
}
catch(err) {
    var DateComps = require("./DateSelectionComponent.js")
    DateSelectionComponent = DateComps.DateSelectionComponent
}

let DateRangeSelectionComponent = {
    template: `<div>
                <date-selection data-cy="start-date-select" :defaultDate="defaultStartDate" :latestDate="latestStartDate" @date-changed="startDateChange">
                    Start Date:
                </date-selection>
                <date-selection data-cy="end-date-select" :defaultDate="defaultEndDate" :earliestDate="earliestEndDate" @date-changed="endDateChange">
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