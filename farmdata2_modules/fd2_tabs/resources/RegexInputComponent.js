
let RegexInputComponent = {
  template: 
      `<span>
      <input v-model='val' :style='inputStyle' :type='defineType' @blur='blurEventHandler($event)'>
       </span>`, 

       props: {
          regExp: {
            type: RegExp,
            default: null
          },

          match:{
            type: Boolean,
            default: null
          },

          defineType: {
            type: String,
            default: 'text'
          },

          defineBColor: {
            type: String,
            default: null
          },

          defineHeight: {
            type: String,
            default: '25px'
          },

          defineWidth: {
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
            selectType : this.defineType,

            inputStyle: {
              backgroundColor: this.defineBColor,
              height: this.defineHeight,
              width: this.defineWidth,
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
          const validation = re.test(this.check)
          console.log("This is the result of the validation: " + validation)
        },
      },
      watch: {
          
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