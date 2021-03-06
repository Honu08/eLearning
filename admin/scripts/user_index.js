var SET_DROPDOWN_OPTIONS = false;
DATA = null;
USERNAME =null;
SESSION = urlParse("session");

getUsername();
	
var INPUT_FIELDS = [
		"#input-field-code",
		"#input-field-type",
		"#input-field-title",
		"#input-field-desc",
		"#input-field-price"
	];

$("#insert-success-alert").hide ();
$("#insert-error-alert").hide ();
$("#delete-success-alert").hide ();
$("#delete-error-alert").hide ();
$("#update-success-alert").hide ();
$("#update-error-alert").hide ();

//logout event
$("#logout").click(function(){
	console.info("logout");
	performAjax({"task":"delete_session",
				 "session":session},function(data){
		var json = JSON.parse(data);
			window.location.href = "login.html";
	});
});

//print available course minus user courses
performAjax({"task":"get_username",
				 "session":SESSION},function(data){
		var json = JSON.parse(data);
		performAjax({
			"task": "get_active_courses",
			"user": json[0].username
		}, printCoursesFunction);
});

//print user certificates
performAjax({"task":"get_username",
				 "session":SESSION},function(data){
		var json = JSON.parse(data);
		performAjax({
			"task": "get_user_certificates",
			"user": json[0].username
		}, function(data){
			var json = JSON.parse(data);
			console.info(json);
			printCertificatesFunction(json);
		});
});

function performAjax(data, callback) {
	$.ajax({
		url: "../API/main.php",
		type: "POST",
		data: data,
		success: callback,
		error: errorFunction
	});
}


$("#submit_course").click(function() {
	var validated    = true;
	var input_values = [];
	
	// Get values for all input text fields and validate at the same time
	for (var i = 0; i < INPUT_FIELDS.length; i++) {
		resetInputFieldColor ($(INPUT_FIELDS[i] + '-container'));
		if ($(INPUT_FIELDS[i]).val () === "") {
			$(INPUT_FIELDS[i] + '-container').addClass ("has-error");
			validated = false;
		} else {
			$(INPUT_FIELDS[i] + '-container').addClass ("has-success");
			input_values.push ($(INPUT_FIELDS[i]).val ());
		}
	}
	
	// Check whether active checkbox is checked or not
	if ($("#input-checkbox-active").is (":checked")) {
		input_values.push (1);
	} else {
		input_values.push (0);
	}			
	
	console.info (JSON.stringify (input_values));
	
	// If validated is true, send to server
 	if (validated) {		
		performAjax({
			"task" : "insert_course",
			"course_code"  : input_values[0],
			"course_type"  : input_values[1],
			"course_title" : input_values[2],
			"course_desc"  : input_values[3],
			"course_price" : input_values[4],
			"course_active": input_values[5]
		}, function (data) {
			var json = JSON.parse (data);

			if (json.success === true) {
				
				//make dir
				performAjax({
					"task": "course_dir",
					"course_code" : input_values[0],
				}, function(data){
					var json = JSON.parse (data);
					console.info(data);
				});
				
				performAjax({
					"task": "get_courses"
				}, printCoursesFunction);
				
				resetInputFields ();
				getDropdownOptions ();
				getExamDropdownOptions();
				getFileDropdownOptions();

				$("#insert-success-alert").show ("fast");
				setTimeout (function () {
					$("#insert-success-alert").hide ("fast");
				}, 3000);
			} else {
				$("#insert-error-alert").show ("fast");
				setTimeout (function () {
					$("#insert-error-alert").hide ("fast");
				}, 3000);
			}	
		});
	} else {
		$("#insert-error-alert").show ("fast");
		setTimeout (function () {
			$("#insert-error-alert").hide ("fast");
		}, 3000);
	}
});





