const express = require("express");
const dontev = require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();
// const port = 5111;
// const DB = require("./DB/dbConnection");

//Configs
// app.use(express.static("react-client/build"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "OPTIONS", "HEAD"],
    credentials: true,
  })
);
// app.use(cookieParser());
// app.use(
//   session({
//     secret: "some secret",
//     saveUninitialized: true,
//     name: "User session",
//     resave: false,
//     cookie: {
//       secure: false,
//       expires: 1000 * 60 * 60 * 24,
//       sameSite: false,
//     },
//   })
// );

app.get("/", (req, res) => {
  res.send("Hello World!");
  // res.sendFile(
  //   path.join(__dirname, "react-client/build", "index.html"),
  //   null,
  //   function (err) {
  //     console.log(err);
  //     res.end();
  //   }
  // );
});

//Routes
// const users = require("./routes/users");
const arbitrator = require("./routes/arbitrator");
const verification = require("./routes/verification");

app.use("/arbitrator", arbitrator);
app.use("/verification", verification);


///App listening on port
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port: ${process.env.PORT}`);
});




// const http = require("http");
// const querystring = require("querystring");
// const axios = require("axios");
// const qs = require("qs");

// const API_KEY = "0aM5FVD78nWuj5aIfNZi1g((";
// const CLIENT_ID = 25214;
// const CLIENT_SECRET = "pAxk535XGNP5R7cxtE0gJw((";
// const REDIRECT_URI = "http://localhost:3000/callback";


// const server = http.createServer((req, res) => {
//   if (req.url === "/") {
//     res.writeHead(200, { "Content-Type": "text/html" });
//     res.end(`
//       <a href="https://stackoverflow.com/oauth?client_id=${CLIENT_ID}&scope=no_expiry&redirect_uri=${REDIRECT_URI}">
//         Login with Stack Exchange
//       </a>
//     `);
//   } else if (req.url.startsWith("/callback")) {
//     const query = querystring.parse(req.url.split("?")[1]);
//     if (query.error) {
//       res.end(`Error: ${query.error}`);
//     } else {
//       axios
//         .post(
//           "https://stackoverflow.com/oauth/access_token",
//           qs.stringify({
//             client_id: CLIENT_ID,
//             client_secret: CLIENT_SECRET,
//             code: query.code,
//             redirect_uri: REDIRECT_URI,
//           }),
//           {
//             headers: {
//               "Content-Type": "application/x-www-form-urlencoded",
//             },
//           }
//         )
//         .then(async (response) => {
//           const data = querystring.parse(response.data);
//           if (data.error) {
//             res.end(`Error: ${data.error}`);
//           } else {
//             const access_token = data.access_token;
//             const expires = data.expires;
//             console.log(expires);
//             const userId = await getUserId(access_token);
//             const tagsArr = ["nodejs"];
//             const tags = tagsArr.join(";");
//             const answers = await getAnswersByUser(userId, access_token, tags);
//             res.end(`Anwsers by user: ${userId} are : ${answers.map((anwser) => {return(anwser.body)})}`);
//           }
//         })
//         .catch((error) => {
//           res.end(`Error: ${error.message}`);
//         });
//     }
//   } else {
//     res.writeHead(404);
//     res.end();
//   }
// });

// async function getUserId(access_token) {
//   try {
//     const user = await axios.get(
//       `https://api.stackexchange.com/2.3/me?site=stackoverflow&access_token=${access_token}&key=${API_KEY}`
//     );
//     // console.log(user);
//     return user.data.items[0].user_id;
//   } catch (error) {
//     console.log(`Error: ${error.message}`);
//   }
// }

// async function getAnswersByUser(userId, access_token, tags) {
//   try {
//     const answers = await axios.get(
//       `https://api.stackexchange.com/2.3/users/${userId}/answers?order=desc&sort=activity&site=stackoverflow&access_token=${access_token}&filter=withbody&tagged=${tags}&key=${API_KEY}`
//     );
//     return answers.data.items;
//   } catch (error) {
//     console.log(`Error: ${error.message}`);
//   }
// }

// const PORT = 3000;
// server.listen(PORT, () => {
//   console.log(`Server listening on http://localhost:${PORT}`);
// });
