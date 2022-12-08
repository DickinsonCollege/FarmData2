try {
    FarmData2
}
catch(err) {
    var RegexComp = require("./RegexInputComponent.js")
    RegexInputComponent = RegexComp.RegexInputComponent
}

/**
 * A Vue component for FarmData2 report tables. The table ensures a consistent styling, and provides the row-based edit/delete and export functionalities that are common to all reports.
 * 
 * <p><b>data-cy attributes</b></p>
 * <button></button>                 <button>The export button appears on the top right of the table</button>
 * <button></button>                 <buton>The delete button appear on the top right of the table.</button>
 * <button></button>                 <buton>Any visible custom buttons appear on the top right of the table.</button>
 * <table>
 * <thead><tr><th>Value</th>         <th>Description</th></tr></thead>
 * <tbody>
 * <tr><td>table</td>                <td>The table element.</td></tr>
 * <tr><td>table-headers</td>        <td>The tr element holding the th elements</td></tr>
 * <tr><td>selectAll-checkbox</td>   <td>The select all checkbox which appears if the table has custom buttons or can delete</td>
 * <tr><td>hi</td>                   <td>The ith th element, i=0,1,2...</td>
 * <tr><td>edit-header</td>          <td>The th element for the edit button column</td>
 * <tr><td>save-header</td>          <td>The th element for the save button column</td>
 * <tr><td>ri</td>                   <td>The tr checkbox element for the ith table row if custom buttons or deleting is enabled, i=0,1,2,...</td>
 * <tr><td>ri</td>                   <td>The tr element for the ith table row, i=0,1,2,...</td>
 * <tr><td>td-ricj</td>              <td>The td element in the ith row and jth column, i,j=0,1,2...</td>
 * <tr><td>ri-columnHeader</td>      <td>The div for plain text in the ith row and jth column, i,j=0,1,2....</td>
 * <tr><td>ri-text-input</td>        <td>The text input in the ith row and jth column in edit mode, i,j=0,1,2....</td>
 * <tr><td>ri-dropdown-input</td>    <td>The select input in the ith row and jth column in edit mode, i,j=0,1,2....</td>
 * <tr><td>ri-date-input</td>        <td>The date input in the ith row and jth column in edit mode, i,j=0,1,2....</td>
 * <tr><td>ri-regex-input</td>       <td>The regex input in the ith row and jth column in edit mode, i,j=0,1,2....</td>
 * <tr><td>ri-boolean-input</td>     <td>The boolean input in the ith row and jth column in edit mode, i,j=0,1,2....</td>
* <tr><td>ri-edit-button</td>        <td>The edit button in the ith row, i=0,1,2....</td>
* <tr><td>ri-save-button</td>        <td>The save button in the ith row, i=0,1,2....</td>
* <tr><td>ri-cancel-button</td>      <td>The cancel button in the ith row, i=0,1,2....</td>
 * </tbody>
 * </table>
 * 
 * @vue-prop {Object[]} rows - The content to be displayed in the table. Each object in the array is a row, and each element in the data property is an individual cell in that row.  For example the following value would provide data for three rows and three columns:<br> <code>[{id: 1, data:[1, 2, 'three']}, {id: 2, data:[4, 5, 'six']}, {id: 3, data:['seven', 8, 9]}]</code><br>  Note: The ID is not displayed, but emitted as a payload with some events to communicate which row is affected.
 * @vue-prop {Object[]} columns - Contains a column's header, visibility, and the input type for that column along with other specified data values for that column
 *  * @vue-prop {Object[]} customButtons - Contains a custom button's hover tip, visibility, and input type specifying the button's icon, class, and event.
 * @vue-prop {Boolean} [canEdit=false] - true if the table rows should be editable via an edit button that appears in each row.
 * @vue-prop {Boolean} [canDelete=false] - true if the table rows should be able to be deleted via a delete button that appears in each row.
 * @vue-prop {String} [csvName] - A String that assigns the exported CSV file its name. If left empty the export button does not appear. 
 * 
 * @vue-event edit-clicked - Emitted when an edit button is clicked to indicate that the table is in edit mode.
 * @vue-event {Object|Number} row-edited - Emitted when the save button is clicked after editing a row.  The event has two payloads.  The first is an Object indicates the changes that were made to the row. For example, if a user changes the crop of a row to kale, the emitted object will be <code>{crop: 'KALE'}</code>, and if they also edited the area to Chuau it would be <code>{crop: 'KALE', area: 'CHUAU'}</code>.  The second is a Number that indicates 'id' of the row that was changed. 
 * @vue-event row-canceled - Emitted when a row was being edited and the cancel button is clicked.
 * @vue-event {Array[]} row-deleted - Emitted when the delete button is clicked if any of the checkboxes on the lefthand side of a row are selected. Emits an array of all the IDs that were deleted for the page to make the appropriate API request to have those records deleted.
 * @vue-event {Array[]} event - Emits an 'event', name of event depends on the button's event name, with a payload of row IDs for the parent page to handle. 
 */
