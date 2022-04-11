var passport = require('passport');
var GoogleStrategy = require('passport-google-oidc');

passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: 'https://www.example.com/oauth2/redirect/google'
  },
  function(issuer, profile, cb) {
    const User = require("./userModel");
    User.findOne({ email: user.email })
    db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
      issuer,
      profile.id
    ], function(err, cred) {
      if (err) { return cb(err); }
      if (!cred) {
        // The Google account has not logged in to this app before.  Create a
        // new user record and link it to the Google account.
        db.run('INSERT INTO users (name) VALUES (?)', [
          profile.displayName
        ], function(err) {
          if (err) { return cb(err); }

          var id = this.lastID;
          db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
            id,
            issuer,
            profile.id
          ], function(err) {
            if (err) { return cb(err); }
            var user = {
              id: id.toString(),
              name: profile.displayName
            };
            return cb(null, user);
          });
        });
      } else {
        // The Google account has previously logged in to the app.  Get the
        // user record linked to the Google account and log the user in.
        db.get('SELECT * FROM users WHERE id = ?', [ cred.user_id ], function(err, user) {
          if (err) { return cb(err); }
          if (!user) { return cb(null, false); }
          return cb(null, user);
        });
      }
    };
  }
));
















// const express = require("express");
// const passport = require("passport");
// const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const FacebookStrategy = require("passport-facebook").Strategy;
// const env = require("dotenv");
// const mongoose = require("mongoose");

// const DATA = [{ email: "test@gmail.com", password: "1234" }];

// const app = express();
// env.config();
// mongoose
//   .connect(
//     `mongodb+srv://thor:thor@cluster0.ib472.mongodb.net/ddtest?retryWrites=true&w=majority`,
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }
//   )
//   .then(() => {
//     console.log("Database Connected");
//   });

// app.use(express.urlencoded({ extended : true }));
// app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(passport.initialize());

// // Add this line below
// const jwt = require("jsonwebtoken");
// const { use } = require("passport");
// var JwtStrategy = require("passport-jwt").Strategy,
//   ExtractJwt = require("passport-jwt").ExtractJwt;
// var opts = {};
// opts.jwtFromRequest = function (req) {
//   var token = null;
//   if (req && req.cookies) {
//     token = req.cookies["jwt"];
//   }
//   return token;
// };
// opts.secretOrKey = "secret";

// passport.use(
//   new JwtStrategy(opts, function (jwt_payload, done) {
//     console.log("JWT BASED  VALIDATION GETTING CALLED");
//     console.log("JWT", jwt_payload);
//     if (CheckUser(jwt_payload.data)) {
//       return done(null, jwt_payload.data);
//     } else {
//       // user account doesnt exists in the DATA
//       return done(null, false);
//     }
//   })
// );

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID:
//         "838332261192-budi1id57969rso2hfml57lfonoefopa.apps.googleusercontent.com",
//       clientSecret: "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",
//       callbackURL: "http://localhost:5006/googleRedirect",
//     },
//     function (accessToken, refreshToken, profile, cb) {
//       console.log(accessToken, refreshToken, profile);
//       console.log("GOOGLE BASED OAUTH VALIDATION GETTING CALLED");
//       return cb(null, profile);
//     }
//   )
// );

// // passport.use(new FacebookStrategy({
// //     clientID: '378915159425595',//process.env['FACEBOOK_CLIENT_ID'],
// //     clientSecret: '7bd791932eaf12fbb75d0166721c0e02',//process.env['FACEBOOK_CLIENT_SECRET'],
// //     callbackURL: "http://localhost:5000/facebookRedirect", // relative or absolute path
// //     profileFields: ['id', 'displayName', 'email', 'picture']
// //   },
// //   function(accessToken, refreshToken, profile, cb) {
// //     console.log(profile)
// //     console.log("FACEBOOK BASED OAUTH VALIDATION GETTING CALLED")
// //     return cb(null, profile);
// //   }));

// passport.serializeUser(function (user, cb) {
//   console.log("I should have jack ");
//   cb(null, user);
// });

