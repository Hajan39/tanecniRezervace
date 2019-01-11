<?php 

class MyPDO extends PDO
{
    public function __construct()
    {
        if (!$settings = parse_ini_file($_SERVER['DOCUMENT_ROOT'] . '/scripts/my_setting.ini', true)) throw new exception('Unable to open ' . $_SERVER['DOCUMENT_ROOT'] . '/scripts/my_setting.ini' . '.');

        $dns = $settings['database']['driver'] .
            ':host=' . $settings['database']['host'] . ((!empty($settings['database']['port'])) ? (';port=' . $settings['database']['port']) : '') .
            ';dbname=' . $settings['database']['schema'];

        parent::__construct($dns, $settings['database']['username'], $settings['database']['password'], array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"
        ));
    }
}

function getDiscounts($email)
{
    $db = new MyPDO();

    $statement = $db->prepare("SELECT `VALUE` FROM `DISCOUNTS` WHERE EMAIL = :email");

    $statement->execute(array(':email' => $email));

    return $statement->fetch();
}

function getCustomer($email)
{
    $db = new MyPDO();

    $statement = $db->prepare("select ID, TOTAL_PRICE from CUSTOMERS where email = :email");
    $statement->execute(array(':email' => strtolower($email)));
    return $statement->fetch();
}

function updateCustomer($id, $total)
{
    $db = new MyPDO();

    $statement = $db->prepare("UPDATE `CUSTOMERS` SET `TOTAL_PRICE` = :total WHERE ID = :id");
    $statement->execute(array(
        ':id' => $id,
        ':total' => $total
    ));
}

function createNewCustomer($forename, $surname, $email, $total)
{
    $db = new MyPDO();

    $statement = $db->prepare("INSERT INTO CUSTOMERS set email = :email, FORENAME = :forename, SURNAME = :surname, TOTAL_PRICE = :value, CREATED = NOW()");

    $statement->execute(array(
        ':forename' => $forename,
        ':surname' => $surname,
        ':email' => $email,
        ':value' => $total
    ));
    return $db->lastInsertId();
}

function setPayment($total)
{
    $db = new MyPDO();

    $statement = $db->prepare("INSERT INTO PAYMENT set VALUE = :total, CREATED = NOW()");

    $statement->execute(array(':total' => $total));
    $id = $db->lastInsertId();
    return $id;
}

function insertToBooking($customerId, $id, $order, $paymentId)
{
    $db = new MyPDO();

    $statement = $db->prepare("INSERT INTO BOOKING set CUSTOMER_ID = :custid, PRICE_ID = :priceid, NAME = :name, PAYMENT_ID = :paymentid, CREATED = NOW(), COMPETITION_ID = 1");

    $statement->execute(array(
        ':custid' => $customerId,
        ':priceid' => $id,
        ':name' => $order,
        ':paymentid' => $paymentId
    ));
}

function setPaid($vars)
{
    $db = new MyPDO();

    $statement = $db->prepare("UPDATE `PAYMENT` SET `PAID`= NOW(),`PAID_AMOUNT`=`VALUE` WHERE ID = :vars");

    $statement->execute(array(':vars' => $vars));
}

function getOrders()
{
    $db = new MyPDO();
    $sth = $db->query('SELECT *  FROM `ORDERS2` WHERE true', PDO::FETCH_ASSOC);
    $result = $sth->fetchAll();
    return $result;
}

function getPayment($vars)
{
    echo ($vars);
    $db = new MyPDO();
    $statement = $db->prepare("SELECT `VALUE` FROM `PAYMENT` WHERE `ID` = :vars");
    $statement->execute(array(':vars' => $vars));
    return $statement->fetch();
}

function deletePayment($vars)
{
    $db = new MyPDO();
    $stmt = $db->prepare("DELETE FROM `PAYMENT` WHERE `ID` = :vars");
    $stmt->bindParam(':vars', $vars, PDO::PARAM_INT);
    $stmt->execute();
}

function getCustomerByVars($vars)
{
    $db = new MyPDO();
    $statement = $db->prepare("SELECT `CUSTOMER_ID` FROM `BOOKING` WHERE `PAYMENT_ID` = :vars");
    $statement->execute(array(':vars' => $vars));
    return $statement->fetch();
}

function updateCustomerByVars($result, $cid)
{
    $db = new MyPDO();

    $statement = $db->prepare("UPDATE `CUSTOMERS` SET `TOTAL_PRICE`= `TOTAL_PRICE` - :total WHERE `ID` = :cid");
    $statement->execute(array(
        ' : total ' => $result,
        ' : cid ' => $cid
    ));
    $statement->fetch();
}

function deteleBookingByVars($vars)
{
    $db = new MyPDO();
    $statement = $db->prepare("DELETE FROM `BOOKING` WHERE `PAYMENT_ID` = :vars");
    $statement->execute(array(':vars' => $vars));
}

function getBookingNames()
{
    $db = new MyPDO();
    $sth = $db->query(' SELECT NAME FROM `BOOKING` WHERE true ', PDO::FETCH_ASSOC);
    return $sth->fetchAll(PDO::FETCH_COLUMN);
}

function getPaymentList()
{
    $db = new MyPDO();
    $sth = $db->query(' SELECT ID, NAME, VALUE FROM `PRICE_LIST` WHERE COMPETITION_ID = 1', PDO::FETCH_ASSOC);
    return $sth->fetchAll();

}
?>