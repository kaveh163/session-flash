fetch('http://localhost:3000/sess')
  .then((response) => response.json())
  .then((json) => console.log(json));