import { Request, Response } from 'express';
import { UserService } from '../services/user.services';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    getAll = async (req: Request, res: Response) => {
        try {
            const users = await this.userService.getAll();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: 'Error getting users' });
        }
    };

    getById = async (req: Request, res: Response) => {
         try {
            if (!req.params.id) {
                return res.status(400).json({ error: 'User ID is required' });
            }
            const user = await this.userService.getById(req.params.id);
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Error getting user' });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            if (!req.params.id) {
                return res.status(400).json({ error: 'User ID is required' });
            }
            const user = await this.userService.create(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: 'Error creating user' });
        }
    };

    update = async (req: Request, res: Response) => {
         try {
            if (!req.params.id) {
                return res.status(400).json({ error: 'User ID is required' });
            }
            const user = await this.userService.update(req.params.id, req.body);
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch (error) {
            res.status(400).json({ error: 'Error updating user' });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            if (!req.params.id) {
                return res.status(400).json({ error: 'User ID is required' });
            }
            const result = await this.userService.delete(req.params.id);
            if (!result) return res.status(404).json({ error: 'User not found' });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Error deleting user' });
        }
    };
}