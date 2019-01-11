var modal = document.getElementById('myModal');
$(document).ready(function () {


    localStorage.clear();
    $('.HideForEmpty').hide();
    $("#tableContent").load("images\\parket.svg", function () {
        GetTables();
        GetPrices();
    });
    $('#closeModal').click(function () {
        modal.style.display = "none";
        MarkMap();

    })


    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            MarkMap();

        }
    }

    /*$("#hallTickets").on("change paste keyup", function (e) {
        SetHallValue(this.value);

    });*/
    /*$('#tableContent').on('contextmenu', '#Hala', function (e) {
        e.preventDefault();
        $('#hallTickets').val(function (i, oldval) {
            if (oldval > 0) {
                return --oldval;
            }

        })

        SetHallValue($('#hallTickets')[0].value);
    });*/
    /* $('#tableContent').on('click', '#Hala', function () {
         $('#hallTickets').val(function (i, oldval) {
             if (oldval < 100) {
                 return ++oldval;
             }
         })
 
         SetHallValue($('#hallTickets')[0].value);
     });*/

    $('#tableContent').on('click', '[id^="T"]', function () {
        var table = this.id.substring(2);

        $('#tableNumber').html(table)
        if (this.id.indexOf("TB") == 0) {
            //if (this.id.startsWith('TB')) {
            $("#tableSvg").load("images/bigtable.svg", function () {
                MarkTables(table)

            });
        } else if (this.id.indexOf("TM") == 0) {//if (this.id.startsWith('TM')) {
            $("#tableSvg").load("images/medtable.svg", function () {
                MarkTables(table)
            });
        } else if (this.id.indexOf("TS") == 0) {///if (this.id.startsWith('TS')) {
            $("#tableSvg").load("images/smalltable.svg", function () {
                MarkTables(table)
            });
        }
        modal.style.display = "block";
    })


    $('#tableSvg').on('click', 'rect', function () {
        swal("děkujeme za zájem", "Předprodej byl již ukončen. Zbývající vstupenky budou k dispozici na místě.", "error");
    /*    if (this.id.indexOf("table") == 0) {
  
            //if (this.id.startsWith('table')) {
            $(this).siblings('rect').each(function () {
                if (this.id.indexOf("table") != 0) {
                    //if (!this.id.startsWith('table')) {
                    AddLineToStorage(this);
                }

            })
        }
        else {
            var num = $('#tableNumber').html() + '/' + this.id.substring(1);
            if (!isTableInLocalStorage(num)) {
                AddLineToStorage(this);
            }
        }
        MarkTables($('#tableNumber').html());*/
    })

    $('#sendReservation').click(function () {
       
        
        swal({
            title: 'Prosím, vyplňte kontaktní údaje',
            html:
                'Jméno: ' +
                '<input id="forename" class="w3-input" type="text" name="firstname">' +
                'Přijmení:' +
                '<input id="surname" class="w3-input" type="text" name="lastname">' +
                '<br /> E-mail:' +
                '<input id="email" class="w3-input" type="email" name="email">',
            showCancelButton: true,
            confirmButtonText: 'Odeslat',
            cancelButtonText: 'Zrušit',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                $('#email, #forename, #surname').css("border", "");
            
                var allok = true;
                var noVal = ''
                if ($('#email').val().length == 0) {
                    allok = false;
                    $('#email').css("border", "5px solid red");
                } if ($('#forename').val().length == 0) {
                    $('#forename').css("border", "5px solid red");
                    allok = false;

                }
                if ($('#surname').val() == 0) {
                    $('#surname').css("border", "5px solid red");
                    allok = false
                }
                if (allok) {
                    if (!validateEmail($('#email').val())) {
                        $('#email').css("border", "5px solid red");
                        swal.showValidationError(
                            'Prosím, zkontrolujte emailovou adresu.'
                        )
                    }
                    else {

                        return {
                            forename: $('#forename').val(),
                            surname: $('#surname').val(),
                            email: $('#email').val()
                        };
                    }
                }
                else{
                    swal.showValidationError(
                        'Prosím, zkontrolujte červené položky.'
                    )
                }
            },
            allowOutsideClick: () => !swal.isLoading()
        }).then((result) => {
            if (result.value) {
                swal.showLoading()
                var values = [];

                //values.push($('#hallTickets').val());
                $('#selectedPlaces > tbody > tr').find("td:first").each(function () {
                    values.push($(this).html());
                })
                SendReservation(values, result.value.forename, result.value.surname, result.value.email);

            }
        })

    });

    $('tbody').on('click', 'tr td span', function () {
        deleteTableFromLocalStorage(this.id)
        this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
        MarkMap()
        setTotalValue()
    })


});

