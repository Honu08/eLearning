<?php 
	require_once "Mail.php";  

	$from = "Sandra Sender <honurodz@gmail.com>";

	$to = "Ramona Recipient <djhonu_31@hotmail.com>"; 

	$subject = "Hi!"; 

	$body = "Hi,\n\nHow are you?";  

	$host = "smtp.gmail.com"; 

	$port = "587"; 

	$username = "obedandroids@gmail.com"; 

	$password = "oad102030@";  

	$headers = array ('From' => $from,   'To' => $to,   'Subject' => $subject); 

	$smtp = Mail::factory('smtp', array ('host' => $host,'port' => $port, 'auth' => true, 'username' => $username, 'password' => $password));  

	$mail = $smtp->send($to, $headers, $body);  
   
	if (PEAR::isError($mail)) {  
		print_r ("<p>" . $mail->getMessage() . "</p>");  
	} else {   
		print_r ("<p>Message successfully sent!</p>");  
} 
?>