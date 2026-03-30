import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from './middleware.interface';
import { verify, JwtPayload } from 'jsonwebtoken';

export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			return next();
		}

		const token = authHeader.split(' ')[1];

		if (!token) {
			return next();
		}

		verify(token, this.secret, (err, payload: string | JwtPayload | undefined) => {
			if (err) {
				return next();
			}

			if (payload && typeof payload !== 'string') {
				req.user = payload.email as string;
			}

			next();
		});
	}
}
