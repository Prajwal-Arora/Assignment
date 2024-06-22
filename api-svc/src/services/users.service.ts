import { UserI } from '../interfaces/users.interface';
import { User } from '../models/user.model';
import { validateUserParams } from '../utils/validator';
import { HttpException } from '../exceptions/HttpException';
import { hash } from 'bcrypt';
import { publishMessage } from '../rabbitmq/publisher';
import { getCachedData, setCachedData, deleteCachedData } from '../utils/redis';
const CACHE_DURATION = 160;

class UserService {
  public async createUser(userData: UserI): Promise<UserI> {
    const { error } = validateUserParams(userData);
    if (error) throw new HttpException(400, error.details[0].message);

    const checkExistingUser = await User.findOne({ email: userData.email });
    if (checkExistingUser) {
      throw new HttpException(409, 'Email already exists');
    }

    const hashedPassword = await hash(userData.password, 10);
    const user = await User.create({
      email: userData.email,
      password: hashedPassword,
    });

    publishMessage({ data: `user created - ${userData.email}` }).catch(
      (err) => {
        console.error(err);
      }
    );

    return user;
  }

  public async getUserById(userId: string): Promise<UserI> {
    const cachedUser = await getCachedData(`user:${userId}`);
    if (cachedUser) {
      return cachedUser;
    }
    const findUser = await User.findOne({ _id: userId });
    if (!findUser) throw new HttpException(409, "User doesn't exist");
    await setCachedData(`user:${userId}`, findUser, CACHE_DURATION);
    return findUser;
  }

  public async updateUser(userId: string, userData: UserI): Promise<UserI> {
    const { error } = validateUserParams(userData);
    if (error) throw new HttpException(400, error.details[0].message);

    const findUser = await User.findOne({ email: userData.email });
    if (findUser && findUser._id !== userId)
      throw new HttpException(409, 'Email already exists');

    const updatedUser = await User.findByIdAndUpdate(userId, {
      email: userData.email,
    });
    if (!updatedUser) throw new HttpException(409, "User doesn't exist");

    publishMessage({
      data: `${updatedUser.id} user updated to - ${userData.email}`,
    }).catch((err) => {
      console.error(err);
    });

    await deleteCachedData(`user:${userId}`);

    return updatedUser;
  }

  public async deleteUser(userId: string): Promise<UserI> {
    const deleteUserById = await User.findByIdAndDelete(userId);
    if (!deleteUserById) throw new HttpException(409, "User doesn't exist");

    publishMessage({
      data: `user deleted - ${userId}`,
    }).catch((err) => {
      console.error(err);
    });

    await deleteCachedData(`user:${userId}`);

    return deleteUserById;
  }

  public async getAllUsers(
    pageString: string,
    limitString: string
  ): Promise<{
    users: UserI[];
    pagination: any;
  }> {
    const page = parseInt(pageString) || 1;
    const limit = parseInt(limitString) || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `users:page:${page}:limit:${limit}`;
    const data = await getCachedData(cacheKey);
    if (data) {
      return data;
    }

    const users = await User.find().skip(skip).limit(limit);
    const total = await User.countDocuments();

    const pagination = {
      page: page,
      pages: Math.ceil(total / limit),
      total: total,
    };

    await setCachedData(cacheKey, { users, pagination }, CACHE_DURATION);

    return { users, pagination };
  }
}

export default UserService;
