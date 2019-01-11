<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
$db = new MyPDO();


class MyPDO extends PDO
{
    public function __construct($file = '../my_setting.ini')
    {
        if (!$settings = parse_ini_file($file, TRUE)) throw new exception('Unable to open ' . $file . '.');
        
        $dns = $settings['database']['driver'] .
        ':host=' . $settings['database']['host'] .
        ((!empty($settings['database']['port'])) ? (';port=' . $settings['database']['port']) : '') .
        ';dbname=' . $settings['database']['schema'];
        
        parent::__construct($dns, $settings['database']['username'], $settings['database']['password']);
    }
}


if($_SERVER['REQUEST_METHOD'] === 'GET'){

    $statement = $db->prepare("SELECT * FROM `ORDERS`");

    $statement->execute();   
    $result = $statement->fetchAll(); 
    
    echo json_encode($result);
}
?>