let CustomTableComponent = {
    template:
    `<span>
        <div style="display: flex; justify-content: flex-end">
            <button 
            title="Export"
            data-cy="export-button" 
            class="table-button btn btn-primary"
            @click="exportCSV" 
            :disabled="editDeleteDisabled"
            v-if="csvName != ''">
            <span class="glyphicon glyphicon-download"></span>
            </button>

            <button class="table-button btn btn-danger" 
            v-if="canDelete"
            title="Delete"
            data-cy="delete-button"
            @click="deleteRow()" 
            :disabled="indexesToAction.length == 0 || editDeleteDisabled">
                <span class="glyphicon glyphicon-trash"></span>
            </button>
            
            <button 
            v-if="customButtons.length > 0 && customButtons[hi].visible"
            v-for="(button, hi) in customButtons"
            :title="button.hoverTip"
            :data-cy="button.hoverTip.toLowerCase() + '-button'"
            :class="button.inputType.buttonClass"
            :disabled="editDeleteDisabled || indexesToAction.length == 0"
            @click="(buttonEventHandler(customButtons[hi].inputType.event))">
                <span :class="button.inputType.value"></span>
            </button>
        </div>
        <div class="sticky-table">
            <table data-cy="table" style="width:100%;" class="table table-bordered table-striped">
                <thead>
                    <tr class="sticky-header table-text" data-cy="table-headers">
                        <th
                        v-if="canDelete || customButtons.length > 0"  
                        :data-cy="'selectAll-checkbox'"
                        style="text-align:center">
                            <input type="checkbox"
                            title="Select All"
                            v-model="selectAllEvent"
                            @click="selectAll(selectAllEvent)"
                            :disabled="editDeleteDisabled">
                        </th>

                        <th v-for="(column, hi) in columns"
                        v-if="columns[hi].visible" 
                        :data-cy="'h'+hi"
                        style="text-align:center">{{ column.header }}</th>

                        <th data-cy="edit-header" width=55 v-if="canEdit && !currentlyEditing">Edit</th>
                        <th data-cy="save-header" width=55 v-if="canEdit && currentlyEditing">Save</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="table-text" 
                    v-for="(row, ri) in rows"
                    :data-cy="'r'+ri">
                        <td
                        v-if="customButtons.length > 0 || canDelete" 
                        :data-cy="'r'+ri+'cbutton'+ri"
                        style="text-align:center">
                            <input
                            :disabled="editDeleteDisabled"
                            :data-cy="'r'+ri+'-cbuttonCheckbox'"
                            type="checkbox"
                            :value="row.id" 
                            v-model="indexesToAction"
                            @click="updateSelectAll()"
                            >
                        </td>
                        <td v-for="(item, ci) in row.data"
                        v-if="columns[ci].visible"
                        :data-cy="'td-r'+ri+'c'+ci"
                        style="text-align:center">
                        
                            <div 
                            v-if="(rowToEditIndex!=ri || columns[ci].inputType.type == 'no input') && (columns[ci].inputType.type != 'boolean')"
                            :data-cy="'r'+ri+'-'+columns[ci].header"
                            v-html='item'></div>
                                        
                            <textarea 
                            v-if="rowToEditIndex==ri && columns[ci].inputType.type == 'text'" 
                            :data-cy="'r'+ri+'-'+columns[ci].inputType.type+'-input'"
                            v-model="editedRowData.data[ci]" 
                            @focusout="changedCell(ci)"></textarea>
                                        
                            <select 
                            v-if="rowToEditIndex==ri && columns[ci].inputType.type == 'dropdown'" 
                            :data-cy="'r'+ri+'-'+columns[ci].inputType.type+'-input'"
                            v-model="editedRowData.data[ci]" 
                            @focusout="changedCell(ci)">
                                <option v-for="option in columns[ci].inputType.value">{{ option }}</option>
                            </select>
                                        
                            <input 
                            v-if="rowToEditIndex==ri && columns[ci].inputType.type == 'date'" 
                            :data-cy="'r'+ri+'-'+columns[ci].inputType.type+'-input'"
                            type="date" 
                            v-model="editedRowData.data[ci]" 
                            @focusout="changedCell(ci)">
                                        
                            <regex-input 
                            v-if="rowToEditIndex==ri && columns[ci].inputType.type == 'regex'"
                            :data-cy="'r'+ri+'-'+columns[ci].inputType.type+'-input'" 
                            :reg-exp="columns[ci].inputType.regex"
                            :default-val="editedRowData.data[ci]"
                            set-type="number" 
                            @match-changed="setMatchVal"
                            @input-changed="(newVal) => setNewRegexVal(ci, newVal)"
                            >
                            </regex-input>

                            <input 
                            v-if="columns[ci].inputType.type == 'boolean'" 
                            :data-cy="'r'+ri+'-'+columns[ci].inputType.type+'-input'" 
                            type="checkbox" 
                            :disabled="rowToEditIndex!=ri || !editDeleteDisabled"
                            v-model="rows[ri].data[ci]">
                        </td>

                        <td v-if="canEdit"> 
                        <button class="table-button btn btn-info" 
                        v-if="!(rowToEditIndex==ri)" 
                        :data-cy="'r'+ri+'-edit-button'" 
                        @click="editRow(ri)" 
                        :disabled="editDeleteDisabled">
                            <span class="glyphicon glyphicon-pencil"></span>
                        </button> 
                        <button class="table-button btn btn-success" 
                        v-if="rowToEditIndex==ri" 
                        :data-cy="'r'+ri+'-save-button'"
                        :disabled="!isMatch"
                        @click="finishRowEdit(row.id, row)">
                            <span class="glyphicon glyphicon-check"></span>
                        </button>
                        <button class="table-button btn btn-danger"
                        v-if="(rowToEditIndex==ri)"
                        :data-cy="'r'+ri+'-cancel-button'"
                        title="Cancel"
                        @click="cancelRowEdit()"> 
                            <span class="glyphicon glyphicon-remove"></span>
                        </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </span>`,
    props: { 
        customButtons: {
            type: Array,
            required: false,
            default: () => []
        },
        columns: {
            type: Array,
            required: true
        },
        rows: {
            type: Array,
            required: true
        },
        canEdit: {
            type: Boolean,
            default: false
        },
        canDelete: {
            type: Boolean,
            default: false
        },
        csvName : {
            type: String,
            default: ''
        }
    },
    components: {
        'regex-input': RegexInputComponent,
    },
    data() {
        return {
            rowToEditIndex: null,
            indexesToChange: [],
            indexesToAction: [],
            editedRowData: {},
            originalRow: {},
            selectAllEvent: false,
            currentlyEditing: false,
            isMatch: true,
            updatedColumns: this.columns,
        }
    },
    methods: {

        selectAll: function(allChecked){
            this.indexesToAction = []
            if(allChecked){
                this.selectAllEvent = false
            }
            else{
                for(let i = 0; i < this.rows.length; i++){
                    this.indexesToAction.push(this.rows[i].id)
                }
                this.selectAllEvent = true
            }
        },

        updateSelectAll: function(){
            if((this.indexesToAction).length <= (this.rows).length){
                this.selectAllEvent = false
            }
        },

        buttonEventHandler(event){
            let payload = this.indexesToAction.slice()
            this.$emit(event, payload)
            this.selectAllEvent = false
            this.indexesToAction = []
        },

        setMatchVal(newBool){
            this.isMatch = newBool
        },

        setNewRegexVal(colIndex, value){
            if(this.isMatch){
                this.editedRowData.data[colIndex] = value
                this.changedCell(colIndex)
            }
        },

        editRow: function(index){
            this.rowToEditIndex = index
            this.currentlyEditing = true
            this.originalRow = JSON.parse(JSON.stringify({ 
                'id': this.rows[index].id,
                'data': this.rows[index].data
            }))
            this.editedRowData = { 
                'id': this.rows[index].id,
                'data': this.rows[index].data    
            }
            this.$emit('edit-clicked')
        },

        finishRowEdit: function(id){
            this.rowToEditIndex = null
            this.currentlyEditing = false

            let jsonObject = {}
            for(i=0; i < this.indexesToChange.length; i ++){
                let key = this.columns[[this.indexesToChange[i]]].header
                jsonObject[key] = this.editedRowData.data[this.indexesToChange[i]]
                }

            this.indexesToChange = []
            this.editedRowData = {}

            this.$emit('row-edited', jsonObject, id)
        },

        cancelRowEdit: function(){

            this.rows[this.rowToEditIndex].data = this.originalRow.data

            this.rowToEditIndex = null
            this.currentlyEditing = false
    
            this.indexesToChange = []
            this.editedRowData = {}

            this.isMatch = true
            this.$emit('row-canceled')
        },

        deleteRow: function(){
            if(confirm("Would you like to delete the selected log(s)?")){
                this.$emit('row-deleted', this.indexesToAction)
                this.selectAllEvent = false
            }
        },

        changedCell: function(itemIndex){
            if(!this.indexesToChange.includes(itemIndex)){
                if(this.editedRowData.data[itemIndex] != this.originalRow.data[itemIndex]) {
                    this.indexesToChange.push(itemIndex)
                }
            }
            else if (this.indexesToChange.includes(itemIndex) && (this.editedRowData.data[itemIndex] == this.originalRow.data[itemIndex])){
                for (i = 0; i < this.indexesToChange.length; i++) {
                    if (this.indexesToChange[i] == itemIndex) {
                        this.indexesToChange.splice(i, 1)
                    }
                }
            }
        },
        exportCSV(){
            let csvInfoArr = []
            let headerTemp = []
            let rowTemp = []

            for(let i = 0; i < this.columns.length; i++){
                if(this.columns[i].visible){
                    headerTemp.push(this.columns[i].header)
                }
            }
            csvInfoArr.push(headerTemp)

            for(let i = 0; i < this.rows.length; i++){
                for(let j = 0; j < this.columns.length; j++){
                    if(this.columns[j].visible){
                        if(typeof this.rows[i].data[j] === 'string'){
                            cleanHTML = this.rows[i].data[j].replaceAll(/(<p[^>]+?>|<p>|<\/p>|<br \/>)/img, "")
                            cleanHTML = cleanHTML.replaceAll(/(\r\n|\n|\r)/gm, "-")
                            cleanHTML = cleanHTML.replaceAll(',', "--")
                            rowTemp.push(cleanHTML)
                        }
                        else{
                            rowTemp.push(this.rows[i].data[j])
                        }
                    }
                }
                csvInfoArr.push(rowTemp)
                rowTemp = []
            }

            let csvContent = "data:text/csv;charset=utf-8," 
            + csvInfoArr.map(e => e.join(",")).join("\n");

            // Create a new date used for the file's name
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); 
            var yyyy = today.getFullYear();
            today = mm + dd + yyyy;

            // Required if we want to be able to name the file
            var encodedUri = encodeURI(csvContent)
            var link = document.createElement("a")
            link.setAttribute("href", encodedUri)
            link.setAttribute("download", this.csvName + today + ".csv")
            document.body.appendChild(link)

            // This will download the csv file named "seedingReport_(today).csv"
            link.click()
        },
        updateColumns(newArr){
            this.columns = newArr
        } 
    },
    computed: {
        editDeleteDisabled() {
            if (this.rowToEditIndex != null){
                return true
            }else{
                return false
            }
        },   
        dropdownOptions() {
            tempArr = []
            return tempArr
        }
    },
    // watch: {
    //     // Leaving this uncommented code in here until I try this out with something
    //     // more complex than the simple UI page
    //     columns: {
    //         // using deep watch to track nested property changes
    //         handler(newArr) {
    //             console.log("Hey!")
    //             this.updatedColumns = newArr
    //         },
    //         deep: true
    //     }
    // } 
}

try {
    module.exports = {
        CustomTableComponent: CustomTableComponent
    }
}
catch {}
