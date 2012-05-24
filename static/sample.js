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

    $("#update_card_form").submit(function(e) {
        var url = $("#api_url").val();
        var desc = $("#description").val();
        var user = $("#api_username").val();
        var pass = $("#api_password").val();

        $("#result").text("");

        $.ajax({
            url: url,
            // set this to XML if you want to manipulate XML - we use text just so we can display the contents
            dataType: 'text',
            data: {
                card: {
                    description: desc
                }
            },
            type: 'PUT',
            beforeSend: function(xhr){
                xhr.setRequestHeader("Authorization", auth_token(user, pass));
            },
            success: function(data) {
                $("#result").text(data);
                log('success!');
            },
            error: function(data) {
                var message = "Error updating card with: \n  url: " + url + "\n  user: " + user + "\n  pass: " + pass;
                $("#result").text(message);
                log('Error!');
            }
        });

        log("Submitted form.");
        return false;
    })
});