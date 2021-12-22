let CustomTableComponent = {
    template:
    `<div class="sticky-table">
        <table data-cy="table" style="width:100%" class="table table-bordered table-striped">
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
    </div>`,
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
            if(confirm("Would you like ot delete this log?")){
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
            let updatedVis = []
            if (this.visibleColumns == null) {
                for (i = 0; i < this.headers.length; i++) {
                    updatedVis.push(true);
                }
            }
            else {
                updatedVis = this.visibleColumns
            }
            return updatedVis;
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
    }
}

try {
    module.exports = {
        CustomTableComponent: CustomTableComponent
    }
}
catch {}