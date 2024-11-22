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
  getKeyValue,
  Tooltip,
} from "@nextui-org/react";
import useSWR from "swr";
import { EditIcon } from "../../../components/icon/EditIcon";
import { DeleteIcon } from "../../../components/icon/DeleteIcon";

interface Product {
  uid: string;
  name: string;
  description: string;
  purchasePrice: number;
  retailPrice: number;
  wholesalePrice: number;
  bulkWholesalePrice: number;
  stock: number;
  technicalData: string;
  subcategory: {
    _id: string;
    name: string;
    description: string;
    status: boolean;
    category: {
      _id: string;
      name: string;
      description: string;
      status: boolean;
    };
  };
  preview: {
    url: string;
    title: string;
  };
  status: boolean;
}

interface ApiResponse {
  content: Product[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProductTable() {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

  const { data, isLoading } = useSWR<ApiResponse>(
    `http://192.168.100.62:8080/product?page=${page - 1}&size=${rowsPerPage}`,
    fetcher,
    { keepPreviousData: true }
  );

  const products = data?.content || [];
  const pages = data?.totalPages || 0;

  const renderCell = (product: Product, columnKey: React.Key) => {
    const key = columnKey as string;  // Cast columnKey to a string

    switch (columnKey) {
      case "name":
        return product.name;
      case "description":
        return product.description;
      case "purchasePrice":
        return `$${product.purchasePrice}`;
      case "retailPrice":
        return `$${product.retailPrice}`;
      case "wholesalePrice":
        return `$${product.wholesalePrice}`;
      case "bulkWholesalePrice":
        return `$${product.bulkWholesalePrice}`;
      case "stock":
        return product.stock;
      case "technicalData":
        return product.technicalData;
      case "subcategory":
        return product.subcategory.name;
      case "category":
        return product.subcategory.category.name;
      case "status":
        return product.status ? "Active" : "Inactive";
      case "preview":
        return <img src={product.preview.url} alt={product.name} width={50} />;
      case "actions":
        return (
          <div className="flex items-center gap-2">
            <Tooltip content="Edit">
              <span className="text-lg cursor-pointer">
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip content="Delete">
              <span className="text-lg text-danger cursor-pointer">
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return getKeyValue(product, key);
    }
  };

  

  return (
    <Table
    fullWidth
    shadow="lg"
      aria-label="Product Table with pagination and loading"
      bottomContent={
        pages > 1 && (
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={setPage}
          />
        )
      }
    >
      <TableHeader >
        <TableColumn key="name">Name</TableColumn>
        <TableColumn key="description">Description</TableColumn>
        <TableColumn key="purchasePrice">Purchase Price</TableColumn>
        <TableColumn key="retailPrice">Retail Price</TableColumn>
        <TableColumn key="wholesalePrice">Wholesale Price</TableColumn>
        <TableColumn key="bulkWholesalePrice">BulkWholesale Price</TableColumn>
        <TableColumn key="stock">Stock</TableColumn>
        <TableColumn key="technicalData">Technical Data</TableColumn>
        <TableColumn key="subcategory">Subcategory</TableColumn>
        <TableColumn key="category">Category</TableColumn>
        <TableColumn key="status">Status</TableColumn>
        <TableColumn key="preview">Preview</TableColumn>
        <TableColumn key="actions">Actions</TableColumn>
      </TableHeader>
      <TableBody
        items={products}
        loadingContent={<Spinner />}
        loadingState={isLoading ? "loading" : "idle"}
      >
        {(item) => (
          <TableRow key={item.uid}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
