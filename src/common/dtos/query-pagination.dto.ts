import { IsNumberString, IsOptional } from "class-validator";
import { isOptionalChain } from "typescript";

export class QueryPaginationDTO {
    @IsOptional()
    @IsNumberString()
    page?: string

    @IsOptional()
    @IsNumberString()
    size?: string
}

export interface PaginatedResponseDTO<T> {
    data: T[],
    meta: {
        total: number,
        lastPage: number,
        currentPage: number,
        totalPerPage: number,
        prevPage: number | null,
        nextPage: number | null,
    }
}