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
                    jsonObject: An object containing the edited cell information, with the headers as the keys and the inputs as the values. Example: If a user changes the crop of a row to kale, the emitted object will be {crop: 'KALE'}, and if they also edited the area to be Chuau it would be {crop: 'KALE', area: 'CHUAU'}
                    id: The id of the row that has been edited
            row-deleted:
                -Emitted When: The delete button of a row is clicked
                -Payloads:
                    id: The id of the row that has been deleted
    DateSelection:
        Example -> 
            <date-selection default-date="2021-06-08" earliest-date="2021-06-03" latest-date="2021-06-15" @date-changed='dateChange'></date-selection>

        Discription ->
            Displays a date input on the page, that allows a user to select a date. Has a slot before the date input to put in a discription of the date input.
        
        Props -> 
            default-date:
                -Required
                -Structure: A string of numbers in date format YYYY-MM-DD 
                    '2021-07-22'
                -Discription: This is the date that will appear on the page in the input when it first loads
            earliest-date: 
                -Not Required
                -Structure: A string of numbers in date format YYYY-MM-DD
                    '2000-05-29'
                -Discription: This is the earlist date that the date input will allow the user to choose
            latest-date:
                -Not Required
                -Structure: A string of numbers in date format YYYY-MM-DD
                    '2053-01-30'
                -Discription: This is the lastiest date that the date input will allow the user to choose

        Emitted Events ->
            date-changed:
                -Emitted When: The date input is focused out on by the user
                -Payloads:
                    this.selectedDate: is a string in the format of a date (YYYY-MM-DD). EX: '2021-11-07'