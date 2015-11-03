var questions = [];
var CHECK = null;
var USER = null;
var index = 0;
var title = $("#input-field-exam-title").val();

getExamDropdownOptions();
printAllExams();

$(function() {
	$('input[name="daterange"]').daterangepicker();
});

 
$("#exam-danger-alert").hide ();
$("#exam-select-danger-alert").hide ();
$("#exam-title-danger-alert").hide ();
$("#exam-noQuestion-danger-alert").hide ();
$("#question-danger-alert").hide ();
$("#nochange-success-alert").hide ();
$("#change-success-alert").hide ();
$("#exam-create-select-danger-alert").hide ();
$("#exam-quantity-danger-alert").hide ();
$("#exam-quantity-exede-danger-alert").hide ();
$("#exam-exits-danger-alert").hide ();



$("#plus_button").click(function() {
	var x = questions.length+1;
	var id = "id=\""+x+"\"";
	var header = "id=\"top_"+x+"\"";
	var value = "top_"+x+"";
	var string= "<div "+id+">"+
					"<div class=\"panel panel-default\" style=\"background-color: #F8F8F8\">"+
							"<div class=\"panel-heading\"  style=\"height: 40px\">"+
								"<div class=\"form-group\">"+
									"<button data-toggle=\"collapse\" class=\"btn btn-default btn-xs\"  data-parent=\"#accordion\" href=\"#collapse"+x+"\">"+
										"<span class=\"glyphicon glyphicon-menu-hamburger\" aria-hidden=\"true\">"+
									"</button>"+"&nbsp;&nbsp;&nbsp;<strong id=\""+value+"\"></strong>"+
									"<button class=\"btn btn-danger btn-xs pull-right\" style=\"margin-top: -2px\" id=\"delete_question_"+x+"\">"+
										"<span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\">"+
									"</button>"+
								"</div>"+
							"</div>"+
							"<div id=\"collapse"+x+"\" class=\"panel-collapse collapse in\">"+
								"<div class=\"panel-body\">"+
									"<div id=\"input-field-question-"+x+"-container\" class=\"form-group input-color-verifier\">"+
										"<label>Question:</label>"+
										"<input type=\"text\" class=\"form-control\" id=\"input-field-question-"+x+"\" placeholder=\"Enter Question\">"+
									"</div>"+
									"<div id=\"input-field-answer-"+x+"-container\" class=\"form-group input-color-verifier\">"+
										"<label>Correct Answer: </label>"+
										"<input type=\"text\" style=\"width: 75%\" class=\"form-control\" id=\"input-field-answer-"+x+"\" placeholder=\"Enter Answer\">"+
									"</div>"+
									"<div id=\"input-field-choiceA-"+x+"-container\" class=\"form-group input-color-verifier\">"+
										"<label>Choice 1: </label>"+
										"<input type=\"text\" style=\"width: 75%\" class=\"form-control\" id=\"input-field-choiceA-"+x+"\" placeholder=\"Enter Choice 1\">"+
									"</div>"+
									"<div id=\"input-field-choiceB-"+x+"-container\" class=\"form-group input-color-verifier\">"+
										"<label>Choice 2: </label>"+
										"<input type=\"text\" style=\"width: 75%\" class=\"form-control\" id=\"input-field-choiceB-"+x+"\" placeholder=\"Enter Choice 2\">"+
									"</div>"+
									"<div id=\"input-field-choiceC-"+x+"-container\" class=\"form-group input-color-verifier\">"+
										"<label>Choice 3: </label>"+
										"<input type=\"text\" style=\"width: 75%\" class=\"form-control\" id=\"input-field-choiceC-"+x+"\" placeholder=\"Enter Choice 3\">"+
									"</div>"+
								"</div>"+
							"</div>"+
					"</div>"+"<hr class=\"featurette-divider\">"+
				"</div>"+
				"<script>"+
					"$(\"#delete_question_"+x+"\").click(function() {"+
						"$(\"#"+x+"\").remove();"+
						"questions["+(x-1)+"].status = \"removed\";"+
						"index--;"+
						"var temp = \"Questions:\"+ index;"+
						"$(\"#footer\").html(temp);"+
					"});"+
					"$( \"#input-field-question-"+x+"\").keyup(function(e){"+
						"var text = $(\"#input-field-question-"+x+"\").val();"+
					  		"$(\"#"+value+"\").html(text);"+
							"if(text.length > 45){"+
								"text = text.substring(0, 48 - 1);"+
								"text += \"...\";"+
								"$(\"#"+value+"\").html(text);"+
							"}"+
					"});"+
				"</script>";
	var obj = {"html":string,"status":"added"};
	questions.push (obj);
	
	if(questions.length === 1){
	$("#accordion").html (null);
	}
	$("#accordion").prepend(string);
	index++;
	var test = "Questions: "+index+"";
	$("#footer").html(test);
});

