<?php
	if (isset($_POST['keywords'])){
		require "dbconnect.php";
		$keywords = mysqli_real_escape_string($db,$_POST['keywords']);
		$query = "Select * from suggestion where word like '".$keywords."%'";
		if ($result = mysqli_query($db,$query)) {
			$i=1;
    		while($row = mysqli_fetch_assoc($result)){
    			if($i>10){
    				break;
    			}
    			$i++;
    			echo htmlentities(strip_tags($row['word']))."<br>";
    		}
		}
	}
?>