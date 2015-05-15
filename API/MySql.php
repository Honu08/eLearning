
<?php
	class MySql {

		public $mysqli;

		public function __construct(){
			$this->mysqli = new mysqli(DB_SERVERNAME, DB_USERNAME, DB_PASSWORD, DB_NAME);
		}

		public static function connectToMySQL(){
			$instance = new self();
			if($instance->mysqli->connect_error){
				return array("message"=>"Connection failed: ".$instance->mysqli->connect_error);
			}else{
				return array("message"=>"Connection successfully");
			}
		}

		public static function runSelectQuery($query){
			 $instance = new self();
			 $results = array ();
             if ($result = $instance->mysqli->query($query)) {
                if ($result->num_rows != 0) {
                    while ($object = $result->fetch_object()) {
                            array_push ($results, (array) $object);
                        }               
                    } else {
                		return array ("success" => false, "sql" => $query);
                 }
              } 
                
               return $results;
		}

		public static function runOtherQuery($query){
			 $instance = new self();
			 if ($instance->mysqli->query ($query)) {
             	return array ("success" => true, "sql" => $query);
             } else {
                return array ("success" => false, "sql" => $query);
             }
		}
		
		
		public static function getColumnNames ($table_name){
			$sql = 'SELECT COLUMN_NAME AS `column` FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = "' . $table_name . '";';
			$resultset = MySQL::runSelectQuery ($sql);
			$unwanted_columns = array ("id"); // Add unwanted columns by comma separation
			
			$columns = array ();
			for ($i = 0; $i < count ($resultset); $i++) {
				if (in_array ($resultset[$i]["column"], $unwanted_columns)) {
					continue;
				} else {
					$column_name  = explode ("_", $resultset[$i]["column"]);
					$final_string = "";

					for ($j = 0; $j < count ($column_name); $j++) {
						if ($j == (count ($column_name) - 1)) {
							$final_string .= ucfirst ($column_name[$j]);
						} else {
							$final_string .= ucfirst ($column_name[$j]) . " ";
						}
					}
					$object = array (
						"id"   => $resultset[$i]["column"],
						"name" => $final_string
					);

					array_push ($columns, $object);
				}
			}
			
			return $columns;
		}
	}
?>

