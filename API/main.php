<?php
	include_once "config.php";

	$data = null;
	switch ($_POST["task"])
	{
		case "test_connection":
			$data = MySql::connectToMySQL(); 
			// $data["post"] = $_POST[ "task"]; 
			break;
		
		case "valid_session":
			$id = $_POST['session'];
			if (JsonSQL::rowExists ("session", $id, "sessions")) {
				$data = array ( "exists" => true );
			} else {
				$data = array ( "exists" => false );
			}		
			
			break;
		
		case "get_username":
			$id = $_POST['session'];
			$sql = "SELECT username FROM sessions WHERE session = '".$id."';";
			$username = MySql::runSelectQuery($sql);
			$sql = "SELECT * FROM users WHERE username = '".$username[0]['username']."';";
			$data = MySql::runSelectQuery($sql);
			
			break;
				
		case "get_users":
		
			$sql = "SELECT l.username, u.name, u.lastName FROM users u JOIN login l ON u.username = l.username AND l.username <> '".$_POST['username']."';";
			$data = MySql::runSelectQuery($sql);
		
			break;
		
		case "get_roles":
		
			$sql = "SELECT role FROM login WHERE username = '".$_POST['user']."';";
			$data = MySql::runSelectQuery($sql);
		
			break;
		
		case "update_role":
		
			$sql = "UPDATE login SET role= '".$_POST['role']."' WHERE username= '".$_POST['user']."';";
			$data = MySql::runOtherQuery($sql);
		
			break;
		
		case "update_user_data":
		
			$sql = "UPDATE users SET name = '".$_POST['data'][0]."', lastName = '".$_POST['data'][1]."', address = '".$_POST['data'][2].
					"', email = '".$_POST['data'][3]."', phone = '".$_POST['data'][4]."' WHERE username = '".$_POST['user']."' ";
			$data = MySql::runOtherQuery($sql);
		
			break;
		
		case "verify_password":
		
			$sql = "SELECT COUNT(*) AS count FROM login WHERE username = '".$_POST['user']."' AND password = '".$_POST['password']."';";
			$data = MySql::runSelectQuery($sql);
		
			break;
		
		case "update_password":
		
			$sql = "UPDATE login SET password = '".$_POST['new']."' WHERE password = '".$_POST['old']."';";
			$data = MySql::runOtherQuery($sql);
		
			break;
		
		case "delete_session":
			$sql = array (
				"statement" => "delete",
				"from"  => "sessions",
				"where" => array (
					"=" => array ( "session" => $_POST["session"] )
				)
			);
			$data = JsonSQL::sqlify ($sql);
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
		
		case "add_questions":
			$payload = $_POST['payload'];
			//$code    = MySql::runSelectQuery("SELECT code FROM catalog WHERE title = '".$payload['course']."';");
			
			foreach($payload['questions'] as $question ){
				$check = MySql::runSelectQuery("SELECT COUNT(*) AS count FROM questions WHERE question = '".$question['question']."';");
				if($check[0]['count'] == 0){
					$query = "INSERT INTO questions VALUES (NULL,'".$payload['course']."', '".$question['question']."', '".
							$question['answer']."', '".$question['choiceA']."', '".
							$question['choiceB']."', '".$question['choiceC']."', 1)";
					$data .= MySql::runOtherQuery($query);
				}
			}
			break;
		
		case "verify_count":
			//$code    = MySql::runSelectQuery("SELECT code FROM catalog WHERE title = '".$_POST['course']."';");
			$size    = MySql::runSelectQuery("SELECT COUNT(*) AS size FROM questions WHERE code = '".$_POST['course'].
											 "'AND active= 1;");
			$data    = $size;
			break;
		
		case "create_exam":
			//$code    = MySql::runSelectQuery("SELECT code FROM catalog WHERE title = '".$_POST['course']."';");
			$data    = MySql::runOtherQuery("INSERT INTO exams VALUES (NULL, '".$_POST['course']."', ".$_POST['size'].", '".$_POST['username'].
											"', CURRENT_TIMESTAMP, 1);");
			break;
		
		case "update_exam":
			//$code    = MySql::runSelectQuery("SELECT code FROM catalog WHERE title = '".$_POST['course']."';");
			$data    = MySql::runOtherQuery("UPDATE exams SET course = '".$_POST['course']."', questions = ".$_POST['size'].", username = '".$_POST['username'].
											"', created =  CURRENT_TIMESTAMP, active = '".$_POST['active']."' WHERE  course = '".$_POST['course']."';");
			break;
		
		case "get_exam":
			//$code    = MySql::runSelectQuery("SELECT code FROM catalog WHERE title = '".$_POST['course']."';");
			$data    = MySql::runSelectQuery("SELECT * FROM exams WHERE course = '".$_POST['course']."';");
			break;
		
		case "get_active_courses":
		
			$sql = "SELECT * FROM catalog WHERE code NOT IN ( SELECT c.code FROM catalog c JOIN enroll e ON e.code = c.code WHERE c.active =1 AND e.username = '".$_POST['user']."') AND code NOT IN (SELECT f.code FROM certificates f WHERE f.username = '".$_POST['user']."') AND active = 1 order by code;";
			$data =  MySql::runSelectQuery($sql);
			break;
		
		case "get_user_certificates":
		
			$sql = "SELECT * FROM certificates ".
					"WHERE username = '".$_POST['user']."';";
		
			$data =  MySql::runSelectQuery($sql);
			
			break;
		
		case "get_user_courses":
		
			$sql = "SELECT * FROM catalog c JOIN enroll e ON c.code = e.code  WHERE e.username = '".$_POST['user']."';";
			$data =  MySql::runSelectQuery($sql);
			break;
		
		case "update_question":
		 
			$data = MySql::runOtherQuery("UPDATE questions SET question = '".$_POST['question'][0]."', answer = '".$_POST['question'][1].
											"', choiceA = '".$_POST['question'][2]."', choiceB = '".$_POST['question'][3].
											"', choiceC = '".$_POST['question'][4]."', active = '".$_POST['question'][5].
										 	"' WHERE id = '".$_POST['id']."';");
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
		
		case"course_dir":
			
			$code	= $_POST['course_code'];
			$id 	= MySql::runSelectQuery("SELECT id FROM catalog WHERE code = '".$code."' ");
			$path 	= "/var/www/html/eLearning/admin/files/".$id[0]['id'];
			$data1 	= File::createDirectory($path);
 			if($data1){
			$sql 	= "UPDATE catalog SET path = '".$path."'   WHERE id = '".$id[0]['id']."' ";
			$data 	= MySql::runOtherQuery($sql);
			}else{$data = false;}
		
			break;
		
		case"scan_dir":
			$list = array();
 			$title	= $_POST['course_title'];
			$struc 	= MySql::runSelectQuery("SELECT path FROM catalog WHERE code = '".$title."' ");
			$id 	= MySql::runSelectQuery("SELECT id FROM catalog WHERE code = '".$title."' ");
			$path 	= $struc[0]['path'];
			$files 	= File::listFilesInsidePath($path);
		
			foreach($files as $names){
				if($names != "." && $names != ".."){
					$obj = array ("file"=>$names, "path"=>$id[0]['id']."/".$names);
					array_push($list, $obj);
				}
			}
			$data = array("list" => $list, "fullPath" => $path ) ; 
			break;
		
		case"del_file":
 			$file	= $_POST['file'];
			$path 	= $struc[0]['path'];
			$data 	= File::delFile($file);
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

		case "get_pool_info":
			//$code =  MySql::runSelectQuery ("SELECT code FROM catalog WHERE title = '".$_POST['course_title']."';");
			$sql = "SELECT * FROM questions WHERE code = '".$_POST['course_title']."';"; 
			$data = MySql::runSelectQuery ($sql);
			break;
		
		case "get_course_exam":
			$code =  MySql::runSelectQuery ("SELECT code FROM catalog WHERE title = '".$_POST['course']."';");
			$sql = "SELECT * FROM exams WHERE course = '".$code[0]['code']."';"; 
			$data = MySql::runSelectQuery ($sql);
			break;
		
		case "get_all_exams":
			$sql = "SELECT * FROM exams;"; 
			$data = MySql::runSelectQuery ($sql);
			break;
		
		case "verify_course_exam":
			//$code =  MySql::runSelectQuery ("SELECT code FROM catalog WHERE title = '".$_POST['course']."';");
			$sql = "SELECT COUNT(*) AS count FROM exams WHERE course = '".$_POST['course']."';"; 
			$data = MySql::runSelectQuery ($sql);
			break;
		
		
		case "get_pool_questions":
			//$code =  MySql::runSelectQuery ("SELECT code FROM catalog WHERE title = '".$_POST['course_title']."';");
			$sql = "SELECT question FROM questions WHERE code = '".$_POST['course_title']."';"; 
			$data = MySql::runSelectQuery ($sql);
			break;
		
		case "get_certifications":

			$sql = "SELECT u.name, u.lastName, u.profession, u.license, c.code, c.grade, c.exam_date, c.username FROM certificates c JOIN users u ON u.username = c.username WHERE status = 0;"; 
			$data = MySql::runSelectQuery ($sql);
			break;
		
		case "update_certification":
			
			$result = array();
		
			foreach($_POST['data'] as $user){
				$sql = "UPDATE certificates SET status = 1 WHERE username = '".$user['username']."';"; 
				array_push($result, MySql::runOtherQuery ($sql));
			}
		
			$data = $result;
			break;
		
		case "get_question_info":
		
			$sql = "SELECT * FROM questions WHERE question = '".$_POST['question']."';"; 
			$data = MySql::runSelectQuery ($sql);
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
		
		case "make_order":
			
			$data = Paypal::makeOrder($_POST['user'], $_POST['amt'], $_POST['data']);
			break;
		
		case "cancel_order":
			
			$data = Paypal::cancelOrder($_POST['id']);
			break;
		
		case "get_user_exams":
		
				$sql =  "SELECT e.id, e.course, e.questions FROM exams e JOIN enroll l ON l.code = e.course WHERE l.username =  '".$_POST['user']."' AND e.active =1";
				$data = MySql::runSelectQuery($sql);
		
			break;
		
		case "get_exam_course_code":
		
				$sql =  "SELECT course FROM exams WHERE id = '".$_POST['exam']."';";
				$data = MySql::runSelectQuery($sql);
		
			break;
		
		case "generate_exam":
		
				$questions = array();
				$choices   = array();
				$payload   = array();
				//$sql =  "SELECT e.id, e.course, e.questions FROM exams e JOIN enroll l ON l.code = e.course WHERE l.username =  '".$_POST['user']."' AND e.active =1";
				$value = MySql::runSelectQuery("SELECT questions FROM exams WHERE id = ".$_POST['exam']."");
				$sql = "SELECT * FROM questions q JOIN exams e ON q.code = e.course WHERE e.id = ".$_POST['exam']." ORDER BY Rand() LIMIT ".$value[0]['questions']."";
				$struc = MySql::runSelectQuery($sql);
				
				foreach($struc as $exam){
					$choices = [];
					array_push($choices , $exam['answer'],  $exam['choiceA'], $exam['choiceB'], $exam['choiceC']);
					shuffle($choices);
					array_push($payload, array( "question" => $exam['question'], "choices" => $choices));
				}
				
				$data = $payload;
			break;
		
		case "exam_correction":
		
				$exam = $_POST['exam'];
				$max = count($exam);
				$result = 0;
				$send = array();
				$send2 = array();
				$user = MySql::runSelectQuery("SELECT * FROM sessions WHERE session = ".$_POST['user']."");
				$profession = MySql::runSelectQuery("SELECT profession FROM users WHERE username = '".$user[0]['username']."'");
				$course = MySql::runSelectQuery("SELECT course FROM exams WHERE id = ".$_POST['id']."");
		
				foreach($exam as $answer){
					$sql = "SELECT COUNT(*) as value FROM questions WHERE question = '".$answer['question']."' AND answer = '".$answer['answer']."'";
					$struc = MySql::runSelectQuery($sql);
					$result += $struc[0]['value'];
					if ($struc[0]['value'] == 0){
						array_push($send, array("question" => $answer['question'], "answer" => $answer['answer'], "flag" => "fail"));
					}
				}
				
				$total = ($result/$max) * 100;
				
				if($total < 64){
					array_push($send2, array("exam"=>$send, "status"=>"fail", "grade"=>$total));
					MySql::runOtherQuery("DELETE FROM enroll WHERE username = '".$user[0]['username']."' AND code = '".$course[0]['course']."'");
					
				}else{
					$today = date("m.d.y");
					
					array_push($send2, array("exam"=>$send, "status"=>"pass", "grade"=>$total));
					MySql::runOtherQuery("DELETE FROM enroll WHERE username = '".$user[0]['username']."' AND code = '".$course[0]['course']."'");
					MySql::runOtherQuery("INSERT INTO certificates VALUES ('".$user[0]['username']."', '".$profession[0]['profession']."', '".$course[0]['course']."', ".$total.", CURRENT_TIMESTAMP, 0);");
					
				}
				$data = $send2;
			break;

		default:
			break;
	}

	echo json_encode($data); 
?>