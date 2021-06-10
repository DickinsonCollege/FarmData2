let CustomTableComponent = {
    template: `<div>
                    <table data-cy="custom-table" style="width:100%" border=1>
                        <tr>
                            <th data-cy="headers" v-for="header in headers">{{ header }}</th>
                            <th v-if="canEdit">Edit</th>
                            <th v-if="canDelete">Delete</th>
                        </tr>
                        <tr data-cy="objectTest" v-for="(row, index) in rows">
                            <td data-cy="tableData" v-for="(item, itemIndex) in row.data"><input data-cy="testInput" v-if="rowsToEdit.includes(index)" v-model="row.data[itemIndex]"></input><p v-if="!rowsToEdit.includes(index)">{{ item }}</p></td>
                            <td v-if="canEdit"> <button data-cy="editButton" @click="editRow(index)" v-if="!rowsToEdit.includes(index)">Edit</button> <button data-cy="saveButton" v-if="rowsToEdit.includes(index)" @click="finishRowEdit(index, row.id)">Save</button></td>
                            <td v-if="canDelete"> <button data-cy="deleteButton" @click="deleteRow(row.id)">Delete</button></td>
                        </tr>
                    </table>
                </div>`,
    props: {
        rows: {
            type: Array,
            required: false
        },
        headers: {
            type: Array,
            required: false
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
            this.$emit('finishedRowEdit', row)
        },
        deleteRow: function(id){
            //get row by id --> then remove it
            for(var i = 0; i < this.rows.length; i++){
                if(this.rows[i].id == id){
                    this.rows.splice(i, 1)
                }
            }
            var row = this.rows.filter(obj => {
                return obj.id === idToChange
            })
            this.$emit('deleteRow', id)
        }
    },
}
try{
    module.exports = CustomTableComponent
}
catch(err) {}