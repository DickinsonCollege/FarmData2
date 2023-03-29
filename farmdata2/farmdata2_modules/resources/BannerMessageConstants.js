/**
 * Map of common banner messages used in the BannerComponent.
 * // ui { contains banner messages for the ui page. }
 */
var bannerMessageMap = {
    ui: {
        error: {"msg": "Error! This is what an error banner looks like.", "class": "alert alert-danger alert-dismissible"},
        success: {"msg": "Success! This is what a success banner looks like.", "class": "alert alert-success alert-dismissible"}, 
        msg: {"msg": "Message! This is what a message banner looks like.", "class": "alert alert-info alert-dismissible"},
    }
}

try {
    module.exports = {
        bannerMessageMap
    }
}
catch {}