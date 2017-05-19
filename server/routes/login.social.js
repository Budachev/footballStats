const axios = require('axios');
const jwt   = require('jsonwebtoken');

module.exports = function (req, res) {
    let db = req.db;
    let collection = db.get('usercollection');

    let instance = axios.create({
      baseURL: 'https://www.linkedin.com/oauth/v2',
      headers: {
       "Access-Control-Allow-Origin": "https://www.linkedin.com"
      }
    });

    
    instance.post('/accessToken', req.body.body)
      .then(function(data){
        let linkedinAPI = axios.create({
          baseURL: 'https://api.linkedin.com/v1/',
          headers: { "Authorization": `Bearer ${data.data.access_token}` }
        });

        linkedinAPI.get('people/~?format=json').then(data => {
        collection.findOne( { username: data.data.firstName }, {}, (err, user) => {
          if (err) throw err;

          if( user ){
            res.status(400);
            res.send(`User with name ${userName} already exists.`);
          } else {
            console.log('You can add user');
            
            let token = jwt.sign(data.data, 'broodWar');
            console.log(token);
            data.data.token = token;
          }
        });

          res.json(data.data);
        })
      })
      .catch((err) => {
        console.log(err)
      });
};