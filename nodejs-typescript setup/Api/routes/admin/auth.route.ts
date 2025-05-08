import { Router } from "express";
import { Login } from "../../controllers/admin/auth.controller";

const router = Router();

router.get("/login", Login);
export default router;
