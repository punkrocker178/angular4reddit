const fetch = require('node-fetch');
var url ='https://reddit.com/hot.json';

fetch(url)
.then(res => {
  console.log(res);
  // Do something with the returned data.
  return res.json();
})
.then(json => {
    console.log(json);
});