COMPONENTS:

    CustomTable:
        Example ->
            <custom-table :rows="arrayOfRows" :headers="arrayOfHeaders" can-edit can-delete :visible-columns="visibleColumnsArray" :input-options="inputTypesArray" @edit-clicked="enterEditMode" @row-edited="updateArrayOfRows" @row-deleted="deleteFromArrayOfRows"></custom-table>

        Description ->
            A table styled to match FarmOS. By using Vue to v-bind the values of the props the table can dynamically update to display relevant information.

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
                -Description: If true, adds a column to the right side of the table containing buttons that when clicked emits the event 'edit-clicked' and allows the user to edit the values in that row of the table. By default these will be text inputs. Clicking the edit button will cause that cell to change to a save button and all other buttons in the table to be disabled.
            can-delete:
                -Not Required
                -Structure: Boolean
                    can-delete *OR* can-delete=true
                -Default: false
                -Description: If true, adds a column to the right side of the table containing buttons that when clicked emits an event 'row-deleted' with the ID of the row as the payload.
            visible-columns:
                -Not Required
                -Structure: Array of Booleans
                    [true, true, false, true]
                -Default: *all elements are true*
                -Description: Determines which columns in the table are displayed on the page. Must be the same length as the headers array.
            input-options:
                -Not Required
                -Structure: Array of Strings (representing the five input types)
                    ['text', 'dropdown', 'date', 'number', 'no input']
                    *strings in this array MUST be one of these five options*
                -Default: *all elements are 'text'*
                -Description: Determines the type of input that appears in each row cell when the edit button is clicked.

        Emitted Events ->
            edit-clicked:
                -Emitted When: The edit button of a row is clicked
                -Payloads: none
            row-edited:
                -Emitted When: The save button of a row is clicked
                -Payloads:
                    jsonObject: An object containing the edited cell information, with the headers as the keys and the inputs as the values. Example: If a user changes the crop of a row to kale, the emitted object will be {crop: 'KALE'}, and if they also edited the area to Chuau it would be {crop: 'KALE', area: 'CHUAU'}
                    id: The id of the row that has been edited
            row-deleted:
                -Emitted When: The delete button of a row is clicked
                -Payloads:
                    id: The id of the row that has been deleted

    Dropdown With All:
        Example ->
            <dropdown-with-all :dropdown-list=fieldList includes-all default-input="All" @selection-changed="addSelectionToList"></dropdown-with-all>

        Description -> 
            A dropdown selection whose options can dynamically change based of the props.

        Props ->
            dropdown-list:
                -Required
                -Structure: Array
                    ['Peas', 'Potato', 'Corn']
                -Description: Each element in this array becomes an option in the dropdown.
            includes-all:
                -Not Required
                -Structure: Boolean
                    includes-all *OR* includes-all=true
                -Default: null
                -Description: Determines whether an "All" option is included in the dropdown.
            default-input:
                -Not Required  
                -Structure: String
                    "Lettuce"
                -Default: null
                -Description: If specified, the default input will be what is initially selected before the user makes a selection.

        Emitted Events ->
            selection-changed:
                -Emitted When: A new option has been selected
                -Payloads:
                    selectedOption: The value of the option that has been selected