$("#insert_exam").click(function(){
	var bool = null;
	var bool1 = null;
	var bool2 = null;
	var payload = [];
	var exam = {};
	bool1 = getSelectedTitle();
	bool = getInputs(questions);
	if(bool && bool1){
		payload = getInputValues(questions);
		if(checkArray(payload)){
			exam = {"course":$("#existing-registered-courses-title").val(),
					"questions":payload
				   };
			modal(exam);
		}
	}
});

function getSelectedTitle(){
	var bool = true;
	var title = $("#existing-registered-courses-title").val();
	if(title === null){
		bool = false;
		$("#exam-select-danger-alert").show ("fast");
			setTimeout (function () {
				$("#exam-select-danger-alert").hide ("fast");
			}, 3000);
	}
	return bool;
}

function getTitle(){
	var bool = true;
	var title = $("#input-field-exam-title").val();
	if(title === ""){
		bool = false;
		$("#input-field-exam-title-container").addClass ("has-error");
		$("#exam-title-danger-alert").show ("fast");
			setTimeout (function () {
				$("#exam-title-danger-alert").hide ("fast");
			}, 3000);
	}else{
		resetInputFieldColor($("#input-field-exam-title-container"));
		$("#input-field-exam-title-container").addClass ("has-success");
	}
	return bool;
}

function checkArray(arr){
	var bool = true;
	if(arr.length < 1){
		bool = false;
		$("#exam-noQuestion-danger-alert").show ("fast");
		setTimeout (function () {
			$("#exam-noQuestion-danger-alert").hide ("fast");
		}, 3000);
	}
	return bool;
}

function modal(arr){
	var bool = null;
	$.getScript("scripts/bootbox.min.js", function() {
		bootbox.confirm({
			title: '<h2>Are you sure?</h2>',
			message: msg(arr),
			buttons: {
				'cancel': {
					label: 'No',
					className: 'btn-danger pull-left'
				},
				'confirm': {
					label: 'Yes',
					className: 'btn-primary pull-right'
				}
			},
			callback: function(result) {
				if (result) {
					var outApi = {"task":"add_questions", "payload": arr};
					performAjax(outApi, function(data){
						var json= JSON.parse(data);
						console.info(JSON.stringify(json));
						$("#accordion").html (null);
						$("#accordion").text ("Press the plus sign button to add a question.");
						getExamDropdownOptions ();
						$("#select-question-edit").html (null);
						questions = [];
					});
				}
			}
		});
	});
	return bool;
}

