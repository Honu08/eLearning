var SET_DROPDOWN_OPTIONS = false;
var USERNAME = null;
VALIDATED = null;

var INPUT_FIELD = [
	"#input-field-name",
	"#input-field-lastName",
	"#input-field-address",
	"#input-field-email",
	"#input-field-phone",
];

$("#password-error-alert").hide();
$("#wrong-password-error-alert").hide();
$("#password-match-error-alert").hide();
$("#password-success-alert").hide();
$("#user-role-alert").hide();
$("#user-update-success-alert").hide();
$("#user-update-error-alert").hide();

$("#insert-success-alert").hide();
$("#insert-error-alert").hide();
$("#profession-error-alert").hide();
$("#password-error-alert").hide();
$("#email-error-alert").hide();
$("#username-error-alert").hide();
$("#license-error-alert").hide();

$("#edit_profile").click(function() {
	var validated = true;
	var confirm = false;
	var input_values = [];

	// Get values for all input text fields and validate at the same time
	for (var i = 0; i < INPUT_FIELD.length; i++) {
		resetInputFieldColor($(INPUT_FIELD[i] + '-container'));
		if ($(INPUT_FIELD[i]).val() === "") {
			$(INPUT_FIELD[i] + '-container').addClass("has-error");
			$("#insert-error-alert").show("fast");
			setTimeout(function() {
				$("#insert-error-alert").hide("fast");
			}, 5000);
			validated = false;
		} else {
			$(INPUT_FIELD[i] + '-container').addClass("has-success");
			input_values.push($(INPUT_FIELD[i]).val());
		}
	}

	//validate email syntaxis
	if (!(validEmail($(INPUT_FIELD[3]).val()))) {
		validated = false;
		$(INPUT_FIELD[3] + '-container').addClass("has-error");
		$("#email-error-alert").show("fast");
		setTimeout(function() {
			$("#email-error-alert").hide("fast");
		}, 5000);

	}
	
	//if data is ready then insert into databases
	if (validated) {
		performAjax({
			"task":"update_user_data",
			"data": input_values,
			"user": USERNAME
		},function(data){
			var json = JSON.parse(data);
			console.info(json.success);
			if(json.success){
				console.info(json);
				for (var i = 0; i < INPUT_FIELD.length; i++) {
					resetInputFieldColor($(INPUT_FIELD[i] + '-container'));
				}
				getUserData();
				$("#user-update-success-alert").show("fast");
					setTimeout(function() {
						$("#user-update-success-alert").hide("fast");
					}, 5000);
			}else{
				$("#user-update-error-alert").show("fast");
					setTimeout(function() {
						$("#user-update-error-alert").hide("fast");
					}, 5000);
			}
		});
	}
});

function performSajax(data, callback) {
	$.ajax({
		url: "../API/main.php",
		type: "POST",
		data: data,
		async: false,
		success: callback,
		error: errorFunction
	});
}

function verifyUsername(param) {
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

function verifyLicense(param) {
	var validuser = null;
	performAjax({
		"task": "exist_license",
		"license": param
	}, function(data) {
		var json = JSON.parse(data);
		validuser = json.exists;
	});
	return validuser;
}

function validEmail(email) {
	var emailReg = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
	var valid = emailReg.test(email);
	if (!valid) {
		return false;
	} else {
		return true;
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

function resetInputFieldColor(field) {
	if (field.hasClass("has-error")) {
		field.removeClass("has-error");
	} else if (field.hasClass("has-success")) {
		field.removeClass("has-success");
	}
}

getUserData();

function getUserData(){
	
	performAjax({"task":"get_username",
				 "session":SESSION},function(data){
		var json = JSON.parse(data);
		$("#username").html("&nbsp;&nbsp;"+json[0].name+"&nbsp;"+json[0].lastName+"&nbsp;&nbsp;");
		$(INPUT_FIELD[0]).val (json[0].name);
		$(INPUT_FIELD[1]).val (json[0].lastName);
		$(INPUT_FIELD[2]).val (json[0].address);
		$(INPUT_FIELD[3]).val (json[0].email);
		$(INPUT_FIELD[4]).val (json[0].phone);
		$("#current-profession").html(json[0].profession);
		USERNAME = json[0].username;
		console.info(USERNAME);
	    //getUsersOptions(USERNAME);
	});
	
}

$("#change_password").click(function(){
	var INPUT_FIELD = [     
		"#input-field-oldpassword",
		"#input-field-password",
		"#input-field-repassword"];
	
	 VALIDATED = true;
	var confirm = false;
	var input_values = [];

	// Get values for all input text fields and validate at the same time
	for (var i = 0; i < INPUT_FIELD.length; i++) {
		resetInputFieldColor($(INPUT_FIELD[i] + '-container'));
		if ($(INPUT_FIELD[i]).val() === "") {
			$(INPUT_FIELD[i] + '-container').addClass("has-error");
			$("#password-error-alert").show("fast");
			setTimeout(function() {
				$("#password-error-alert").hide("fast");
			}, 5000);
			VALIDATED = false;
		} else {
			$(INPUT_FIELD[i] + '-container').addClass("has-success");
			input_values.push($(INPUT_FIELD[i]).val());
		}
	}
	
	//verify password from user
	if(VALIDATED){
		console.info(USERNAME);
		performSajax({
			"task":"verify_password",
			"user":USERNAME,
			"password":input_values[0]
		},function(data){
			var json = JSON.parse(data);
			if(Number(json[0].count) === 0){
				VALIDATED = false;
				$("#wrong-password-error-alert").show("fast");
				setTimeout(function() {
					$("#wrong-password-error-alert").hide("fast");
				}, 5000);
				$(INPUT_FIELD[0] + '-container').addClass("has-error");
			}
			
			if (input_values[1] !== input_values[2]) {
				VALIDATED = false;
				$(INPUT_FIELD[1] + '-container').addClass("has-error");
				$(INPUT_FIELD[2] + '-container').addClass("has-error");
				$("#password-match-error-alert").show("fast");
				setTimeout(function() {
					$("#password-match-error-alert").hide("fast");
				}, 5000);
			}
			
			if(VALIDATED){
				performAjax({
					"task":"update_password",
					"old": input_values[0],
					"new": input_values[1]
				},function(data){
					var json = JSON.parse(data);
					if(json.success){
						$("#password-success-alert").show("fast");
						setTimeout(function() {
							$("#password-success-alert").hide("fast");
						}, 5000);

						$(INPUT_FIELD[0]).val(null);
						$(INPUT_FIELD[1]).val(null);
						$(INPUT_FIELD[2]).val(null);
						resetInputFieldColor($(INPUT_FIELD[0] + '-container'));
						resetInputFieldColor($(INPUT_FIELD[1] + '-container'));
						resetInputFieldColor($(INPUT_FIELD[2] + '-container'));
					}
				});
			}
		});
	}
});




























