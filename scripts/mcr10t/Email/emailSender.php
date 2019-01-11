<?php

if (!$settings = parse_ini_file($_SERVER['DOCUMENT_ROOT'] . '/scripts/my_setting.ini', true)) throw new exception('Unable to open ' . $_SERVER['DOCUMENT_ROOT'] . '/scripts/my_setting.ini' . '.');
$mainDirName = dirname(dirname(realpath(get_included_files()[0])));

$snt = $mainDirName . '/localSettings.ini';
if (!$localSettings = parse_ini_file($snt, true)) throw new exception('Unable to open ' . $snt . '.');

function getHeader($from)
{
    return "From: " . $from . "\r\n" .
        "MIME-Version: 1.0" . "\r\n" .
        "Content-type: text/html; charset=UTF-8" . "\r\n";
}

function sendOrderEmail($email, $choose, $amount, $varSym)
{
    global $settings;
    global $localSettings;
    global $mainDirName;

    if ($email != null) {
        $accountNumber = $settings['account']['accountNumber'];
        $bankCode = $settings['account']['bankCode'];
        $message = $localSettings['competition']['qrMessage'];
        $actionName = $localSettings['competition']['name'];
        $actionDate = $localSettings['competition']['date'];
        $actionPlace = $localSettings['competition']['place'];

        $url = "http://api.paylibo.com/paylibo/generator/czech/image?accountNumber=" . $accountNumber . "&bankCode=" . $bankCode . "&amount=" . $amount . ".00&vs=" . $varSym . "&message=" . $message;

        $headers = getHeader($settings['email']['from']);

        $subject = $actionName . " – objednávka vstupenek";

        $content = file_get_contents($mainDirName . "/Email/templates/newOrderEmail.html", true);

        $text = sprintf($content, $actionName, $actionDate, $actionPlace, $choose, $amount, $accountNumber, $bankCode, $varSym, $url);

        mail($email, $subject, $text, $headers);
    }
}

function sendAdminMail($forename, $surname, $choose, $varSym, $amount)
{
    global $settings;
    global $localSettings;
    global $mainDirName;

    $headers = getHeader($settings['email']['from']);
    $email = $settings['email']['admin'];
    $actionName = $localSettings['competition']['name'];
    $actionDate = $localSettings['competition']['date'];

    $subj = $actionName . " - nová objednávka";
    $content = file_get_contents($mainDirName . '/Email/templates/adminEmail.html', false);

    $text = sprintf($content, $actionName, $actionDate, $forename, $surname, $choose, $varSym, $amount);

    mail($email, $subj, $text, $headers);
}

function sendReminder($email)
{
    global $settings;
    global $localSettings;
    global $mainDirName;

    $headers = getHeader($settings['email']['from']);
    $actionName = $localSettings['competition']['name'];

    $subj = $actionName . " - Upozornění na nezaplacenou rezervaci";
    $content = file_get_contents($mainDirName . '/Email/templates/reminderEmail.html', false);

    $text = sprintf($content, $actionName);

    mail($email, $subj, $text, $headers);
}

function sendConfirmationEmail($email)
{
    global $settings;
    global $localSettings;
    global $mainDirName;

    $headers = getHeader($settings['email']['from']);
    $actionName = $localSettings['competition']['name'];
    $actionDate = $localSettings['competition']['date'];
    $actionPlace = $localSettings['competition']['place'];

    $subj = $actionName . " – potvrzení přijetí platby";
    $content = file_get_contents($mainDirName . '/Email/templates/confirmationEmail.html', false);

    $text = sprintf($content, $actionName, $actionDate, $actionPlace);

    mail($email, $subj, $text, $headers);
}
?>

