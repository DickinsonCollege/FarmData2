/**
 * A Vue component for a message banner that is displayed when a specific event (success/error/etc.) occurs.
 * 
 * <h3 class="subsection-title">data-cy attributes</h3>
 * <table>
 * <thead><tr><th>Value</th>        <th>Description</th></tr></thead>
 * <tbody>
 * <tr><td>banner-handler</td>   <td>div containing bootstrap alert banner</td></tr>
 * <tr><td>banner-message</td>   <td>The message displayed inside the alert banner</td></tr>
 * </tbody>
 * </table>
 * 
 * <div>
 *  @vue-prop {String} [bannerType=null] - sets the type of banner to be displayed (success, error, etc.)
 * @vue-prop {String} [errMessage="Error Processing Request. This may be an intermittent network issue. Please try again later."] - The message to display in the alert banner.
 * @vue-prop {Boolean} [visible=false] - Set to true to show the alert banner. 
 * </div>
 * 
 * @module
 */ 
let BannerComponent = {
    template: 
        `<div data-cy='banner-handler' :class="currentBanner" 
            ref="banner" role="alert" v-show="isVisible" @click="hideBanner"
            >
            <p data-cy='banner-message'>{{ message }}</p>
        </div>`,
    props: {
        bannerType: {
            type: String,
            default: 'alert alert-danger'
        },
        bannerMessage: {
            type: String,
            default: "Error Processing Request. This may be an intermittent network issue. Please try again later."
        },
        visible: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            color: [
                {'type': 'error', 'color': 'alert alert-danger'},
                {'type': 'success', 'color': 'alert alert-success'},
                {'type': 'message', 'color': 'alert alert-primary'}, 
            ],
            currentBanner: this.bannerType,
            message: this.bannerMessage,
            isVisible: this.visible,
        }
    },
    watch: {
        visible(newbool) {
            this.isVisible = newbool;
            this.$nextTick(function () { // this allows the DOM to be updated so that the page only scrolls after this component is rendered
                this.ScrollToBanner()
            })
        },
        bannerMessage(newString) {
            this.message = newString;
        },
        bannerType(newType){
            console.log("Hi! I can see when this changes!")
            for(let i = 0; i < this.color.length; i++){
                if(this.color[i].type == newType){
                    console.log("Hi!")
                    this.currentBanner = this.color[i].color
                }
            }
        }
    },
    methods: {
        hideBanner() {
            this.isVisible = false
            this.$emit('banner-clicked')
        },
        ScrollToBanner() {
            var errorBanner = this.$refs.banner;
            var pageHeader = document.getElementById('navbar')
            var headerBounds = pageHeader.getBoundingClientRect()
            var alertBounds = errorBanner.getBoundingClientRect()
            scrollBy({
                top: alertBounds.top - headerBounds.bottom,
                behavior: 'smooth'
            })
        },
        updateBannerType(newType){
            for(let i = 0; i < this.color.length; i++){
                if(this.color[i].type == newType){
                    console.log("Hi!")
                    this.currentBanner = this.color[i].color
                }
            }
        }
    }
}
/*
 * Export the ErrorBannerComponent object as a CommonJS component
 * so that it can be required bythe component test.
 */
try {
    module.exports = {
        BannerComponent
    }
}
catch {}