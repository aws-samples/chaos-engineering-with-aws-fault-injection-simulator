<html>
 <head>
  <title>Hello...</title>

  <meta charset="utf-8">

  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>

</head>
<body>
    <div class="container">
    <?php echo "<h1>Hi!</h1>"; ?>

    <?php

    // Create MySQL connection
    $conn = mysqli_connect($_ENV["MYSQL_HOST"], $_ENV["MYSQL_USER"], $_ENV["MYSQL_PASSWORD"], $_ENV["MYSQL_DB"]);

    $query = 'SELECT * From Person';
    $result = mysqli_query($conn, $query);

    echo '<table class="table table-striped">';
    echo '<thead><tr><th></th><th>id</th><th>name</th></tr></thead>';
    while($value = $result->fetch_array(MYSQLI_ASSOC)){
    echo '<tr>';
      echo '<td><a href="#"><span class="glyphicon glyphicon-search"></span></a></td>';
      foreach($value as $element){
        echo '<td>' . $element . '</td>';
      }
      echo '</tr>';
    }
    echo '</table>';

    $result->close();

    // Close connection
    mysqli_close($conn);

    ?>
    </div>
</body>
</html>