// passport.deserializeUser(function (obj, cb) {
//   console.log("I wont have jack shit");
//   cb(null, obj);
// });

// app.get("/", (req, res) => {
//   res.sendFile("home.html", { root: __dirname + "/public" });
// });

// app.get("/login", (req, res) => {
//   res.sendFile("login.html", { root: __dirname + "/public" });
// });

// app.get("/auth/email", (req, res) => {
//   res.sendFile("signup.html", { root: __dirname + "/public" });
// });

// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );
// // app.get('/auth/facebook',  passport.authenticate('facebook', {scope:'email'}))

// app.post('/auth/email', (req, res)=>{

//     if(CheckUser(req.body))
//     {
//         let token =    jwt.sign({
//             data: req.body
//             }, 'secret', { expiresIn: '1h' });
//         res.cookie('jwt', token)
//         res.send(`Log in success ${req.body.email}`)
//     }else{
//         res.send('Invalid login credentials')
//     }
// })

// app.get(
//   "/profile",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     res.send(`THIS IS UR PROFILE MAAANNNN ${req.user.email}`);
//   }
// );

// app.get("/logout", (req, res) => {
//     console.log(req.user.accessToken);
        
//     if(req.session.passport){ delete req.session.passport; }
        
//     req.session.destroy(function (err) {
//         req.logout();
//         req.logOut();
//         req.user = null;
//         res.clearCookie('connect.sid');
//         res.redirect('/'); 
//     });
// })

// app.get("/googleRedirect", passport.authenticate("google"), (req, res) => {
// //   console.log("redirected", req.user);
//   let user = {
//     displayName: req.user.displayName,
//     name: req.user.name.givenName,
//     email: req.user._json.email,
//     verified: req.user._json.email_verified,
//     provider: req.user.provider,
//   };
// //   console.log(user);

//   FindOrCreate(user);
//   let token = jwt.sign(
//     {
//       data: user,
//     },
//     "secret",
//     { expiresIn: "1h" }
//   );
//   res.cookie("jwt", token);
//   res.redirect("/");
// });
// // app.get('/facebookRedirect', passport.authenticate('facebook', {scope: 'email'}),(req, res)=>{
// //     console.log('redirected', req.user)
// //     let user = {
// //         displayName: req.user.displayName,
// //         name: req.user._json.name,
// //         email: req.user._json.email,
// //         provider: req.user.provider }
// //     console.log(user)

// //     FindOrCreate(user)
// //     let token = jwt.sign({
// //         data: user
// //         }, 'secret', { expiresIn: 60 });
// //     res.cookie('jwt', token)
// //     res.redirect('/')
// // })

// async function FindOrCreate(user) {
// try{
//     console.log("USERRR", user)
//     const User = require("./userModel");
//     User.findOne({ email: user.email }).then(async(data) => {
//       if (user != null && user.length > 0 && user) {
//       console.log("User: ", data);
//         console.log("User already Registered");
//       } else {
//         const user1 = await new User({
//           name: user.displayName,
//           email: user.email ,
//           verified: user.verified,
//           provider: user.provider,
//         });
//         user1.save((data) => {
//             console.log("User registered successfully ",data)
//         })
//       }
//     });
// } catch(error) {
//     console.log("Error from : FindOrCreate", error)
// }
// }
// async function CheckUser(input) {
//   const User = require("./userModel");
// try{
//     const user = await User.findOne({ email: input.email })
//         if (user != null) {
//             console.log("User found in DATA");
//             return true;
//         } else {
//         console.log("no match");
//         }
//       return false;
 
// }catch(error) {
//     console.log("Check user", error)
// }

// //   console.log("data", DATA);
// //   console.log("Input", input);

// //   for (var i in DATA) {
// //     if (
// //       input.email == DATA[i].email &&
// //       (input.password == DATA[i].password || DATA[i].provider == input.provider)
// //     ) {
// //       console.log("User found in DATA");
// //       return true;
// //     } else null;
// //     console.log("no match");
// //   }
// //   return false;
// }
// const port = process.env.PORT || 5006;
// app.listen(port, () => {
//   console.log(`Sever ARG0 listening on port ${port}`);
// });
