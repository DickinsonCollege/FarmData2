// Declaring regulart expression variables so that is
// defined in all the pages served from out modules.

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