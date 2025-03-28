const express = require('express');
const jwt = require('jsonwebtoken');
const { getUsers } = require('../utils/users');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = await getUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    const newUser = Object.assign({}, user);
    delete newUser.password;
    res.json({ ...newUser, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
