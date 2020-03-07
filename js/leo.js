$(document).ready(function(e) {

	$("#leo-form").submit(function(e) {
		e.preventDefault();
	});

	$.fn.isEmailValid = function(inputEmail){ 
        var emailFilter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
		if (emailFilter.test(inputEmail)) {
			return true;
		}
		else {
			return false;
		}
	}

	$.fn.isContactNoValid = function(inputContactNo){ 
		if ($.isNumeric(inputContactNo) && inputContactNo.replace(/ /g,'').length == 10) {
			return true;
		}
		else {
			return false;
		}
	}

	$.fn.isPhotoValid = function(file){
		var file_size=file.size;
		var image_name = file.name;
		var file_extension = image_name.split('.').pop().toLowerCase();
		if(jQuery.inArray(file_extension,['png','jpg','jpeg']) == -1){
			return false;
		}else{
			if(file_size < 2000000){
				return true;
			}else{
				return false;
			}
		}
	}

	$.fn.removeMessage = function(){ 
		$("#message-box").remove(); 
	}

	$.fn.showSuccessMessage = function(){ 
		$("#message").append( "<div class=\"alert alert-success\" id=\"message-box\">Your registration was successful. You will receive a confirmation email with a QR code. Please present that QR code on the event day to complete the registration process.</div>" );
	}

	$.fn.showErrorMessage = function(){
		$("#message").append( "<div class=\"alert alert-danger\" id=\"message-box\">Submission failure. Please try again later</div>" );
	}

	$.fn.showLoadingMessage = function(){ 
		$("#message").append("<div class=\"loader-leo\" id=\"message-box\"></div>");
	}

	$.fn.publishData = function(formData){
		var t = JSON.parse(formData);
		$.fn.removeMessage();
		$.fn.showLoadingMessage();
		$.ajax({
			url: "https://bcglslns3d.execute-api.us-east-1.amazonaws.com/dev/users",
			// url: "http://localhost:3000/users",
			type: "post",
			dataType: 'text',
			cache: false,
			contentType: false,
			processData: false,
			data: formData,
			success: function(response){
				$.fn.removeMessage();
				$.fn.showSuccessMessage();
			},
			error: function () {
                $.fn.removeMessage();
                $.fn.showSuccessMessage();
            }
		});
	}
	
  
	$("#btnSubmit").click(function(){
        document.getElementById('btnSubmit').disabled = 'disabled';
		$.fn.removeMessage();
		var data = {};
		var messageError = "";
		var firstName = $("#firstName").val();
		var lastName = $("#lastName").val();
		var email = $("#email").val();
		var contactNo = $("#contactNo").val();
		var food = $("#food").val();
		var gender = $("#gender").val();
		var participation = $("#participation").val();
		var club = $("#club").val();
		var photo = $('#photo').prop('files')[0];
		var t = reader;

		if(firstName == "" || lastName == "" || email == "" || contactNo == "" || photo == null){
			messageError = messageError + "Please fill all the required fields\n";
		}
		else{
			var isPhotoValidated = $.fn.isPhotoValid(photo);
			var isEmailValidated = $.fn.isEmailValid(email);
			var isContactNoValidated = $.fn.isContactNoValid(contactNo);
			if(!isPhotoValidated){
				messageError= messageError + "Image is not valid (supported types png,jpg,jpeg and should be less than 1MB)\n";
			}
			if(!isEmailValidated){
				messageError= messageError + "Please enter a valid email\n";
			}
			if(!isContactNoValidated){
				messageError= messageError + "Please enter a valid contact Number\n";
			}
			if(messageError === ""){
				data["name"] = firstName + " " + lastName;
				data["email"] = email;
				data["contact"] = contactNo;
				data["meal"] = food;
				data["gender"] = gender;
				data["participation"] = participation;
				data["club"] = club;
                // data["photo"]=photo;

                var reader = new FileReader();


                reader.onload = function(e) {
                    var dataURL = reader.result;
                }

                reader.readAsDataURL(photo);


                // var base64photo = reader.readAsDataURL(photo);

                $.fn.removeMessage();
                $.fn.showLoadingMessage();
                setTimeout(function () {
                    data["photo"]= reader.result;
                    console.log(data);

                    data = JSON.stringify(data);
                    $.fn.publishData(data);
                }, 3000);
			}
		}
		
		
		if(messageError !== ""){
			$("#message" ).append( "<div class=\"alert alert-danger\" id=\"message-box\">"+messageError+"</div>" );
		}
		
	});
});
