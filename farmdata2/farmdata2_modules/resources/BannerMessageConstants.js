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
    uiError: {"msg": "Error! This is what an error banner looks like.", "class": "alert alert-danger alert-dismissible"},
    uiSuccess:{"msg": "Success! This is what a success banner looks like.", "class": "alert alert-success alert-dismissible"}, 
    uiMsg: {"msg": "Message! This is what a message banner looks like.", "class": "alert alert-info alert-dismissible"},
}

try {
    module.exports = {
        bannerMessageMap
    }
}
catch {}