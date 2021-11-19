let ExportButtonComponent = {
    template: `<div>
                <button data-cy="download-btn" class="btn center-block btn-primary">
                    <a style= "text-decoration: none; color: white;"
                    :download="'tableDownload.csv'" :href="makeFile()">Download Tables</a>
                </button>
            </div>`,
    props:{
        headers: {
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
        },
        extraData: {
            type: Object,
            default: {},
        },
    },
    methods:{
        makeFile: function(){
            let downloadRows = []
            let visiableCols = this.isVisible
            for (i = 0 ; i < this.rows.length ; i ++){
                downloadRows[i] = ''
                for (j = 0; j < this.rows[i].data.length ; j++){
                    if (this.visibleColumns[j]){
                        let column = '"' +this.rows[i].data[j] + '"'
                        downloadRows[i] = downloadRows[i] + column + ','
                    }
                }

            }
            tableString = ''
            for (k = 0 ; k < this.headers.length ; k ++){
                if (visiableCols[k]){
                    tableString = tableString + this.headers[k] + ','
                }
            }

            downloadData = []
            console.log('do these work?')
            console.log(this.extraData)
            if(this.extraData != null){
                downloadData[i] = ''
                console.log('inside if statement')
                for(i=0; i<Object.keys(this.extraData).length; i++){
                    for(j=0; j<this.extraData.data.length; j++){
                        let column = '"' + this.extraData.data[j] + '"'
                        downloadData[j] = downloadData[j] + column + ','
                    }
                }
                console.log(downloadData)
            }
            
            tableString =
                tableString +
                '\n' +
                downloadRows.join('\n') +
                downloadData.join('\n');
            
            data = new Blob([tableString], {
                type: 'text/csv',
            })
            return window.URL.createObjectURL(data);
        },
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