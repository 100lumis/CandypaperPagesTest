 function bounce() {
      $(".fairy")
        .animate({ top: "-=20px" }, 800) 
        .animate({ top: "+=20px" }, 800, bounce); 
    }

    $(document).ready(function(){
      bounce();
    });
