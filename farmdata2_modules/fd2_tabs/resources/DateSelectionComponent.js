let DateSelectionComponent = {
    template: `<div>
            <slot></slot>
            <input data-cy="date-select" type="date" :min="earliestDate" :max="latestDate" id="date" v-model="selectedDate" @click="click" @focusout="checkBounds">
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
        }
    },
}

try {
    module.exports = {
        DateSelectionComponent: DateSelectionComponent
    }
}
catch {}