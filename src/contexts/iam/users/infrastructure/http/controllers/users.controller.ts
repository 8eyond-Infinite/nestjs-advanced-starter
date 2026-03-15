import {
  Body,
  Controller,
  Post,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserCommand } from '../../../application/commands/register-user/register-user.command';
import { LoginQuery } from '../../../application/queries/login/login.query';
import {
  RegisterUserSchema,
  RegisterUserRequest,
  LoginSchema,
  LoginRequest,
} from '../requests';
import { ZodValidationPipe } from '../../../../../../shared/infrastructure/pipes/zod-validation.pipe';
import { User } from '../../../domain/entities/user.entity';
import { UserResponse } from '../responses/user.response';

@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(RegisterUserSchema))
  async register(@Body() req: RegisterUserRequest): Promise<UserResponse> {
    const userEntity = await this.commandBus.execute<RegisterUserCommand, User>(
      new RegisterUserCommand(req),
    );
    return UserResponse.fromEntity(userEntity);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(LoginSchema))
  async login(@Body() req: LoginRequest) {
    const userEntity = await this.queryBus.execute<LoginQuery, User>(
      new LoginQuery(req),
    );
    const payload = {
      sub: userEntity.id.value,
      email: userEntity.email,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: UserResponse.fromEntity(userEntity),
    };
  }
}
