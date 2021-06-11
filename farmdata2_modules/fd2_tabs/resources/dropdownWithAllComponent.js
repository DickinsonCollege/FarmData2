/**
 * Vue.js component that defines the dropdown menu.
 */ 
let DropdownWithAllComponent = {
    template: `<div data-cy="dropdown-component">
            <label for="dropdownOptions"><slot>Select: </slot></label>
            <input list="dropdownOptions" v-model="selectedOption" data-cy="dropdown-input" @focusout="checkInput" @focusout="selectionChanged">
                <datalist id="dropdownOptions" data-cy="dropdownOptions">
                   <option v-for="singleOption in fullDropdown" data-cy="singleOption">{{ singleOption }}</option>
                </datalist>
        </div>`, 
    props: {
        dropdownList: {
            type: Array,
            required: true
        },
        includesAll: {
            type: Boolean,
        },
        defaultInput: {
            type: String
        } 
    }, 
    data() {
        return {
            selectedOption: this.defaultInput,
        }
    },
    methods: {
        selectionChanged: function() {
            this.$emit('selection-changed', this.selectedOption)
        },
        checkInput: function() {
            if (!this.fullDropdown.includes(this.selectedOption)) {
                this.selectedOption = null;
            }
        }
    },
    computed: {
        fullDropdown: function() {
            let newList = this.dropdownList;
            if (this.includesAll == true) {
                newList.splice(0,0,"All");
                //newList.push("All");
            }
            return newList;
        }
    }
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
    module.exports = {
        DropdownWithAllComponent: DropdownWithAllComponent
    }

}
catch(err) {}