import bcrypt from 'bcryptjs';

export const passwordUtils = {
  hashPassword: async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  verifyPassword: async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
  }
};