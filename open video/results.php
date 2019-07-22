<!DOCTYPE html>
<html>
<head>
	<title>OpenVideo</title>
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO"
        crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="result.css">
	<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>


	<script type="text/javascript">
		/*  function for query suggestions. If user types words, 
		link to keyword-suggestions.php and show suggestions.
		If user moves mouse out, clear previous suggestions and show prompt*/
		$(document).ready(function(){
			$("#search").keyup(function(){
				$.post("keyword-suggestions.php",
				{
					keywords: $("#search").val()
				},
				function(data,stauts){
				$("#suggestions").html(data);
				}
				);
			}); 
		});
	</script>

	<script>
		/* Function to show video details when user moves mouse over the video*/
		$(document).ready(function(){
			$(".resultrow").mouseover(function() {
				$.post(" result-details.php",
				{
					videoid: $(this).attr('videoid')
				},
				function(data,stauts){
					$("#videoinfo").html(data);
				}
				);
			});
			$(".resultrow").mouseout(function() {
				$("#videoinfo").html("");
			});
		});
	</script>
</head>

<body>
<nav class="navbar bg-dark navbar-dark fixed-top">
    <div class="container">
    	<a href="" class="navbar-brand"><i class="fas fa-video mr-3"></i>Open Video</a>
    </div>
</nav>

<div class='container'>
<div id='header' class='jumbotron text-center mt-5'>
<h1><i class="fas fa-search mr-3"></i>Search Videos:</h1>
<div class="row justify-content-center">
<div class="col">
<form name="search" method="GET" action="results.php" >
  <!-- form to search for videos -->
    	<input type="text" id="search" name="searchtext" size =50 >
   		<input type="submit" class='btn btn-primary' value='search' id="searchbutton">
</form>
</div>
</div>
</div>
</div>

<div class="container" id='suggestions'>Type in the boxes above and the search suggestions will appear here</div>


<div id='results' class='container'>
<?php
	if(isset($_GET['searchtext'])&& strlen($_GET['searchtext'])!=0){
		//if user input search text, connect to database and retrive relevant results
		require "dbconnect.php";
		$searchtext = mysqli_real_escape_string($db,$_GET['searchtext']);
		$query = "Select * from p4records where match (title, description,keywords) against ('$searchtext')";
		if ($result = mysqli_query($db,$query)) {
			echo '<span><br><br>'."Showing results for: ".$searchtext.'<br><hr></span>';
    		while($row = mysqli_fetch_assoc($result)){
    			echo "<div class='resultrow card mt-4' style='width: 60%;' videoid=".$row['videoid'].">";
    			echo "<div class='card-header text-light'><strong>".htmlentities(strip_tags($row['title'])).'('.htmlentities(strip_tags($row['creationyear'])).")</strong><br></div>";
    			echo "<div class='card-body'>".htmlentities(strip_tags(substr($row['description'],0,200))).'<br><br></div>'; 
    			echo '</div>';
    		}	
		}
	}
?>
</div>

<!-- div to show video information -->
<div id='videoinfo'></div>


<script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
</body>
</html>