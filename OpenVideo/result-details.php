<?php
	if (isset($_POST['videoid'])){
		require "dbconnect.php";
		$videoid = mysqli_real_escape_string($db,$_POST['videoid']);
		$query = "Select * from p4records where videoid ='$videoid'";
		if ($result = mysqli_query($db,$query)) {
    		while($row = mysqli_fetch_assoc($result)){
    			echo '<br><br><strong>'.htmlentities(strip_tags($row['title']))."</strong><br><br>";
    			echo '<strong>Genre: </strong>'.htmlentities(strip_tags($row['genre'])).'<br>';
    			echo '<strong>Keywords: </strong>'.htmlentities(strip_tags($row['keywords'])).'<br>';
    			echo '<strong>Duration: </strong>'.htmlentities(strip_tags($row['duration'])).'<br>';
    			echo '<strong>Color: </strong>'.htmlentities(strip_tags($row['color'])).'<br>';
    			echo '<strong>Sound: </strong>'.htmlentities(strip_tags($row['sound'])).'<br>';
    			echo '<strong>Sponsor: </strong>'.htmlentities(strip_tags($row['sponsorname'])).'<br>';
    		}
		}
	}
?>