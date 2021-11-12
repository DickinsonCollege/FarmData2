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
    computed:{
        isVisible() {
            let updatedVis = []
            if (this.visibleColumns == null) {
                for (i = 0; i < this.headers.length; i++) {
                    updatedVis.push(true);
                }
            }
            else {
                updatedVis = this.visibleColumns
            }
            return updatedVis;
        },
    },
}