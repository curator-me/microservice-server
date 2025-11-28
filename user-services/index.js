const app = require("./controllers/users");

const port = 3001;

app.listen(port, () => {
  console.log(`User service app listening on port ${port}`);
});
