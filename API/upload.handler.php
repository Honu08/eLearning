
<?php
	$filename      = $_FILES["file"]["name"];
	$temp_location = $_FILES["file"]["tmp_name"];

	var_dump ($filename);
	echo $temp_location;
	var_dump( $_POST);

	if(!$temp_location) {
		exit ();
	}

	if(move_uploaded_file ($temp_location, $_POST['value']."/".$filename)) {
		echo "Upload succeeded.";
	} else {
		echo "Upload failed.";
	}
?>