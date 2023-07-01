<?php

header('Content-Type: application/json; charset=utf-8');
header("access-control-allow-origin: *");

require './src/Nanite.php';
require './src/JsonDB.class.php';

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


$db = new JsonDB("./db/");

$lastTime = 0;
$getContent = 0;

$dateLast = $db->selectAll("date");	
$now = new DateTime();
if (count($dateLast) == 0) {
	$db->insert("date", array("date" => $now->getTimestamp()), true);
}

// 3 hours // 60 * 60 * 3 = 1944000
$lastTime = $dateLast[0]["date"] + 1944000;
// 86400; //One day, 60 seg * 60 min * 24 hour


if ($lastTime>$now->getTimestamp()) {
	$getContent = 1;
}

function showList() {
	global $getContent;
	global $db;	

	if ($getContent == 1) {

		$urlSinclair = "https://sinclairzxworld.com/app.php/feed";

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $urlSinclair);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
		curl_setopt($ch,CURLOPT_FOLLOWLOCATION,true);
		$page = curl_exec($ch);
		curl_close($ch);

		//$page = file_get_contents("https://sinclairzxworld.com/app.php/feed");

		http_response_code(200);
		echo json_encode(get_entrys($page));
		die();
	} else {
		http_response_code(200);
		$dateDB = $db->selectAll("date");	
		echo json_encode($dateDB[1]["content"]);
		die();
	}
}

function get_entrys ($page){ 
	global $db;	
	preg_match_all ("/<entry> (.*) <\/entry>/xsmUi", $page, $matches);
	$items = array ();
	foreach ($matches[0] as $match){

		$creator = "";
		$date = "";
		$link = "";
		$title = "";
		$content = "";

		$initPosCreator = strrpos($match, '<name><![CDATA[');
		$endPosCreator = strpos($match, ']]></name>', $initPosCreator);
		$creator = substr($match, $initPosCreator +15, $endPosCreator - ($initPosCreator + 15) );

		$initPosDate = strrpos($match, '<updated>');
		$endPosDate = strpos($match, '</updated>', $initPosDate);
		$date = substr($match, $initPosDate +9, $endPosDate - ($initPosDate + 9) );

		$initPos = strrpos($match, '<id>');
		$endPos = strpos($match, '</id>', $initPos);
		$link = substr($match, $initPos +4, $endPos - ($initPos + 4) );

		$initPos = strrpos($match, '<title type="html"><![CDATA[');
		$endPos = strpos($match, '</title>', $initPos);
		$title = substr($match, $initPos +28, $endPos - ($initPos + 28));

		$initPos = strrpos($match, '<![CDATA[', $endPos);
		$endPos = strpos($match, '</content>', $initPos);
		$content = substr($match, $initPos +9, $endPos - ($initPos + 9));
		
		$items[] = array ('creator'=>$creator, 'date'=>strtotime($date), 'link'=>$link, 'title'=>$title, 'content'=>$content);
	} 

	$db->insert("date", array("content" => $items, true));
	return $items; 
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