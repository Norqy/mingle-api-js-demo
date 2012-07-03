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

    $("#update_card_form").submit(function(e) {
        var url = $("#api_url").val();
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
                $("#result").text(data);
                log('success!');
            },
            error: function(request, textStatus, errorThrown) {
                var message = "Error updating card: " + textStatus + ", " + errorThrown;
                $("#result").text(message);
                log('Error!');
            }
        });

        log("Submitted form.");
        return false;
    });
});