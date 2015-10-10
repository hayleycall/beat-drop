//code from https://github.com/watsonbox/exportify
window.Helpers = {
  authorize: function() {
    var client_id = this.getQueryParam('app_client_id');

    // Use Exportify application client_id if none given
    if (client_id == '') {
      client_id = "6f0c759f1b0c40a587c6dafdd63a295b"
    }

    window.location = "https://accounts.spotify.com/authorize" +
      "?client_id=" + client_id +
      "&redirect_uri=" + encodeURIComponent([location.protocol, '//', location.host, location.pathname].join('')) +
      "&scope=playlist-read-private%20playlist-read-collaborative" +
      "&response_type=token";
  },

  // http://stackoverflow.com/a/901144/4167042
  getQueryParam: function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  },

  apiCall: function(url, access_token) {
    return $.ajax({
      url: url,
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    }).fail(function (jqXHR, textStatus) {
      if (jqXHR.status == 401) {
        // Return to home page after auth token expiry
        window.location = window.location.href.split('#')[0]
      } else if (jqXHR.status == 429) {
        // API Rate-limiting encountered
        window.location = window.location.href.split('#')[0] + '?rate_limit_message=true'
      } else {
        // Otherwise report the error so user can raise an issue
        alert(jqXHR.responseText);
      }
    })
  }
}
 