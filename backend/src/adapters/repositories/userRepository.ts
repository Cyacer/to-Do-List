import { Login, User } from '../../core/interfaces/userInterface';
import { prisma} from "../../config/prismaClient";
import bcrypt from "bcrypt";

class UserRepository {
  async createUser(data: { email: string, username: string, password: string }): Promise<User> {
    return prisma.user.create({
      data,
    });
  }
  async loginUser(data: { email: string; password: string }): Promise<Login | null> {
    
    const user = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });
  
    if (!user || !user.password) {
      return null;
    }
  
    const passwordMatch = await bcrypt.compare(data.password, user.password);
  
    if (!passwordMatch) {

      return null;
    }
  
    return {
      id: user.id,
      email: user.email,
      password: null
    };
  }
}

export default new UserRepository();