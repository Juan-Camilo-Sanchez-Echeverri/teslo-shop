import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const RawHeaders = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    return request.rawHeaders;
  },
);
