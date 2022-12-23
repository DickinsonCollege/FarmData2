/**
 * A Vue component for input HTML elements that use Regex to validate user input <br>
 * See the regexMap object for commonly used regular expressions.
 * 
 * <h3 class="subsection-title">data-cy attributes</h3>
 * <table>
 * <thead><tr><th>Value</th>    <th>Description</th></tr></thead>
 * <tbody>
 * <tr><td>regex-input</td>     <td>span containing input element.</td></tr>
 * <tr><td>text-input</td>      <td>The input element.</td></tr>
 * </tbody>
 * </table>
 * 
 * <div>
 * @vue-prop {RegExp} [regExp] - The regular expression used to validate user inputs.
 * @vue-prop {String} [defaultVal] - Used to clear the page once a log has been submitted.
 * @vue-prop {String} [setType] - Defines the type of input box.
 * @vue-prop {String} [setColor] - Defines the background color of the input element.
 * @vue-prop {String} [setHeight] - Defines the height of the input element.
 * @vue-prop {String} [setWidth] - Defines the width of the input element.
 * @vue-prop {String} [setMin] - Defines the min of the input element. Prop is ignored if the input type does not support those attributes.
 * @vue-prop {String} [setMax] - Defines the max of the input element. Prop is ignored if the input type does not support those attributes.
 * @vue-prop {String} [setStep] - Defines the step increments of the input element. Prop is ignored if the input type does not support those attributes.
 * @vue-prop {String} [setTitle] - Defines the title for a simple hover tip for the input element.
 * @vue-prop {Boolean} [isDisabled] - Makes the element read-only.
 * </div>
 * 
 * <div>
 * @vue-event {Boolean} match-changed - Emits boolean (isMatch) for the parent page to make use of the results of the validation. 
 * @vue-event {String} input-changed - Emits String (val) for the parent page to make use of the value stored within the input element. 
 * </div>
 * 
 * @module
 */ 
let RegexInputComponent = {
  template: 
      `<span data-cy='regex-input'>
      <input data-cy='text-input' v-model='val' :style='inputStyle' :min='setMin' :max='setMax' :step='setStep' 
      :title='setTitle' :disabled="isDisabled" :type='setType' @click="clickEventHandler($event)" @blur="blurEventHandler($event)">
      </span>`, 

      props: {
          regExp: {
            type: RegExp,
            default: null
          },
          defaultVal: {
            type: String,
          },
          setType: {
            type: String,
            default: 'text'
          },
          setColor: {
            type: String,
            default: "pink"
          },
          setHeight: {
            type: String,
            default: '25px'
          },
          setWidth: {
            type: String,
            default: '4em'
          },
          setMin: {
            type: Number,
            default: null
          },
          setMax: {
            type: Number,
            default: null
          },
          setStep: {
            type: Number,
            default: null
          },
          setTitle: {
            type: String,
            default: null
          },
          disabled: {
            type: Boolean,
            default: false
          },
        },
        data () {
          return {
            val: this.defaultVal,
            InputType : this.setType,
            isMatch: null,  // default null to evaluate initial inputted value
            isDisabled: this.disabled,
            regex: this.regExp,
            inputStyle: {
              backgroundColor: "white",
              height: this.setHeight,
              width: this.setWidth,
            },
          }
        },
        methods: {
          // Handles validation of the input value
          blurEventHandler: function (e) {
            const inputVal = e.target.value;
            this.validateVal(inputVal) 
        },

          // This click even handler points the event to the input box to address
          // an issue in FireFox where clicking on the increment/decrement buttons 
          // does not actually focus the input box.
          clickEventHandler: function (e) {
              e.target.focus()
          },

          validateVal(inputVal){
            const re = new RegExp(this.regex)
            const temp = this.isMatch
            this.isMatch = re.test(inputVal)
            this.updateColor(this.isMatch)
            if(this.isMatch != temp){
              this.$emit('match-changed', this.isMatch)
            }
              this.$emit('input-changed', inputVal)
          },

          updateColor(matches){
            if(!matches){
              this.inputStyle.backgroundColor = this.setColor
          }
          else{
              this.inputStyle.backgroundColor = 'white'
          }
        },

      },
      
      watch: {
        defaultVal(newVal) {
          this.val = newVal
          if(this.val == null){
            this.isMatch = false
            this.inputStyle.backgroundColor = 'white'
            this.$emit('match-changed', this.isMatch)
            this.$emit('input-changed', this.val)
          }
          else{
            this.validateVal(this.val)
          }
          
        },
        disabled(newBool) {
          this.isDisabled = newBool;
        },
        regExp(newReg) {
          this.regex = newReg;
          this.validateVal(this.val)
        }
      }
    }

/*
* Export the RegexInputComponent object as a CommonJS component
* so that it can be required by the component test.
*/
try {
  module.exports = {
      RegexInputComponent
  }
}
catch {}