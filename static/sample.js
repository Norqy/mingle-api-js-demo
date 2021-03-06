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
        var name = $(div).children('input.name').val();
        var value = $(div).children('input.value').val();
        if (name && value) {
          params.push("card[properties][][name]=" + name);
          params.push("card[properties][][value]="+ value);
        }
      });
      return params.join("&");
    }

    function setSelfUrl() {
      $('#link_to_self').attr('href', $('#mingle_instance').val() + '/mingle-api-js-demo/index.html');
    }

    setSelfUrl();
    $("#mingle_instance").blur(setSelfUrl);

    $("#update_card_form").submit(function() {
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
                $("#result").text("Response:\n" + data);
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