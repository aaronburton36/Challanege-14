const bcrypt = require('bcrypt');

const saltRounds = 10;

const users = [
  {
    username: 'john_doe',
    password: 'password123',
  },
  {
    username: 'jane_doe',
    password: 'password456',
  },
];

module.exports = {
  up: async (queryInterface) => {
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        return {
          ...user,
          password: hashedPassword,
          created_at: new Date(),
          updated_at: new Date(),
        };
      })
    );

    return queryInterface.bulkInsert('users', hashedUsers, {});
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
