const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

const mongoUrl = "mongodb+srv://khalilouedraogo:admin@cluster0.ikpeq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pou89ywe";

mongoose.connect(mongoUrl).then(() => {
    console.log("Database Connected");
}).catch((e) => {
    console.log(e);
});

require('./UserDetails');
require('./Classe');
require('./Absences');
require('./Devoirs');
require('./Eleves');
require('./Matieres');
require('./Notes');
require('./Parents');
require('./Professeur');
require('./Surveillants');
require('./Utilisateur');
require('./Admin');

const User = mongoose.model("UserInfo");
const User_Professeur = mongoose.model("Professeur");
const User_Parent = mongoose.model("Parent");
const User_Eleve = mongoose.model("Eleves");
const User_Surveillant = mongoose.model("Surveillants");
const User_Admin = mongoose.model("Admin");

app.get("/", (req, res) => {
    res.send({ status: "Started" });
});

app.post("/register", async (req, res) => {
  const { identifiant, nom, prenom, telephone, password, userType, matiere, classe, dateNaissance } = req.body;
  console.log(req.body);

  // Vérifie si les champs requis sont fournis
  if (!identifiant || !password || !userType) {
      return res.status(400).send({ status: "error", data: "Identifiant, password and userType are required." });
  }

  // Vérifie si l'utilisateur existe dans n'importe quel modèle
  const userExists = await User.findOne({ identifiant: identifiant }) ||
                     await User_Professeur.findOne({ identifiant: identifiant }) ||
                     await User_Parent.findOne({ identifiant: identifiant }) ||
                     await User_Eleve.findOne({ identifiant: identifiant }) ||
                     await User_Surveillant.findOne({ identifiant: identifiant }) ||
                     await User_Admin.findOne({ identifiant: identifiant });

  if (userExists) {
      // Envoie un message d'erreur si l'utilisateur existe déjà dans n'importe quel modèle
      return res.status(409).send({ status: "error", data: "Cet utilisateur existe déjà !!" });
  }

  try {
      // Logique de création d'un utilisateur en fonction du userType
      if (userType === "Admin") {
          await User_Admin.create({ identifiant, nom, prenom, telephone, password, userType });
          return res.send({ status: "ok", data: "Admin Created" });
      } else if (userType === "Professeur") {
          await User_Professeur.create({ identifiant, nom, prenom, telephone, password, matiere, userType });
          return res.send({ status: "ok", data: "Professeur Created" });
      } else if (userType === "Eleve") {
          await User_Eleve.create({ identifiant, nom, prenom, telephone, password, classe, dateNaissance, userType });
          return res.send({ status: "ok", data: "Eleve Created" });
      } else if (userType === "Parent") {
          await User_Parent.create({ identifiant, nom, prenom, telephone, password, userType });
          return res.send({ status: "ok", data: "Parent Created" });
      } else if (userType === "Surveillant") {
          await User_Surveillant.create({ identifiant, nom, prenom, telephone, password, userType });
          return res.send({ status: "ok", data: "Surveillant Created" });
      } else {
          return res.status(400).send({ status: "error", data: "Invalid userType" });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).send({ status: "error", data: "Internal server error" });
  }
});

// app.post("/login-user", async (req, res) => {
//     const { identifiant, password} = req.body;
//     console.log(req.body);

//     if (!identifiant || !password ) {
//         return res.status(400).send({ status: "error", data: "Identifiant and password are required." });
//     }

//     let oldUser;
//     try {
//         if (userType === "Admin") {
//             oldUser = await User_Admin.findOne({ identifiant });
//         } else if (userType === "Professeur") {
//             oldUser = await User_Professeur.findOne({ identifiant });
//         } else if (userType === "Eleve") {
//             oldUser = await User_Eleve.findOne({ identifiant });
//         } else if (userType === "Parent") {
//             oldUser = await User_Parent.findOne({ identifiant });
//         } else if (userType === "Surveillant") {
//             oldUser = await User_Surveillant.findOne({ identifiant });
//         } else {
//             return res.status(400).send({ status: "error", data: "Invalid userType" });
//         }

//         if (!oldUser) {
//             return res.status(404).send({ status: "error", data: "User doesn't exist!" });
//         }

//         // Comparaison directe du mot de passe (NON RECOMMANDÉ)
//         if (password !== oldUser.password) {
//             return res.status(401).send({ status: "error", data: "Invalid password" });
//         }

//         const token = jwt.sign({ identifiant: oldUser.identifiant, userType: oldUser.userType }, JWT_SECRET);
//         console.log("Token generated:", token);

