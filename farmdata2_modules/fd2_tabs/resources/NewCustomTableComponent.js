/**
 * A Vue component for FarmData2 report tables. The table ensures a consistent styling, and provides the row-based edit/delete and export functionalities that are common to all reports.
 * 
 * <p><b>data-cy attributes</b></p>
 * <table>
 * <thead><tr><th>Value</th>         <th>Description</th></tr></thead>
 * <tbody>
 * <tr><td>table</td>                <td>The table element.</td></tr>
 * <tr><td>table-headers</td>        <td>The tr element holding the th elements</td></tr>
 * <tr><td>hi</td>                   <td>The ith th element, i=0,1,2...</td>
 * <tr><td>edit-header</td>          <td>The th element for the edit button column</td>
 * <tr><td>save-header</td>          <td>The th element for the save button column</td>
 * <tr><td>delete-header</td>        <td>The th element for the delete button column</td>
 * <tr><td>cancel-header</td>        <td>The th element for the cancel button column</td>
 * <tr><td>ri</td>                   <td>The tr element for the ith table row, i=0,1,2,...</td>
 * <tr><td>td-ricj</td>              <td>The td element in the ith row and jth column, i,j=0,1,2...</td>
 * <tr><td>ricj</td>                 <td>The div for plain text in the ith row and jth column, i,j=0,1,2....</td>
 * <tr><td>ricj</td>                 <td>The div for plain text in the ith row and jth column, i,j=0,1,2....</td>
 * <tr><td>text-input-ricj</td>      <td>The text input in the ith row and jth column in edit mode, i,j=0,1,2....</td>
 * <tr><td>dropdown-input-ricj</td>  <td>The select input in the ith row and jth column in edit mode, i,j=0,1,2....</td>
 * <tr><td>date-input-ricj</td>      <td>The date input in the ith row and jth column in edit mode, i,j=0,1,2....</td>
 * <tr><td>number-input-ricj</td>    <td>The number input in the ith row and jth column in edit mode, i,j=0,1,2....</td>
* <tr><td>edit-button-ri</td>        <td>The edit button in the ith row, i=0,1,2....</td>
* <tr><td>save-button-ri</td>        <td>The save button in the ith row, i=0,1,2....</td>
* <tr><td>delete-button-ri</td>      <td>The delete button in the ith row, i=0,1,2....</td>
* <tr><td>cancel-button-ri</td>      <td>The cancel button in the ith row, i=0,1,2....</td>
 * </tbody>
 * </table>
 * 
 * @vue-prop {Object[]} rows - The content to be displayed in the table. Each object in the array is a row, and each element in the data property is an individual cell in that row.  For example the following value would provide data for three rows and three columns:<br> <code>[{id: 1, data:[1, 2, 'three']}, {id: 2, data:[4, 5, 'six']}, {id: 3, data:['seven', 8, 9]}]</code><br>  Note: The ID is not displayed, but emitted as a payload with some events to communicate which row is affected.
 * @vue-prop {Object[]} columns - Contains a column's header, whether it is to be displayed or not, and what the input type for that column is.
 * @vue-prop {Boolean} [canEdit=false] - true if the table rows should be editable via an edit button that appears in each row.
 * @vue-prop {Boolean} [canDelete=false] - true if the table rows should be able to be deleted via a delete button that appears in each row.
 * @vue-prop {String} [csvName] - A String that assigns the exported CSV file its name. If left empty the export button does not appear. 
 * 
 * @vue-event edit-clicked - Emitted when an edit button is clicked to indicate that the table is in edit mode.
 * @vue-event {Object|Number} row-edited - Emitted when the save button is clicked after editing a row.  The event has two payloads.  The first is an Object indicates the changes that were made to the row. For example, if a user changes the crop of a row to kale, the emitted object will be <code>{crop: 'KALE'}</code>, and if they also edited the area to Chuau it would be <code>{crop: 'KALE', area: 'CHUAU'}</code>.  The second is a Number that indicates 'id' of the row that was changed. 
 * @vue-event row-canceled - Emitted when a row was being edited and the cancel button is clicked.
 * @vue-event {Number} row-deleted - Emitted when the delete button next to a row is clicked and the user confirms that they want to delete the row.  The payload indicates the 'id' of the row that is to be deleted.
 */
