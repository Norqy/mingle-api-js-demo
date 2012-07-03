$(document).ready(function() {
  
    $('#mingle_response').hide();
  
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
    
    function urlParams() {
      var params = [];
      if ($("#description").val()) {
        params.push("card[description]=" + $("#description").val());
      }
      $('.prop_names_and_values .pair').each(function(index, div) { 
        params.push("card[properties][][name]=" + $(div).children('input.name').val());
        params.push("card[properties][][value]="+ $(div).children('input.value').val());
      });
      return params.join("&");
    };
    
    $("#mingle_instance").blur(function(e) {
      $('#link_to_self').attr('href', $('#mingle_instance').val() + '/mingle-api-js-demo/index.html');
    });

    $("#update_card_form").submit(function(e) {
        var url = $("#mingle_instance").val() + '/api/v2/projects/' + $("#project_identifier").val() + "/cards/" + $("#card_number").val() + ".xml";
        var user = $("#api_username").val();
        var pass = $("#api_password").val();

        $("#result").text("");

        $.ajax({
            url: url + "?" + urlParams(),
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
                $('#mingle_response').show();
            },
            error: function(request, textStatus, errorThrown) {
                var message = "Error updating card: " + errorThrown;
                message += '<p>Note: ensure basic authentication is enabled (<a href="http://www.thoughtworks-studios.com/docs/mingle/current/help/configuring_mingle_authentication.html">instructions</a>)</p>';
                $("#error").html(message);
                log('Error!');
                $('#mingle_response').show();
            }
        });

        log("Submitted form.");
        return false;
    });
});