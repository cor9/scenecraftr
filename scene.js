module.exports = (req, res) => {
  const memberId = req.query.memberId;
  
  fetch('https://api.airtable.com/v0/app1IfFIhWJaLxjVW/user_scenes?filterByFormula={memberID}="'+memberId+'"', {
      headers: {
        'Authorization': 'Bearer keyfQ87Zzr8iuZajP'
      }
    })
    .then(response => response.json())
    .then(data => res.json(data.records))
    .catch(error => res.json({ error: 'An error occurred' }));
}
