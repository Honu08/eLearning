var questions = [];
var index = 0;
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
						"<input type=\"text\" style=\"width: 75%\" class=\"form-control\" id=\"input-field-choiceB"+x+"\" placeholder=\"Enter Choice 2\">"+
					"</div>"+
					"<div id=\"input-field-choiceC-"+x+"-container\" class=\"form-group input-color-verifier\">"+
						"<label>Choice 3: </label>"+
						"<input type=\"text\" style=\"width: 75%\" class=\"form-control\" id=\"input-field-choiceC"+x+"\" placeholder=\"Enter Choice 3\">"+
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

$("#insert_exam").click(function() {
	getInputs(questions);
});

function getInputs(arr){
	for (var i = 0; i<arr.length;i++){
		if(arr[i].status != "removed"){
			console.log(arr[i]);
		}
	}
}
/* $("#minus_button").click(function() {
	questions.pop();
	for (var i = 0; i < questions.lenth; i++){
	   console.log(questions[i]);
	}
}); */

