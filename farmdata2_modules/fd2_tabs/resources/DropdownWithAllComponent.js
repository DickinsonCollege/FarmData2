/**
 * Vue.js component that defines the dropdown menu.
 */ 
let DropdownWithAllComponent = {
    template: `<div data-cy="dropdown-component">
            <label for="dropdownOptions"><slot>Select: </slot></label>
            <select id="dropdownOptions" v-model="selectedOption" data-cy="dropdown-input" @focusout="selectionChanged">
                <option v-for="singleOption in fullDropdown" data-cy="single-option">{{ singleOption }}</option>
            </select>
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
    mounted() {
        console.log("Just mounted")
            this.selectionChanged();
            console.log("Just passed selectionChanged after mount")
    },
    methods: {
        selectionChanged: function() {
            this.$emit('selection-changed', this.selectedOption)
            console.log("Just emitted selectionChanged")
        },
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