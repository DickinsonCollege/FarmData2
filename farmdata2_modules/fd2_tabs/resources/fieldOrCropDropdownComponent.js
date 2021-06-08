let FieldOrCropDropdownComponent = {
    /**
     * <div>
            <label for="dropdownOptions"><slot></slot></label>
            <input list="dropDownOptions" v-model="selectedOption" data-cy="dropdown-input" @change="selectionChanged">
                <datalist id="dropdownOptions" data-cy="dropdownOptions">
                   <option v-for="singleOption in fullDropDown" data-cy="singleOption">{{ singleOption }}</option>
                </datalist>
        </div>`
     */
    template: `<div>
            <label for="dropdownOptions"><slot></slot></label>
            <input list="dropDownOptions" v-model="selectedOption" @change="selectionChanged">
                <datalist id="dropdownOptions">
                   <option v-for="singleOption in fullDropDown">{{ singleOption }}</option>
                </datalist>
        </div>`,
    props: {
        dropDownList: {
            type: Array
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
        fullDropDown: function() {
            let newList = this.dropDownList;
            if (this.includesAll == true) {
                newList.splice(0,0,"All");
            }
            return newList;
        }
    }
}