function getInputs(arr){
	var bool = true;
	for (var i = 0; i<arr.length;i++){
		if(arr[i].status != "removed"){
			if($("#input-field-question-"+(i+1)+"").val() === "" || $("#input-field-answer-"+(i+1)+"").val() === "" || 
			   $("#input-field-choiceA-"+(i+1)+"").val() === "" || $("#input-field-choiceB-"+(i+1)+"").val() === "" || 
			   $("#input-field-choiceC-"+(i+1)+"").val() === ""){
				console.info("Empty");
				bool = false;
				$("#exam-danger-alert").show ("fast");
				setTimeout (function () {
					$("#exam-danger-alert").hide ("fast");
				}, 3000);
				$("#input-field-question-"+(i+1)+"-container").addClass ("has-error");
				$("#input-field-answer-"+(i+1)+"-container").addClass ("has-error");
				$("#input-field-choiceA-"+(i+1)+"-container").addClass ("has-error");
				$("#input-field-choiceB-"+(i+1)+"-container").addClass ("has-error");
				$("#input-field-choiceC-"+(i+1)+"-container").addClass ("has-error");
				
			}else{
				
				resetInputFieldColor($("#input-field-question-"+(i+1)+"-container"));
				resetInputFieldColor($("#input-field-answer-"+(i+1)+"-container"));
				resetInputFieldColor($("#input-field-choiceA-"+(i+1)+"-container"));
				resetInputFieldColor($("#input-field-choiceB-"+(i+1)+"-container"));
				resetInputFieldColor($("#input-field-choiceC-"+(i+1)+"-container"));
				
				$("#input-field-question-"+(i+1)+"-container").addClass ("has-success");
				$("#input-field-answer-"+(i+1)+"-container").addClass ("has-success");
				$("#input-field-choiceA-"+(i+1)+"-container").addClass ("has-success");
				$("#input-field-choiceB-"+(i+1)+"-container").addClass ("has-success");
				$("#input-field-choiceC-"+(i+1)+"-container").addClass ("has-success");
			}
		}
	}	
	return bool;
}

function getInputValues(arr){
	var data = [];
	for (var i = 0; i<arr.length;i++){
		if(arr[i].status != "removed"){
			var obj = {
			"question"	:$("#input-field-question-"+(i+1)+"").val(),
			"answer"	:$("#input-field-answer-"+(i+1)+"").val(),
			"choiceA"	:$("#input-field-choiceA-"+(i+1)+"").val(),
			"choiceB"	:$("#input-field-choiceB-"+(i+1)+"").val(),
			"choiceC"	:$("#input-field-choiceC-"+(i+1)+"").val()
			};
			data.push(obj);
		}
	}
	return data;
}

function msg(arr){
	var string = "<h4>Course: "+arr.course+"</h4>"+
				 "<h4>Questions:</h4>";
	for(var i = 0; i<arr.questions.length; i++){
		string += ""+(i+1)+")"+arr.questions[i].question+"";
		string += "<ul style=\"list-style-type:circle\">"+
				  "<li> Answer  : "+arr.questions[i].answer+"</li>"+
				  "<li> Choice A: "+arr.questions[i].choiceA+"</li>"+
				  "<li> Choice B: "+arr.questions[i].choiceB+"</li>"+
				  "<li> Choice C: "+arr.questions[i].choiceC+"</li></ul>";
	}
	return string;
}
function msg2(arr){
	var string = "<h4>Course: "+$("#select-course-pool").val()+"</h4>"+
				 "<h4>Update Question:</h4>";
		string += ""+1+")"+arr[0]+"";
		string += "<ul style=\"list-style-type:circle\">"+
				  "<li> Answer  : "+arr[1]+"</li>"+
				  "<li> Choice A: "+arr[2]+"</li>"+
				  "<li> Choice B: "+arr[3]+"</li>"+
				  "<li> Choice C: "+arr[4]+"</li></ul>";
	return string;
}

function getExamDropdownOptions () {
	performAjax({
		"task": "get_courses_title"
	}, function (data) {
		var json = JSON.parse (data);
		var select_options = '<option disabled selected=true>Choose a course</option>';
		if (json.constructor === Array) {
			for (var i = 0; i < json.length; i++) {
				select_options += '<option>' + json[i].code + '</option>';
			}
		} else {
			select_options += '<option>' + json.title + '</option>';
		}
		$("#existing-registered-courses-title").html (select_options);
		$("#select-course-pool").html (select_options);
		$("#select-exam-course").html (select_options);
		$("#select-modify-exam").html (select_options);
	});
}

function getSelectQuestions (data) {
		var json = JSON.parse (data);
		var select_options = '<option disabled selected=true>Choose a Question</option>';
		if (json.constructor === Array) {
			for (var i = 0; i < json.length; i++) {
				select_options += '<option>' + json[i].question + '</option>';
			}
		} else {
			select_options += '<option>' + json.question + '</option>';
		}
		
		$("#select-question-edit").html (select_options);
	
}

