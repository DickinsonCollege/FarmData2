// Declaring regular expression variables so that is
// defined in all the pages served from out modules.


/**
 * Map of common banner messages used in the BannerComponent for displaying messages
 * 
 * <p><b>Banner Message Variables</b></p>
 * <table>
 * <thead><tr><th>Variable Name</th>   <th>Banner Message</th>     <th>Descripion</th></tr></thead>
 * <tbody>
 * <tr><td>standardErr</td> <td>Error Processing Request. This may be an intermittent network issue. Please try again later.</td> <td>Displayed when an error occurs.</td></tr>
 * </tbody>
 * </table>
 */
var bannerMessageMap = {
    standardErr: "Error Processing Request. This may be an intermittent network issue. Please try again later."
}

try {
    module.exports = {
        regexMap,
        bannerMessageMap
    }
}
catch {}