
var ses = urlParse("session");
var exam = urlParse("id");

verifySession(ses);

performAjax({
	"task"   :"generate_exam",
	"session": ses,
	"exam"   : exam
},function(data){
	var json = JSON.parse(data);
	console.info(json[3].choices[1]);
	generateExam(json);
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
	
	var string = "";
	
	for(var i=0; i<arr.length; i++){
		string += "<div class='panel panel-default'>" +
					"<div class='panel-heading' role='tab' id='heading"+(i+1)+"'>"+
					 "<h4 class='panel-title'>"+
						"<a data-toggle='collapse' data-parent='#accordion' href='#collapse"+(i+1)+"' aria-expanded='true' aria-controls='collapse"+(i+1)+"'>"+
						  "Question "+(i+1)+""+
						"</a>"+
					 "</h4>"+
					"</div>"+
					"<div id='collapse"+(i+1)+"' class='panel-collapse collapse' role='tabpanel' aria-labelledby='heading"+(i+1)+"'>"+
					  "<div class='panel-body'>"+
						""+arr[i].question+""+
						"<ul style='list-style-type:none; margin-left: -10px'>"+
							"<li><input type='radio' name='choices"+(i+1)+"' value='"+arr[i].choices[0]+"'>  "+ arr[i].choices[0] +"</li>"+
							"<li><input type='radio' name='choices"+(i+1)+"' value='"+arr[i].choices[1]+"'>  "+ arr[i].choices[1] +"</li>"+
							"<li><input type='radio' name='choices"+(i+1)+"' value='"+arr[i].choices[2]+"'>  "+ arr[i].choices[2] +"</li>"+
							"<li><input type='radio' name='choices"+(i+1)+"' value='"+arr[i].choices[3]+"'>  "+ arr[i].choices[3] +"</li>"+
						"</ul>"+
					 "</div>"+
					"</div>"+
				  "</div>";
	}
	$("#accordion").html(string);
}










/* <button id="exam-button" type="button" class="btn btn-primary">
<span class="glyphicon glyphicon-education"></span>&nbsp;&nbsp;Enroll
</button>
<script>$("#exam-button").click(function(){
		 console.info(
			 $("input[name=choices]:checked").val(),
			 $("input[name=choices1]:checked").val());
			});
</script>  */