let NewCustomTableComponent = {
    template:
    `<span>
        <div style="display: flex; justify-content: flex-end">
            <button 
            title="Export"
            data-cy="export-btn" 
            class="table-button btn btn-primary"
            @click="exportCSV" 
            :disabled="editDeleteDisabled"
            v-if="csvName != ''">
            <span class="glyphicon glyphicon-download"></span>
            </button>

            <button class="table-button btn btn-danger" 
            title="Delete"
            data-cy="delete-button" 
            @click="deleteRow()" 
            v-if="(rowToEditIndex==null)" 
            :disabled="indexesToAction.length == 0">
                <span class="glyphicon glyphicon-trash"></span>
            </button>
            <button class="table-button btn btn-danger"
            title="Cancel"
            data-cy="cancel-button"
            @click="cancelRowEdit()" 
            v-if="(rowToEditIndex!=null)">
                <span class="glyphicon glyphicon-remove"></span>
            </button>
            
            <button v-for="(button, hi) in customButtons"
            v-if="customButtons[hi].visible && button.inputType.type == 'button'"
            :title="button.header"
            :data-cy="'h'+hi"
            :class="button.inputType.box"
            :disabled="editDeleteDisabled || indexesToAction.length == 0"
            @click="(buttonEventHandler(customButtons[hi].inputType.event))">
                <span :class="button.inputType.value"></span>
            </button>
        </div>
        <div class="sticky-table">
            <table data-cy="table" style="width:100%;" class="table table-bordered table-striped">
                <thead>
                    <tr class="sticky-header table-text" data-cy="table-headers">
                        <tr class="sticky-header table-text" data-cy="table-headers">
                            <th v-for="(buttons, hi) in customButtons"
                            v-if="customButtons[hi].visible && buttons.inputType.type == 'button'" 
                            :data-cy="'h'+hi"
                            style="text-align:center">
                            <input type="checkbox"
                            title="Select All"
                            v-model="selectAllEvent"
                            @click="selectAll(selectAllEvent)"
                            :disabled="editDeleteDisabled">
                        </th>

                        <th v-for="(column, hi) in columns"
                        v-if="columns[hi].visible && column.inputType.type != 'button'" 
                        :data-cy="'h'+hi"
                        style="text-align:center">{{ column.header }}</th>

                        <th v-for="(column, hi) in columns"
                        v-if="columns[hi].visible && column.inputType.type == 'boolean' && column.inputType.selectAllAllowed == 'false'"
                        style="text-align:center"
                        width=55
                        :data-cy="'h'+hi">{{ column.header }}</th>

                        <th data-cy="edit-header" width=55 v-if="canEdit && !currentlyEditing">Edit</th>
                        <th data-cy="save-header" width=55 v-if="canEdit && currentlyEditing">Save</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="table-text" 
                    v-for="(row, ri) in rows"
                    :data-cy="'r'+ri">

                        <td
                        :data-cy="'r'+ri+'cbutton'+ri"
                        style="text-align:center">
                            <input 
                            type="checkbox" 
                            v-if="customButtons.length > 0" 
                            v-model="selectAllEvent || customButtons.length == 0"
                            @click="addRow(row.id, selectAllEvent)"
                            >
                        </td>

                        <td v-for="(item, ci) in row.data"
                        v-if="columns[ci].visible"
                        :data-cy="'td-r'+ri+'c'+ci"
                        style="text-align:center">
                        
                            <div v-if="(rowToEditIndex!=ri || columns[ci].inputType.type == 'no input') && (columns[ci].inputType.type != 'boolean')"
                            :data-cy="'r'+ri+'c'+ci"
                            v-html='item'></div>
                                        
                            <textarea 
                            :data-cy="'text-input-r'+ri+'c'+ci"
                            v-if="rowToEditIndex==ri && columns[ci].inputType.type == 'text'" 
                            v-model="editedRowData.data[ci]" 
                            @focusout="changedCell(ci)"></textarea>
                                        
                            <select 
                            :data-cy="'dropdown-input-r'+ri+'c'+ci"
                            v-if="rowToEditIndex==ri && columns[ci].inputType.type == 'dropdown'" 
                            v-model="editedRowData.data[ci]" 
                            @focusout="changedCell(ci)">
                                <option v-for="option in columns[ci].inputType.value">{{ option }}</option>
                            </select>
                                        
                            <input 
                            :data-cy="'date-input-r'+ri+'c'+ci"
                            type="date" 
                            v-if="rowToEditIndex==ri && columns[ci].inputType.type == 'date'" 
                            v-model="editedRowData.data[ci]" 
                            @focusout="changedCell(ci)">
                                        
                            <regex-input 
                            :data-cy="'regex-input-r'+ri+'c'+ci" 
                            :reg-exp="columns[ci].inputType.regex"
                            :default-val="rows[ri].data[ci]"
                            set-min="0"
                            set-type="number" 
                            v-if="rowToEditIndex==ri && columns[ci].inputType.type == 'regex'"
                            v-model.number="editedRowData.data[ci]"
                            @focusout="changedCell(ci)">
                            </regex-input>

                            <input 
                            :data-cy="'checkbox-input-r'+ri+'c'+ci" 
                            type="checkbox" 
                            :disabled="rowToEditIndex!=ri || !editDeleteDisabled"
                            v-if="columns[ci].inputType.type == 'boolean'" 
                            v-model="rows[ri].data[ci]" 
                            @click="select(ri, ci)"
                            >

                        </td>
                        <td v-if="canEdit"> 
                        <button class="table-button btn btn-info" :data-cy="'edit-button-r'+ri" 
                        @click="editRow(ri)" 
                        v-if="!(rowToEditIndex==ri)" :disabled="editDeleteDisabled">
                            <span class="glyphicon glyphicon-pencil"></span>
                        </button> 
                        <button class="table-button btn btn-success" :data-cy="'save-button-r'+ri"
                        v-if="rowToEditIndex==ri" 
                        @click="finishRowEdit(row.id, row)">
                            <span class="glyphicon glyphicon-check"></span>
                        </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </span>`,
    props: { 
        customButtons: {
            type: Array
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
            isMatch: false,
            updatedVis: this.visibleColumns,
        }
    },
    methods: {

        selectAll: function(allChecked){
            this.indexesToAction = []
            if(!allChecked){
                for(let i = 0; i < this.rows.length; i++){
                    this.indexesToAction.push(this.rows[i].id)
                }
                this.selectAllEvent = true
            }
            else{
                this.selectAllEvent = false
            }
        },

        select: function(rowIndex, colIndex){
            if(this.rows[rowIndex].data[colIndex] == false){
                this.rows[rowIndex].data[colIndex] = true
            }
            else if(this.rows[rowIndex].data[colIndex] == true) {
                this.rows[rowIndex].data[colIndex] = false
            }    
        },

        addRow: function(rowIndex, check){
            for(let i = 0; i < this.indexesToAction.length; i++){
                if(this.indexesToAction[i] == rowIndex){
                    this.indexesToAction.splice(i, 1)
                    return
                }
            }
            this.indexesToAction.push(rowIndex)
        },

        buttonEventHandler(event){
            this.$emit(event + "-event", this.indexesToAction)
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
                let key = this.columns[this.indexesToChange[i]]
                jsonObject[key] = this.editedRowData.data[this.indexesToChange[i]]
                console.log("Hello!")
            }

            this.indexesToChange = []
            this.editedRowData = {}

            this.$emit('row-edited', jsonObject, id)
        },

        cancelRowEdit: function(index){

            this.rows[this.rowToEditIndex].data = this.originalRow.data

            this.rowToEditIndex = null
            this.currentlyEditing = false
    
            this.indexesToChange = []
            this.editedRowData = {}

            this.$emit('row-canceled')
        },

        deleteRow: function(id){
            if(confirm("Would you like to delete this log?")){
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
        isVisible() {
            tempArr = []
            if (this.columns == null) {
                for (i = 0; i < this.columns.length; i++) {
                    tempArr.push(true);
                }
            } else {
                tempArr = this.updatedVis
            }
            return tempArr;
        },
        inputType() {
            let typeArray = []
            if (this.inputOptions == null) {
                for (i = 0; i < this.columns.length; i++) {
                    typeArray.push({'type': 'text'});
                }
            }
            else {
                typeArray = this.inputOptions
            }
            return typeArray;
        }
    },
    watch: {
        columns: {
            // using deep watch to track nested property changes
            handler(newArr) {
                this.updatedVis = newArr
            },
            deep: true
        }
    } 
}

try {
    module.exports = {
        NewCustomTableComponent: NewCustomTableComponent
    }
}
catch {}
