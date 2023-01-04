import express, { NextFunction, Request, Response, Router } from 'express';
const router: Router = express.Router();
import { isAuth } from '../middlewares/auth';

router.get('/test', isAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        // checking role:
        const payload = req.payload;
        if (payload.Role !== 'admin') {
            res.status(401);
            throw new Error('🚫User is Un-Authorized 🚫');
        }
        res.json("Hello")
    } catch (error) {
        next(error)
    }
});

router.get('/test/:id', isAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
        // checking role:
        const payload = req.payload;
        if (payload.Role !== 'admin') {
            res.status(401);
            throw new Error('🚫User is Un-Authorized 🚫');
        } 

        
        res.json("Hello")
    } catch (error) {
        next(error)
    }
});


export default router;