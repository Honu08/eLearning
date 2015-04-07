<?php
class user{
	public static function userLogin($username, $password){
		$payload= array();
		$session  = null;
		$sql= "SELECT COUNT(*) AS value, role FROM login WHERE username='".$username."' AND password='".$password."';";
		$data = MySql::runSelectQuery ($sql);

		if($data[0]["value"] == 0){
			array_push($payload, array("role"=>"invalid"));
		}else{
			$session = rand(0,1000000000);
			MySql::runOtherQuery ("UPDATE login SET session=".$session." WHERE username='".$username."' AND password='".$password."';");;
			array_push($payload, array("role" => $data[0]["role"], "session" => $session));
		}
		return($payload);
	}
}