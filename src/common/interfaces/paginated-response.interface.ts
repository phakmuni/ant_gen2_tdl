

export interface PaginationMetaFormat{
    currentPage: number;
    itemPerPage: number;
    totalItems : number;
    totalPages: number;
    hasPreviousPage : boolean;
    hasNextPage : boolean;
}

export interface PaginationRequestParams {
  _page: number;
  _per_page: number;
  totalItems: number;
}

export function getPaginationMeta ({_page, _per_page, totalItems} : PaginationRequestParams) : PaginationMetaFormat {
    const totalPages = Math.ceil(totalItems / _per_page);
    return {
        currentPage: _page,
        itemPerPage: _per_page,
        totalItems,
        totalPages,
        hasPreviousPage: _page > 1,
        hasNextPage: _page < totalPages
    };
}


export interface PaginatedResponse <T> {
    items: T[],
    meta : PaginationMetaFormat
}
