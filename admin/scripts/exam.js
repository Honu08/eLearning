var questions = [];
var index = 0;
$("#exam-danger-alert").hide ();

$("#plus_button").click(function() {
	var x = questions.length+1;
	var id = "id=\""+x+"\"";
	var string= "<div "+id+">"+
				"<div class=\"panel panel-default\" style=\"background-color: #F8F8F8\">"+
				"<div class=\"panel-heading\" style=\"height: 30px\">"+
					"<div class=\"form-group\">"+
						"<button class=\"btn btn-danger btn-xs pull-right\" style=\"margin-top: -6px\" id=\"delete_question_"+x+"\">"+
						"<span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\">"+
						"</button>"+
					"</div>"+
				"</div>"+
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
				"</div>"+"<hr class=\"featurette-divider\">"+
				"</div>"+
				"<script>"+
					"$(\"#delete_question_"+x+"\").click(function() {"+
						"$(\"#"+x+"\").remove();"+
						"questions["+(x-1)+"].status = \"removed\";"+
						"index--;"+
						"test = \"Questions:"+index+"\";"+
						"$(\"#footer\").html(test);"+
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
	var payload = [];
	bool = getInputs(questions);
	if(bool){
		payload = getInputValues(questions);
		console.info(payload);
	}
});

function getInputs(arr){
	var bool = true;
	for (var i = 0; i<arr.length;i++){
		if(arr[i].status != "removed"){
			if($("#input-field-question-"+(i+1)+"").val() === "" || $("#input-field-answer-"+(i+1)+"").val() === "" || $("#input-field-choiceA-"+(i+1)+"").val() === "" || $("#input-field-choiceB-"+(i+1)+"").val() === "" || $("#input-field-choiceC-"+(i+1)+"").val() === ""){
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
/* $("#minus_button").click(function() {
	questions.pop();
	for (var i = 0; i < questions.lenth; i++){
	   console.log(questions[i]);
	}
}); */
