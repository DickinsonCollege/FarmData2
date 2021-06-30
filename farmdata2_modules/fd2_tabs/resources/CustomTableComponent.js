let CustomTableComponent = {
    template:`<div>
                    <table data-cy="custom-table" style="width:100%" class="table table-bordered table-striped">
                        <thead>
                            <tr class="bg-success">
                                <th v-if="visibleColumns[index]" data-cy="headers" v-for="(header, index) in headers">{{ header }}</th>
                                <th data-cy="edit-header" width=55 v-if="canEdit">Edit</th>
                                <th data-cy="delete-header" width=55 v-if="canDelete">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr data-cy="object-test" v-for="(row, index) in rows">
                                <td v-if="visibleColumns[itemIndex]" data-cy="table-data" v-for="(item, itemIndex) in row.data">
                                    <input data-cy="test-input" v-if="rowToEdit==index" v-model="row.data[itemIndex]" @focusout="changedCell(itemIndex)"></input><p v-if="!(rowToEdit==index)">{{ item }}</p>
                                </td>
                                <td v-if="canEdit"> 
                                    <button class="btn btn-info" data-cy="edit-button" @click="editRow(index)" v-if="!(rowToEdit==index)" :disabled="editDisabled"><span class="glyphicon glyphicon-pencil"></span></button> 
                                    <button class="btn btn-success" data-cy="save-button" v-if="rowToEdit==index" @click="finishRowEdit(row.id, row)"><span class="glyphicon glyphicon-check"></button>
                                </td>
                                <td v-if="canDelete"> 
                                    <button class="btn btn-primary" data-cy="delete-button" @click="deleteRow(row.id)"><span class="glyphicon glyphicon-trash"></span></button>
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
            required: true
        }
    },
    data() {
        return {
            rowToEdit: null,
            indexesToChange: []
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