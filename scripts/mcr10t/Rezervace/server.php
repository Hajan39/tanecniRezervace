<?php
include('../Database/database.php');
include('../Email/emailSender.php');

function getTotalPrice($json_obj, $email)
{
    $rows = getPaymentList();
    $suma = 0;
    for ($i = 0; $i < count($json_obj); $i++) {
        if (is_numeric($json_obj[$i])) {
            foreach ($rows as $row) {
                if (strpos('standings', $row['NAME']) === 0) {
                    $suma += $json_obj[$i] * $row['VALUE'];
                };
            };
            continue;
        }
        foreach ($rows as $row) {
            if (strpos($json_obj[$i], $row['NAME']) === 0) {
                $suma += $row['VALUE'];
            };
        };
    };

    $row = getDiscounts($email);

    $id = (int)$row['VALUE'];
    if ($id != null) {
        $suma = $suma / 100 * (100 - $id);
    }
    return $suma;
}

function createCustomer($forename, $surname, $email, $total)
{
    $row = getCustomer($email);
    if (strlen($row['ID']) > 0) {

        updateCustomer($row['ID'], $total + $row['TOTAL_PRICE']);
        return $row['ID'];
    } else {
        return createNewCustomer($forename, $surname, $email, $total);
    }
}

function SendEmail($order, $email, $amount, $varSym, $forename, $surname)
{
    $choose = "";
    $standing = 0;
    $tables = [];
    $dsf = [];
    $section = "";
    $string = file_get_contents("../../Eshop/toSale.json");
    $dsfjson = json_decode($string);

    for ($i = 0; $i < count($order); $i++) {
        $val = $order[$i];

        if (strpos($val, 'Chair') === 0) {
            $spl = explode('_', $val);
            if (!isset($tables[$spl[1]]))
                $tables[$spl[1]] = 0;
            $tables[$spl[1]]++;
        } elseif (strpos($val, 'Sector') === 0) {
            $spl = explode('_', $val);
            $section .= "Řada " . $spl[2] . ", Místo " . $spl[3] . "<br/>";
        } elseif (is_numeric($val)) {
            if ($val > 0) {
                $standing = $val;
            }
        } elseif (strpos($val, 'dsf') === 0) {
            if (!isset($dsf[$val])) {
                $dsf[$val] = 0;
            }
            $dsf[$val]++;

        }
    }

    if ($tables) {
        foreach ($tables as $key => $count) {
            $choose .= "Stůl: " . $key . " počet míst: " . $count . "<br/>";
        }
    }

    $choose .= $section;
    if ($standing > 0) {
        $choose .= "Počet míst na tribunu: " . $standing . "</br>";
    }

    if ($dsf) {
        $choose .= "Zakoupené předměty Dancesport Family: ";
        $exp = array();
        foreach ($dsf as $key => $count) {
            foreach ($dsfjson as $row) {
                if ($row->id == $key) {
                    array_push($exp, $row->name . " " . $count . "x");
                }
            }
        }
        $choose .= implode(", ", $exp) . "</br>";
    }

    sendOrderEmail($email, $choose, $amount, $varSym);
    if ($email == 'hajan39@gmail.com') {
        echo ($choose);
        return;
    }
    sendAdminMail($forename, $surname, $choose, $varSym, $amount);
}

function setBooking($orders, $paymentId, $customerId)
{

    $rows = getPaymentList();
    for ($i = 0; $i < count($orders); $i++) {
        if (is_numeric($orders[$i])) {
            foreach ($rows as $row) {
                if (strpos('standings', $row['NAME']) === 0) {
                    $id = $row['ID'];
                };
            };

        }
        foreach ($rows as $row) {
            if (strpos($orders[$i], $row['NAME']) === 0) {
                $id = $row['ID'];
            };
        };

        insertToBooking($customerId, $id, $orders[$i], $paymentId);

    }
}

header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $json_str = file_get_contents('php://input');

    $json_obj = json_decode($json_str);
    if (count($json_obj->order) > 0) {
        $suma = getTotalPrice($json_obj->order, $json_obj->email);

        if ($suma > 0) {
            $custid = createCustomer($json_obj->forename, $json_obj->surname, $json_obj->email, $suma);
            $payment = setPayment($suma);
            setBooking($json_obj->order, $payment, $custid);
            SendEmail($json_obj->order, $json_obj->email, $suma, $payment, $json_obj->forename, $json_obj->surname);
            echo "Děkujeme za objednávku, informativní email o platbě Vám byl odeslán na vyplněný email.";
        } else {
            echo $json_obj->order;
            echo "SUMA = " . $suma;
        }
    } else {
        echo "Nebyly vyplněny žádná data.";
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $result = getBookingNames();
    echo json_encode($result);
};
?>