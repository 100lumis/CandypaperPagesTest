async function loadLeaderboard() {
  const res = await fetch('http://localhost:3000/leaderboard');
  const data = await res.json();

  const tbody = document.getElementById('leaderboardBody');
  tbody.innerHTML = '';

  data.forEach(entry => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${entry.nimi}</td>
      <td>${entry.pisteet}</td>
      <td>${entry.aika}</td>
    `;
    tbody.appendChild(row);
  });
}