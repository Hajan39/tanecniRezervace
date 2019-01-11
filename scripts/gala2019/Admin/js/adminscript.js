$(document).ready(function() {
  SendLogin();
  // Check if JavaScript is enabled
  $("body").addClass("js");

  $("#paidBody > tr >td > input").on("click", function() {
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
      SendDelete(email, vars);
    }
  });
});
