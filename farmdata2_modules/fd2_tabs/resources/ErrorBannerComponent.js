let ErrorBannerComponent = {
    template: 
    `<span>
        <div data-cy='alert-err-handler' class="alert alert-danger" style="display: none;" role="alert" v-show="errBanner == true" @click="hideBanner">
            <p v-model="errMessage"></p>
        </div>
    </span>`,
    props: {
        default: {

        }
    },
    data() {
        return {

        }
    },
    watch: {

    }
}
/*
 * Export the ErrorBannerComponent object as a CommonJS component
 * so that it can be required bythe component test.
 */
try {
    module.exports = {
        ErrorBannerComponent: ErrorBannerComponent
    }
}
catch {}