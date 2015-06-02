
var ses = urlParse("session");
var exam = urlParse("id");
var payload = [];

verifySession(ses);
$("#exam-error-alert").hide ();

performAjax({
	"task"   :"generate_exam",
	"session": ses,
	"exam"   : exam
},function(data){
	var json = JSON.parse(data);
	console.info(json);
	generateExam(json);
	performAjax({
			"task": "get_exam_course_code",
			"exam": exam,			
		},function(data){
			var json = JSON.parse(data);
			console.info(json);
			$("#course-label").html(json[0].course);
			getDate();
		});
});

performAjax({
	"task":"get_username",
	"session":ses},function(data){
	var json = JSON.parse(data);
	console.info(json);
	$("#name-label").html(json[0].name+" ");
	$("#last-label").html(json[0].lastName);
});

function verifySession(session){
	
	performAjax({"task":"valid_session",
				 "session":session},function(data){
		var json = JSON.parse(data);
		if(!json.exists){
			console.info(json);
			window.location.href = "login.html";
		}
	});
}

function urlParse(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function performAjax(data, callback) {
	$.ajax({
		url: "../API/main.php",
		type: "POST",
		data: data,
		success: callback,
		error: errorFunction
	});
}

function errorFunction(data) {
	console.info(data.text);
}


function generateExam(arr){
	payload = arr;
	var string = "";
	
	for(var i=0; i<arr.length; i++){
		string += "<div class='panel panel-default'>" +
					"<div class='panel-heading' role='tab' id='heading"+(i+1)+"'>"+
					 "<h4 class='panel-title'>"+
						"<a data-toggle='collapse' style='font-size: 18px' data-parent='#accordion' href='#collapse"+(i+1)+"' aria-expanded='true' aria-controls='collapse"+(i+1)+"'>"+
						  "Question "+(i+1)+" <span class= 'pull-right' id='"+(i+1)+"' style='font-text: 10px'></span>"+
						"</a>"+
					 "</h4>"+
					"</div>"+
					
						"<div id='collapse"+(i+1)+"' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading"+(i+1)+"'>"+
							  "<div class='panel-body' id='panel"+(i+1)+"' style='font-size: 18px'>"+
								""+arr[i].question+""+
									"<ul style='list-style-type:none; margin-left: -10px'>"+
										"<li><input type='radio' name='choices"+(i+1)+"' value='"+arr[i].choices[0]+"'>  "+ arr[i].choices[0] +"</li>"+
										"<li><input type='radio' name='choices"+(i+1)+"' value='"+arr[i].choices[1]+"'>  "+ arr[i].choices[1] +"</li>"+
										"<li><input type='radio' name='choices"+(i+1)+"' value='"+arr[i].choices[2]+"'>  "+ arr[i].choices[2] +"</li>"+
										"<li><input type='radio' name='choices"+(i+1)+"' value='"+arr[i].choices[3]+"'>  "+ arr[i].choices[3] +"</li>"+
									"</ul>"+
							 "</div>"+
						"</div>"+
				  "</div>"+
				"<script>"+
				
					"$('input[type=radio][name=choices"+(i+1)+"]').change(function (){"+
						"$('#"+(i+1)+"').addClass('glyphicon glyphicon-ok');"+
						"$('#"+(i+1)+"').html('Answered');"+
						"$('#"+(i+1)+"').addClass('alert-success');"+						
					"});"+	
					"$('#panel"+(i+1)+"').append(\"<button class='btn btn-default btn-xs pull-right' id='clear-answer"+(i+1)+"'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span>&nbsp;&nbsp;Clear Answer</button>\");"+
						
					"$('#clear-answer"+(i+1)+"').click(function (){"+
						"$('#"+(i+1)+"').removeClass('glyphicon glyphicon-ok');"+
						"$('#"+(i+1)+"').html(null);"+
						"$('#"+(i+1)+"').removeClass('alert-success');"+
						"$('input[type=radio][name=choices"+(i+1)+"]').prop('checked', false);"+
					"});"+	
			
				"</script>";
				
	}
	$("#accordion").html(string);
}
 
function getDate(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
		dd='0'+dd;
	} 

	if(mm<10) {
		mm='0'+mm;
	} 

	today = mm+'/'+dd+'/'+yyyy;

	$("#date-label").html(today);
}

$("#submit_exam").click(function(){
	var questions = payload;
	var valid = true;
	var input_values =[];
	for(var i=0; i<questions.length; i++){
		if(typeof $("input[name=choices"+(i+1)+"]:checked").val() == "undefined"){
			console.info("misiing");
			$("#exam-error-alert").show ("fast");
			setTimeout (function () {
				$("#exam-error-alert").hide ("fast");
			}, 5000);
			valid = false;
		}
	}
	
	if(valid){
		for(var j=0; j<questions.length; j++){
			input_values.push ({"question":questions[j].question, "answer": $("input[name=choices"+(j+1)+"]:checked").val() });
		}
		
		performAjax({
		"task"   :"exam_correction",
		"exam"   : input_values,
		"id"     : exam,
		"user"   : ses 
		},function(data){
			var json = JSON.parse(data);
			console.info(json);
			$.getScript('scripts/bootbox.min.js', function() {
				bootbox.confirm({
					title: 'Exam',
					message: 'Are you sure you want to finish the exam?',
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
							$("#exam-container").html(null);
							bootbox.dialog({
								title: '<h2>VEP EXAM</h2>',
								message: generateMessage(json),
								 buttons: {
									danger: {
									  label: "OK",
									  className: "btn-primary",
									  callback: function() {
										  window.location.href = "user.html" + "?session=" + ses;
									  }
									}
								 }
							});
						}
					}
				});
			});
		});
	}
});


function generateMessage(json){
	var string = "";

	if(json[0].status == "fail"){
		string = "<strong>Exam failed.</strong><br>"+
			     "<p>Verify your wrong answers:</p>";
		for(var i=0; i<json[0].exam.length; i++){
			string += "Question: "+json[0].exam[i].question+"<br>Answer: <strong>"+json[0].exam[i].answer+"</strong><br><br>";
			console.info("Fucking loop");
		}
	}else{
		string = "<strong>Congratulations! You pass the exam.</strong>";
	}
	return string;
}
/* $.getScript('scripts/bootbox.min.js', function() {
	bootbox.confirm({
		title: 'Exam',
		message: 'Are you sure you want to take the exam of course: "+param[i].course+"',
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
				bootbox.dialog({
					title: '<h2>VEP EXAM</h2>',
					message: '<br>',
					 buttons: {
						danger: {
						  label: "OK",
						  className: "btn-primary",
						  callback: function() {
							  window.location.href = "user.html" + "?session=" + ses;
						  }
						}
					 }
				});
			}
		}
	});
});
 */


/* <button id="exam-button" type="button" class="btn btn-primary">
<span class="glyphicon glyphicon-education"></span>&nbsp;&nbsp;Enroll
</button>
<script>$("#exam-button").click(function(){
		 console.info(
			 $("input[name=choices]:checked").val(),
			 $("input[name=choices1]:checked").val());
			});
</script>  */