import { Request, Response } from "express";
import bcrypt from "bcrypt";
import * as jwt from 'jsonwebtoken';
import userRepository from "../repositories/userRepository";
import { User, Login } from "../../core/interfaces/userInterface";
import { prisma } from "../../config/prismaClient";
 
export class UserController {
  async store(req: Request, res: Response) {

    const {email , username, password}: User = req.body;
    try {
      console.log(email,username,password)
      if(!email||!username||!password){
        return res.status(400).json({message: "Necessário preenchimento de todos os campos"});
      }

      const userExist = await prisma.user.findUnique({where: {email}});
      
      if(userExist){
        return res.status(400).json({message: "Usuário já existe!"});
      }

      const encryptPass = await bcrypt.hash(password, 10);

      const user = await userRepository.createUser({email,username,password: encryptPass})

      return res.status(200).json([{
       email: user.email,
        username: user.username
    }]);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw new Error("Falha ao criar usuário");
    }
  }
  async login(req: Request, res: Response, Jwt: any) {
    const { email, password }: Login = req.body;
  
    try {

      if (!email || !password) {
        return res.status(400).json({ message: "Necessário preenchimento de todos os campos" });
      }
  
      const user = await prisma.user.findFirst({
        where: {
          email: email,
        },
      });
  
      
      if (!user || !user.password) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }
  
    
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }
  
      const jwtPassword = process.env.JWT_PASSWORD;

      if (!jwtPassword) {
        throw new Error("JWT_PASSWORD not defined in environment variables");
      }
      
      const token = jwt.sign({ id: user.id, email: user.email }, jwtPassword);

      
      return res.status(200).json({
        id: user.id,
        email: user.email,
        token: token,
      });
  
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return res.status(500).json({ message: "Erro ao fazer login" });
    }
  }
}
