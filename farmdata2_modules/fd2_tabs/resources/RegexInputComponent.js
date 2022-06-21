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
 * @vue-prop {RegExp} [regExp] - The regular expression that will be used to valid user input.
 * @vue-prop {String} [defaultType] - Defines the HTML input type. Set to 'text' by default.
 * @vue-prop {String} [defaultColor] - Defines the background color of the input element.
 * @vue-prop {String} [defaultHeight] - Defines the height of the input element.
 * @vue-prop {String} [defaultWidth] - Defines the width of the input element.
 * @vue-prop {String} [defaultVal] - Defines the value inside the input element. Set to null by default.
 * 
 * @vue-event {Boolean} update-color - Emits the Boolean of the last input and updates the background color depending on whether a valid or invalid was computed. 
 */ 
let RegexInputComponent = {
  template: 
      `<span>
      <input v-model='val' :style='inputStyle' :type='defaultType' @blur='blurEventHandler($event)'>
       </span>`, 

       props: {
          regExp: {
            type: RegExp,
            default: null
          },

          defaultType: {
            type: String,
            default: 'text'
          },

          defaultColor: {
            type: String,
            default: null
          },

          defaultHeight: {
            type: String,
            default: '25px'
          },

          defaultWidth: {
            type: String,
            default: '4em'
          },

          defaultVal: {
            type: String,
          }
        },
        data () {
          return {
            val: this.defaultVal,
            selectType : this.defaultType,
            match: false,

            inputStyle: {
              backgroundColor: this.defaultColor,
              height: this.defaultHeight,
              width: this.defaultWidth,
            },
          }
        },
        methods: {
          // Handles validation of the input value
          blurEventHandler: function (e) {
            const name = e.target.value;
            console.log(name);
            this.validateVal(name)
            
        },

        validateVal(check){
          const re = new RegExp(this.regExp)
          console.log(this.regExp + " this is the re var: " + re)
          console.log("We are checking the Regex: " + this.regExp + ", against this value: " + check)
          this.match = re.test(check)
          console.log("This is the result of the validation: " + this.match)
          this.updateColor(this.match)
        },

        updateColor(valid){
          console.log('HEY! HELLO! LISTEN!')
          this.$emit('update-color', valid)
        }


      },
      watch: {
        defaultVal(newVal) {
          this.val = newVal
        },
        defaultColor(newColor) {
          var s = new Option().style;
          s.color = newColor;
          this.default = newColor;
          this.inputStyle.backgroundColor = newColor;
        
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