<?php
include('../Database/database.php');
include('../Email/emailSender.php');
header('content-type:text/json;charset=utf-8');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = getOrders();

    echo json_encode($result);
};

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $headerValue = $_SERVER['HTTP_X_TYPE'];
    $json_str = file_get_contents('php://input');

    $json_obj = json_decode($json_str);
    $email = $json_obj->email;

    if ($headerValue == 'Reminder') {

        sendReminder($email);

    } elseif ($headerValue == 'Confirmation') {

        $vars = $json_obj->vars;

        sendConfirmationEmail($email);

        setPaid($vars);

    };
};

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $json_str = file_get_contents('php://input');

    # Get as an object
    $json_obj = json_decode($json_str);
    $vars = $json_obj->vars;

    $f = getPayment($vars);
    $result = $f['VALUE'];

    deletePayment($vars);


    $row = getCustomerByVars($vars);
    $cid = $f['CUSTOMER_ID'];

    deteleBookingByVars($vars);

    updateCustomerByVars($result, $cid);

};
?>