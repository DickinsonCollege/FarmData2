/**
 * A Vue component for a dropdown list where "All" can be included as the first option.
 * 
 * <p><b>data-cy attributes</b></p>
 * <table>
 * <thead><tr><th>Value</th>        <th>Descripion</th></tr></thead>
 * <tbody>
 * <tr><td>dropdown-component</td>  <td>div containing the label and select elements.</td></tr>
 * <tr><td>dropdown-input</td>      <td>The select element.</td></tr>
 * <tr><td>optioni</td>             <td>The ith option element, i=0,1,2...</td></tr>
 * </tbody>
 * </table>
 * 
 * @vue-prop {Array} dropDownList - The contents of the dropdown. Changes to an array bound to this prop will appear in the list.
 * @vue-prop {Boolean} [includesAll=false] - true to include the All option at the top of the list of options. All will be omitted if includesAll is false or omitted.
 * @vue-prop {String} [defaultInput] - the option to be selected in the component. Changes to a value bound to this prop will change the selected option.
 *
 * @vue-event {String} selection-changed - Emits the selected option when the option is changed. Note: This event is also emitted in the mounted lifecycle hook to signal the setting of the initial value.
 */ 
let DropdownWithAllComponent = {
    template: `<div data-cy="dropdown-component">
            <label for="dropdownOptions"><slot> </slot></label>
            <select id="dropdownOptions" v-model="selectedOption" data-cy="dropdown-input" @change="selectionChanged">
                <option v-for="(singleOption,i) in fullDropdown" data-cy="'option'+i">{{ singleOption }}</option>
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
            // Copies the prop first then adds All.
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