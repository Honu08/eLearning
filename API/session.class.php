<?php
    class Session {
        
        public $session;
        
        public function __construct ($session) {
            $this->session = $session;
        }
        
        /*
         *  Initializes session and creates session file for active user
         *  - returns string of session id
         */
        public static function initSession ($data) {
            $instance = new self (JsonSQL::generateIdForTable ("sessions"));
                    
            if(!JsonSQL::rowExists ("username", $data["username"], "sessions")) {
                $sql = array (
                    "statement" => "insert",
                    "into" => "sessions",
                    "values" => array (
                        "username" => $data["username"],
                        "session"  => $instance->session,
                        "date"     => "timestamp",
                        "circle"   => $data["circle"]
                    )
                );
            } else {
                $sql = array (
                    "statement" => "update",
                    "table" => "sessions",
                    "set" => array (
                        "session" => $instance->session
                    ),
                    "where" => array (
                        "=" => array (
                            "username" => $data["username"]
                        )
                    )
                );
            }
            
            $response = JsonSQL::sqlify ($sql);
            $response["session"] = $instance->session;
            return $response;;              
        }
        
        /*
         *  Deletes session from database
         *  - returns bool; true if session deleted successfully, false if not
         */
        public static function closeSession ($session) {
            $sql = array (
                "statement" => "delete",
                "from" => "sessions",
                "where" => array (
                    "=" => array (
                        "session" => $session
                    )
                )
            );
            
            return JsonSQL::sqlify ($sql);
        }
    }
?>