import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
export declare const addOrderItems: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateOrderStatus: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getMyOrders: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const getOrders: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateOrderToPaid: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const updateOrderToDelivered: (req: AuthenticatedRequest, res: Response) => Promise<void>;
//# sourceMappingURL=orderController.d.ts.map