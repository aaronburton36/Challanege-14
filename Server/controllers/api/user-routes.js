const router = require("express").Router();
const { User } = require("./models");
const withAuth = require("../utils/auth");

// CREATE new user
router.post("/", async (req, res) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.user_id = newUser.id;
      req.session.username = newUser.username;
      req.session.logged_in = true;

      res.status(201).json({ id: newUser.id, username: newUser.username });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not create user" });
  }
});

// LOGIN user
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.body.username } });

    if (!user) {
      res.status(400).json({ message: "Incorrect username or password, please try again" });
      return;
    }

    const validPassword = await user.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: "Incorrect username or password, please try again" });
      return;
    }

    req.session.save(() => {
      req.session.user_id = user.id;
      req.session.username = user.username;
      req.session.logged_in = true;

      res.json({ message: "You are now logged in!" });
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Could not log in" });
  }
});

// LOGOUT user
router.post("/logout", withAuth, (req, res) => {
  req.session.destroy(() => {
    res.status(204).end();
  });
});

module.exports = router;
