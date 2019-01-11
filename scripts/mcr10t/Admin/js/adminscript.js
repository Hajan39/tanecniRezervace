$(document).ready(function() {
  $("body").addClass("js");

  SendLogin();
  // Check if JavaScript is enabled

  $("#paidBody > tr > td > input").on("click", function() {
    var email = $(this)
      .parent()
      .parent()
      .find(".email")
      .html();
    var vars = $(this)
      .parent()
      .parent()
      .find(".vars")
      .html();
    if ($(this).hasClass("w3-amber")) {
      SendReminder(email);
    } else if ($(this).hasClass("w3-green")) {
      SendConfirmation(email, vars);
    } else if ($(this).hasClass("w3-red")) {
      swal({
        title: "Jste si jisti?",
        text: "Opravdu chcete tuto rezervaci smazat?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ano, smazat!"
      }).then(result => {
        if (result.value) {
          SendDelete(email, vars);
        }
      });
    }
  });
});
