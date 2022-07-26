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