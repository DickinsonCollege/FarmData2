/**
 * A Vue component for a error banner that is displayed when an error occurs.
 * 
 * <p><b>data-cy attributes</b></p>
 * <table>
 * <thead><tr><th>Value</th>        <th>Descripion</th></tr></thead>
 * <tbody>
 * <tr><td>alert-err-handler</td>   <td>div containing bootstrap alert banner</td></tr>
 * <tr><td>alert-err-message</td>   <td>The message displayed inside the alert banner</td></tr>
 * </tbody>
 * </table>
 * 
 * @vue-prop {String} [errMessage] - The message to display in the alert banner. Required. 
 * @vue-prop {Boolean} [visible=false] - true to show the alert banner. False by default. 
 */ 
let ErrorBannerComponent = {
    template: 
        `<div data-cy='alert-err-handler' class="alert alert-danger" id="banner" role="alert" v-show="isVisible" @click="hideBanner">
            <p data-cy='alert-err-message'>{{ message }}</p>
        </div>`,
    props: {
        errMessage: {
            type: String,
            required: true,
        },
        visible: {
            type: Boolean,
            required: true,
            default: false,
        }
    },
    data() {
        return {
            message: this.errMessage,
            isVisible: this.visible,
        }
    },
    watch: {
        visible(newbool) {
            this.isVisible = newbool;
            this.ScrollToBanner()
        },
        errMessage(newString) {
            this.message = newString;
        }
    },
    methods: {
        hideBanner() {
            this.isVisible = false
        },
        ScrollToBanner() {
            var errorBanner = document.getElementById('banner')
            var pageHeader = document.getElementById('navbar')
            var headerBounds = pageHeader.getBoundingClientRect()
            var alertBounds = errorBanner.getBoundingClientRect()
            scrollBy({
                top: alertBounds.top - headerBounds.bottom,
                behavior: 'smooth'
            })
        }
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