var SET_DROPDOWN_OPTIONS = false;
USER = null;

getProfessionOptions();

var INPUT_FIELD = [
	"#input-field-name",
	"#input-field-lastName",
	"#input-field-license",
	"#input-field-address",
	"#input-field-email",
	"#input-field-phone",
	"#input-field-username",
	"#input-field-password",
	"#input-field-repassword",
	"#existing-registered-profession"
];

$("#insert-success-alert").hide();
$("#insert-error-alert").hide();
$("#profession-error-alert").hide();
$("#password-error-alert").hide();
$("#email-error-alert").hide();
$("#username-error-alert").hide();
$("#license-error-alert").hide();

$("#cancel_registration").click(function() {
	window.location = "login.html";
});

$("#edit_profile").click(function() {
	var validated = true;
	var confirm = false;
	var input_values = [];

	// Get values for all input text fields and validate at the same time
	for (var i = 0; i < INPUT_FIELDS.length; i++) {
		resetInputFieldColor($(INPUT_FIELDS[i] + '-container'));
		if ($(INPUT_FIELDS[i]).val() === "") {
			$(INPUT_FIELDS[i] + '-container').addClass("has-error");
			$("#insert-error-alert").show("fast");
			setTimeout(function() {
				$("#insert-error-alert").hide("fast");
			}, 5000);
			validated = false;
		} else {
			$(INPUT_FIELDS[i] + '-container').addClass("has-success");
			input_values.push($(INPUT_FIELDS[i]).val());
		}
	}

	//verify if username exist
	if (verifyLicense($(INPUT_FIELDS[2]).val())) {
		validated = false;
		$(INPUT_FIELDS[2] + '-container').addClass("has-error");
		$("#license-error-alert").show("fast");
		setTimeout(function() {
			$("#license-error-alert").hide("fast");
		}, 5000);
	}
	//verify license
	if (verifyUsername($(INPUT_FIELDS[6]).val())) {
		validated = false;
		$(INPUT_FIELDS[6] + '-container').addClass("has-error");
		$("#username-error-alert").show("fast");
		setTimeout(function() {
			$("#username-error-alert").hide("fast");
		}, 5000);
	}
	//validate dropdown selection if null show message
	if ($(INPUT_FIELDS[9]).val() === null) {
		validated = false;
		$("#profession-error-alert").show("fast");
		setTimeout(function() {
			$("#profession-error-alert").hide("fast");
		}, 5000);
	}
	//validate email syntaxis
	if (!(validEmail($(INPUT_FIELDS[4]).val()))) {
		validated = false;
		$(INPUT_FIELDS[4] + '-container').addClass("has-error");
		$("#email-error-alert").show("fast");
		setTimeout(function() {
			$("#email-error-alert").hide("fast");
		}, 5000);

	}
	//verify if password match
	if ($(INPUT_FIELDS[7]).val() !== $(INPUT_FIELDS[8]).val()) {
		validated = false;
		$(INPUT_FIELDS[7] + '-container').addClass("has-error");
		$(INPUT_FIELDS[8] + '-container').addClass("has-error");
		$("#password-error-alert").show("fast");
		setTimeout(function() {
			$("#password-error-alert").hide("fast");
		}, 5000);
	}


	//if data is ready then insert into databases
	if (validated) {
		$.getScript("scripts/bootbox.min.js", function() {
			bootbox.confirm({
				title: '<h2>Confirm your data!</h2>',
				message: "<strong>&nbsp;Name:</strong> " + input_values[0] + "<br>" +
					"<strong>&nbsp;Last name:</strong> " + input_values[1] + "<br>" +
					"<strong>&nbsp;License number:</strong> " + input_values[2] + "<br>" +
					"<strong>&nbsp;Email address:</strong> " + input_values[4] + "<br>" +
					"<strong>&nbsp;Username:</strong> " + input_values[6] + "<br>" +
					"<strong>&nbsp;Profession:</strong> " + input_values[9] + "<br>",
				buttons: {
					'cancel': {
						label: 'Cancel',
						className: 'btn-default pull-left'
					},
					'confirm': {
						label: 'Confirm',
						className: 'btn-primary pull-right'
					}
				},
				callback: function(result) {
					if (result) {
						performAjax({
								"task": "insert_user",
								"name": input_values[0],
								"lastName": input_values[1],
								"license": input_values[2],
								"address": input_values[3],
								"email": input_values[4],
								"phone": input_values[5],
								"username": input_values[6],
								"profession": input_values[9]
							},
							function(data) {
								var json = JSON.parse(data);
								console.info(json);
								if (json.success) {
									performAjax({
											"task": "insert_login",
											"username": input_values[6],
											"password": input_values[8]
										},
										function(data) {
											var json = JSON.parse(data);
											console.info(json);
											if (json.success) {
												$.getScript("scripts/bootbox.min.js", function() {
													bootbox.alert("Registration successful", function() {
														window.location = "login.html";
													});
												});
											}
										});
								}
							});

					}
				}
			});

		});
	}
});

function getProfessionOptions() {
	performAjax({
		"task": "get_profession"
	}, function(data) {
		var json = JSON.parse(data);
		var select_options = '<option disabled selected=true>Choose a profession</option>';

		if (json.constructor === Array) {
			for (var i = 0; i < json.length; i++) {
				select_options += '<option>' + json[i].category + '</option>';
			}
		} else {
			select_options += '<option>' + json.category + '</option>';
		}
		$("#existing-registered-profession").html(select_options);
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

getUsername();


function getUsername(){
	
	performAjax({"task":"get_username",
				 "session":SESSION},function(data){
		var json = JSON.parse(data);
		console.info(data);
		$("#username").html("&nbsp;&nbsp;"+json[0].name+"&nbsp;"+json[0].lastName+"&nbsp;&nbsp;");
		console.info(json.name);
		$(INPUT_FIELD[0]).val (json[0].name);
		$(INPUT_FIELD[1]).val (json[0].lastName);
		$(INPUT_FIELD[2]).val (json[0].license);
		$(INPUT_FIELD[3]).val (json[0].address);
		$(INPUT_FIELD[4]).val (json[0].email);
		$(INPUT_FIELD[5]).val (json[0].phone);
		$("#current-profession").html(json[0].profession);
		USER = json[0].username;
	});
	
}