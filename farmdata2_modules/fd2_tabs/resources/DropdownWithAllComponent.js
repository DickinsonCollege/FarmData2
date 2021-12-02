/**
 * Vue.js component that defines the dropdown menu.
 */ 
let DropdownWithAllComponent = {
    template: `<div data-cy="dropdown-component">
            <label for="dropdownOptions"><slot> </slot></label>
            <select id="dropdownOptions" v-model="defaultInput" data-cy="dropdown-input" @change="selectionChanged">
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
    mounted() {
            this.selectionChanged();
    },
    methods: {
        selectionChanged: function() {
            this.$emit('selection-changed', this.defaultInput)
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
 * Export the DropdownWithAllComponent object as a CommonJS component
 * so that it can be required bythe component test.
 */
try {
    module.exports = {
        DropdownWithAllComponent: DropdownWithAllComponent
    }
}
catch {}