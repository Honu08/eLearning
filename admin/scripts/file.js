PHP_FILE_HANDLER = "../API/upload.handler.php";
DIR = "";
VALUE = null;

getFileDropdownOptions ();
$("#select-course-error-alert-file").hide ();
$("#progress-bar-div").hide ();
$("#upload-success-file").hide ();
$("#file-error-alert").hide ();
		
$(document).ready(function () {
	$("#upload-file-button").click (function () {
		var select = $("#upload-registered-courses-title").val();
		var file = $("#input-file").val();
		if(select === null){
			$("#select-course-error-alert-file").show ("fast");
			setTimeout (function () {
				$("#select-course-error-alert-file").hide ("fast");
			}, 3000);
			//if(file === null){console.info("is working");}
		}else{
			if(!(file.length)){
				$("#file-error-alert").show ("fast");
					setTimeout (function () {
						$("#file-error-alert").hide ("fast");
					}, 3000);
			}else{
				$("#progress-bar").removeClass("progress-bar-success");
				$("#progress-bar").addClass("progress-bar-striped");
				$("#progress-bar").addClass("active");
				$("#progress-bar-div").show ();
				uploadFile ();
			}
		}
	});
});

$("#upload-registered-courses-title").change (function () {
	var select = $("#upload-registered-courses-title").val();
	VALUE = select;
	console.info(select);
  	generateLinks(VALUE);
	$("#list-header").html("<strong>"+select+"</strong>");
});

function uploadFile () {
	$("#input-file").upload (PHP_FILE_HANDLER, {
		value: DIR
	}, 
	function (success) {
		setTimeout(uploadedFileSuccessfully, 500);
		console.info(success);
		generateLinks(VALUE);
		$("#progress-bar-div").hide ();
		$("#upload-success-file").show ("fast");
			setTimeout (function () {
				$("#upload-success-file").hide ("fast");
			}, 3000);
		$("#input-file").replaceWith("<input type='file' id='input-file' name='file' style='margin-bottom: 15px; margin-top: 3px';/>");
	}, 
	function (progress, value) {
		console.info (value);
		$("#progress-bar").css("width", value + "%");
	});
}			

function uploadedFileSuccessfully () {
	$("#progress-bar").removeClass("progress-bar-striped");
	$("#progress-bar").removeClass("active");
	$("#progress-bar").addClass("progress-bar-success");
}

$.fn.upload = function(remote, data, successFunction, progressFunction) {
	if(typeof data != "object") {
		progressFunction = successFunction;
		successFunction = data;
	}
	return this.each(function() {
		if($(this)[0].files[0]) {
			var form_data = new FormData ();
			form_data.append($(this).attr("name"), $(this)[0].files[0]);

			if(typeof data == "object") {
				for(var i in data) {
					form_data.append(i, data[i]);
				}
			}
			$.ajax({
				url: remote,
				type: 'POST',
				xhr: function() {
					var my_xhr = $.ajaxSettings.xhr();

					if(my_xhr.upload && progressFunction) {
						my_xhr.upload.addEventListener ('progress',function (progress) {
							var value = ~~((progress.loaded / progress.total) * 100);

							if(progressFunction && typeof progressFunction == "function") {
								progressFunction (progress, value);
							} else if (progressFunction) {
								$(progressFunction).val (value);
							}

						}, false);
					}
					return my_xhr;
				},
				data: form_data,
				dataType: "json",
				cache: false,
				contentType: false,
				processData: false,
				complete : function(response) {
					var json;
					try {
						json = JSON.parse(response.responseText);
					} catch (e) {
						json = response.responseText;
					}
					if (successFunction) successFunction (json);
				}
			});
		}
	});
};

function getUrlParameter(parameter) {
	var parameters = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
		parameters[key] = value;
	});

	return parameters[parameter];
}

function getFileDropdownOptions () {
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
		$("#upload-registered-courses-title").html (select_options);	
	});
}

function generateLinks(select){
	var string = "";
	var loc = "";
	performAjax ({
		"task" : "scan_dir",
		"course_title" : select
		}, function (data) {
			var json = JSON.parse (data);
				DIR = json.fullPath;
			for(var i = 0; i<json.list.length;i++)
				{
					string += "<div class=\"form-group\">"+
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
			console.info (json.list.length);
			$("#links").html(string);
		});  
}

			

































