
// Old
// Moved to interface folder instead


export class PaginatedResultDto<T> {
  items: T[];

  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    isFirstPage: boolean,
    isLastPage : boolean
  };
}
