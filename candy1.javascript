<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="stylesheet" href="Candy1.css">
  <link rel="icon" type="image/x-icon" href="favicon.ico">  
</head>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  
  <script>
    function bounce() {
      $(".fairy")
        .animate({ top: "-=20px" }, 800) 
        .animate({ top: "+=20px" }, 800, bounce); 
    }

    $(document).ready(function(){
      bounce();
    });

document.getElementById("loginMessage").textContent = "Kirjautuminen onnistui!";
  </script>



  </body>
  </html>
