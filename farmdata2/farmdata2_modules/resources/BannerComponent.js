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
        `<div data-cy='banner-handler' :class="bannerClass" 
            ref="banner" role="alert" v-show="isVisible"
            style="position: -webkit-sticky; position: sticky; top: 64px;">
            <button type="button" class="close" 
            aria-label="Close" @click="hideBanner" v-show="timeout==null">
            <span aria-hidden="true">&times;</span>
            </button>
            <p data-cy='banner-message'>{{ message }}</p>
        </div>`,
    props: {
        updateBanner:{
            type: Object,
            default: null
        },
        visible: {
            type: Boolean,
            default: null,
        },
        timeout: {
            type: Number, 
            default: null
        }
    },
    data() {
        return {
            // color: [
            //     {'type': 'error', 'color': 'alert alert-danger alert-dismissible'},
            //     {'type': 'success', 'color': 'alert alert-success alert-dismissible'},
            //     {'type': 'message', 'color': 'alert alert-primary alert-dismissible'}, 
            // ],
            bannerClass: 'alert alert-warning',
            message: 'Hello, I am a banner alert.',
            isVisible: this.visible,
            duration: this.timeout, 
        }
    },
    watch: {
        updateBanner(newObj) {
            this.bannerClass = newObj.class
            this.message = newObj.msg
            
        },
        visible(newbool) {         
            this.isVisible = newbool;
            // this.$nextTick(function () { // this allows the DOM to be updated so that the page only scrolls after this component is rendered
            //     this.ScrollToBanner()
            // })
        },

        timeout(newDuration){
            this.duration = newDuration
        }

        // bannerMessage(newString) {
        //     console.log("Message updated!")
        //     this.message = newString;
        // },
    },
    methods: {
        hideBanner() {
            if(this.duration == null){
                this.isVisible = false
                this.$emit('visibility-update')
            }
        },
        // ScrollToBanner() {
        //     var errorBanner = this.$refs.banner;
        //     var pageHeader = document.getElementById('navbar')
        //     var headerBounds = pageHeader.getBoundingClientRect()
        //     var alertBounds = errorBanner.getBoundingClientRect()
        //     scrollBy({
        //         top: alertBounds.top - headerBounds.bottom,
        //         behavior: 'smooth'
        //     })

        //     if(this.duration != null){
        //         setTimeout(() => { 
        //             this.isVisible = false
        //             this.$emit('visibility-update')
        //         }, this.duration) 
                
        //     }
        // },
    },

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