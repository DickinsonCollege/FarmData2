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
                                <input data-cy="test-input" v-if="rowsToEdit.includes(index)" v-model="row.data[itemIndex]"></input><p v-if="!rowsToEdit.includes(index)">{{ item }}</p>
                            </td>
                            <td v-if="canEdit"> 
                                <button data-cy="edit-button" @click="editRow(index)" v-if="!rowsToEdit.includes(index)">Edit</button> 
                                <button data-cy="save-button" v-if="rowsToEdit.includes(index)" @click="finishRowEdit(index, row.id)">Save</button>
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
            rowsToEdit: [],
        }
    },
    methods: {
        editRow: function(index){
            this.rowsToEdit.push(index)
        },
        finishRowEdit: function(index, idToChange){
            for(var i = 0; i < this.rowsToEdit.length; i++){
                if(this.rowsToEdit[i] == index){
                    this.rowsToEdit.splice(i, 1)
                }
            }
            var row = this.rows.filter(obj => {
                return obj.id === idToChange
            })
            this.$emit('row-edited', row)
        },
        deleteRow: function(id){
            this.$emit('row-deleted', id)
        }
    },
}

try {
    module.exports = {
        CustomTableComponent: CustomTableComponent
    }
}
catch {}