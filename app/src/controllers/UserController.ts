import { Request, Response } from 'express';
import CreateUserService from '../services/CreateUserService';


export default class UserController {
    public async create(req: Request, res: Response) {
        try {
            const { ...userBody } = req.body;

            const createUserService = new CreateUserService();

            const { createdUser, createUserAddress } = await createUserService.execute({ ...userBody });
            
            return res.status(200).json({ createdUser, createUserAddress });
        } catch (error) {
            return res.status(400).json({ error });
        }
    }
}