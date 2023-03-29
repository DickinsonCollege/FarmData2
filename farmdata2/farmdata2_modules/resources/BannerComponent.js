/**
 * A Vue component that augments the Bootstrap CSS class for the alert banner to generate dynamic success/error/message banner for pages.
 * 
 *  <h3 class="subsection-title">data-cy attributes</h3>
 *  <table>
 *  <thead><tr><th>Value</th>        <th>Description</th></tr></thead>
 *  <tbody>
 *  <tr><td>banner-handler</td>   <td>div containing bootstrap alert banner</td></tr>
 *  <tr><td>banner-close</td>   <td>The button element that contains the 'X' symbol that must be clicked to close the alert banner</td></tr>
 *  <tr><td>banner-message</td>   <td>The paragraph element that contains the message displayed inside the alert banner</td></tr>
 *  </tbody>
 *  </table>
 * 
 *  <div>
 *  @vue-prop {Object} message - Contains the message and class for the alert banner
 *  @vue-prop {Boolean} visible - Set to true to show the alert banner. False makes the banner invisible.
 *  @vue-prop {Boolean} timeout - Sets whether or not the banner dismisses itself which disables the 'x' to close. Set to false by default. Currently set to self-dismiss after 5 seconds.
 *  </div>
 *  
 *  <div>
 *  @vue-event banner-hidden - Indicates to the parent page that the visibility in the child component has 
 *  been set to 'false' and the parent page needs to update its own variable for banner visibility. This means 
 *  each page needs to implement a function that catches this emit and matches their visibility with the child's internal visibility. 
 *  </div>
 *  
 *  
 *  @example <caption>Handling Banner Visibility in Parent Page</caption>
 *  // A Banner component element tag may look like this:
 *  
 *    <banner data-cy="alert-banner" 
 *    :message="bannerObj" 
 *    :visible="bannerVisibility" 
 *    :timeout="timeoutSet" 
    \@banner-hidden="resetBannerVisibility"></banner> 
 *  
 *  // where 'hideBanner' is the name of your method in the parent page.
 *  // the method in the parent page should look like the following:
 *  function hideBanner(){
 *      // 'bannerVisibility' would be the Vue data in charge of determining the banner's visibility in the parent page 
 *      this.bannerVisibility = false 
 *  }
 * 
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
            required: true,
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
            if(this.timeoutBool == true && this.isVisible){
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
 * so that it can be required by the component test.
 */
try {
    module.exports = {
        BannerComponent
    }
}
catch {}
