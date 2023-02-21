// Declaring regular expression variables so that is
// defined in all the pages served from out modules.


/**
 * Map of common banner messages used in the BannerComponent for displaying messages
 * 
 * <p><b>Banner Message Variables</b></p>
 * <table>
 * <thead><tr><th>Variable Name</th>   <th>Banner Message</th>     <th>Descripion</th></tr></thead>
 * <tbody>
 * <tr><td>uiError</td> <td>Error! This is what an error banner looks like.</td> <td>Displayed when an error in the UI page occurs.</td></tr>
 * <tr><td>uiSuccess</td> <td>Success! This is what a success banner looks like.</td> <td>Displayed when a success event in the UI page occurs.</td></tr>
 * <tr><td>uiMsg</td> <td>Message! This is what a message banner looks like.</td> <td>Displayed when when a message event in the UI page occurs.</td></tr>
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