//         return res.status(200).send({
//             status: "ok",
//             data: token,
//             userType: oldUser.userType,
//         });
//     } catch (error) {
//         console.error("Error during login:", error);
//         return res.status(500).send({ status: "error", data: "Something went wrong!" });
//     }
// });

app.post("/login-user", async (req, res) => {
  const { identifiant, password } = req.body;
  console.log(req.body);

  let oldUser;

  try {
    // Vérification dans toutes les collections possibles
    oldUser = await User.findOne({ identifiant }) ||
               await User_Professeur.findOne({ identifiant }) ||
               await User_Parent.findOne({ identifiant }) ||
               await User_Eleve.findOne({ identifiant }) ||
               await User_Surveillant.findOne({ identifiant }) ||
               await User_Admin.findOne({ identifiant });

    // Vérification si l'utilisateur existe
    if (!oldUser) {
      return res.send({ data: "User doesn't exist!" });
    }

    // Comparer les mots de passe
    const isPasswordValid = oldUser.password === password; // Enlever bcrypt
    if (!isPasswordValid) {
      return res.send({ status: "error", data: "Invalid password" });
    }

    // Génération d'un token JWT
    const token = jwt.sign({ identifiant: oldUser.identifiant, userType: oldUser.userType }, JWT_SECRET);
    console.log("Token generated:", token);

    return res.status(201).send({
      status: "ok",
      data: token,
      userType: oldUser.userType,
    });

  } catch (error) {
    console.error("Error during login:", error);
    return res.send({ status: "error", data: "Something went wrong!" });
  }
});

// app.post("/userdata", async (req, res) => {
//     const { token } = req.body;
//     try {
//         const user = jwt.verify(token, JWT_SECRET);
//         const useridentifiant = user.identifiant;

//         const userData = await User.findOne({ identifiant: useridentifiant });
//         if (!userData) {
//             return res.status(404).send({ status: "error", data: "User not found." });
//         }

//         return res.send({ status: "Ok", data: userData });
//     } catch (error) {
//         return res.status(401).send({ status: "error", data: "Invalid token." });
//     }
// });
app.post("/userdata", async (req, res) => {
  const { token } = req.body;
  try {
      const user = jwt.verify(token, JWT_SECRET);
      const useridentifiant = user.identifiant;
      const userType = user.userType; // Obtenez le userType du token

      let userData;

      // Recherche de l'utilisateur dans la collection correspondante selon le userType
      if (userType === "Admin") {
          userData = await User_Admin.findOne({ identifiant: useridentifiant });
      } else if (userType === "Professeur") {
          userData = await User_Professeur.findOne({ identifiant: useridentifiant });
      } else if (userType === "Eleve") {
          userData = await User_Eleve.findOne({ identifiant: useridentifiant });
      } else if (userType === "Parent") {
          userData = await User_Parent.findOne({ identifiant: useridentifiant });
      } else if (userType === "Surveillant") {
          userData = await User_Surveillant.findOne({ identifiant: useridentifiant });
      }

      // Si aucune donnée utilisateur trouvée
      if (!userData) {
          return res.status(404).send({ status: "error", data: "User not found." });
      }

      return res.send({ status: "Ok", data: userData });
  } catch (error) {
      return res.status(401).send({ status: "error", data: "Invalid token." });
  }
});


app.post("/update-user", async (req, res) => {
    const { identifiant, nom, prenom, telephone } = req.body;
    console.log(req.body);
    try {
        const updatedUser = await User.updateOne(
            { identifiant: identifiant },
            {
                $set: { nom, prenom, telephone },
            }
        );

        if (updatedUser.nModified === 0) {
            return res.status(404).send({ status: "error", data: "User not found." });
        }
        res.send({ status: "Ok", data: "Updated" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "error", data: "Internal server error." });
    }
});

app.get("/get-all-user", async (req, res) => {
    try {
        const data = await User.find({});
        res.send({ status: "Ok", data: data });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "error", data: "Internal server error." });
    }
});

app.post("/delete-user", async (req, res) => {
    const { id } = req.body;
    try {
        const deletedUser = await User.deleteOne({ _id: id });
        if (deletedUser.deletedCount === 0) {
            return res.status(404).send({ status: "error", data: "User not found." });
        }
        res.send({ status: "Ok", data: "User Deleted" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "error", data: "Internal server error." });
    }
});

app.listen(5000, () => {
    console.log("Node js server started.");
});
