var questions = [];
var index = 0;
var title = $("#input-field-exam-title").val();

getExamDropdownOptions();

$("#exam-danger-alert").hide ();
$("#exam-select-danger-alert").hide ();
$("#exam-title-danger-alert").hide ();
$("#exam-noQuestion-danger-alert").hide ();
$("#question-danger-alert").hide ();


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

function getExamDropdownOptions () {
	performAjax({
		"task": "get_courses_title"
	}, function (data) {
		var json = JSON.parse (data);
		var select_options = '<option disabled selected=true>Choose a course</option>';
		if (json.constructor === Array) {
			for (var i = 0; i < json.length; i++) {
				select_options += '<option>' + json[i].title + '</option>';
			}
		} else {
			select_options += '<option>' + json.title + '</option>';
		}
		$("#existing-registered-courses-title").html (select_options);
		$("#select-course-pool").html (select_options);
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
	var fields = ["question", "answer", "choiceA", "choiceB", "choiceC"];
	
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
					"<label>Correct Answer: </label>"+
					"<input type=\"text\" style=\"width: 75%\" class=\"form-control\" id=\"input-field-answer\" placeholder=\"Enter Answer\">"+
				"</div>"+
				"<div id=\"input-field-choiceA-container\" class=\"form-group input-color-verifier\">"+
					"<label>Choice 1: </label>"+
					"<input type=\"text\" style=\"width: 75%\" class=\"form-control\" id=\"input-field-choiceA\" placeholder=\"Enter Choice 1\">"+
				"</div>"+
				"<div id=\"input-field-choiceB-container\" class=\"form-group input-color-verifier\">"+
					"<label>Choice 2: </label>"+
					"<input type=\"text\" style=\"width: 75%\" class=\"form-control\" id=\"input-field-choiceB\" placeholder=\"Enter Choice 2\">"+
				"</div>"+
				"<div id=\"input-field-choiceC-container\" class=\"form-group input-color-verifier\">"+
					"<label>Choice 3: </label>"+
					"<input type=\"text\" style=\"width: 75%\" class=\"form-control\" id=\"input-field-choiceC\" placeholder=\"Enter Choice 3\">"+
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
		
/* 		if (parseInt (json.active) === 1) { 
			$("#input-checkbox-question-active").prop ("checked", true);
		} else {
			$("#input-checkbox-question-active").prop ("checked", false);
		} */
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
	
	// Get values for all input text fields and validate at the same time
	for (var i = 0; i < INPUT_FIELDS.length; i++) {
		resetInputFieldColor($(INPUT_FIELDS[i] + '-container'));
		if ($(INPUT_FIELDS[i]).val() === "") {
			$(INPUT_FIELDS[i] + '-container').addClass("has-error");
 			$("#question-danger-alert").show("fast");
			setTimeout(function() {
				$("#question-danger-alert").hide("fast");
			}, 5000);
			valid = false;
		} else {
			$(INPUT_FIELDS[i] + '-container').addClass("has-success");
			input_values.push($(INPUT_FIELDS[i]).val());
		}
	}

	console.info(input_values);
	if(valid){
		performAjax ({
			"task" : "get_question_info",
			"question" : $("#select-question-edit").val ()
		}, function (data) {
			var json = JSON.parse (data);
			console.info (JSON.stringify (json));
			var values = [json[0].question,
						  json[0].answer,
						  json[0].choiceA,
						  json[0].choiceB,
						  json[0].choiceC];

			console.info (JSON.stringify (values));
	/* 		if (parseInt (json.active) === 1) { 
				$("#input-checkbox-question-active").prop ("checked", true);
			} else {
				$("#input-checkbox-question-active").prop ("checked", false);
			} */
			//verify if no change is added to the question
			
			for(var i = 0; i < values.length; i++){
				if(input_values[i] == values[i]){

				}
				
			}
		});
	}
	
	//$("#question-edit-fields").html (null);
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



