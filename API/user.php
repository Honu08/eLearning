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
			array_push($payload, array("role" => $data[0]["role"]));
			$valid = true;
			
			while($valid){
				$session = rand(0,1000000000);
				$sql= "SELECT COUNT(*) AS value FROM sessions WHERE session='".$session."';";
				$data = MySql::runSelectQuery ($sql);
				if($data[0]["value"] == 0){
					$sql= "SELECT COUNT(*) AS value FROM sessions WHERE username='".$username."';";
					$data = MySql::runSelectQuery ($sql);
					if($data[0]["value"] == 0){
						MySql::runOtherQuery ("INSERT INTO sessions VALUES ('".$username."', '".$session."', CURRENT_TIMESTAMP );");;
						array_push($payload, array("session" => $session));
						$valid = false;
					}else{
						MySql::runOtherQuery ("UPDATE sessions SET username = '".$username."', session = '".$session.
											  "', time = CURRENT_TIMESTAMP WHERE username = '".$username."' ;");
						array_push($payload, array("session" => $session));
						$valid = false;
					}
				}else{
					$data = MySql::runOtherQuery ("UPDATE sessions SET username = '".$username."', session = '".$session.
												  "', time = CURRENT_TIMESTAMP WHERE username = '".$username."';");
					array_push($payload, array("session" => $session));
					$valid = false;
				}
			}
		}
		return($payload);
	}
}