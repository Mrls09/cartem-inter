'use client'

import { useState } from "react"
import useSWR, { mutate } from "swr"
import ReusableTable from "@/components/ReusableTable"
import { Product } from "@/interfaces/Product"
import { Button, Input, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Tooltip } from "@nextui-org/react"
import {  ChevronRightIcon, ArrowDownTrayIcon, ArrowUpTrayIcon , PencilIcon, TrashIcon, XCircleIcon, CheckIcon, PencilSquareIcon} from '@heroicons/react/24/solid'
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'
import axios from "axios"
import ProductModal from "@/components/products/saveModalProduct"
import EditModalProductAttachment from "@/components/products/editModalProduct"
import { useAuth } from "@/context/AuthContext"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ProductsPage() {
  const {token} = useAuth() ;
  const [page, setPage] = useState(1)
  const rowsPerPage = 10
  const [search, setSearch] = useState("")
  const [isModalOpen, setModalOpen] = useState(false)
  const [isModalOpenEdit, setModalOpenEdit] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const { data, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/product?page=${page - 1}&size=${rowsPerPage}&name=${search}`,
    fetcher,
    { keepPreviousData: true }
  )

  const products = data?.content || []
  const totalPages = data?.totalPages || 1
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  }
  const columns = [
    { key: "name", label: "Nombre" },
    {
      key: "description",
      label: "Descripción",
      render: (item: Product) => (
        <Tooltip content={item.description}>
          <span className="cursor-help">{truncateText(item.description, 20)}</span>
        </Tooltip>
      )
    },
    { key: "purchasePrice", label: "Precio Compra" },
    { key: "wholesalePrice", label: "Precio Mayoreo" },
    { key: "bulkWholesalePrice", label: "Precio socio" },
    { key: "retailPrice", label: "Precio publico" },
    { key: "stock", label: "Stock" },
    { key: "technicalData", label: "Info tecnica" , 
      render: (item: Product) => (
      <Tooltip content={item.technicalData}>
        <span className="cursor-help">{truncateText(item.technicalData, 20)}</span>
      </Tooltip>
    )},
    { key: "sku", label: "SKU" },
    { key: "subcategory", label: "Subcategoria", render: (item: Product) => (<div>{item.subcategory.name}</div>) },
    { key: "category", label: "Categoria", render: (item: Product) => (<div>{item.subcategory.category.name}</div>) },
    {
      key: "status",
      label: "Estatus",
      render: (item: Product) => (
        <Chip variant="flat" color={item.status ? "success" : "danger"}>
          {item.status ? "Activo" : "Inactivo"}
        </Chip>
      )
    },
    {
      key: "preview",
      label: "Preview",
      render: (item: Product) => (
        <img src={item.preview.url} alt={item.name} className="rounded" width={50} />
      )
    },
    {
      key: "actions",
      label: "Acciones",
      render: (item: Product) => (
        <div className="flex gap-2">
          {item.status ? <Button variant="bordered" isIconOnly color="warning" aria-label="Edit" size="sm" onPress={() => handleEdit(item)}>
            <PencilSquareIcon className="size-5"/>
          </Button> : <Button variant="bordered" isIconOnly color="danger" aria-label="Remove" size="sm" onPress={() => handleRemoveProduct(item)}>
            
            <TrashIcon className="size-5"/>
          </Button>}

          <Button variant="bordered" isIconOnly color={item.status ? "danger" : "success"} aria-label={item.status ? "Delete" : "Activate"} size="sm" onPress={() => handleStatusChange(item)}>
            {item.status ?  <XCircleIcon className="size-5"/>: <CheckIcon className="size-5"/>}
          </Button>
        </div>
      ),
    },
  ]

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setModalOpenEdit(true)
  }

  const handleStatusChange = async (product: Product) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/product/change-status/${product.uid}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        mutate(`${process.env.NEXT_PUBLIC_API_URL}/product?page=${page - 1}&size=${rowsPerPage}&name=${search}`);
      } else {
        console.error('Error al actualizar el estado del producto', response);
      }
    } catch (error) {
      console.error('Error en la petición', error);
    }
  };
  const handleRemoveProduct = async (product: Product) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/product/delete/${product.uid}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        // Actualiza la caché de useSWR para que la tabla se actualice
        mutate(`${process.env.NEXT_PUBLIC_API_URL}/product?page=${page - 1}&size=${rowsPerPage}&name=${search}`);
      } else {
        console.error('Error al actualizar el estado del producto', response);
      }
    } catch (error) {
      console.error('Error en la petición', error);
    }
  };

  const handleExport = (format: string) => {
    // Implement export logic here
    console.log(`Exporting data in ${format} format`)
  }

  return (
    <div className="container mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex mb-5" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <a href="/dashboard" className="text-gray-50 hover:text-blue-600">
              Dashboard
            </a>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRightIcon className="w-5 h-5 text-gray-50" />
              <span className="ml-1 text-sm font-medium text-gray-50 md:ml-2">Productos</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Productos</h3>
          <p className="text-2xl font-bold">{data?.totalElements || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Productos Activos</h3>
          <p className="text-2xl font-bold text-green-600">{products.filter((p: { status: any }) => p.status).length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Productos Inactivos</h3>
          <p className="text-2xl font-bold text-red-600">{products.filter((p: { status: any }) => !p.status).length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Valor del Inventario</h3>
          <p className="text-2xl font-bold">${products.reduce((sum: number, p: { stock: number; purchasePrice: number }) => sum + p.stock * p.purchasePrice, 0).toFixed(2)}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Input
              isClearable
              placeholder="Buscar producto"
              value={search}
              onValueChange={(value) => {
                setSearch(value)
                setPage(1)
              }}
              startContent={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
              className="w-full"
            />
          </div>
          <Dropdown>
            <DropdownTrigger>
              <Button
                style={{ backgroundColor: "white" }}
                variant="flat"
                startContent={<FunnelIcon className="h-5 w-5" />}
              >
                Filtros
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Opciones de filtro">
              <DropdownItem key="category">Por Categoría</DropdownItem>
              <DropdownItem key="status">Por Estado</DropdownItem>
              <DropdownItem key="price">Por Precio</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="flex items-center gap-4">
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="flat"
                style={{ backgroundColor: "white" }}
                startContent={<ArrowUpTrayIcon className="h-5 w-5" />}
              >
                Importar
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Opciones de importación">
              <DropdownItem key="excel" onPress={() => handleExport('excel')}>Excel</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="flat"
                style={{ backgroundColor: "white" }}
                startContent={<ArrowDownTrayIcon className="h-5 w-5" />}
              >
                Exportar
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Opciones de exportación">
              <DropdownItem key="csv" onPress={() => handleExport('csv')}>CSV</DropdownItem>
              <DropdownItem key="excel" onPress={() => handleExport('excel')}>Excel</DropdownItem>
              <DropdownItem key="pdf" onPress={() => handleExport('pdf')}>PDF</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button
            color="primary"
            onPress={() => setModalOpen(true)}
            startContent={<PlusIcon className="h-5 w-5" />}
          >
            Agregar nuevo
          </Button>
        </div>
      </div>

      <ReusableTable
        data={products}
        columns={columns}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
      {selectedProduct && (
        <EditModalProductAttachment
          getProduct={() => mutate(`${process.env.NEXT_PUBLIC_API_URL}/product?page=${page - 1}&size=${rowsPerPage}&name=${search}`)}
          token={token}
          isOpen={isModalOpenEdit}
          onOpenChange={() => {
            setModalOpenEdit(false)
            setSelectedProduct(null)
          }}
          product={selectedProduct}
        />
      )}
      <ProductModal 
      getProduct={() => mutate(`${process.env.NEXT_PUBLIC_API_URL}/product?page=${page - 1}&size=${rowsPerPage}&name=${search}`)} 
      token={token} isOpen={isModalOpen} onOpenChange={() => { setModalOpen(false) }} />
    </div>
  )
}