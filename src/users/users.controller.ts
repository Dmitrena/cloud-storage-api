import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorators/user-id.decorator';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMe(@GetCurrentUserId() id: number) {
    return this.usersService.findOne(id);
  }
}
