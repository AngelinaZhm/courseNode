import express, { Express } from 'express';
import { Server } from 'http';
import type { ILogger } from './logger/logger.interface';
import { inject, injectable } from 'inversify';
import { json } from 'body-parser';
import { TYPES } from './types';
import type { IConfigService } from './config/config.service.interface';
import type { IExceptionFilter } from './errors/exception.filter.interface';
import { UserController } from './users/users.controller';
import { PrismaService } from './database/prisma.service';
import { AuthMiddleware } from './common/auth.middleware';

@injectable()
export class App {
	app: Express;
	server: Server;
	port: number;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.UserController) private userController: UserController,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.PrismaService) private prismaService: PrismaService,
	) {
		this.app = express();
		this.port = 8000;
	}

	useMiddleWare(): void {
		this.app.use(json());
		const authMiddleware = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use(authMiddleware.execute.bind(authMiddleware));
	}

	useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	useExeptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	public async init(): Promise<void> {
		this.useMiddleWare();
		this.useRoutes();
		this.useExeptionFilters();
		await this.prismaService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Сервер запущено на http://localhost:${this.port}`);
	}

	public close(): void {
		this.server.close();
	}
}
