<?php

header('Content-Type: application/json; charset=utf-8');
header("access-control-allow-origin: *");

require './src/Nanite.php';
require './src/JsonDB.class.php';
require './src/classRssReader.php';

/*
if (!ini_get('date.timezone')) {
	date_default_timezone_set('Europe/Madrid');
}
*/

/*
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
*/
//$objData = json_decode(file_get_contents("php://input"));

$objData = [
	"http://feeds.weblogssl.com/genbeta",
	"http://feeds.weblogssl.com/xataka2",
	"http://feeds.weblogssl.com/genbetadev",
	"http://feeds.weblogssl.com/vitonica",
	"http://www.microsiervos.com/index.xml"
];

/*
if (!isset($objData->url) || empty($objData->url)) {
	$rtn = array("error" => "Falta parametro de entrada");
    http_response_code(500);
    print json_encode($rtn);
	die();
}
*/


$db = new JsonDB("./db/");

$lastTime = 0;
if (isset($_GET["time"]) && !empty($_GET["time"])) {
	$lastTime = intval(urlencode($_GET["time"]));
} else {
	$dateLast = $db->selectAll("date");	
	$now = new DateTime();
	if (count($dateLast) == 0) {
		$db->insert("date", array("date" => $now->getTimestamp()), true);
	}
	// 3 hours // 60 * 60 * 3 = 1944000
	$lastTime = $dateLast[0]["date"] - 1000; 
	// 86400; //One day, 60 seg * 60 min * 24 hour
}

function showList() {
    global $objData;
	global $lastTime;

	$listaPrincipal = array();
	foreach ($objData as &$url) {
		$lista = array();
		$rss = new RssReader ($url);	
		foreach ($rss->get_items () as $item) {
			if ($lastTime > 0){
				if (strtotime($item->get_date()) > $lastTime) {
					$aux = array ('title'=>$item->get_title(),'url'=>$item->get_url(),'date'=>strtotime($item->get_date()));
					$lista[] = $aux;
				}
			} else {
				$aux = array ('title'=>$item->get_title(),'url'=>$item->get_url(),'date'=>strtotime($item->get_date()));
				$lista[] = $aux;
			}		
		} 
		$listaPrincipal[] = array('name'=>$rss->get_name(), 'content'=>$lista);
	}
	http_response_code(200);
	echo json_encode($listaPrincipal);
	die();
}

Nanite::get('/', function() {
	showList();
});

Nanite::get('/clear', function() {
	global $db;	
	$now = new DateTime();

    //Reset db
    $db->deleteAll("date");
	$db->insert("date", array("date" => $now->getTimestamp()), true);
	
	http_response_code(200);
	echo json_encode('ok');
});