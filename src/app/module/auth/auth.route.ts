import { Router } from 'express'
import { auth } from '../../middleware/checkAuth'
import { Role } from '../../../../generated/prisma/enums'
import { AuthController } from './auth.controller'


const router = Router()

router.post('/register', AuthController.registerUser)
router.post('/login', AuthController.loginUser)
router.get(
    '/me',
    auth(Role.USER, Role.DONOR, Role.ADMIN),
    AuthController.getMe,
)
router.post('/refresh-token', AuthController.refreshToken)
export const AuthRoutes = router