import { Request, Response } from 'express';
import { userServiceInstance } from '../services/instances';

export class UserController {
    getAll = async (req: Request, res: Response) => {
        try {
            const users = await userServiceInstance.getAll();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: 'Error getting users' });
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ error: 'User ID is required' });
            }
            const user = await userServiceInstance.getById(id);
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Error getting user' });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            if (!req.body) {
                return res.status(400).json({ error: 'User data is required' });
            }
            const { name, email, role } = req.body;
            
            // Validar que todos los campos requeridos estén presentes
            if (!name || !email || !role) {
                return res.status(400).json({ 
                    error: 'Missing required fields: name, email, role',
                    received: { name, email, role }
                });
            }
            
            const user = await userServiceInstance.create(req.body);
            res.status(201).json(user);
        } catch (error: any) {
            console.error('Error creating user:', error);
            res.status(400).json({ 
                error: 'Error creating user',
                details: error.message
            });
        }
    };

    update = async (req: Request, res: Response) => {
         try {
            if (!req.params.id) {
                return res.status(400).json({ error: 'User ID is required' });
            }
            const user = await userServiceInstance.update(req.params.id, req.body);
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch (error) {
            res.status(400).json({ error: 'Error updating user' });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ error: 'User ID is required' });
            }
            const result = await userServiceInstance.delete(id);
            if (!result) return res.status(404).json({ error: 'User not found' });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Error deleting user' });
        }
    };
}