$(function () {

    $('#contact-form').validator();

    $('#contact-form').on('submit', function (e) {

        if (!e.isDefaultPrevented()) {
            var url = "contact.php";

            // POST values in the background the the script URL
            $.ajax({
                type: "POST",
                url: url,
                data: $(this).serialize(),
                success: function (data)
                {
                    var messageAlert = 'alert-' + data.type;
                    var messageText = data.message;

                    // let's compose Bootstrap alert box HTML
                    var alertBox = '<div class="alert ' + messageAlert + ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';

                    if (messageAlert && messageText) {
                        $('#contact-form').find('.messages').html(alertBox);            
                        $('#contact-form')[0].reset(); // empty the form
                    }
                }
            });
            return false;
        }
    })
});