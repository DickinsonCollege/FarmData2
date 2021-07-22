COMPONENTS:
    CustomTable:
        Example ->
            <custom-table :rows="arrayOfRows" :headers="arrayOfHeaders" can-edit can-delete :visible-columns="visibleColumnsArray" @row-deleted="deleteFromArrayOfRows" @row-edited="updateArrayOfRows" :input-options="inputTypesArray"></custom-table>

        Description ->
            A table styled to match FarmOS. By using Vue to v-bind/v-model the values of the props the table can dynamically update to display relevant information.

        Props ->
            rows:
                -Required
                -Structure: Array of objects 
                    [{id: 1, data:[1, 2, 'three']}, {id: 2, data:[4, 5, 'six']}, {id: 3, data:['seven', 8, 9]}]
                -Decription: Determines what information is displayed in the table. Each object is a row, and each element in the data array is an individual cell in that row. The ID is not displayed, but emitted as a payload with certain methods.
            headers:
                -Required
                -Structure: Array
                    ['Date', 'Crop', 'Area']
                -Description: Displays each element of the array as a header in the table. Should be the same length as the data arrays in the row prop.
            can-edit:
                -Not Required
                -Structure: Boolean
                    can-edit *OR* can-edit=true
                -Default: false
                -Description: If true, adds a column to the right side of the table containing buttons that when clicked emits the event 'edit-clicked' and allows the user to edit the values in that row of the table. By default these will be text inputs.
            can-delete:
                -Not Required
                -Structure: Boolean
                    can-delete *OR* can-delete=true
                -Default: false
                -Description: If true, adds a column to the right side of the table containing buttons that when clicked emits an event 'row-deleted' with the ID of the row as the payload.