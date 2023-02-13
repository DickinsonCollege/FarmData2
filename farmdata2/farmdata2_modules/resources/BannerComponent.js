/**
 * A Vue component for a message banner that is displayed when a specific event (success/error/etc.) occurs.
 * 
 * <h3 class="subsection-title">data-cy attributes</h3>
 * <table>
 * <thead><tr><th>Value</th>        <th>Description</th></tr></thead>
 * <tbody>
 * <tr><td>banner-handler</td>   <td>div containing bootstrap alert banner</td></tr>
 * <tr><td>banner-close</td>   <td>'X' button that closes the alert banner</td></tr>
 * <tr><td>banner-message</td>   <td>The message displayed inside the alert banner</td></tr>
 * </tbody>
 * </table>
 * 
 * <div>
 *  @vue-prop {Object} [updateBanner={"msg": "Hello, I am a banner alert.", "class": "alert alert-warning"}] - Contains the message and class for the alert banner
 *  @vue-prop {Boolean} [visible=null] - Set to true to show the alert banner. False makes the banner invisible.
 *  @vue-prop {Number} [timeout=null] - Set duration until banner disappears on its own. Set to null so that users have to click an 'X' to close alert banner.
 * </div>
 * 
 * <div>
 *  @vue-event visibility-update - Updates the visibility in the parent page when the child component has internal visibility updates. 
 * </div>
 * 
 * @module
 */ 
let BannerComponent = {
    template: 
        `<div data-cy='banner-handler' :class="bannerClass" 
            ref="banner" role="alert" v-show="isVisible"
            style="position: -webkit-sticky; position: sticky; top: 64px;">
            <button data-cy='banner-close' type="button" class="close" 
            aria-label="Close" @click="hideBanner" v-show="timeout==null">
            <span aria-hidden="true">&times;</span>
            </button>
            <p data-cy='banner-message'>{{ message }}</p>
        </div>`,
    props: {
        updateBanner:{
            type: Object,
            default: {"msg": "Hello, I am a banner alert.", "class": "alert alert-warning"}
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
            //     {'type': 'message', 'color': 'alert alert-info alert-dismissible'}, 
            // ],
            bannerClass: this.updateBanner.class,
            message: this.updateBanner.msg,
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
            this.isVisible = newbool
            if(this.duration != null){
                setTimeout(() => { 
                    this.isVisible = false
                    this.$emit('visibility-update')
                }, this.duration)     
            }
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