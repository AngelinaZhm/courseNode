import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Неправильно вказано email' })
	email: string;
	@IsString()
	password: string;
}
