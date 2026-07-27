import { SetMetadata } from '@nestjs/common';

export const PUBLIC_ROUTE_KEY = 'PublicRoute'

export const PublicRoute = (...args: string[]) => SetMetadata(PUBLIC_ROUTE_KEY, args);
