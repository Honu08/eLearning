<?PHP
	include_once "config.php";
	$result = [];
    session_start();
    if (!empty($_GET)){
        $_SESSION['got'] = $_GET;
        header('Location: http://45.55.162.46/eLearning/API/paypalHandle.php');
        die;
    }
    else{
        if (!empty($_SESSION['got'])){
            $_GET = $_SESSION['got'];
            unset($_SESSION['got']);
        }
		$st = $_GET['st'];
		
		$id = $_GET['item_number'];
		
        //use the $_GET vars here..
		if($st === "Completed"){
			
			$sql = "SELECT o.username, d.code FROM orders o JOIN order_detail d ON d.id = o.id WHERE o.id = ".$id." ;";
			$data = MySql::runSelectQuery($sql);
			foreach($data as $course){
				array_push($result, MySql::runOtherQuery("INSERT INTO enroll VALUES ('".$course['username']."', '".$course['code']."');"));
				print_r($result);
			}
			
			MySql::runOtherQuery("DELETE FROM orders WHERE id = ".$id."");
			header('Location: http://45.55.162.46/eLearning/admin/login.html');
		}
		
    }
?>