import '@jest/globals';
import UserService from '../services/users.service';
import { HttpException } from '../exceptions/HttpException';

const userService = new UserService();

// Mock dependencies
jest.mock('../models/user.model', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

jest.mock('../utils/redis', () => ({
  getCachedData: jest.fn(),
  setCachedData: jest.fn(),
  deleteCachedData: jest.fn(),
}));

jest.mock('../utils/validator', () => ({
  validateUserParams: jest.fn(() => ({ error: null })),
}));

const { User } = jest.requireMock('../models/user.model');
const { getCachedData, setCachedData, deleteCachedData } =
  jest.requireMock('../utils/redis');

describe('User API Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password',
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ ...userData, _id: '1' });

      const result = await userService.createUser(userData);

      expect(result.email).toEqual(userData.email);
      expect(User.create).toHaveBeenCalledWith({
        email: userData.email,
        password: expect.any(String),
      });
    });

    it('should throw HttpException if email already exists', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password',
      };

      User.findOne.mockResolvedValue({ email: 'test@example.com' });

      await expect(userService.createUser(userData)).rejects.toThrow(
        HttpException
      );
    });
  });

  describe('getUserById', () => {
    it('should retrieve user by ID', async () => {
      const userId = '1';
      const user = { _id: userId, email: 'test@example.com' };

      getCachedData.mockResolvedValue(null);
      User.findOne.mockResolvedValue(user);

      const result = await userService.getUserById(userId);

      expect(result).toEqual(user);
      expect(setCachedData).toHaveBeenCalledWith(
        `user:${userId}`,
        user,
        expect.any(Number)
      );
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      const userId = '1';
      const userData = { email: 'updated@example.com' };

      User.findOne.mockResolvedValue(null);
      User.findByIdAndUpdate.mockResolvedValue({ _id: userId, ...userData });

      const result = await userService.updateUser(userId, userData);

      expect(result.email).toEqual(userData.email);
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(userId, {
        email: userData.email,
      });
      expect(deleteCachedData).toHaveBeenCalledWith(`user:${userId}`);
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const userId = '1';

      User.findByIdAndDelete.mockResolvedValue({ _id: userId });

      const result = await userService.deleteUser(userId);

      expect(result._id).toEqual(userId);
      expect(deleteCachedData).toHaveBeenCalledWith(`user:${userId}`);
    });
  });
});
