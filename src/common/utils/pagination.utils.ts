import { NotFoundException } from "@nestjs/common";
import { QueryPaginationDTO, PaginatedResponseDTO } from "../dtos/query-pagination.dto"

const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_PAGE_SIZE = 10

export const paginate = (query?: QueryPaginationDTO): { skip: number, take: number } => {
    const size = Math.abs(Number(query?.size ?? DEFAULT_PAGE_SIZE));
    const page = Math.abs(Number(query?.page ?? DEFAULT_PAGE_NUMBER));

    return {
        skip: size * (page - 1),
        take: size,
    };
}

export const paginateOutput = <T>(data: T[], total: number, query?: QueryPaginationDTO): PaginatedResponseDTO<T> => {
    const size = Math.abs(Number(query?.size ?? DEFAULT_PAGE_SIZE));
    const page = Math.abs(Number(query?.page ?? DEFAULT_PAGE_NUMBER));
    const lastPage = Math.ceil(total / size);

    if(!data.length){
        return {
            data,
            meta: {
                total,
                lastPage,
                currentPage: page,
                totalPerPage: size,
                prevPage: null,
                nextPage: null
            }
        }
    }

    if(page > lastPage){
        throw new NotFoundException(`Page ${page} not found. Last page is ${lastPage}`);
    }

    return {
        data,
        meta: {
            total,
            lastPage,
            currentPage: page,
            totalPerPage: size,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < lastPage ? page + 1 : null,
        }
    }

}