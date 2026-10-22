const { app } = require("./index");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server Running on PORT: ${PORT}`);
});
