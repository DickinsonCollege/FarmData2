let ExportButtonComponent = {
    template: `<div>
                <button data-cy="download-btn" class="btn center-block btn-primary">
                    <a style= "text-decoration: none; color: white;"
                    :download="'tableDownload.csv'" :href="makeFile()">Download Tables</a>
                </button>
            </div>`,
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