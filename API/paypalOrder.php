<?php
class Paypal{
	
	public static function makeOrder($username, $amt, $courses){
		$payload= [];
		$session  = null;
		$valid = true;
			
		while($valid){
			$session = rand(0,1000000000);
			$sql= "SELECT COUNT(*) AS value FROM orders WHERE id ='".$session."';";
			$data = MySql::runSelectQuery ($sql);
			if($data[0]["value"] == 0){ 
				$sql= "INSERT INTO orders VALUES ('".$username."',".$session.", 'pending', ".$amt." );";
				$temp = MySql::runOtherQuery ($sql);
				array_push($payload, array("session" => $session, "data"=> $courses));
				foreach($courses as $code){
					$sql= "INSERT INTO order_detail VALUES (".$session.", '".$code['code']."', '".$code['price']."' );";
					$temp = MySql::runOtherQuery ($sql);
				} 
				$valid = false;
			}
		}
		return(array("order"=>$session, "amt"=>$amt));
	}
	
	public static function cancelOrder($id){
		$sql = "DELETE FROM orders WHERE id = ".$id.";";
		$data = MySql::runOtherQuery($sql);
		return $data;
	}
	
	public static function completeOrder($id){
		
	}
}