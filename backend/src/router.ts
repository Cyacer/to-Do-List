import { Router } from "express";
import { UserController } from "./adapters/controllers/UserController";

const router: Router = Router();
const user= new UserController

router.post("/user", user.store);
router.post("/login", user.login );

export { router };