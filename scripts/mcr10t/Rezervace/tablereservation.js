$url = "/scripts/mcr10t/Rezervace/server.php";

var json = $.getJSON({ url: "/scripts/Eshop/toSale.json", async: false })
  .responseJSON;

$(document).ready(function() {
  var tableItems = json.map(
    (x, i) =>
      (i % 5 == 0 && i > 0 ? "</tr><tr>" : "") +
      '<td align="center" width="20%"><img src="/scripts/Eshop/images/' +
      x.filename +
      '.jpg" style="cursor: pointer; " onclick="addToOrder(\'' +
      x.id +
      "')\"/><h5>" +
      x.name +
      "</h5><p>Výše příspěvku: " +
      x.value +
      "</p></td>"
  );

  $("#shopField").html("<table><tr>" + tableItems + "</tr></table>");

  $("#uptable").load(
    "/scripts/mcr10t/Images/MCR10T_2019_vstupenky.svg",
    function() {
      ColorAllGreen();
      MarkItemsFromWeb();
      clearAll();
      RenderLocalStorageToTable();
    }
  );

  $("#uptable").on("click", "g", function() {
    console.log(this.id);
    var table = new RegExp("T\\d{1,2}");
    if (table.test(this.id)) {
      var chairs = this.querySelectorAll("[id^=Chair]");
      for (var i = 0; i < chairs.length; i++) {
        if (chairs[i].classList.contains("green")) {
          SwitchColor(chairs[i]);
          if (i + 1 == chairs.length) {
            SwitchColor(this.querySelector("[id^=Table]"));
            AddNewLineToOrder(this.id);
          }
          return;
        }
      }
      alert("Tento stůl je již plný, zkuste prosím jiný");
      return;
    }

    if (this.id.startsWith("Sector")) {
      var lists = prompt("Kolik lístků na tribunu si přejete?", "1");

      if (lists == null || lists == "") {
        $("#standings").html("0");
      } else {
        $("#standings").html(lists);
      }

      return;
    }
  });
  // $("#uptable").on("click", "#Sektor_B  text", function() {
  //   var newid = this.id.substring(4);
  //   var item = $(this).siblings("rect");
  //   $.each(item, function(i, val) {
  //     if (val.id == newid) {
  //       SwitchColor(val);
  //       return;
  //     }
  //   });
  // });
  // $("#uptable").on("click", "#Sektor_E  text", function() {
  //   var newid = this.id.substring(4);
  //   var item = $(this).siblings("rect");
  //   $.each(item, function(i, val) {
  //     if (val.id == newid) {
  //       SwitchColor(val);
  //       return;
  //     }
  //   });
  // });
  // $("#uptable").on("click", "#Sektor_B  rect", function() {
  //   SwitchColor(this);
  // });
  // $("#uptable").on("click", "#Sektor_E  rect", function() {
  //   SwitchColor(this);
  // });

  $("#sendReservation").click(function() {
    var forename = $("#forename").val();
    var surname = $("#surname").val();
    var email = $("#email")
      .val()
      .toLowerCase();
    if (forename.length == 0) {
      alert("Musíte vyplnit své jméno");
    } else {
      if (surname.length == 0) {
        alert("Musíte vyplnit své příjmení");
      } else {
        if (email.length == 0) {
          alert("Musíte vyplnit svůj email");
        } else {
          if (!validateEmail(email)) {
            alert("Email není ve správném formátu");
          } else {
            if ($("#agreement").is(":checked")) {
              let st = parseInt($("#standings").html());
              if (st > 0) {
                setItemToLocalStorage(st);
              }
              SendReservation(forename, surname, email);
            } else {
              alert("Musíte souhlasit se zpracováním osobních údajů.");
            }
          }
        }
      }
    }
  });

  $("#ordersTable").on("click", "td", function() {
    var spl = this.id.split("_");
    var chairs = $('[id^="Chair_' + spl[1] + '"]');
    for (var i = chairs.length - 1; i >= 0; i--) {
      if (chairs[i].classList.contains("orange")) {
        SwitchColor(chairs[i]);
        return;
      }
    }

    if (this.title) {
      var spl = this.title;
      var chairs = $("#" + spl)[0];

      SwitchColor(chairs);
      return;
    }

    if (spl[0] == "dsf") {
      removeFromOrder(this.id);
    }
  });
});

function SendReservation(forename, surname, email) {
  $("#sendReservation").prop("disabled", true);
  var obj = {
    forename: forename,
    surname: surname,
    email: email,
    order: JSON.parse(localStorage.getItem("myOrders"))
  };

  var request = $.ajax({
    url: $url,
    method: "POST",
    contentType: "application/json",
    processData: false,
    data: JSON.stringify(obj),
    dataType: "text",
    success: function(response) {
      swal({
        title: "Děkujeme za objednávku",
        text: "Informativní email o platbě Vám byl odeslán na vyplněný email ",
        type: "success"
        //       timer: 3000
      }).then(result => {
        location.reload();
      });
    },
    error: function(response, errorThrown) {
      alert(response.responseText);
      location.reload();
    },
    done: function() {
      clearAll();
      $("#sendReservation").prop("disabled", false);
    }
  });
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function ColorAllGreen() {
  ColorItem("Sektor", "rect");
  ColorItem("T", "rect");
  ColorItem("T", "ellipse");
}

function ColorItem(start, item) {
  var items = document.querySelectorAll("[id^=" + start + "]");
  $.each(items, function(i, val) {
    var elements = val.getElementsByTagName(item);
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.add("green");
    }
  });
}

