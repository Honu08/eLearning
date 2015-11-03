
//master function
performAjax({
	"task":"get_username",
	"session":SESSION},function(data){
	var json = JSON.parse(data);
	performAjax({
		"task": "get_user_courses",
		"user": json[0].username
	}, function(data){
		var json = JSON.parse(data);
		courseList(json);
		performAjax({
			"task": "get_user_exams",
			"user": json[0].username,
			"courses":json			
		},function(data){
			var json = JSON.parse(data);
			generateExamLinks(json);
		});
	});
});

function generateExamLinks(param){
	
	var string = "";
	console.info(param);
	for(var i =0; i < param.length; i++){
		
		string += "<div class='panel panel-default' >"+
					"<div class='panel-body' >"+
						"<strong>"+param[i].course+"</strong><br>"+
						"questions: "+param[i].questions+""+
					"</div>"+
					"<div class='panel-footer' >"+
						"<button id='take-exam-button-"+(i+1)+"' type='button' class='btn btn-primary btn-sm btn-block'>"+
							"<span class='glyphicon glyphicon-open-file'></span>&nbsp;&nbsp;Take Exam"+
						"</button>"+
					"</div>"+
				"</div>"+
				"<script>"+
					"$('#take-exam-button-"+(i+1)+"').click(function(){"+
						"console.info('"+param[i].id+"', SESSION);"+
						"$.getScript('scripts/bootbox.min.js', function() {"+
							"bootbox.confirm({"+
								"title: 'Exam',"+
								"message: 'Are you sure you want to take the exam of course: "+param[i].course+"',"+
								"buttons: {"+
									"'cancel': {"+
										"label: 'No',"+
										"className: 'btn-danger pull-left'"+
									"},"+
									"'confirm': {"+
										"label: 'Yes',"+
										"className: 'btn-primary pull-right'"+
									"}"+
								"},"+
								"callback: function(result) {"+
									"if (result) {"+
										"window.location='exam.html?session="+SESSION+"&id="+param[i].id+"';" +
									"}"+
								"}"+
							"});"+
						"});"+
					"});"+
				"</script>";
	}
	$("#my-exam-links").html(string);
}

function courseList(arr){
	var string = "";
	for(var i = 0; i<arr.length;i++){
		string += "<a id='"+arr[i].id+"' style=\"font-size: 20px;\">"+arr[i].code+"</a><br>"+ arr[i].title +"<hr class=\"featurette-divider\">"+
		"<script>"+
		"$(\"#"+arr[i].id+"\").click(function() {"+
			"generateLinks('"+arr[i].code+"');"+
			"console.info('"+arr[i].code+"');"+
		"});</script>";
		console.info(string);
	}
	$("#my-courses").html(string);
}

function generateLinks(arr){
	var links = "";
	var loc = "";
	var dir = "";
	performAjax ({
		"task" : "scan_dir",
		"course_title" : arr
		}, function (data) {
			var json = JSON.parse (data);
				console.info(json);
				dir = json.fullPath;
			for(var i = 0; i<json.list.length;i++)
				{
					links += "<div class=\"form-group\">"+
					"<a href=\"http://45.55.162.46/eLearning/admin/files/"+json.list[i].path+"\" target=\"_blank\" style=\"font-size: 14px;\">"+json.list[i].file+"</a><hr class=\"featurette-divider\">"+
					"</script>";
				} 
			$("#my-courses-links").html(links);
			$("#content").html(arr);
		});  
}

























