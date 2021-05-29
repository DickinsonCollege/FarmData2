/**
 * Vue.js component that defines the fields dropdown.
 */
let fieldsDropdownComponent = {
    template: `
        <div id='fieldsDropDown'>
            <label for='fieldSelect'>Field: </label>
            <select id='fieldSelect' @change='fieldChanged' v-model='selectedField'>
                <option v-for='field in fieldsList'>{{field}}</option>
            </select>
        </div>`,
    props: {
        fieldsList: {
            required: true,
            default: [ 'None' ],
        },
    },
    data() {
        return {
            selectedField: null,
        }
    },
    methods: {
        fieldChanged: function() {
            this.$emit('field-changed', this.selectedField)
        },
    },
}