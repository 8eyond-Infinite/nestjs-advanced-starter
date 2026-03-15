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
import { RegisterUserSchema, RegisterUserDto } from '../dtos/register-user.dto';
import { ZodValidationPipe } from '../../../../../../shared/infrastructure/pipes/zod-validation.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(RegisterUserSchema))
  async register(@Body() dto: RegisterUserDto): Promise<{ id: string }> {
    return await this.commandBus.execute<{ id: string }>(
      new RegisterUserCommand(dto),
    );
  }
}