function SwitchColor(item) {
  if (item.classList.contains("red")) {
    alert("Onlouváme se, toto místo je již obsazeno, zkuste jiné.");
  }
  if (item.classList.contains("green")) {
    item.classList.remove("green");
    item.classList.add("orange");
    setItemToLocalStorage(item.id);
  } else {
    item.classList.remove("orange");
    item.classList.add("green");
    deleteItemFromLocalStorage(item.id);
  }
  RenderLocalStorageToTable();
}

function removeFromOrder(item) {
  deleteItemFromLocalStorage(item);
  RenderLocalStorageToTable();
}

function addToOrder(item) {
  setItemToLocalStorage(item);
  RenderLocalStorageToTable();
}

function AddNewLineToOrder(item, count = 1) {
  var spl = item.split("_");
  if (spl[0] == "Chair") {
    var name = "Stůl č." + spl[1];
    $("#ordersTable").append(
      "<tr><td>" +
        name +
        "</td><td style='text-align:center'>" +
        count +
        "</td><td id='tableline_" +
        spl[1] +
        "' style='color:red'>&#x2796;</td></tr>"
    );

    return;
  }
  if (spl[0] == "Sector") {
    var name =
      "Sektor " + spl[1] + ", řada " + spl[2] + "., místo " + spl[3] + ".";
    $("#ordersTable").append(
      "<tr><td>" +
        name +
        "</td><td  style='text-align:center'>1</td><td title='" +
        item +
        "'>&#x274C;</td></tr>"
    );
    return;
  }
  if (spl[0] == "dsf") {
    var text = json.find(x => x.id === item).name;
    var name = "Dancesport family " + text;
    $("#ordersTable").append(
      "<tr><td>" +
        name +
        "</td><td style='text-align:center'>" +
        count +
        "</td><td id='dsf_" +
        spl[1] +
        "' style='color:red'>&#x2796;</td></tr>"
    );
    return;
  }

  console.log(item);
}

function setItemToLocalStorage(value) {
  var orders = JSON.parse(localStorage.getItem("myOrders"));
  if (orders == null) orders = [];
  orders.push(value);
  localStorage.setItem("myOrders", JSON.stringify(orders));
}

function isItemInLocalStorage(item) {
  var orders = JSON.parse(localStorage.getItem("myOrders"));
  if (orders == null) return false;
  $.each(orders, function(i, val) {
    if (item == val) {
      return true;
    }
  });
  return false;
}

function deleteItemFromLocalStorage(item) {
  var orders = JSON.parse(localStorage.getItem("myOrders"));
  if (orders == null) return;
  var index = orders.indexOf(item);
  if (index > -1) {
    orders.splice(index, 1);
  }
  // $.each(orders, function(i, val) {
  //   if (item == val) {
  //     orders.splice(i, 1);
  //   }
  // });
  localStorage.setItem("myOrders", JSON.stringify(orders));
}

function MarkItemsFromWeb() {
  $.get($url, function(data, status) {
    if (status == "success") {
      console.log(data);
      RerenderColors(JSON.parse(data));
    }
  });
}

function RerenderColors(orders) {
  $.each(orders, function(i, val) {
    var item = document.getElementById(val);
    if (item) {
      item.classList.remove("green");
      item.classList.add("red");
    }
  });
}

function RenderLocalStorageToTable() {
  $("#ordersTable")
    .find("tr:gt(1)")
    .remove();
  var orders = JSON.parse(localStorage.getItem("myOrders"));
  var chairs = {};
  var dsf = {};
  $.each(orders, function(i, val) {
    if (val.startsWith("Chair")) {
      assignKey(chairs, val.split("_")[1]);
      var item = document.getElementById(val);
      item.classList.remove("green");
      item.classList.add("orange");
    } else if (val.startsWith("dsf")) assignKey(dsf, val);
    else AddNewLineToOrder(val);
  });

  Object.keys(chairs).forEach(function(key) {
    var str = "Chair_" + key;
    AddNewLineToOrder(str, chairs[key]);
  });

  Object.keys(dsf).forEach(function(key) {
    AddNewLineToOrder(key, dsf[key]);
  });
}

function assignKey(obj, key) {
  typeof obj[key] === "undefined" ? (obj[key] = 1) : obj[key]++;
}

function validateEmail(sEmail) {
  var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  if (filter.test(sEmail)) {
    return true;
  } else {
    return false;
  }
}

function clearAll() {
  localStorage.removeItem("myOrders");
  $("#myModal").modal("hide");
  $("#forename").val("");
  $("#surname").val("");
  $("#email").val("");
  RenderLocalStorageToTable();
}
