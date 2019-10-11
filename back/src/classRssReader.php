<?php

class RssReader { 
	var $url; 
	var $data;  
	function RssReader ($url){ 
		$this->url; 
		$this->data = implode ("", file ($url)); 
	}  
	function get_name (){ 
		preg_match ("/<title> (.*) <\/title>/xsmUi", $this->data, $matches); 	
		return $matches[1]; 
	}
	function get_items (){ 
		preg_match_all ("/<item .*>.*<\/item>/xsmUi", $this->data, $matches); 
		$items = array (); 
		foreach ($matches[0] as $match){ 
			$items[] = new RssItem ($match); 
		} 
		return $items; 
	} 
}  

class RssItem { 
	var $title, $url, $description;  
	function RssItem ($xml){ 
		$this->populate ($xml); 
	}  
	function populate ($xml){ 
		preg_match ("/<title> (.*) <\/title>/xsmUi", $xml, $matches); 
		$this->title = $matches[1]; 
		preg_match ("/<link> (.*) <\/link>/xsmUi", $xml, $matches); 
		$this->url = $matches[1]; 
		preg_match ("/<description> (.*) <\/description>/xsmUi", $xml, $matches); 
		$this->description = $matches[1]; 
		// Para otros feed puede ser 'dc:date' en vez de 'pubDate'
		preg_match ("/<pubDate> (.*) <\/pubDate>/xsmUi", $xml, $matches); 
		$this->date = $matches[1]; 
		//preg_match ("/<dc:creator> (.*) <\/dc:creator>/xsmUi", $xml, $matches); 
		//$this->creator = $matches[1]; 
	}  
	function get_title (){ 
		return $this->title; 
	}  
	function get_url (){ 
		return $this->url; 
	}  	
	function get_description (){ 
		return $this->description; 
	} 
	function get_date (){ 
		return $this->date; 
	}  
	function get_creator (){ 
		//return $this->creator; 
	}  
} 
?> 