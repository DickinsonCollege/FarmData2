/**
 * Vue.js component that defines the fields dropdown.
 */
let fieldsDropdownComponent = {
    template: `
        <div id='fieldsDropDown'>
            <label for='field-select'>Field: </label>
            <select data-cy="field-select" id='field-select' @change='fieldChanged' v-model='selectedField'>
                <option v-for='field in fieldsList'>{{field}}</option>
            </select>
        </div>`,
    props: {
        fieldsList: {
            required: false,
            default() {
                return [ 'None' ]
            },
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

/*
 * Export the fieldsDropdownComponent object as a CommonJS component
 * so that it can be imported into the component test.  This is 
 * wrapped in the try/catch to suppress the error that is generated
 * in the browser when it is added to the Drupal page as a normal
 * JavaScript file through a <script> tag inserted in the module's
 * .info file.
 */
try {
    module.exports = fieldsDropdownComponent
}
catch(err) {}