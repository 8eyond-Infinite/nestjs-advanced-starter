import {
  Body,
  Controller,
  Post,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../../../application/commands/register-user/register-user.command';
import {
  RegisterUserSchema,
  RegisterUserRequest,
} from '../requests/register-user.request';
import { ZodValidationPipe } from '../../../../../../shared/infrastructure/pipes/zod-validation.pipe';
import { User } from '../../../domain/entities/user.entity';
import { UserResponse } from '../responses/user.response';

@Controller('users')
export class UsersController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(RegisterUserSchema))
  async register(@Body() req: RegisterUserRequest): Promise<UserResponse> {
    const userEntity = await this.commandBus.execute<RegisterUserCommand, User>(
      new RegisterUserCommand(req),
    );
    return UserResponse.fromEntity(userEntity);
  }
}