$("#existing-registered-courses").change (function () {
	resetAllInputFieldColors ();
	
	performAjax ({
		"task" : "get_course_info",
		"course_code" : $(this).val ()
	}, function (data) {
		var json = JSON.parse (data);
		console.info (JSON.stringify (json));
		
		$(INPUT_FIELDS[0]).val (json.code);
		$(INPUT_FIELDS[1]).val (json.type);
		$(INPUT_FIELDS[2]).val (json.title);
		$(INPUT_FIELDS[3]).val (json.desc);
		$(INPUT_FIELDS[4]).val (json.price);
		
		if (parseInt (json.active) === 1) { 
			$("#input-checkbox-active").prop ("checked", true);
		} else {
			$("#input-checkbox-active").prop ("checked", false);
		}
	});
});


function getDropdownOptions () {
	performAjax({
		"task": "get_courses"
	}, function (data) {
		var json = JSON.parse (data);
		var select_options = '<option disabled selected=true>Choose a course</option>';
		
		if (json.constructor === Array) {
			for (var i = 0; i < json.length; i++) {
				select_options += '<option>' + json[i].code + '</option>';
			}
		} else {
			select_options += '<option>' + json.code + '</option>';
		}
		$("#existing-registered-courses").html (select_options);
	});
}

function resetInputFields () {
	for (var i = 0; i < INPUT_FIELDS.length; i++) {
		$(INPUT_FIELDS[i]).val (null);
		resetInputFieldColor ($(INPUT_FIELDS[i] + '-container'));
	}
	$("#input-checkbox-active").prop ("checked", false);
}

function resetInputFieldColor (field) {
	if (field.hasClass ("has-error")) {
		field.removeClass ("has-error");
	} else if (field.hasClass ("has-success")) {
		field.removeClass ("has-success");
	}
}

function resetAllInputFieldColors () {
	for (var i = 0; i < INPUT_FIELDS.length; i++) {
		var field = $(INPUT_FIELDS[i] + '-container');
		if (field.hasClass ("has-error")) {
			field.removeClass ("has-error");
		} else if (field.hasClass ("has-success")) {
			field.removeClass ("has-success");
		}
	}
}



function printCoursesFunction (data) {
	var json = JSON.parse (data);
	console.info("aquiiiiiiiii",json);
	DATA = json;
	var table_content = "";
	var fields = ["select","code", "title", "desc", "price"];
	
	if (json.constructor === Array) {
		for (var j = 0; j < json.length; j++) {
			table_content += "<tr>";
			for (var z = 0; z < fields.length; z++) {
				if(z === 0){
					table_content += "<td> <input id=\"input-checkbox-active-"+(j+1)+"\" type=\"checkbox\" name=\"active-checkbox\" value=\"1\">"+
									"<script>"+
										
									"</script></td>";
				}else{
					table_content += "<td>" + json[j][fields[z]] + "</td>";
				}
			}
			table_content += "</tr>";
			console.info(JSON.stringify (table_content));
		}
	} else {
		table_content += "<tr>";
		for (var i = 0; i < fields.length; i++) {
			table_content += "<td>" + json[fields[i]] + "</td>";
		}
		table_content += "</tr>";
	}
	
	if (!SET_DROPDOWN_OPTIONS) {
		getDropdownOptions ();
		SET_DROPDOWN_OPTIONS = true;
	}
	
	if(DATA.length > 0){
		$("#course-table-body").html (table_content);
	}else{
		$("#course-table-body").html ("No Course Avilable");
	}
	
	console.info(DATA);
}

function printCertificatesFunction (data) {
	console.info(data);
	var table_content = "";
	var fields = ["username","profession", "code", "grade", "exam_date"];
	
	if (data.constructor === Array) {
		for (var j = 0; j < data.length; j++) {
			table_content += "<tr>";
			for (var z = 0; z < fields.length; z++) {
					table_content += "<td>" + data[j][fields[z]] + "</td>";
			}
			table_content += "</tr>";
			console.info(JSON.stringify (table_content));
		}
	} else {
		table_content += "<tr>";
		for (var i = 0; i < fields.length; i++) {
			table_content += "<td>" + data[fields[i]] + "</td>";
		}
		table_content += "</tr>";
	}
	
	if (!SET_DROPDOWN_OPTIONS) {
		getDropdownOptions ();
		SET_DROPDOWN_OPTIONS = true;
	}
	
	if(data.length > 0){
		$("#certificates-table-body").html (table_content);
	}else{
		$("#certificates-table-body").html ("No Certificate Avilable");
	}
}

