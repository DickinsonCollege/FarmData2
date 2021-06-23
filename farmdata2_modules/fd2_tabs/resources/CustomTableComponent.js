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
                                <input data-cy="test-input" v-if="rowToEdit==index" v-model="row.data[itemIndex]" @focusout="changedCell(itemIndex)"></input><p v-if="!(rowToEdit==index)">{{ item }}</p>
                            </td>
                            <td v-if="canEdit"> 
                                <button data-cy="edit-button" @click="editRow(index)" v-if="!(rowToEdit==index)" :disabled="editDisabled">Edit</button> 
                                <button data-cy="save-button" v-if="rowToEdit==index" @click="finishRowEdit(row.id, row)">Save</button>
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
            rowToEdit: null,
            indexesToChange: [],
        }
    },
    methods: {
        editRow: function(index){
            this.rowToEdit = index
        },
        finishRowEdit: function(id, row){
            this.rowToEdit = null
            let jsonObject = {}
            for(i=0; i < this.indexesToChange.length; i ++){
                let key = this.headers[this.indexesToChange[i]]
                jsonObject[key] = row.data[this.indexesToChange[i]]
            }
            this.indexesToChange = []

            this.$emit('row-edited', jsonObject, id)
        },
        deleteRow: function(id){
            this.$emit('row-deleted', id)
        },
        changedCell: function(itemIndex){
            if(!this.indexesToChange.includes(itemIndex)){
                this.indexesToChange.push(itemIndex)
            }
        }
    },
    computed: {
        editDisabled() {
            if (this.rowToEdit != null){
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