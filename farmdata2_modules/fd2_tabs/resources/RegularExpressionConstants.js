// Declaring regulart expression variables so that is
// defined in all the pages served from out modules.


/**
 * Map of common regular expression variables used in RegexInputComponent
 * to validate string input.
 * 
 * <p><b>Regular Expresssion Variables</b></p>
 * <table>
 * <thead><tr><th>Variable Name</th>   <th>Regular Expression String</th>     <th>Descripion</th></tr></thead>
 * <tbody>
 * <tr><td>regPosInt</td> <td>^[1-9]+[0-9]*$</td> <td>Positive integer excluding 0.</td></tr>
 * <tr><td>regPosFloatTwoDigit</td> <td>^[1-9]+[0-9]*([.][0-9]{1,2}){0,1}$|^[0]{0,1}[.][1-9][0-9]{0,1}$|^[0]{0,1}[1-9]$|^[1-9]+[0-9]*\.$</td> <td>Positive floating-point number (excluding 0) expressed to 2 digit precision.</td></tr>
 * </tbody>
 * </table>
 */
var regexMap = {
    regPosInt: "^[1-9]+[0-9]*$",
    regPosFloatTwoDigit: "^[1-9]+[0-9]*([.][0-9]{1,2}){0,1}$|^[0]{0,1}[.][1-9][0-9]{0,1}$|^[0]{0,1}[1-9]$|^[1-9]+[0-9]*\.$"
}

try {
    module.exports = {
        regexMap: regexMap
    }
}
catch {}