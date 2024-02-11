import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { Request } from 'express';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const requet = ctx.switchToHttp().getRequest<Request>();
  const user = requet.user;

  if (!user) {
    throw new InternalServerErrorException('User not found');
  }

  return data ? user[data] : user;
});
