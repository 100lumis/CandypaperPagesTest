document.getElementById('signup').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const user = formData.get('user').trim();
  const psw = formData.get('psw');
  const confirmPsw = formData.get('confirmPsw');

  if (psw !== confirmPsw) {
    alert('Salasanat eivät täsmää!');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, password: psw })
    });

    if (res.ok) {
      alert('Rekisteröityminen onnistui! Voit nyt kirjautua sisään.');
      e.target.reset();
    } else {
      const data = await res.json();
      alert('Virhe rekisteröitymisessä: ' + data.message);
    }
  } catch (error) {
    alert('Palvelinvirhe. Yritä myöhemmin uudelleen.');
  }
});
