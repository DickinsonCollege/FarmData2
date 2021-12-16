/**
 * Vue.js component that defines the dropdown menu.
 */ 
let DropdownWithAllComponent = {
    template: `<div data-cy="dropdown-component">
            <label for="dropdownOptions"><slot> </slot></label>
            <select id="dropdownOptions" v-model="selectedOption" data-cy="dropdown-input" @change="selectionChanged">
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
        return { selectedOption: this.defaultInput }
    },
    watch: {
        defaultInput(newVal) {
            if(this.fullDropdown.includes(newVal)) {
                this.selectedOption = newVal;
            }
            else {
                this.selectedOption = null;
            }
        }
    },
    mounted() {
        this.selectionChanged();
    },
    methods: {
        selectionChanged: function() {
            this.$emit('selection-changed', this.selectedOption)
        },
    },
    computed: {
        fullDropdown: function() {
            // Copies the prop, doesn't it.
            let newList = this.dropdownList.slice(0);
            if (this.includesAll == true) {
                newList.splice(0,0,"All");
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