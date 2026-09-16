import math
from typing import List, TypeVar, Tuple
from app.schemas.common import PaginationMeta

T = TypeVar("T")


def paginate_list(items: List[T], page: int = 1, page_size: int = 10) -> Tuple[List[T], PaginationMeta]:
    page = max(1, page)
    page_size = max(1, min(100, page_size))
    total = len(items)
    total_pages = math.ceil(total / page_size) if total > 0 else 1

    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    paginated_items = items[start_idx:end_idx]

    meta = PaginationMeta(
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        has_next=page < total_pages,
        has_prev=page > 1
    )
    return paginated_items, meta
