var url = "/scripts/mcr10t/Admin/admin.php";
var totalSeats = 264;

function SendLogin() {
  $("#paidBody").html("");
  $.ajax({
    url: url,
    type: "GET",
    contentType: "application/json",
    dataType: "json",
    async: false,
    success: function(result) {
      // On success, 'data' contains a list of products.
      var htmlContent = "";

      $.each(result, function(key, item) {
        htmlContent +=
          "<tr><td>" +
          item.FORENAME +
          "</td><td>" +
          item.SURNAME +
          "</td><td class='email'>" +
          item.EMAIL +
          "</td><td class='vars'>" +
          item.VARSYMBOL +
          "</td><td>" +
          item.bookings +
          "</td><td>" +
          item.TOTAL_PRICE +
          "</td>";
        if (item.PAID) {
          htmlContent += "<td colspan='3'>" + item.PAID + "</td></tr>";
        } else {
          htmlContent +=
            "<td><input class='w3-button w3-amber w3-center w3-input' type='button' value='Upomínka'>" +
            "</td><td>" +
            "<input class='w3-button w3-green w3-center w3-input' type='button' value='Potvrdit'>" +
            "</td><td>" +
            "<input class='w3-button w3-red w3-center w3-input' type='button' value='X'>" +
            "</td></tr>";
        }
      });

      // Appending HTML content
      $("#paidBody").html(htmlContent);
    },
    error: function(err) {
      console.log("error", err);
    }
  });
}

function SendReminder(data) {
  let content = {
    email: data
  };
  $.ajax({
    type: "POST",
    //the url where you want to sent the userName and password to
    url: url,
    data: JSON.stringify(content),
    dataType: "text",
    headers: { "X-TYPE": "Reminder" },
    async: false,
    success: function(result) {
      swal({
        title: "Odesláno.",
        text: "Upomínka byla odeslána.",
        type: "success",
        timer: 3000
      }).then(function() {
        SendLogin();
      });
    },
    error: function(err) {
      console.log(err);
      alert(err.statusText);
    }
  });
}

function SendConfirmation(data, vars) {
  let content = {
    email: data,
    vars: vars
  };
  $.ajax({
    type: "POST",
    //the url where you want to sent the userName and password to
    url: url,
    dataType: "text",
    data: JSON.stringify(content),
    headers: { "X-TYPE": "Confirmation" },
    async: false,
    success: function(result) {
      swal({
        title: "Odesláno.",
        text: "Potvrzení bylo odesláno.",
        type: "success",
        timer: 3000
      }).then(function() {
        SendLogin(auth);
      });
    },
    error: function(err) {
      alert(err.statusText);
      location.reload();
    }
  });
}

function SendDelete(data, vars) {
  let content = {
    email: data,
    vars: vars
  };

  $.ajax({
    type: "DELETE",
    url: url,
    data: JSON.stringify(content),
    dataType: "text",
    headers: { "X-TYPE": "Delete" },
    async: false,
    success: function(result) {
      swal({
        title: "Smazáno.",
        text: "Rezervace byla smazána.",
        type: "success",
        timer: 3000
      }).then(function() {
        SendLogin();
      });
    },
    error: function(err, stat) {
      console.log("done", err, stat);
      alert(err.statusText);
      location.reload();
    }
  });
}
