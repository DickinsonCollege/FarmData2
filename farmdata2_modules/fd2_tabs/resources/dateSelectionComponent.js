let DateSelectionComponent = {
    template: `<div>
            <slot></slot>
            <input data-cy="date-select" type="date" v-bind:min="earliestDate" v-bind:max="latestDate" id="date" v-model="selectedDate" @change="dateChanged">
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
    },
}

try{
    module.export = DateSelectionComponent
}
catch(err) {}