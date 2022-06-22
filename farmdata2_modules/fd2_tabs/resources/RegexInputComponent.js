/**
 * A Vue component for input HTML elements that use Regex to validate user input
 * 
 * <p><b>data-cy attributes</b></p>
 * <table>
 * <thead><tr><th>Value</th>        <th>Descripion</th></tr></thead>
 * <tbody>
 * <tr><td>dropdown-component</td>  <td>div containing the label and select elements.</td></tr>
 * <tr><td>dropdown-input</td>      <td>The select element.</td></tr>
 * <tr><td>optioni</td>             <td>The ith option element, i=0,1,2...</td></tr>
 * </tbody>
 * </table>
 * 
 * @vue-prop {RegExp} [regExp] - The regular expression used to validate user inputs.
 * @vue-prop {String} [defaultVal] - Used to clear the page once a log has been submitted.
 * @vue-prop {String} [setType] - Defines the type of input box.
 * @vue-prop {String} [setColor] - Defines the background color of the input element.
 * @vue-prop {String} [setHeight] - Defines the height of the input element.
 * @vue-prop {String} [setWidth] - Defines the width of the input element.
 * @vue-prop {String} [setMin] - Defines the min of the input element.
 * @vue-prop {String} [setMax] - Defines the max of the input element.
 * @vue-prop {String} [setStep] - Defines the step increments of the input element.
 * @vue-prop {String} [setTitle] - Defines the title for a simple hover tip for the input element.
 * @vue-prop {Boolean} [isDisabled] - Makes the element read-only.
 * 
 * @vue-event {Boolean} is-enabled - Emits boolean (isMatch) for the parent page to make use of the results of the validation. 
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
            isMatch: false,
            isDisabled: this.disabled,

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
            console.log(inputVal);
            this.validateVal(inputVal)
            
        },

        // This click even handler points the event to the input box to address
        // an issue in FireFox where clicking on the increment/decrement buttons 
        // does not actually focus the input box.
        clickEventHandler: function (e) {
            e.target.focus()
        },

        validateVal(isValid){
          const re = new RegExp(this.regExp)
          this.isMatch = re.test(isValid)
          this.updateColor(this.isMatch)
          this.$emit('is-match-changed', this.isMatch)
        },

        updateColor(setNewColor){
          if(!setNewColor){
            this.inputStyle.backgroundColor = this.setColor
        }
        else{
            this.inputStyle.backgroundColor = 'white'
        }
        },

        updateVal(){
          this.$emit('input-changed', this.val)
          this.validateVal(this.val)
        }

      },
      watch: {
        defaultVal(newVal) {
          this.val = newVal
          this.updateVal()
        },
        disabled(newBool) {
          this.isDisabled = newBool;
      }
      }
    }

/*
* Export the RegexInputComponent object as a CommonJS component
* so that it can be required by the component test.
*/
try {
  module.exports = {
      RegexInputComponent: RegexInputComponent
  }
}
catch {}