/* etusivu missä on vaikeustasot ja asetukset */

<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="stylesheet" href="Candy2.css">
  <link rel="icon" type="image/x-icon" href="favicon.ico">  
<script>
  function openSettings() {
    document.getElementById("settingsBox").style.display = "block";
    document.getElementById("overlay").style.display = "block";
  }

  function closeSettings() {
    document.getElementById("settingsBox").style.display = "none";
    document.getElementById("overlay").style.display = "none";
  }

  const audio = document.getElementById("backgroundAudio");
  const audioBtn = document.getElementById("audioControlBtn");

/* musiikin aloittaminen ja pysäyttäminen */
  function toggleAudio() {
    if (audio.paused) {
      audio.play();
      audioBtn.textContent = "Pysäytä musiikki";
    } else {
      audio.pause();
      audioBtn.textContent = "Soita musiikki";
    }
  }
</script>
</head>
  </body>
  </html>
