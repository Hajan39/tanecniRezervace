function SendEmail($order, $email, $amount, $varSym, $forename, $surname)
{
$choose = "";
$standing = 0;
$tables = [];
$dsf = array();
$section = "";
$string = file_get_contents("../../Eshop/toSale.json");
$dsfjson = json_decode($string);

for ($i = 0; $i < count($order); $i++) { $val=$order[$i]; if (strpos($val, 'Chair' )===0) { $spl=explode('_', $val); if
    (!isset($tables[$spl[1]])) $tables[$spl[1]]=0; $tables[$spl[1]]++; } elseif (strpos($val, 'Sector' )===0) { $spl=explode('_',
    $val); $section .="Řada " . $spl[2] . ", Místo " . $spl[3] . "<br/>" ; } elseif (is_numeric($val)) { if ($val> 0) {
    $standing = $val;
    }
    } elseif (strpos($val, 'dsf') === 0) {
    foreach ($json_a as $row) {
    if ($row->id == $val)
    array_push($dsf, $row->name);
    }
    }
    }

    if ($tables) {
    foreach ($tables as $key => $count) {
    $choose .= "Stůl: " . $key . " počet míst: " . $count . "<br />";
    }
    }
    $choose .= $section;
    if ($standing > 0) {
    $choose .= "Počet míst na tribunu: " . $standing . "</br>";
    }