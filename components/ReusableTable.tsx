"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
} from "@nextui-org/react";

interface TableColumnConfig {
  key: string;
  label: string;
  render?: (item: any) => React.ReactNode; // Optional custom cell rendering
}

interface ReusableTableProps {
  data: any[];
  columns: TableColumnConfig[];
  isLoading?: boolean;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const ReusableTable: React.FC<ReusableTableProps> = ({
  data,
  columns,
  isLoading = false,
  page,
  totalPages,
  onPageChange,
}) => {
  return (
    <Table
      fullWidth
      shadow="lg"
      aria-label="Dynamic Data Table"
      selectionMode="single" 
      bottomContent={
        totalPages > 1 && (
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={totalPages}
            onChange={onPageChange}
          />
        )
      }
    >
      <TableHeader>
        {columns.map((col) => (
          <TableColumn  key={col.key}>{col.label}</TableColumn>
        ))}
      </TableHeader>
      <TableBody
        items={data}
        loadingContent={<Spinner />}
        loadingState={isLoading ? "loading" : "idle"}
      >
        {(item) => (
          <TableRow key={item.id || item.uid}>
            {columns.map((col) => (
              <TableCell key={col.key}>
                {col.render ? col.render(item) : item[col.key]}
              </TableCell>
            ))}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ReusableTable;
