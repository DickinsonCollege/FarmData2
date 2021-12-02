let DateSelectionComponent = {
    template: `<div>
            <slot></slot>
            <input data-cy="date-select" type="date" :min="earliestDate" :max="latestDate" id="date" v-model="defaultDate" @click="click" @focusout="checkBounds">
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
            this.$emit('date-changed', this.defaultDate)
        }
    },
}

try {
    module.exports = {
        DateSelectionComponent: DateSelectionComponent
    }
}
catch {}