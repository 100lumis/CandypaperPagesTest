async function submitScore(score, time) {
  await fetch('http://localhost:3000/submit-score', {
    method: 'POST',
    credentials: 'include', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ score, time })
  });
}
