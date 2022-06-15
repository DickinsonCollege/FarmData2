let RegexInputComponent = {
    template: 
        `<span>
        <input style='height: 25px; width: 4em;' type='number'>
         </span>`, 

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