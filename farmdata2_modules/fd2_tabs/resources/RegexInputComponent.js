let RegexInputComponent = {
    template: 
        `<span>
        <input @input="updateValue($event.target.value)"
        @change="emitChange"
        v-model="val" style='height: 25px; width: 4em;' type='number'>
         </span>`, 

         props: {
          value: {
              required: true,
              type: [Number, String]
          },
          // Using for: String.prototype.replace(regexp, replacement)
          regExp: {
              type: RegExp,
              default: null
          },
          // Using for: String.prototype.replace(regexp, replacement)
          replacement: {
              type: String,
              default: ''
          }
      },
      data() {
          return {
              val: ''
          };
      },
      methods: {
          // format the value of input
          formatValue(val) {
              const formattedValue = val.toString().replace(this.regExp, this.replacement);

              return formattedValue;
          },

          // update the value of input
          updateValue(val) {
              const formattedValue = this.formatValue(val);

              this.val = formattedValue;
              this.emitInput(formattedValue);
          },

          // emit input event
          emitInput(val) {
              this.$emit('input', val);
          },

          // emit change event
          emitChange() {
              this.$emit('change', this.val);
          }
      },
      watch: {
          // watch value prop
          value(val) {
              if (val !== this.val) {
                  this.updateValue(val)
              }
          }
      }
  }
        


/*
 * Export the RegexInputComponent object as a CommonJS component
 * so that it can be required bythe component test.
 */
try {
    module.exports = {
        RegexInputComponent: RegexInputComponent
    }
}
catch {}