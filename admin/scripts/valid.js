var session = urlParse("session");

verifySession(session);

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

var timeout;
document.onmousemove = function(){
  clearTimeout(timeout);
  timeout = setTimeout(function(){
	performAjax({"task":"delete_session",
				 "session":session},function(data){
		var json = JSON.parse(data);
			window.location.href = "login.html";
	});}, (30000));
};


