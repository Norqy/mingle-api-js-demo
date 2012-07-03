$(document).ready(function() {
    function auth_token(user, password) {
      var token = user + ':' + password;
      var hash = $.base64.encode(token);
      return "Basic " + hash;
    }

    function log(message) {
        if (console && "function" === typeof console.log) {
            console.log(message);
        }
    }
    
    function toUrlParams(json) {
      var allProperties = new Array();
      if (json.description) {
        allProperties.push($.param({ 
                            card: { 
                                description: json.description
                              }
                          }));
      }
      allProperties.concat(json.properties.map(function(pair) { propertyUrlParamPair(pair[0], pair[1]); }));
      return allProperties.join('&');
    };
    
    function propertyUrlParamPair(name, value) {
      return $.param({
          card:
           {
            'properties[]': { name: name, value: value }
           }
        });
    };

    $("#mingle_instance").blur(function(e) {
      $('#link_to_self').attr('href', $('#mingle_instance').val() + '/mingle-api-js-demo/index.html');
    });

    $("#update_card_form").submit(function(e) {
        var url = $("#mingle_instance").val() + '/api/v2/projects/' + $("#project_identifier").val() + "/cards/" + $("#card_number").val() + ".xml";
        var desc = $("#description").val();

        var user = $("#api_username").val();
        var pass = $("#api_password").val();

        $("#result").text("");

        var postData = {
          description: desc,
          properties: [
              ['Status', 'New'],
              ['Size', '128']
           ]
        };

        $.ajax({
            url: url + "?" + toUrlParams(postData),
            // set this to XML if you want to manipulate XML - we use text just so we can display the contents
            dataType: 'text',
            type: 'PUT',
            beforeSend: function(xhr){
                xhr.setRequestHeader("Authorization", auth_token(user, pass));
            },
            success: function(data) {
                $("#error").text("");
                $("#result").text("Response: " + data);
                log('success!');
            },
            error: function(request, textStatus, errorThrown) {
                var message = "Error updating card: " + errorThrown;
                message += '<p>Note: ensure basic authentication is enabled (<a href="http://www.thoughtworks-studios.com/docs/mingle/current/help/configuring_mingle_authentication.html">instructions</a>)</p>';
                $("#error").html(message);
                log('Error!');
            }
        });

        log("Submitted form.");
        return false;
    });
});