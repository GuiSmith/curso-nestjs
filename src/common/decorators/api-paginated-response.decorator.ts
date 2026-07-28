import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiPaginatedResponse = <T extends Type<unknown>>(dto: T) => {
    return applyDecorators(
        ApiExtraModels(dto),
        ApiOkResponse({
            schema: {
                type: 'object',
                properties: {
                    data: {
                        type: 'array',
                        items: { $ref: getSchemaPath(dto) }
                    },
                    meta: {
                        type: 'object',
                        properties: {
                            total: { type: 'number' },
                            lastPage: { type: 'number' },
                            currentPage: { type: 'number' },
                            totalPerPage: { type: 'number' },
                            prevPage: { type: 'number' },
                            nextPage: { type: 'number' },
                        }
                    }
                }
            }
        })
    );
}