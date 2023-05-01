const router = require("express").Router();
const { User, Post } = require(".");
const withAuth = require("./utils/auth");

// GET all posts for logged in user
router.get("/", withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id);
    const postsData = await Post.findAll({
      where: { user_id: req.session.user_id },
      attributes: ["id", "title", "content", "created_at"],
      include: [{ model: User, attributes: ["username"] }],
    });

    const user = userData.get({ plain: true });
    const posts = postsData.map((post) => post.get({ plain: true }));

    res.render("dashboard", { user, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not retrieve posts" });
  }
});

// CREATE new post
router.post("/", withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id,
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not create post" });
  }
});

// UPDATE post
router.put("/:id", withAuth, async (req, res) => {
  try {
    const updatedPost = await Post.update(
      {
        title: req.body.title,
        content: req.body.content,
      },
      { where: { id: req.params.id } }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update post" });
  }
});

// DELETE post
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const deletedPost = await Post.destroy({ where: { id: req.params.id } });

    res.status(200).json(deletedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not delete post" });
  }
});

module.exports = router;