function printQuestionsFunction (data) {
	var json = JSON.parse (data);
	// console.info(JSON.stringify (json));
	var table_content = "";
	var fields = ["question", "answer", "choiceA", "choiceB", "choiceC", "active"];
	
	if (json.constructor === Array) {
		for (var j = 0; j < json.length; j++) {
			table_content += "<tr>";
			for (var z = 0; z < fields.length; z++) {
				if(z===0){
					table_content += "<td>" + json[j][fields[z]] + "</a></td>"; 
				}
				else{
					table_content += "<td>" + json[j][fields[z]] + "</td>";
				}
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
	$("#question-table-body").html (table_content);
}

$("#select-course-pool").change (function () {
	//get question pool table content
	performAjax ({
		"task" : "get_pool_info",
		"course_title" : $(this).val ()
	},printQuestionsFunction);
	
	performAjax ({
		"task" : "get_pool_questions",
		"course_title" : $(this).val ()
	},getSelectQuestions);
	
	$("#question-edit-fields").html (null);
});

$("#select-question-edit").change (function () {
	
	var fields = "<div id=\"input-field-question-container\" class=\"form-group input-color-verifier\">"+
					"<label>Question:</label>"+
					"<input type=\"text\" class=\"form-control\" id=\"input-field-question\" placeholder=\"Enter Question\">"+
				"</div>"+
				"<div id=\"input-field-answer-container\" class=\"form-group input-color-verifier\">"+
					"<label>Choice 1 (correct answer): </label>"+
					"<input type=\"text\" style=\"width: 75%\" class=\"form-control\" id=\"input-field-answer\" placeholder=\"Enter Choice 1 (correct answer)\">"+
				"</div>"+
				"<div id=\"input-field-choiceA-container\" class=\"form-group input-color-verifier\">"+
					"<label>Choice 2: </label>"+
					"<input type=\"text\" style=\"width: 75%\" class=\"form-control\" id=\"input-field-choiceA\" placeholder=\"Enter Choice 2\">"+
				"</div>"+
				"<div id=\"input-field-choiceB-container\" class=\"form-group input-color-verifier\">"+
					"<label>Choice 3: </label>"+
					"<input type=\"text\" style=\"width: 75%\" class=\"form-control\" id=\"input-field-choiceB\" placeholder=\"Enter Choice 3\">"+
				"</div>"+
				"<div id=\"input-field-choiceC-container\" class=\"form-group input-color-verifier\">"+
					"<label>Choice 4: </label>"+
					"<input type=\"text\" style=\"width: 75%\" class=\"form-control\" id=\"input-field-choiceC\" placeholder=\"Enter Choice 4\">"+
				"</div>"+
				"<input id=\"input-checkbox-question-active\" type=\"checkbox\" name=\"active-checkbox\" value=\"1\">&nbsp;&nbsp;Currently Active";
	
	$("#question-edit-fields").html (fields);
	
	performAjax ({
		"task" : "get_question_info",
		"question" : $(this).val ()
	}, function (data) {
		var json = JSON.parse (data);
		console.info (JSON.stringify (json));
		
		$("#input-field-question").val (json[0].question);
		$("#input-field-answer").val (json[0].answer);
		$("#input-field-choiceA").val (json[0].choiceA);
		$("#input-field-choiceB").val (json[0].choiceB);
		$("#input-field-choiceC").val (json[0].choiceC);
		
		if (parseInt (json[0].active) === 1) { 
			$("#input-checkbox-question-active").prop ("checked", true);
		} else {
			$("#input-checkbox-question-active").prop ("checked", false);
		} 
	});
	$("#question-edit-fields").html (fields);
});


$("#edit_question").click(function(){
	
	var valid = true;
	var payload = [];
	var input_values = [];
	var compare = [];
	
	var INPUT_FIELDS = [
		"#input-field-question",
		"#input-field-answer",
		"#input-field-choiceA",
		"#input-field-choiceB",
		"#input-field-choiceC"];
	
		console.info(INPUT_FIELDS);
	if(typeof $(INPUT_FIELDS[0]).val() === 'undefined'){
		 valid = false;
	}
	
	// Get values for all input text fields and validate at the same time
	for (var i = 0; i < INPUT_FIELDS.length; i++) {
		resetInputFieldColor($(INPUT_FIELDS[i] + '-container'));
		if ($(INPUT_FIELDS[i]).val() === "" ) {
			$(INPUT_FIELDS[i] + '-container').addClass("has-error");
 			$("#question-danger-alert").show("fast");
			setTimeout(function() {
				$("#question-danger-alert").hide("fast");
			}, 5000);
			valid = false;
		} else {
			$(INPUT_FIELDS[i] + '-container').addClass("has-success");
			input_values.push($(INPUT_FIELDS[i]).val());
			// Check whether active checkbox is checked or not
		}
	}
	
	if ($("#input-checkbox-question-active").is (":checked")) {
		input_values.push (1);
	} else {
		input_values.push (0);
	}			

	console.info(input_values);
	//get questions values from database and compare with the input values
	if(valid){
		performAjax ({
			"task" : "get_question_info",
			"question" : $("#select-question-edit").val ()
		}, function (data) {
			var json = JSON.parse (data);
			console.info (JSON.stringify (json));
			var quest_id = json[0].id;
			var values = [json[0].question,
						  json[0].answer,
						  json[0].choiceA,
						  json[0].choiceB,
						  json[0].choiceC,
						  json[0].active];

			console.info (quest_id);
	/* 		if (parseInt (json.active) === 1) { 
				$("#input-checkbox-question-active").prop ("checked", true);
			} else {
				$("#input-checkbox-question-active").prop ("checked", false);
			} */
			//verify if no change is added to the question
			var index = 0;
			for(var i = 0; i < values.length; i++){
				if(input_values[i] == values[i]){
					console.info(input_values[i], "==", values[i]);
					index ++;
				}else{
					console.info(input_values[i], "!==", values[i]);
				}
			}
			// if they are equals do nothing erase content and show message for 5 seconds
			 if(index === values.length){
				$("#question-edit-fields").html(null);
			    $("#nochange-success-alert").show("fast");
				 
				setTimeout(function() {
					$("#nochange-success-alert").hide("fast");
				}, 5000);
				 
				valid = false;
				 
				performAjax ({
					"task" : "get_pool_questions",
					"course_title" : $("#select-course-pool").val ()
				},getSelectQuestions);
				 
			 }else{
				 // else update question on database
				 performAjax({
					 		"task":"update_question",
					 		"id": quest_id, 
					 		"question":input_values
				 },function(data){
					 var json = JSON.parse (data);
					 if(json.success){
						 //get and print content on table for selected course and showw success alert
						$.getScript("scripts/bootbox.min.js", function() {
							bootbox.confirm({
								title: '<h2>Are you sure?</h2>',
								message:msg2(input_values),
								buttons: {
									'cancel': {
										label: 'No',
										className: 'btn-danger pull-left'
									},
									'confirm': {
										label: 'Yes',
										className: 'btn-primary pull-right'
									}
								},
								callback: function(result) {
									if (result) {
										 performAjax ({
											"task" : "get_pool_info",
											"course_title" : $("#select-course-pool").val ()
											 
										},printQuestionsFunction);
										$("#question-edit-fields").html(null);
										$("#change-success-alert").show("fast");
										setTimeout(function() {
											$("#change-success-alert").hide("fast");
										}, 5000);
										
										performAjax ({
											"task" : "get_pool_questions",
											"course_title" : $("#select-course-pool").val ()
										},getSelectQuestions);
									}
								}
							});
						});
					 }
				 });
			 }
		});
	}
});

function verifyQuestionChange(param) {
	var validuser = null;
	performSajax({
		"task": "exist_user",
		"user_name": param
	}, function(data) {
		var json = JSON.parse(data);
		validuser = json.exists;
	});
	return validuser;
}

$("#input-field-exam-quantity-container").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
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

$("#input-field-modify-exams").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
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

function getSelectedTitleModifyExam(){
	var bool = true;
	var title = $("#select-modify-exam").val();
	if(title === null){
		bool = false;
		$("#exam-create-select-danger-alert").show ("fast");
			setTimeout (function () {
				$("#exam-create-select-danger-alert").hide ("fast");
			}, 3000);
	}
	return bool;
}

function getSelectedTitleExam(){
	var bool = true;
	var title = $("#select-exam-course").val();
	if(title === null){
		bool = false;
		$("#exam-create-select-danger-alert").show ("fast");
			setTimeout (function () {
				$("#exam-create-select-danger-alert").hide ("fast");
			}, 3000);
	}
	return bool;
}

$("#create_exam").click(function(){
	var bool = null;
	var payload = [];
	bool = getSelectedTitleExam();
	if(bool){
		if($("#input-field-exam-quantity").val() === "" || $("#input-field-exams-quantity").val() === null ){
			bool = false;
			$("#exam-quantity-danger-alert").show ("fast");
				setTimeout (function () {
					$("#exam-quantity-danger-alert").hide ("fast");
				}, 3000);
			$("#input-field-exam-quantity-container").addClass ("has-error");
		}else{
			$("#input-field-exam-quantity-container").addClass ("has-error");
			resetInputFieldColor($("#input-field-exam-quantity-container"));
			$("#input-field-exam-quantity-container").addClass ("has-success");
		}
	}
	
	if(bool){
		performAjax({
				"task":"verify_course_exam",
				"course": $("#select-exam-course").val()
			},function(data){
				var temp = JSON.parse(data);
				if(temp[0].count >= 1){
					$("#exam-exits-danger-alert").show ("fast");
						setTimeout (function () {
							$("#exam-exits-danger-alert").hide ("fast");
						}, 3000);
						$("#input-field-exam-quantity").val (null);
						resetInputFieldColor($("#input-field-exam-quantity-container"));
						getExamDropdownOptions();
						printAllExams();
				}else{
					performAjax({
						"task":"verify_count",
						"course": $("#select-exam-course").val()
					}, function(data){
						var json = JSON.parse(data);
						console.info( json[0].size);
						console.info($("#date").val());
						if(Number($("#input-field-exam-quantity").val()) <= Number(json[0].size) && Number($("#input-field-exam-quantity").val()) !== 0 ){
							$.getScript("scripts/bootbox.min.js", function() {
								bootbox.confirm({
									title: '<h2>Are you sure?</h2>',
									message: "Create exam",
									buttons: {
										'cancel': {
											label: 'No',
											className: 'btn-danger pull-left'
										},
										'confirm': {
											label: 'Yes',
											className: 'btn-primary pull-right'
										}
									},
									callback: function(result) {
										if (result) {
											performAjax({"task":"get_username",
													 "session":SESSION},function(data){
											var json = JSON.parse(data);
												performAjax({
													"task":"create_exam",
													"size":$("#input-field-exam-quantity").val(),
													"course": $("#select-exam-course").val(),
													"username":json[0].username
												}, function(data){
													json = JSON.parse(data);
													console.info(json);
													getExamDropdownOptions();
													$("#input-field-exam-quantity").val (null);
													resetInputFieldColor($("#input-field-exam-quantity-container"));
													printAllExams();
													console.info(SESSION);
												});
											});
										}
									}
								});
							});
						}else{
							$("#exam-quantity-exede-danger-alert").show ("fast");
							setTimeout (function () {
								$("#exam-quantity-exede-danger-alert").hide ("fast");
							}, 3000);
							$("#input-field-exam-quantity-container").addClass ("has-error");
						}
					});
				}
			}
		);
	}
});

function printExamsFunction (data) {
	var json = JSON.parse (data);
	// console.info(JSON.stringify (json));
	var table_content = "";
	var fields = ["course", "username", "questions", "created", "active"];
	
	if (json.constructor === Array) {
		for (var j = 0; j < json.length; j++) {
			table_content += "<tr>";
			for (var z = 0; z < fields.length; z++) {
				if(z===0){
					table_content += "<td>" + json[j][fields[z]] + "</a></td>"; 
				}
				else{
					table_content += "<td>" + json[j][fields[z]] + "</td>";
				}
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
	console.info(table_content);
	$("#exams-table-body").html (table_content);
}

$("#select-modify-exam").change (function () {
	//get question pool table content
	var string = "<div id=\"input-field-modify-exams-container\" class=\"form-group input-color-verifier\">"+
					"<label>Question Quantity: </label>"+
					"<input type=\"text\" style=\"width: 75%\" class=\"form-control\" id=\"input-field-modify-exams\" placeholder=\"Enter question quantity\">"+
				"</div>"+
				"<input id=\"input-checkbox-exam-active\" type=\"checkbox\" name=\"active-checkbox\" value=\"1\">&nbsp;&nbsp;Currently Active";
	
	$("#questions-modify-field").html (string);
	
	performAjax ({
		"task" : "get_exam",
		"course" : $(this).val ()
	},function(data){
		var json = JSON.parse(data);
		printExamsFunction(data);
		console.info(json);
		$("#input-field-modify-exams").val (json[0].questions);
		
		if (parseInt (json[0].active) === 1) { 
			$("#input-checkbox-exam-active").prop ("checked", true);
		} else {
			$("#input-checkbox-exam-active").prop ("checked", false);
		} 
	});
	
});

$("#modify_exam").click(function(){
	var bool = true;
	var payload = [];
	if(bool){
		if($("#input-field-modify-exams").val() === "" || $("#input-field-modify-exams").val() === null ){
			bool = false;
			$("#exam-quantity-danger-alert").show ("fast");
				setTimeout (function () {
					$("#exam-quantity-danger-alert").hide ("fast");
				}, 3000);
			$("#input-field-modify-exams-container").addClass ("has-error");
		}else{
			$("#input-field-modify-exams-container").addClass ("has-error");
			resetInputFieldColor($("#input-field-modify-exams-container"));
			$("#input-field-modify-exams-container").addClass ("has-success");
		}
	}
	
	if(bool){
		performAjax({
			"task":"verify_count",
			"course": $("#select-modify-exam").val()
		}, function(data){
			var json = JSON.parse(data);
			
			if( Number($("#input-field-modify-exams").val()) <= Number(json[0].size) && Number($("#input-field-modify-exams").val()) !== 0 ){
				$.getScript("scripts/bootbox.min.js", function() {
					bootbox.confirm({
						title: '<h2>Are you sure?</h2>',
						message: "Update exam",
						buttons: {
							'cancel': {
								label: 'No',
								className: 'btn-danger pull-left'
							},
							'confirm': {
								label: 'Yes',
								className: 'btn-primary pull-right'
							}
						},
						callback: function(result) {
							if (result) {
								
								if ($("#input-checkbox-exam-active").is (":checked")) {
									CHECK = 1;
								} else {
									CHECK = 0;
								}
								performAjax({"task":"get_username",
										 "session":SESSION},function(data){
								var json = JSON.parse(data);
									performAjax({
										"task":"update_exam",
										"size":$("#input-field-modify-exams").val(),
										"course": $("#select-modify-exam").val(),
										"username":json[0].username,
										"active": CHECK
									}, function(data){
										json = JSON.parse(data);
										console.info(json);
										printAllExams();
										getExamDropdownOptions();
										$("#input-field-modify-exams").val (null);
										$("#questions-modify-field").html (null);
									});
								});
							}
						}
					});
				});
			}else{
				$("#exam-quantity-exede-danger-alert").show ("fast");
				setTimeout (function () {
					$("#exam-quantity-exede-danger-alert").hide ("fast");
				}, 3000);
				$("#input-field-modify-exams-container").addClass ("has-error");
			}
		});
	}
});

function printAllExams(){
	performAjax ({
		"task" : "get_all_exams",
	},printExamsFunction);
}




