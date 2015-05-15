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
	});
});

function courseList(arr){
	var string = "";
	for(var i = 0; i<arr.length;i++){
		string += "<a id='"+arr[i].id+"' style=\"font-size: 20px;\">"+arr[i].code+"</a><hr class=\"featurette-divider\">"+
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
					"<a href=\"http://45.55.162.46/eLearning/admin/files/"+json.list[i].path+"\" target=\"_blank\" style=\"font-size: 14px;\">"+json.list[i].file+"</a>"+
					"<button class=\"btn btn-default btn-xs pull-right\" style=\"margin-top: 0px\" id=\"delete_file_"+(i+1)+"\">"+
						"<span class=\"glyphicon glyphicon-trash\" aria-hidden=\"true\">"+
					"</button></div>"+"<hr class=\"featurette-divider\">"+"<script>"+
					"$(\"#delete_file_"+(i+1)+"\").click(function() {"+
						"loc = \""+json.fullPath+"/"+json.list[i].file+"\";"+
						"console.info(\"file:\", loc);"+
						"$.getScript(\"scripts/bootbox.min.js\",function(){"+
							"bootbox.confirm({"+
								"title: '<h2>Delete File</h2>',"+
								"message: \""+json.list[i].file+"\","+
								"buttons: {"+
									"'cancel': {"+
										"label: 'Cancel',"+
										"className: 'btn-default pull-left'"+
									"},"+
									"'confirm': {"+
										"label: 'Delete',"+
										"className: 'btn-primary pull-right'"+
									"}},"+
								"callback: function(result) {"+
									"if (result) {"+
										"performAjax({\"task\":\"del_file\",\"file\": loc}, function(data){ var json = JSON.parse(data); console.info(data); generateLinks(VALUE);});"+
									"} }"+
						"});});"+
					"});"+"</script>";
				} 
			$("#my-courses-links").html(links);
		});  
}