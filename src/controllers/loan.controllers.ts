import { Request, Response } from 'express';
import { LoanService } from '../services/loan.services';
import { CreateLoanDTO } from '../models/loan.models';

export class LoanController {
    constructor(private loanService: LoanService) {}

    getAll = async (_req: Request, res: Response) => {
        try {
            const loans = await this.loanService.getAllLoans();
            res.json(loans);
        } catch (error) {
            res.status(500).json({ error: 'Error getting loans' });
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ error: 'Loan ID is required' });
            }
            const loan = await this.loanService.getLoanById(id);
            if (!loan) return res.status(404).json({ error: 'Loan not found' });
            res.json(loan);
        } catch (error) {
            res.status(500).json({ error: 'Error getting loan' });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const loanData: CreateLoanDTO = req.body;
            const loan = await this.loanService.createLoan(loanData);
            res.status(201).json(loan);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Error creating loan' });
            }
        }
    };

    returnLoan = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ error: 'Loan ID is required' });
            }
            const loan = await this.loanService.returnLoan(id);
            if (!loan) return res.status(404).json({ error: 'Loan not found' });
            res.json(loan);
        } catch (error) {
            res.status(500).json({ error: 'Error returning loan' });
        }
    };

    renewLoan = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ error: 'Loan ID is required' });
            }
            const loan = await this.loanService.renewLoan(id);
            if (!loan) return res.status(404).json({ error: 'Loan not found or cannot be renewed' });
            res.json(loan);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Error renewing loan' });
            }
        }
    };

    getUserLoans = async (req: Request, res: Response) => {
        try {
            const userId = req.params.userId;
            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }
            const loans = await this.loanService.getActiveLoansForUser(userId);
            res.json(loans);
        } catch (error) {
            res.status(500).json({ error: 'Error getting user loans' });
        }
    };
}