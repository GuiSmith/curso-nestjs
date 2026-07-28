import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { PUBLIC_ROUTE_KEY } from 'src/consts';

export const PublicRoute = () => {
    return applyDecorators(
        SetMetadata(PUBLIC_ROUTE_KEY, true),
        ApiSecurity({}),
    )
}
