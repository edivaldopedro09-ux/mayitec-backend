import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: any;
    file?: any;
}
export declare const registerUser: (req: Request, res: Response) => Promise<void>;
export declare const loginUser: (req: Request, res: Response) => Promise<void>;
export declare const getUserProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateUserProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getUsers: (req: any, res: any) => Promise<void>;
export {};
//# sourceMappingURL=userController.d.ts.map