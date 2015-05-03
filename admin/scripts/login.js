var INPUT_FIELDS = ["#input-field-username", "#input-field-password"];
USER_NAME = "";

$("#login-error-alert").hide ();

$("#signup_button").click(function() {
	window.location="registration.html";
});


$("#login_button").click(function() {
	//window.location="registration.html";
	var username   = null;
	var password   = null;
	var validated  = true;
	
	for (var i = 0; i < INPUT_FIELDS.length; i++) {
		resetInputFieldColor ($(INPUT_FIELDS[i] + '-container'));
		if ($(INPUT_FIELDS[i]).val () === "" || $(INPUT_FIELDS[i]).val () === null ) {
				$(INPUT_FIELDS[i] + '-container').addClass ("has-error");
				validated = false;
		}else{
			$(INPUT_FIELDS[i] + '-container').addClass ("has-success");
			username = $(INPUT_FIELDS[0]).val();
			password = $(INPUT_FIELDS[1]).val();
		}
	}
	
	//validate credentials
	if(validated){
		performAjax({
		"task":"user_login",
		 "username":username,
		 "password":password}, 
		function(data){
			var json = JSON.parse(data);
			console.info(json);
			if(json[0].role === "invalid"){
				for (var i = 0; i < INPUT_FIELDS.length; i++) {
					resetInputFieldColor ($(INPUT_FIELDS[i] + '-container'));
					$(INPUT_FIELDS[i] + '-container').addClass ("has-error");
					$("#login-error-alert").show ("fast");
					setTimeout (function () {
						$("#login-error-alert").hide ("fast");
					}, 5000);
				}
			}else{
				if(json[0].role === "admin"){
					console.info(json);
					window.location.href = "admin.html" + "?session=" + json[1].session;
					USER_NAME = username;
				}else{
					if(json[0].role === "user"){
					console.info(json[0].role);
					window.location.href = "user.html" + "?session=" + json[1].session;
					USER_NAME = username;
					}
				}
			}
		});
	}
});

function resetInputFieldColor (field) {
	if (field.hasClass ("has-error")) {
		field.removeClass ("has-error");
	} else if (field.hasClass ("has-success")) {
		field.removeClass ("has-success");
	}
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

$(document).keypress(function(e) {
    if(e.which == 13) {
        //window.location="registration.html";
		var username   = null;
		var password   = null;
		var validated  = true;

		for (var i = 0; i < INPUT_FIELDS.length; i++) {
			resetInputFieldColor ($(INPUT_FIELDS[i] + '-container'));
			if ($(INPUT_FIELDS[i]).val () === "" || $(INPUT_FIELDS[i]).val () === null ) {
					$(INPUT_FIELDS[i] + '-container').addClass ("has-error");
					validated = false;
			}else{
				$(INPUT_FIELDS[i] + '-container').addClass ("has-success");
				username = $(INPUT_FIELDS[0]).val();
				password = $(INPUT_FIELDS[1]).val();
			}
		}

		//validate credentials
		if(validated){
			performAjax({
			"task":"user_login",
			 "username":username,
			 "password":password}, 
			function(data){
				var json = JSON.parse(data);
				console.info(json);
				if(json[0].role === "invalid"){
					for (var i = 0; i < INPUT_FIELDS.length; i++) {
						resetInputFieldColor ($(INPUT_FIELDS[i] + '-container'));
						$(INPUT_FIELDS[i] + '-container').addClass ("has-error");
						$("#login-error-alert").show ("fast");
						setTimeout (function () {
							$("#login-error-alert").hide ("fast");
						}, 5000);
					}
				}else{
					if(json[0].role === "admin"){
						console.info(json);
						window.location.href = "admin.html" + "?session=" + json[1].session;
						USER_NAME = username;
					}else{
						if(json[0].role === "user"){
						console.info(json[0].role);
						window.location.href = "user.html" + "?session=" + json[1].session;
						USER_NAME = username;
						}
					}
				}
			});
		}
    }
});





