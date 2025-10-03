document.getElementById('login').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {
    user: formData.get('user'),
    psw: formData.get('psw')
  };

  const res = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert('Kirjautuminen onnistunui');
  } else {
    alert('Kirjautuminen ei onnistunut');
  }
});
