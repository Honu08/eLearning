<?php
	include_once "config.php";

	$data = null;
	switch ($_POST["task"])
	{
		case "test_connection":
			$data = MySql::connectToMySQL(); 
			// $data["post"] = $_POST[ "task"]; 
			break; 
		
		case "insert_course": 
			$sql = array (
				"statement" => "insert",
				"into" => "catalog",
				"values" => array (
					"id"	 	   => null,
					"code"   	   => $_POST["course_code"],
					"type"   	   => $_POST["course_type"],
					"title"  	   => $_POST["course_title"],
					"desc"   	   => $_POST["course_desc"],
					"price"  	   => $_POST["course_price"],
					"active" 	   => $_POST["course_active"],
					"entered_date" => "timestamp" // Boom
				)
			);
			$data = JsonSQL::sqlify ($sql);
			break;
		
		case"user_login":
		
			$data = user::userLogin($_POST['username'], $_POST['password']);
					
			break;

		case "insert_user": 
			$name 		= $_POST['name'];
			$lastName	= $_POST['lastName'];
			$license 	= $_POST['license'];
			$address 	= $_POST['address'];
			$email      = $_POST['email'];
			$phone      = $_POST['phone'];
			$username   = $_POST['username'];
			$profession = $_POST['profession'];
			$date       = 'CURRENT_TIMESTAMP';

			$sql = "INSERT INTO users VALUES ('".trim($name)."','".trim($lastName)."','".trim($license)."','".trim($address)."','"
				.trim($email)."','".trim($phone)."','".trim($username)."','".trim($profession)."',".$date.");";
			$data = MySql::runOtherQuery ($sql);
			break;

		case "insert_login":
			$sql = array (
				"statement" => "insert",
				"into" => "login",
				"values" => array (
					"username"	 	=> $_POST["username"],
					"password"   	=> $_POST["password"],
					"role"   	   	=> "user",
					"session"  	   	=> null
				)
			);
			$data = JsonSQL::sqlify ($sql);
			break;
		
		case "update_course":
			$sql = array (
				"statement" => "update",
				"table" => "catalog",
				"set" => array (
					"code"   	   => $_POST["course_code"],
					"type"   	   => $_POST["course_type"],
					"title"  	   => $_POST["course_title"],
					"desc"   	   => $_POST["course_desc"],
					"price"  	   => $_POST["course_price"],
					"active" 	   => $_POST["course_active"]
				),
				"where" => array (
					"=" => array (
						"code" => $_POST["previous_course"]
					)
				)
			);
			$data = JsonSQL::sqlify ($sql);
			break;

		case "get_courses":
			$sql = array (
				"statement" => "select",
				"columns"   => array ( "*" ),
				"from"      => array ( "catalog" )
			);
			$data = JsonSQL::sqlify ($sql);
			break;
		
		case "get_courses_title":
			$sql = array (
				"statement" => "select",
				"columns"   => array ( "*" ),
				"from"      => array ( "catalog" )
			);
			$data = JsonSQL::sqlify ($sql);
			break;

		case "get_profession":
			$sql = array (
				"statement" => "select",
				"columns"   => array ( "category" ),
				"from"      => array ( "profession" )
			);
			$data = JsonSQL::sqlify ($sql);
			break;
		
		case "get_course_info":
			$sql = array (
				"statement" => "select",
				"columns"   => array ( "*" ),
				"from"      => array ( "catalog" ),
				"where" => array (
					"=" => array (
						"code" => $_POST["course_code"]
					)
				)
			);
			$data = JsonSQL::sqlify ($sql);
			break;

		case "delete_course":
			$sql = array (
				"statement" => "delete",
				"from"  => "catalog",
				"where" => array (
					"=" => array ( "code" => $_POST["course_code"] )
				)
			);
			$data = JsonSQL::sqlify ($sql);
			break;
		
		case "exist_course":
			if (JsonSQL::rowExists ("code", $_POST["course_code"], "catalog")) {
				$data = array ( "exists" => true );
			} else {
				$data = array ( "exists" => false );
			}		
			break;

		case "exist_user":
			if (JsonSQL::rowExists ("username", $_POST["user_name"], "users")) {
				$data = array ( "exists" => true );
			} else {
				$data = array ( "exists" => false );
			}		
			break;

		case "exist_license":
			if (JsonSQL::rowExists ("license", $_POST["license"], "users")) {
				$data = array ( "exists" => true );
			} else {
				$data = array ( "exists" => false );
			}		
			break;
		
 		case "get_table_headers":
			$table_name = trim ($_POST["table_name"]);
			$data = MySql::getColumnNames ($table_name);
			break;

		default:
			break;
	}

	echo json_encode($data); 
?>
