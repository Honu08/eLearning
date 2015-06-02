var DATA = null;

performAjax({
	"task": "get_certifications"
},printCertFunction);

function printCertFunction (data) {
	var json = JSON.parse (data);
    DATA = json;
	var table_content = "";
	var fields = ["select","name","lastName", "profession","license", "code", "grade", "exam_date"];
	
	if (json.constructor === Array) {
		for (var j = 0; j < json.length; j++) {
			table_content += "<tr>";
			for (var z = 0; z < fields.length; z++) {
				if(z === 0){
					table_content += "<td> <input id=\"input-checkbox-active-"+(j+1)+"\" type=\"checkbox\" name=\"active-checkbox\" value=\"1\">"+
									"<script>"+
										
									"</script></td>";
				}else{
					table_content += "<td>" + json[j][fields[z]] + "</td>";
				}
			}
			table_content += "</tr>";
			console.info(JSON.stringify (table_content));
		}
	} else {
		table_content += "<tr>";
		for (var i = 0; i < fields.length; i++) {
			table_content += "<td>" + json[fields[i]] + "</td>";
		}
		table_content += "</tr>";
	}
	
	if (!SET_DROPDOWN_OPTIONS) {
		getDropdownOptions ();
		SET_DROPDOWN_OPTIONS = true;
	}
	
	if(DATA.length > 0){
		$("#cert-table-body").html (table_content);
	}else{
		$("#cert-table-body").html ("No Course Avilable");
	}
	
	console.info(DATA);
}

$("#certificate-button").click(function(){
	var input_values = [];
	
	for(var i=0; i<DATA.length; i++){
		// Check whether active checkbox is checked or not
		if ($("#input-checkbox-active-"+(i+1)+"").is (":checked")) {
			input_values.push (DATA[i]);
		} else {
		}
	}
	
	if(input_values.length !== 0){
		console.info(input_values);
		performAjax({
			"task":"update_certification",
			"data": input_values
		}, function(data){
			var json = JSON.parse(data);
			performAjax({
				"task": "get_certifications"
			},printCertFunction);
			console.info(data);
		});
	}else{
		//show error, "no course selected"
	}
	
});
