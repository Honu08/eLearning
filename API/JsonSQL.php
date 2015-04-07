<?php
    
    /*
     *  JsonSQL v1.0.1
     * 	- constructs and executes SQL queries from JSON structures
	 * 	- constructs and executes SQL queries from PHP array structures
     *
     *  Copyright (c) 2015 Enrique Caballero
     *
     *  Licensed under MIT
     *
     *  Permission is hereby granted, free of charge, to any person obtaining a copy
     *  of this software and associated documentation files (the "Software"), to deal
     *  in the Software without restriction, including without limitation the rights
     *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     *  copies of the Software, and to permit persons to whom the Software is
     *  furnished to do so, subject to the following conditions:     
     *        
     *  The above copyright notice and this permission notice shall be included in
     *  all copies or substantial portions of the Software.
     *   
     *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
     *  THE SOFTWARE.     
     */
     
    class JsonSQL {
        public $mysqli;
        public $data;
        public $sql;
        
        public function __construct ($data) {
            $this->data   = $data;
            $this->mysqli = new mysqli (DATABASE_HOST, DATABASE_USER, DATABASE_PASS, DATABASE_NAME);
            $this->mysqli->set_charset ("utf8");
        }
        
        public static function sqlify ($data, $execute = true) {         
            $instance = new self ($data);
            
            switch ($instance->data["statement"]) {
                case 'select':
                    $instance->sql = $instance->constructSelectSQL ();
                    break;
                
                case 'insert':
                    $instance->sql = $instance->constructInsertSQL ();
                    break;
                    
                case 'update':
                    $instance->sql = $instance->constructUpdateSQL ();
                    break;
                    
                case 'delete':
                    $instance->sql = $instance->constructDeleteSQL ();
                    break;
                    
            }
            
            if ($execute) {
                return $instance->executeSQL ();
            } else {
                return $instance->sql;
            }            
        }
        
        /*
         *  Checks the existence of one item in specified table
         *  - returns bool; true if exists, false if not
         */
        public static function rowExists ($key, $value, $table) {
            $sql = array (
                "statement" => "select",
                "columns" => array (
                    "*"
                ),
                "from" => array (
                    $table
                ),
                "where" => array (
                    "=" => array (
                        $key => $value
                    )
                )
            );
        
            $instance = new self ($sql);
            $query = $instance->constructSelectSQL ();
            
            if ($result = $instance->mysqli->query($query)) {
                if ($result->num_rows != 0) {
                    return true;
                } else {
                    return false;
                }
            } 
        }
        
        /*
         *  Executes a raw SQL query
         *  - returns results in array structure if successful, false if not 
         */
        public static function rawSQL ($query) {
            $instance = new self (null);
            $results = array ();
            if ($result = $instance->mysqli->query($query)) {
                if ($result->num_rows != 0) {
                    while ($object = $result->fetch_object()) {
                        array_push ($results, (array) $object);
                    }               
                } else {
                    return array ( "success" => false );
                }
            } 
            return $results;
        }
        
        /*
         *  Builds SELECT SQL query
         *  - returns SQL query string
         */
        private function constructSelectSQL () {
            $sql = "";  
        
            if (isset ($this->data["columns"])) {
                $select_string = "SELECT ";
                foreach ($this->data["columns"] as $column) {
                    if($column == "*") {
                        $select_string .= $column . ", ";
                    } else {
                        if (preg_match ("/count/i", $column)) {
                            $count = explode (":", $column);
                            if (count ($count) == 2) {
                                if ($count[1] == "*") {
                                    $select_string .= "COUNT(*), ";
                                } else {
                                    $select_string .= "COUNT(`" . $count[1] . "`), ";
                                }
                            } else {
                                if ($count[1] == "*") {
                                    $select_string .= "COUNT(*) AS `" . $count[2] . "`, ";
                                } else {
                                    $select_string .= "COUNT(`" . $count[1] . "`) AS `" . $count[2] . "`, ";
                                }
                            }
                        } else {
                            $select_string .= "`" . $column . "`, ";
                        }
                    }
                }
                $sql .= rtrim ($select_string, ", ") . " ";
            } else {
                return array ("success" => false, "message" => "No SELECT object found.");
            }
            
            if (isset ($this->data["from"])) {
                $from_string = "FROM ";
                foreach ($this->data["from"] as $table) {
                    $from_string .= "`" . $table . "`, ";
                }
                $sql .= rtrim ($from_string, ", ") . " ";
            } else {
                return array ("success" => false, "message" => "No FROM object found.");
            }
            
            if (isset ($this->data["where"])) {
                $where_string = "WHERE ";
                $where_string .= $this->constructWhereStatement ();
                $sql .= $where_string . " ";
            }
            
            if (isset ($this->data["orderby"])) {
                $order_string = "ORDER BY ";
                $keys = array_keys($this->data["orderby"]);
                foreach ($keys as $key) {
                    $order_string .= "`" . $key . "` " . $this->data["orderby"][$key] . ", ";
                }
                $sql .= rtrim ($order_string, ", ") . " ";
            }

            return rtrim ($sql, " ") . ";";
        }
        
        /*
         *  Builds INSERT SQL query
         *  - returns SQL query string
         */
        private function constructInsertSQL () {            
            $keys = array_keys ($this->data["values"]);
            
            $insert_string = "INSERT INTO `" . $this->data["into"] . "` (";
            
            $values_string = "VALUES (";
            foreach ($keys as $key) {
                $insert_string .= "`" . $key . "`, ";
                
                if ($this->data["values"][$key] == "timestamp") {
                    $values_string .= "CURRENT_TIMESTAMP, ";
                } else if($this->data["values"][$key] == null) {
                    $values_string .= "NULL, ";
                } else {
                    if (is_string ($this->data["values"][$key])) {
                        $values_string .= "\"". $this->data["values"][$key] . "\", ";
                    } else if (is_numeric ($this->data["values"][$key])) {
                        $values_string .= $this->data["values"][$key] . ", ";
                    }
                }
            }
            
            $insert_string = rtrim ($insert_string, ", ") . ")";
            $values_string = rtrim ($values_string, ", ") . ")";
                
            $sql = $insert_string . " " . $values_string . ";";
            
            return $sql;
        }
        
        /*
         *  Builds UPDATE SQL query
         *  - returns SQL query string
         */
        private function constructUpdateSQL () {
            $keys = array_keys ($this->data["set"]);
            
            $update_string = "UPDATE `" . $this->data["table"] . "` SET ";
            foreach ($keys as $key) {
                if ($this->data["set"][$key] == "timestamp") {
                    $update_string .= "`" . $key . "` = CURRENT_TIMESTAMP, ";
                } else if($this->data["set"][$key] == null) {
                    $values_string .= "NULL, ";
                } else {
                    if (is_string ($this->data["set"][$key])) {
                        $update_string .= "`" . $key . "` = \"" . $this->data["set"][$key] . "\", ";
                    } else if (is_numeric ($this->data["set"][$key])) {
                        $update_string .= "`" . $key . "` = " . $this->data["set"][$key] . ", ";
                    }
                }
            }
            $update_string = rtrim ($update_string, ", ");
            
            $where_string = "WHERE ";
            if (isset ($this->data["where"])) {
                $where_string .= $this->constructWhereStatement ();
            } else {
                return array ("success" => false, "message" => "No WHERE object found.");
            }
            
            $sql = $update_string . " " . $where_string . ";";
            
            return $sql;
        }
        
        /*
         *  Builds DELETE SQL query
         *  - returns SQL query string
         */
        private function constructDeleteSQL () {
            $delete_string = "DELETE FROM `" . $this->data["from"] . "`";
            
            $where_string = "WHERE ";
            if (isset ($this->data["where"])) {
                $where_string .= $this->constructWhereStatement ();
            } else {
                return array ("success" => false, "message" => "No WHERE object found.");
            }
            
            $sql = $delete_string . " " . $where_string . ";";
            
            return $sql;
        }
        
        /*
         *  Builds WHERE statement for SQL queries with where conditions
         *  - returns SQL query string
         */
        private function constructWhereStatement () {
            $operators = array_keys ($this->data["where"]);
            
            $statement = "";
            foreach ($operators as $operator) {             
                foreach ($this->data["where"][$operator] as $key => $value) {
                    $inside_keys = array ();
                    
                    if (is_array ($value)) {
                        $inside_keys = array_keys ($value);
                        
                        foreach ($inside_keys as $inside_key) {
                            $statement .= " " . $key . " ";
                            if (is_string ($value[$inside_key])) {
                                $statement .= "`" . $inside_key . "` " . $operator . " \"" . $value[$inside_key] . "\" " . $key . " ";
                            } else if (is_numeric ($value[$inside_key])) {
                                $statement .= "`" . $inside_key . "` " . $operator . " " . $value[$inside_key] . " " . $key . " ";
                            }
                            
                            $statement = rtrim ($statement, "AND ");
                            $statement = rtrim ($statement, "and ");
                            $statement = rtrim ($statement, "OR ");
                            $statement = rtrim ($statement, "or ");
                        }
                        
                    } else {
                        $statement .= " AND ";
                        if (is_string ($value)) {
                            $statement .= "`" . $key . "` " . $operator . " \"" . $value . "\" AND ";
                        } else if (is_numeric ($value)) {
                            $statement .= "`" . $key . "` " . $operator . " " . $value . " AND ";
                        }
                        
                        $statement = rtrim ($statement, "AND ");
                    }
                }                       
            }
            
            $statement = ltrim ($statement, " AND ");
            $statement = ltrim ($statement, " and ");
            $statement = ltrim ($statement, " OR ");
            $statement = ltrim ($statement, " or ");
            
            return $statement;
        }       
        
        /*
         *  Executes built SQL query
         *  - returns bool in array structure; true if successful, false if not 
         */
        private function executeSQL () {
            if ($this->data["statement"] == "select") {
                $results = array ();
                if ($result = $this->mysqli->query ($this->sql)) {
                    if ($result->num_rows != 0) {
                        while ($object = $result->fetch_object ()) {
                            array_push ($results, (array) $object);
                        }
                    } else {
                        return array ( "success" => false );
                    }
                } 
                
                if (is_array ($results)) {
                    if (count ($results) == 1) {
                        return $results[0];
                    } else {
                        return $results;
                    }
                } else {
                    return $results;
                }
            } else {
                if ($this->mysqli->query ($this->sql)) {
                    return array ("success" => true, "sql" => $this->sql);
                } else {
                    return array ("success" => false, "sql" => $this->sql);
                }
            }
        }           
                    
        /*
         *  Generates random ID number string for specified table
         *  - returns string
         */
        public static function generateIdForTable ($table) {
            $id = mt_rand (0, 100000000000);
            while(self::rowExists ("id", $id, $table)) {
                $id = mt_rand (0, 100000000000);
            }
            return (string) $id;
        }                               
    }

?>