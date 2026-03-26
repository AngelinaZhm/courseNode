import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Неправильно вказано email' })
	email: string;

	@IsString({ message: 'Не вказано пароль' })
	password: string;

	@IsString({ message: 'Не вказано імені' })
	name: string;
}
