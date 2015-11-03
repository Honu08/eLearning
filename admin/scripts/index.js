var SET_DROPDOWN_OPTIONS = false;
SESSION = urlParse("session");
			console.info(SESSION);
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

$("#print_course").click(function() {
	performAjax({
		"task": "get_courses"
	}, printCoursesFunction);
});

setInterval (function () {
	performAjax({
		"task": "get_courses"
	}, printCoursesFunction);
}, 1000);

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

$("#delete_course").click(function() {
	resetAllInputFieldColors ();
	
	var course_code = $(INPUT_FIELDS[0]).val ().trim ();
	console.info (course_code);
	
 	if (course_code === '' || course_code === null) {
		$(INPUT_FIELDS[0] + '-container').addClass ("has-error");
		$("#delete-error-alert").show ("fast");
		setTimeout (function () {
			$("#delete-error-alert").hide ("fast");
		}, 3000);
		
	} else {
		$(INPUT_FIELDS[0] + '-container').addClass ("has-success");

 		setTimeout (function () {
			performAjax({
				"task": "exist_course",
				"course_code" : course_code
			}, function (data) {
				var json = JSON.parse (data);
				console.info (JSON.stringify (json));
 				if (json.exists) {
					performAjax({
						"task": "delete_course",
						"course_code": course_code
					}, deleteSuccessFunction);
				} else {	
					$("#delete-error-alert").show ("fast");
					setTimeout (function () {
						$("#delete-error-alert").hide ("fast");
						resetInputFields (null);
					}, 3000);
				}
			});
		}, 1000);
	}
});

$("#modify_course").click (function () {
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
	
 	if (validated) {		
		performAjax({
			"task" : "update_course",
			"previous_course" : $("#existing-registered-courses").val (),
			"course_code"  : input_values[0],
			"course_type"  : input_values[1],
			"course_title" : input_values[2],
			"course_desc"  : input_values[3],
			"course_price" : input_values[4],
			"course_active": input_values[5]
		}, function (data) {
			var json = JSON.parse (data);

			if (json.success === true) {
				performAjax({
					"task": "get_courses"
				}, printCoursesFunction);
				
				resetInputFields ();
				getDropdownOptions ();
				getExamDropdownOptions ();
				getFileDropdownOptions();
				
				$("#update-success-alert").show ("fast");
				setTimeout (function () {
					$("#update-success-alert").hide ("fast");
				}, 3000);
			} else {
				$("#update-error-alert").show ("fast");
				setTimeout (function () {
					$("#update-error-alert").hide ("fast");
				}, 3000);
			}	
		});
	} else {
		$("#update-error-alert").show ("fast");
		setTimeout (function () {
			$("#update-error-alert").hide ("fast");
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
//filter
$("#input-field-price").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) || 
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
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

function deleteSuccessFunction(data) {
	var json = JSON.parse (data);
	console.info(JSON.stringify (json));

	if (json.success === true) {
		performAjax({
			"task": "get_courses"
		}, printCoursesFunction);
		
		resetInputFields ();
		getDropdownOptions ();
		
		$("#delete-success-alert").show ("fast");
		setTimeout (function () {
			$("#delete-success-alert").hide ("fast");
		}, 3000);

	} else {
		$("#delete-error-alert").show ("fast");
		setTimeout (function () {
			$("#delete-error-alert").hide ("fast");
		}, 3000);
	}
}

function printCoursesFunction (data) {
	var json = JSON.parse (data);
	// console.info(JSON.stringify (json));
	var table_content = "";
	var fields = ["code", "title", "desc", "active", "price"];
	
	if (json.constructor === Array) {
		for (var j = 0; j < json.length; j++) {
			table_content += "<tr>";
			for (var z = 0; z < fields.length; z++) {
				table_content += "<td>" + json[j][fields[z]] + "</td>";
			}
			table_content += "</tr>";
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
	$("#course-table-body").html (table_content);
}

function errorFunction(data) {
	console.info(data.text);
}

function getUsername(){
	performAjax({"task":"get_username",
				 "session":SESSION},function(data){
		var json = JSON.parse(data);
		console.info(data);
		$("#username").html("&nbsp;&nbsp;"+json[0].name+"&nbsp;"+json[0].lastName+"&nbsp;&nbsp;");
	});
	
}



function urlParse(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
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
