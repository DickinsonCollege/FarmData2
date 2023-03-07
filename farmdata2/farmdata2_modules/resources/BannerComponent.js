/**
 * A Vue component that augments the Bootstrap CSS class for the alert banner to generate dynamic success/error/message banner for pages.
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
 *  @vue-prop {Boolean} [timeout=false] - Sets whether or not the banner dismisses itself which disables the 'x' to close. Set to false by default. Currently set to self-dismiss after 5 seconds.
 * </div>
 * 
 * <div>
 *  @vue-event banner-hiddem - Updates the visibility in the parent page when the child component has internal visibility updates. This means each page needs to implement a function that catches this emit and matches their visibility with the child's internal visibility. 
 *  @example <caption>Handling Banner Visibility in Parent Page</caption>
 *  For the parent page make sure to add the @banner-hidden="hideBanner" where 'hideBanner' is the name of your method in the parent page's BannerComponent tag.
 *  The parent page's method should look like the following: 
 *  hideBanner(){
 *      // 'bannerVisibility' would be the Vue data in charge of determining the banner's visibility in the parent page 
 *      this.bannerVisibility = false 
 *  }
 * 
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
                    this.$emit('banner-hidden')
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
            this.$emit('banner-hidden')
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