function errorFunction(data) {
	console.info(data.text);
}

function getUsername(){
	performAjax({"task":"get_username",
				 "session":SESSION},function(data){
		var json = JSON.parse(data);
		console.info(data);
		USERNAME = json[0].username;
		$("#username").html("&nbsp;&nbsp;"+json[0].name+"&nbsp;"+json[0].lastName+"&nbsp;&nbsp;");
	});
}

function urlParse(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$("#enroll-button").click(function(){
	var input_values = [];
	var username = USERNAME;
	var amt;
	for(var i=0; i<DATA.length; i++){
		// Check whether active checkbox is checked or not
		if ($("#input-checkbox-active-"+(i+1)+"").is (":checked")) {
			input_values.push (DATA[i]);
		} else {
		}
	}
	
	if(input_values.length !== 0){
		amt = getAmount(input_values);
		performAjax({
			"task":"make_order",
			"user":username,
			"amt": amt,
			"data": input_values
		},function(data){
			var json = JSON.parse(data);
			var order = json.order;
			var amt = json.amt;
			console.info(order);
			$.getScript("scripts/bootbox.min.js", function() {
				bootbox.dialog({
					title: '<h2>V.E.P Order</h2>',
					message: "<script async src=\"scripts/paypal-button.min.js?merchant=Djhonu_31-facilitator@hotmail.com\""+
								"data-button      =\"buynow\""+
								"data-name        =\"Matricula\""+
								"data-item_number = \""+order+"\""+
								"data-amount      =\""+amt+"\""+
								"data-env         ='sandbox'>"+	
							"</script>",
					 buttons: {
						danger: {
						  label: "Cancel",
						  className: "btn-danger",
						  callback: function() {
							  performAjax({
								  "task":"cancel_order",
								  "id" : order
							  }, function(data){
								  var json = JSON.parse(data);
								  console.info(json);
							  });
						  }
						}
					 }
				});
			});
		});
	}else{
		//show error, "no course selected"
	}
	
});


function paypal(order, amt){
	var string = "";
	string = "<script async src='scripts/paypal-button.min.js?merchant=Djhonu_31-facilitator@hotmail.com'"+
					"data-button     ='buynow'"+
					"data-name        ='CNDPR Enroll'"+
					"data-item_number = '"+order+"'"+
					"data-amount      ='"+amt+"'"+
					"data-env         ='sandbox'>"+	
				"</script>";
	return string;
}

function getAmount(arr){
	var amt = 0;
	for(var i=0; i<arr.length; i++){
		amt += Number(arr[i].price);
	}
	return amt;
}
/* function preparePage (data){
	var json = JSON.parse (data);
	var table_header = "<tr>";
	
	for (var i = 0; i < json.length; i++) {
		input_fields += '<div id="input-' + json[i].id + '" class="form-group input-color-verifier">';
		input_fields += '<label>' + json[i].name + ':</label>';
		input_fields += '<input type="text" class="form-control" id="' + json[i].id + '" placeholder="Enter a ' + json[i].name + '">';
		input_fields += '</div>';
		
		table_header += '<th>' + json[i].name + '</th>';
	}
	table_header += '</tr>';
	
	$("#dynamic-input-fields").html (null);
	$("#course-table-header").html (null);
	
	$("#dynamic-input-fields").html (input_fields);
	$("#course-table-header").html (table_header);
	
	COLUMN_NAMES = json;
}
 */