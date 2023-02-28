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
 *  @vue-prop {Object} [message={"msg": "Hello, I am a banner alert.", "class": "alert alert-warning"}] - Contains the message and class for the alert banner
 *  @vue-prop {Boolean} [visible=null] - Set to true to show the alert banner. False makes the banner invisible.
 *  @vue-prop {Boolean} [timeout=null] - Sets whether or not the banner dismisses itself which disables the 'x' to close. Set to false by default.
 * </div>
 * 
 * <div>
 *  @vue-event visibility-update - Updates the visibility in the parent page when the child component has internal visibility updates. This means each page needs to implement a function that catches this emit and matches their visibility with the child's internal visibility. 
 * </div>
 * @module
 */ 
let BannerComponent = {
    template: 
        `<div data-cy='banner-handler' :class="bannerClass" 
            ref="banner" role="alert" 
            v-show="isVisible"
            :style="{ position: ['-webkit-sticky', 'sticky'], top: [topNav]}">
            <button data-cy='banner-close' type="button" class="close" 
            aria-label="Close" 
            @click="hideBanner" 
            v-show="timeout==false">
            <span aria-hidden="true">&times;</span>
            </button>
            <p data-cy='banner-message'>{{ bannerMsg }}</p>
        </div>`,
    props: {
        message: {
            type: Object,
            default: null
        },
        visible: {
            type: Boolean,
            default: null,
        },
        timeout: {
            type: Boolean, 
            default: false
        }
    },
    data() {
        return {
            bannerClass: this.message.class,
            bannerMsg: this.message.msg,
            isVisible: this.visible,
            timeoutBool: this.timeout, 
            topNav: '0px',
        }
    },
    watch: {
        message(newObj) {
            this.bannerClass = newObj.class
            this.bannerMsg = newObj.msg
            
        },
        visible(newbool) {         
            this.isVisible = newbool
            if(this.timeoutBool == true){
                setTimeout(() => { 
                    this.isVisible = false
                    this.$emit('visibility-update')
                }, 5000)     
            }
        },

        timeout(newBool){
            this.timeoutBool = newBool
        }
    },
    methods: {
        hideBanner() {
            this.isVisible = false
            this.$emit('visibility-update')
        },
    },
    mounted: 
        // try/catch block exists for Cypress component testing since those are 
        // isolated. Naturally there will be no navbar in those isolated tests. 
        function () {
            this.$nextTick(function () {
                try{
                    var pageHeader = document.getElementById('navbar')
                    var headerBounds = pageHeader.getBoundingClientRect()
                    this.topNav = String(headerBounds.height) + 'px'
                }
                catch(err){
                    this.topNav = '0px'
                }
            })
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