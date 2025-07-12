/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { ErrorResponse, isErrorResponse, PaginationResponse } from '@/types/payload';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

interface DataTableProps<T> {
    fetchData: (
        page: number,
        perPage: number,
        query: string
    ) => Promise<PaginatedResponse<T> | ErrorResponse>;
    columns?: Array<{ key: keyof T; label: string }>;
    href?: string;
    navigateKey?: keyof T;
    isSearchable?: boolean;
    primaryButton?: React.ReactNode;
}

interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationResponse;
    query: string;
}

export function DataTable<T>({
    fetchData,
    columns,
    href,
    navigateKey,
    isSearchable,
    primaryButton
}: DataTableProps<T>) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('query') || '';
    const initialPage = parseInt(searchParams.get('page') || '1', 10);
    const initialPerPage = parseInt(searchParams.get('perPage') || '10', 10);

    const [datas, setDatas] = useState<T[]>([]);
    const [page, setPage] = useState<number>(initialPage);
    const [query, setQuery] = useState<string>(initialQuery);
    const [perPage, setPerPage] = useState<number>(initialPerPage);
    const [total, setTotal] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);

    useEffect(() => {
        setQuery(searchParams.get('query') || '');
        setPage(parseInt(searchParams.get('page') || '1', 10));
        setPerPage(parseInt(searchParams.get('perPage') || '10', 10));
    }, [searchParams]);

    const onFetchData = async () => {
        const response = await fetchData(page, perPage, query);

        if (isErrorResponse(response)) {
            return;
        }

        const { data, pagination } = response;

        setDatas(data);
        setPerPage(pagination.per_page);
        setPage(pagination.page);
        setTotal(pagination.total);
        setTotalPage(pagination.total_page);
    };

    useEffect(() => {
        onFetchData();
    }, [page, perPage]);

    const updateUrlParams = (
        newParams: Partial<{ query: string; page: number; perPage: number }>
    ) => {
        const params = new URLSearchParams(window.location.search);
        if (typeof newParams.query === 'string') {
            if (newParams.query) params.set('query', newParams.query);
            else params.delete('query');
        }
        if (typeof newParams.page === 'number') {
            params.set('page', newParams.page.toString());
        }
        if (typeof newParams.perPage === 'number') {
            params.set('perPage', newParams.perPage.toString());
        }
        router.replace(`?${params.toString()}`);
    };

    const onSearch = () => {
        if (page !== 1) setPage(1);
        else onFetchData();
        updateUrlParams({ query, page: 1, perPage });
    };

    const onPageChange = (newPage: number) => {
        if (newPage !== page) {
            setPage(newPage);
            updateUrlParams({ query, page: newPage, perPage });
        }
    };

    const onNextPage = () => {
        setPage((prev) => {
            const next = prev + 1;
            updateUrlParams({ query, page: next, perPage });
            return next;
        });
    };

    const onPrevPage = () => {
        setPage((prev) => {
            const prevPage = prev - 1;
            updateUrlParams({ query, page: prevPage, perPage });
            return prevPage;
        });
    };

    const onPerPage = (newLimit: number) => {
        setPerPage(newLimit);
        setPage(1);
        updateUrlParams({ query, page: 1, perPage: newLimit });
    };

    const onNavigate = (data: T) => {
        if (href === undefined) {
            return;
        }
        if (navigateKey === undefined) {
            window.location.href = `${href}`;
            return;
        }
        window.location.href = href.replaceAll('{}', (data[navigateKey] ?? '') as string);
    };
    const columnNames = columns || Object.keys(datas[0] || {}).map((key) => ({ key, label: key }));

    return (
        <div className="w-full">
            <div className="flex justify-between items-center py-4">
                {isSearchable && (
                    <div className="flex items-center space-x-2">
                        <Input
                            placeholder="filter here"
                            className="max-w-sm"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') onSearch();
                            }}
                        />
                        <Button variant="outline" size="sm" onClick={onSearch}>
                            Search
                        </Button>
                    </div>
                )}
                <div className="flex space-x-4 items-center">
                    <Select
                        value={perPage.toString()}
                        onValueChange={(value) => onPerPage(Number(value))}
                    >
                        <SelectTrigger className="max-w-xs">
                            <SelectValue placeholder="Select records per page" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex items-end justify-end space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onPrevPage}
                            disabled={page === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onNextPage}
                            disabled={page >= totalPage}
                        >
                            Next
                        </Button>
                        <div>{primaryButton}</div>
                    </div>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader className="overflow-hidden">
                        <TableRow className="bg-muted/50">
                            {columnNames.map(({ label }) => (
                                <TableHead key={label}>{label}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {datas?.length ? (
                            datas.map((data, index) => (
                                <TableRow
                                    key={index}
                                    className={href ? 'cursor-pointer' : ''}
                                    onClick={() => onNavigate(data)}
                                >
                                    {columnNames.map(({ key }) => (
                                        <TableCell key={Math.random()}>
                                            {typeof data[key as keyof T] === 'boolean' ? (
                                                data[key as keyof T] ? (
                                                    <span className="icon-true">✅</span>
                                                ) : (
                                                    <span className="icon-false">❌</span>
                                                )
                                            ) : (
                                                (data[key as keyof T] as ReactNode)
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columnNames.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    Page {page} of {totalPage} <span className="ml-1">Total items: {total}</span>
                </div>
                <div className="flex space-x-1">
                    {(() => {
                        const maxButtons = 3;
                        let start = Math.max(1, page - Math.floor(maxButtons / 2));
                        let end = start + maxButtons - 1;
                        if (end > totalPage) {
                            end = totalPage;
                            start = Math.max(1, end - maxButtons + 1);
                        }
                        const buttons = [];

                        if (start > 1) {
                            buttons.push(
                                <Button
                                    key={1}
                                    variant={page === 1 ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => onPageChange(1)}
                                    disabled={page === 1}
                                >
                                    1
                                </Button>
                            );
                            if (start > 2) {
                                buttons.push(
                                    <span key="start-ellipsis" className="px-2">
                                        ...
                                    </span>
                                );
                            }
                        }

                        for (let i = start; i <= end; i++) {
                            if (i !== 1 && i !== totalPage) {
                                buttons.push(
                                    <Button
                                        key={i}
                                        variant={i === page ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => onPageChange(i)}
                                        disabled={i === page}
                                    >
                                        {i}
                                    </Button>
                                );
                            }
                        }

                        if (end < totalPage) {
                            if (end < totalPage - 1) {
                                buttons.push(
                                    <span key="end-ellipsis" className="px-2">
                                        ...
                                    </span>
                                );
                            }
                            buttons.push(
                                <Button
                                    key={totalPage}
                                    variant={page === totalPage ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => onPageChange(totalPage)}
                                    disabled={page === totalPage}
                                >
                                    {totalPage}
                                </Button>
                            );
                        }

                        return buttons;
                    })()}
                </div>
            </div>
        </div>
    );
}
