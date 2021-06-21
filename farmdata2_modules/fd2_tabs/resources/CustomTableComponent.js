let CustomTableComponent = {
    template:`<div>
                    <table data-cy="custom-table" style="width:100%" border=1>
                        <tr>
                            <th data-cy="headers" v-for="header in headers">{{ header }}</th>
                            <th data-cy="edit-header" v-if="canEdit">Edit</th>
                            <th data-cy="delete-header" v-if="canDelete">Delete</th>
                        </tr>
                        <tr data-cy="object-test" v-for="(row, index) in rows">
                            <td data-cy="table-data" v-for="(item, itemIndex) in row.data">
                                <input data-cy="test-input" v-if="rowsToEdit==index" v-model="row.data[itemIndex]" @focusout="changedCell(itemIndex)"></input><p v-if="!(rowsToEdit==index)">{{ item }}</p>
                            </td>
                            <td v-if="canEdit"> 
                                <button data-cy="edit-button" @click="editRow(index, row)" v-if="!(rowsToEdit==index)" :disabled="disableEdit">Edit</button> 
                                <button data-cy="save-button" v-if="rowsToEdit==index" @click="finishRowEdit(row.id, row)">Save</button>
                            </td>
                            <td v-if="canDelete"> 
                                <button data-cy="delete-button" @click="deleteRow(row.id)">Delete</button>
                            </td>
                        </tr>
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
        }
    },
    data() {
        return {
            rowsToEdit: null,
            oldRow: {},
            testIndex: null,
            indexsToChange: [],
        }
    },
    methods: {
        editRow: function(index, row){
            this.oldRow = this.rows[index]
            this.rowsToEdit = index
            
            //this.oldRow = row
        },
        finishRowEdit: function(idToChange, row){
            this.rowsToEdit = null
            let jsonObject = {}
            for(i=0; i < this.indexsToChange.length; i ++){
                let key = this.headers[this.indexsToChange[i]]
                jsonObject[key] = row.data[this.indexsToChange[i]]
            }
            this.indexsToChange = []
            var row = this.rows.filter(obj => {
                return obj.id === idToChange
            })
            this.$emit('row-edited', jsonObject, idToChange)
        },
        deleteRow: function(id){
            this.$emit('row-deleted', id)
        },
        changedCell: function(itemIndex){
            if(!this.indexsToChange.includes(itemIndex)){
                this.indexsToChange.push(itemIndex)
            }
        }
    },
    computed: {
        disableEdit() {
            if (this.rowsToEdit != null){
                return true
            }else{
                return false
            }
        },
    },
}

try {
    module.exports = {
        CustomTableComponent: CustomTableComponent
    }
}
catch {}