function validateEmail(sEmail) {
    var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (filter.test(sEmail)) {
        return true;
    }
    else {
        return false;
    }
}

function MarkMap() {
    $('#tableContent').find('g g rect').each(function () {
        var val = this.id.substring(1).replace('_x002f_', '/');

        if (isTableInLocalStorage(val)) {
            $(this).css('fill', '#ff0000');
        } else {
            $(this).css('fill', '#33cc33');
        }

    })
}
function AddLineToStorage(item) {
    $(this).css('fill', 'rgb(209, 165, 20)');
    var num = $('#tableNumber').html() + '/' + item.id.substring(1);
    if (!isTableInLocalStorage(num)) {
        var content = '<tr><td>' + num + '</td>' + '<td>1</td><td>' + localStorage.getItem('tablePrice') + ',- Kč</td><td>' + localStorage.getItem('tablePrice') + ',- Kč</td><td><span id="' + num + '" class="close" name="del">&times;</span></td></tr>';
        $('#selectedPlaces > tbody').append(content);
        setLocalStorageTable(num)
    }


}

function MarkTables(table) {
    if ((table > 28 && table < 35) || (table < 16 && table > 10)) {
        $('#tableSvg').css('transform-origin', 'center').css('transform', 'rotate(90deg)');

    } else
        if ((table > 15 && table < 22) || (table < 6)) {
            $('#tableSvg').css('transform-origin', 'center').css('transform', 'rotate(-90deg)');

        }
        else {
            $('#tableSvg').css('transform-origin', 'center').css('transform', 'rotate(0deg)');
        }

    var all = false;
    $('#tableSvg').find('svg g rect').each(function (i, el) {
        var id = el.id;
        if (this.id.indexOf("table") != 0) {
            // if (!id.startsWith('table')) {

            var val = table + '/' + this.id.substring(1);

            if (isTableInLocalStorage(val)) {
                $(this).css('fill', '#ff0000');
            } else {
                $(this).css('fill', '#33cc33');
                all = true;
            }
        }

    })
    if (!all) {
        $('#tableSvg #table').css('fill', '#ff0000');
        $('#tableSvg #tabled').css('fill', '#ff0000');
    } else {
        $('#tableSvg #table').css('fill', '#33cc33');
        $('#tableSvg #tabled').css('fill', '#33cc33');
    }
}

/*function SetHallValue(sum) {
    var value = parseInt(localStorage.getItem('hallPrice'));
    $('#hallTotal').html(sum * value + ",- Kč")
    var tot = parseInt(localStorage.getItem("hala"));
    $('#halaSeats').html('Hala - ' + (tot - sum) + ' míst');
    if (tot - sum <= 0) {
        $('#hala').css('fill', '#ff0000');
    } else {
        $('#hala').css('fill', '#33cc33');
    }
    $(this).data("previousValue", sum)
    if (sum === 0) {
        $('#hall').hide();
    } else {
        $('#hall').show();
    }
    setTotalValue()
}*/

function setLocalStorageTable(item) {
    localStorage.setItem(item, 'true')
    setTotalValue()
}

function isTableInLocalStorage(item) {
    var s = localStorage.getItem(item);
    if (s === null) {
        return false;
    } else {
        return true;
    }
}

function deleteTableFromLocalStorage(item) {
    var s = localStorage.removeItem(item);
    setTotalValue()
}

function setTotalValue() {
    //var hallSuma = $('#hallTickets').val() * parseInt(localStorage.getItem('hallPrice'));
    var tableSuma = parseInt($('#selectedPlaces > tbody > tr').find("td:first").length) * parseInt(localStorage.getItem('tablePrice'));
    $('#totalPrice').html((/*hallSuma + */tableSuma) + ',- Kč');
    if (/*hallSuma +*/ tableSuma <= 0) {
        //   $('tfoot').hide();

        $('.HideForEmpty').hide();
    }
    else {
        //    $('tfoot').show();

        $('.HideForEmpty').show();
    }
}