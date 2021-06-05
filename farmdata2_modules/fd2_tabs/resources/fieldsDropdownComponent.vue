<template>
    <div id='fieldsDropDown'>
        <label for='field-select'>Field: </label>
        <select data-cy="field-select" id='field-select' @change='fieldChanged' v-model='selectedField'>
             <option v-for='field in fieldsList'>{{field}}</option>
        </select>
    </div>
</template>

<script>
export default {
    name: 'fieldsDropdownComponent',
    props: {
        fieldsList: {
            required: false,
            default: function() { return [ 'None' ] },
        },
    },
    data() {
        return {
            selectedField: null,
        }
    },
    methods: {
        fieldChanged: function() {
            this.$emit('field-changed', this.selectedField)
        },
    },
}
</script>
