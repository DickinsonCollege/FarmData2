let ExportButtonComponent = {
    template: '',
    Props:{
        headers:{
            type: Array,
            required: true,
        },
        rows: {
            type: Array,
            required: true,
        },
        visibleColumns: {
            type: Array,
            default: null,
        }
    },
}