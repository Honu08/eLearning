<?php $title="Contact";?>
<?php include_once("head.php"); ?>

		
		<!-- Start Map -->
        
		<div id="map" data-position-latitude="18.3811014" data-position-longitude="-65.9054225"></div>
		<script>
			(function ( $ ) {
				$.fn.CustomMap = function( options ) {
					
					var posLatitude = $('#map').data('position-latitude'),
					posLongitude = $('#map').data('position-longitude');
					
					var settings = $.extend({
						home: { latitude: posLatitude, longitude: posLongitude },
						text: '<div class="map-popup"><h4>Web Development | ZoOm-Arts</h4><p>A web development blog for all your HTML5 and WordPress needs.</p></div>',
						icon_url: $('#map').data('marker-img'),	
						zoom: 15
					}, options );
					
					var coords = new google.maps.LatLng(settings.home.latitude, settings.home.longitude);
					
					return this.each(function() {	
						var element = $(this);
						
						var options = {
							zoom: settings.zoom,
							center: coords,
							mapTypeId: google.maps.MapTypeId.ROADMAP,
							mapTypeControl: false,
							scaleControl: false,
							streetViewControl: false,
							panControl: true,
							disableDefaultUI: true,
							zoomControlOptions: {
								style: google.maps.ZoomControlStyle.DEFAULT
							},
							overviewMapControl: true,	
						};
						
						var map = new google.maps.Map(element[0], options);
						
						var icon = { 
							url: settings.icon_url, 
							origin: new google.maps.Point(0, 0)
						};
						
						var marker = new google.maps.Marker({
							position: coords,
							map: map,
							icon: icon,
							draggable: false
						});
						
						var info = new google.maps.InfoWindow({
							content: settings.text
						});
						
						google.maps.event.addListener(marker, 'click', function() { 
							info.open(map, marker);
						});
						
						var styles = [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"on"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}];
						
						map.setOptions({styles: styles});
					});

};
}( jQuery ));

jQuery(document).ready(function() {
	jQuery('#map').CustomMap();
});
</script>
<!-- End Map -->

<body>

   
	<!-- Container -->
	<div id="container">
        
        <?php include_once("nav.php"); ?>
		
		



<!-- Start Content -->
<div id="content">
	<div class="container">
		
		<div class="row">
			
			<div class="col-md-8">
				
				<!-- Classic Heading -->
				<h4 class="classic-title"><span>Contact Us</span></h4>
				
				<!-- Start Contact Form -->
    <form role="form" class="contact-form" id="contact-form" method="post" action="send.php">
    <div class="form-group">
    <div class="controls">
    <input type="text" placeholder="Name" name="name">
    </div>
    </div>
    <div class="form-group">
    <div class="controls">
    <input type="email" class="email" placeholder="Email" name="email">
    </div>
    </div>
    <div class="form-group">
    <div class="controls">
    <input type="text" class="requiredField" placeholder="Subject" name="subject">
    </div>
    </div>

    <div class="form-group">

    <div class="controls">
    <textarea rows="7"  placeholder="Message" name="message"></textarea>
    </div>
    </div>
    <button type="submit" id="submit" class="btn-system btn-large">Send</button><div id="success" style="color:#34495e;"></div>
    </form>
				<!-- End Contact Form -->
				
			</div>
			
			<div class="col-md-4">
				
				<!-- Classic Heading -->
				<h4 class="classic-title"><span>Information</span></h4>
				
				<!-- Some Info -->
				<p>NSC Puerto Rico, Inc.
			  </p>
				
				<!-- Divider -->
			  <div class="hr1" style="margin-bottom:10px;"></div>
				
				<!-- Info - Icons List -->
				<ul class="icons-list">
					<li><i class="fa fa-globe">  </i> <strong>Address:</strong> P.O. Box 1625 Canovanas, Puerto Rico.</li>
					<li><i class="fa fa-envelope-o"></i> <strong>Email:</strong> sales@nscpr.com</li>
					<li><i class="fa fa-mobile"></i> <strong>Phone:</strong> 787-876-4051 <strong>Fax</strong>: 787-876-6341</li></ul>
				
				<!-- Divider -->
			  <div class="hr1" style="margin-bottom:15px;"></div>
				
				<!-- Classic Heading -->
				<h4 class="classic-title"><span>Working Hours</span></h4>
				
				<!-- Info - List -->
				<ul class="list-unstyled">
					<li><strong>Monday - Friday</strong> - 9am to 5pm</li>
					<li><strong>Saturday</strong> - 9am to 2pm</li>
					<li><strong>Sunday</strong> - Closed</li>
				</ul>
				
			</div>
			
		</div>
		
	</div>
</div>
<!-- End content -->
<?php include_once("footer.php"); ?>
</body>
</html>