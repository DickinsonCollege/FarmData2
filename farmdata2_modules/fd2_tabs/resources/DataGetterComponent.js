let DataGetterComponent = {
    template: `<table style="width:100%" class="table table-bordered table-striped">
        <thead>
            <tr></tr>
        </thead>
        <tbody>
            <tr v-for="row in rows">
                <td v-for="row in rows">{{ row }}</td>
            </tr>
        </tbody>
    </table>`,
    data() {
        return {
            rows: [1, 2, 3, 4, 5],
        };
    },
    convert() {
            this.$emit('sentData', this.rows.join(',').toString());
        },
    created (){
        EventBus.$on('giveString', this.convert)

    }
    
}
try {
    module.exports = {
        DataGetterComponent: DataGetterComponent
    }
}
catch {}


