let DropdownWithAllComponent = {
    template: `<div>
            <label for="dropdownOptions"><slot></slot></label>
            <input list="dropdownOptions" v-model="selectedOption" data-cy="dropdown-input" @change="selectionChanged">
                <datalist id="dropdownOptions" data-cy="dropdownOptions">
                   <option v-for="singleOption in fullDropdown" data-cy="singleOption">{{ singleOption }}</option>
                </datalist>
        </div>`,
    props: {
        dropDownList: {
            type: Array,
            required: true
        },
        includesAll: {
            type: Boolean,
        },
    },
    data() {
        return {
            selectedOption: null,
        }
    },
    methods: {
        selectionChanged() {
            this.$emit('selectionChanged', this.selectedOption)
        }
    },
    computed: {
        fullDropdown: function() {
            let newList = this.dropDownList;
            if (this.includesAll == true) {
                newList.splice(0,0,"All");
            }
            return newList;
        }
    }
}