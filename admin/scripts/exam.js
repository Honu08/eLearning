var questions = [];
var index = 0;
var title = $("#input-field-exam-title").val();

getExamDropdownOptions();

$("#exam-danger-alert").hide ();
$("#exam-select-danger-alert").hide ();
$("#exam-title-danger-alert").hide ();
$("#exam-noQuestion-danger-alert").hide ();


$("#plus_button").click(function() {
	var x = questions.length+1;
	var id = "id=\""+x+"\"";
	var string= "<div "+id+">"+
				"<div class=\"panel panel-default\" style=\"background-color: #F8F8F8\">"+
				"<div class=\"panel-heading\" style=\"height: 30px\">"+
					"<div class=\"form-group\">"+
						"<button class=\"btn btn-default btn-xs pull-right\" style=\"margin-top: -6px\" id=\"delete_question_"+x+"\">"+
						"<span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\">"+
						"</button>"+
					"</div>"+
				"</div>"+
				"<div class=\"panel-body\">"+
					"<div id=\"input-field-question-"+x+"-container\" class=\"form-group input-color-verifier\">"+
						"<label>Question:</label>"+
						"<input type=\"textarea\" class=\"form-control\" id=\"input-field-question-"+x+"\" placeholder=\"Enter Question\">"+
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
				"</script>";
	var obj= {"html":string,"status":"added"};
	questions.push (obj);
	
	if(questions.length === 1){
	$("#questions").html (null);
	}
	$("#questions").append (string);
	index++;
	var test = "Questions: "+index;
	$("#footer").html(test);
});

$("#insert_exam").click(function(){
	var bool = null;
	var bool1 = null;
	var bool2 = null;
	var payload = [];
	var exam = {};
	bool = getInputs(questions);
	bool2 = getTitle();
	bool1 = getSelectedTitle();
	if(bool && bool2 && bool1){
		payload = getInputValues(questions);
		if(checkArray(payload)){
			exam = {"course":$("#existing-registered-courses-title").val(),
				   	"title":$("#input-field-exam-title").val(),
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
					bool = true;
				}else{bool = false;}
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
				 "<h4>Exam title: "+arr.title+"</h4>"+
				 "<h4>Questions:</h4>";
	for(var i = 0; i<arr.questions.length; i++){
		string += "<p>"+(i+1)+") "+arr.questions[i].question+"<br>";
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
	});
}

/* $("#minus_button").click(function() {
	questions.pop();
	for (var i = 0; i < questions.lenth; i++){
	   console.log(questions[i]);
	}
}); */
