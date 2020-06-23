var axios = require("axios");

const api = {
  
  getUser(username) {
    return axios
      .get(
        `https://api.github.com/users/${username}`
      )
      .catch(err => {
        console.log(`User not found`, err);
        process.exit(1);
      });
  }
};

module.exports = api;