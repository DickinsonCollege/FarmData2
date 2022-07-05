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
 * @vue-prop {String[]} headers - The column headings for the table. Must be the same length as the data arrays in the rows prop.
 * @vue-prop {Boolean} [canEdit=false] - true if the table rows should be editable via an edit button that appears in each row.
 * @vue-prop {Boolean} [canDelete=false] - true if the table rows should be able to be deleted via a delete button that appears in each row.
 * @vue-prop {Boolean[]} [visibleColumns] - An array the same length as the headers prop.  Each entry indicates if the associated column is visible (true) or hidden (false).  If omitted, all columns are visible. It is being watched for direct changes from the parent.
 * @vue-prop {String[]} [inputOptions] - An array the same length as the headers prop.  Each entry indicates the type of edit component that will appear in edit mode.  The entries must be one of 'text', 'dropdown', 'date', 'number', or 'no input'.  If omitted, all columns are edited as 'text'.
 * 
 * @vue-event edit-clicked - Emitted when an edit button is clicked to indicate that the table is in edit mode.
 * @vue-event {Object|Number} row-edited - Emitted when the save button is clicked after editing a row.  The event has two payloads.  The first is an Object indicates the changes that were made to the row. For example, if a user changes the crop of a row to kale, the emitted object will be <code>{crop: 'KALE'}</code>, and if they also edited the area to Chuau it would be <code>{crop: 'KALE', area: 'CHUAU'}</code>.  The second is a Number that indicates 'id' of the row that was changed. 
 * @vue-event row-canceled - Emitted when a row was being edited and the cancel button is clicked.
 * @vue-event {Number} row-deleted - Emitted when the delete button next to a row is clicked and the user confirms that they want to delete the row.  The payload indicates the 'id' of the row that is to be deleted.
 */
let CustomTableComponent = {
    template:
    `<span>
        <button data-cy="export-btn" 
            style="float: right; float: top;" class="btn fd2-red-button" @click="exportCSV">Export
        </button>
        <div class="sticky-table">
            <table data-cy="table" style="width:100%;" class="table table-bordered table-striped">
                <thead>
                    <tr class="sticky-header table-text" data-cy="table-headers">
                        <th v-for="(header, hi) in headers"
                        v-if="isVisible[hi]" 
                        :data-cy="'h'+hi">{{ header }}</th>
                        <th data-cy="edit-header" width=55 v-if="canEdit && !currentlyEditing">Edit</th>
                        <th data-cy="save-header" width=55 v-if="canEdit && currentlyEditing">Save</th>
                        <th data-cy="delete-header" width=55 v-if="canDelete && !currentlyEditing">Delete</th>
                        <th data-cy="cancel-header" width=55 v-if="canDelete && currentlyEditing">Cancel</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="table-text" 
                    v-for="(row, ri) in rows"
                    :data-cy="'r'+ri">
                        <td v-for="(item, ci) in row.data"
                        v-if="isVisible[ci]"
                        :data-cy="'td-r'+ri+'c'+ci">
                            <div v-if="rowToEditIndex!=ri || inputType[ci].type == 'no input'"
                            :data-cy="'r'+ri+'c'+ci"
                            v-html='item'></div>
                                        
                            <textarea 
                            :data-cy="'text-input-r'+ri+'c'+ci"
                            v-if="rowToEditIndex==ri && inputType[ci].type == 'text'" 
                            v-model="editedRowData.data[ci]" 
                            @focusout="changedCell(ci)"></textarea>
                                        
                            <select 
                            :data-cy="'dropdown-input-r'+ri+'c'+ci"
                            v-if="rowToEditIndex==ri && inputType[ci].type == 'dropdown'" 
                            v-model="editedRowData.data[ci]" 
                            @focusout="changedCell(ci)">
                                <option v-for="option in inputType[ci].value">{{ option }}</option>
                            </select>
                                        
                            <input 
                            :data-cy="'date-input-r'+ri+'c'+ci"
                            type="date" 
                            v-if="rowToEditIndex==ri && inputType[ci].type == 'date'" 
                            v-model="editedRowData.data[ci]" 
                            @focusout="changedCell(ci)">
                                        
                            <input 
                            :data-cy="'number-input-r'+ri+'c'+ci" 
                            type="number" step="0.001" style="width: 70px;" 
                            v-if="rowToEditIndex==ri && inputType[ci].type == 'number'"
                            v-model="editedRowData.data[ci]" 
                            @focusout="changedCell(ci)">
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
                        <td v-if="canDelete"> 
                            <button class="table-button btn btn-danger" 
                            :data-cy="'delete-button-r'+ri" 
                            @click="deleteRow(row.id)" 
                            v-if="!(rowToEditIndex==ri)" :disabled="editDeleteDisabled">
                                <span class="glyphicon glyphicon-trash"></span>
                            </button>
                            <button class="table-button btn btn-danger"
                            :data-cy="'cancel-button-r'+ri"
                            @click="cancelRowEdit(ri)" 
                            v-if="(rowToEditIndex==ri)">
                                <span class="glyphicon glyphicon-remove"></span>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </span>`,
    props: { 
        rows: {
            type: Array,
            required: true
        },
        headers: {
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
        visibleColumns: {
            type: Array,
            default: null
        },
        inputOptions: {
            type: Array,
            default: null
        }
    },
    data() {
        return {
            rowToEditIndex: null,
            indexesToChange: [],
            editedRowData: {},
            originalRow: {},
            currentlyEditing: false,
            updatedVis: this.visibleColumns,
        }
    },
    methods: {
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
                let key = this.headers[this.indexesToChange[i]]
                jsonObject[key] = this.editedRowData.data[this.indexesToChange[i]]
            }

            this.indexesToChange = []
            this.editedRowData = {}

            this.$emit('row-edited', jsonObject, id)
        },
        cancelRowEdit: function(index){
            this.rowToEditIndex = null
            this.currentlyEditing = false
            
            this.rows[index].data = this.originalRow.data
            
            this.indexesToChange = []
            this.editedRowData = {}

            this.$emit('row-canceled')
        },
        deleteRow: function(id){
            if(confirm("Would you like to delete this log?")){
                this.$emit('row-deleted', id)
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

            for(let i = 0; i < this.headers.length; i++){
                if(this.visibleColumns[i]){
                    headerTemp.push(this.headers[i])
                }
            }
            csvInfoArr.push(headerTemp)

            for(let i = 0; i < this.rows.length; i++){
                for(let j = 0; j < this.visibleColumns.length; j++){
                    if(this.visibleColumns[j]){
                        if(typeof this.rows[i].data[j] === 'string'){
                            cleanHTML = this.rows[i].data[j].replace(/(<p[^>]+?>|<p>|<\/p>|<br \/>)/img, "")
                            cleanHTML = cleanHTML.replace(/(\r\n|\n|\r)/gm, "-")
                            cleanHTML = cleanHTML.replace(',', "--")
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
            link.setAttribute("download", "seedingReport_" + today + ".csv")
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
            if (this.updatedVis == null) {
                for (i = 0; i < this.headers.length; i++) {
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
                for (i = 0; i < this.headers.length; i++) {
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
        visibleColumns: {
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
        CustomTableComponent: CustomTableComponent
    }
}
catch {}
