"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Tooltip,
  Tabs,
  Tab,
  Card,
  CardBody,
  Input,
  Button,
  User,
  Chip,
} from "@nextui-org/react";
import useSWR from "swr";
import { AddPersonModal } from '@/components/persons/AddPersonModal';
import axios from "axios";
import { CheckIcon, LockClosedIcon, LockOpenIcon, PencilSquareIcon, PlusIcon, ShieldCheckIcon, TrashIcon, XCircleIcon } from "@heroicons/react/24/solid";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";
import { ResetPasswordModal } from "@/components/persons/resetPassword";
import { notifySuccess, notifyError } from '@/utils/notifications';

interface UserData {
  _id: string;
  name: string;
  surname: string;
  lastname: string;
  email: string;
  phone: string;
  rfc: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  role: string;
  userinfo: {
    uid: string;
    username: string;
    roles: string;
    nonLocked: boolean;
  };
  position?: string;
  salary?: number;
  department?: string;
  accessLevel?: string;
}

interface ApiResponse {
  content: UserData[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
}
const handleSuccess = () => {
  // Activa una notificación de éxito
  notifySuccess("Operación realizada correctamente!");
};

const handleError = () => {
  // Activa una notificación de error
  notifyError("Ha ocurrido un error inesperado!");
};
const fetcher = (url: string) => {
  const token = Cookies.get("token");
  return fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());
};


export default function UserManagement() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = React.useState("admin");
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const rowsPerPage = 10;
  


  const { data, isLoading, mutate } = useSWR<ApiResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/person/page/?role=${activeTab}&page=${page - 1
    }&size=${rowsPerPage}&search=${search}`,
    fetcher
  );

  const users = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalUsers = data?.totalElements || 0;
  const newUsers = data?.numberOfElements || 0;

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const addNewUser = () => {
    setIsModalOpen(true);
  };
  const changeStatusUser = async (email: string) => {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/person/change-status/${email}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      if(response.status === 200){
        handleSuccess();
      }
    } catch (error) {
      handleError();
    } finally {
      mutate();
    }
  }
  const deleteUser = async (email: string) => {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/person/delete/${email}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      if(response.status === 200){
        handleSuccess();
      }
    } catch (error) {
      handleError();
    } finally {
      mutate();
    }
  }


  const renderCell = (user: UserData, columnKey: React.Key): React.ReactNode => {
    const cellValue = user[columnKey as keyof UserData];

    switch (columnKey) {
      case "name":
        return (
          <User
            name={`${user.name} ${user.surname} ${user.lastname}`}
            description={user.email}
          >
            {user.email}
          </User>
        );
      case "status":
        return <Chip variant="flat" color={user.status ? "success" : "danger"}>
          {user.status ? "Activo" : "Inactivo"}
        </Chip>
      case "createdAt":
        return new Date(user.createdAt).toLocaleDateString();
      case "updatedAt":
      case "updatedAt":
        if (user.updatedAt) {
          return new Date(user.updatedAt).toLocaleString();
        } else {
          return "";
        }
      case "actions":
        return (
          <div className="flex gap-2">
            <Button variant="bordered" title="Cambiar contraseña" isIconOnly color="secondary" size="sm" onPress={() => { setSelectedUser(user); setIsChangePasswordModalOpen(true) }}>
              <ShieldCheckIcon className="size-5" />
            </Button>
            {user.status ? <Button variant="bordered" isIconOnly color="warning" aria-label="Edit" size="sm" onPress={() => ""}>
              <PencilSquareIcon className="size-5" />
            </Button> : <Button variant="bordered" isIconOnly color="danger" aria-label="Remove" size="sm" onPress={() => deleteUser(user.email)}>
              <TrashIcon className="size-5" />
            </Button>}
            <Button variant="bordered" isIconOnly color={user.status ? "danger" : "success"} aria-label={user.status ? "Delete" : "Activate"} size="sm" onPress={() => changeStatusUser(user.email)}>
              {user.status ? <LockClosedIcon className="size-5" /> : <LockOpenIcon className="size-5" />}
            </Button>

          </div>
        );
      case "userinfo":
        return JSON.stringify(user.userinfo);
      case "salary":
        return user.salary ? `$${user.salary.toFixed(2)}` : "N/A";
      default:
        return cellValue !== null && cellValue !== undefined ? String(cellValue) : "";
    }
  };

  return (
    <div className="space-y-4">
      <Tabs
        aria-label="User types"
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
      >
        <Tab key="ROLE_ADMIN" title="Admins" />
        <Tab key="employee" title="Empleados" />
        <Tab key="customer" title="Clientes" />
      </Tabs>

      <Card>
        <CardBody>
          <div className="flex justify-between items-center">
            <div>

              <p className="text-lg font-bold">Total: {totalUsers}</p>
              <p>Nuevos Registros: {newUsers}</p>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Busqueda por nombre"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {activeTab === "customer" ? ("") : (
                <Button
                  color="primary"
                  onPress={() => addNewUser()}
                  startContent={<PlusIcon className="h-5 w-5" />}
                >
                  Agregar
                </Button>)}

            </div>
          </div>
        </CardBody>
      </Card>

      {activeTab === "ROLE_ADMIN" && (
        <Table
          aria-label="Admin table"
          bottomContent={
            totalPages > 1 ? (
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={totalPages}
                onChange={setPage}
              />
            ) : null
          }
        >
          <TableHeader>
            <TableColumn key="name">Usuario</TableColumn>
            <TableColumn key="phone">Telefono</TableColumn>
            <TableColumn key="rfc">RFC</TableColumn>
            <TableColumn key="status">Estatus</TableColumn>
            <TableColumn key="createdAt">Creado</TableColumn>
            <TableColumn key="updatedAt">Actualización</TableColumn>
            <TableColumn key="actions">Acciones</TableColumn>
          </TableHeader>
          <TableBody
            items={users}
            loadingContent={<Spinner />}
            loadingState={isLoading ? "loading" : "idle"}
          >
            {(item) => (
              <TableRow key={item._id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {activeTab === "employee" && (
        <Table
          aria-label="Employee table"
          bottomContent={
            totalPages > 1 ? (
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={totalPages}
                onChange={setPage}
              />
            ) : null
          }
        >
          <TableHeader>
            <TableColumn key="name">Usuario</TableColumn>
            <TableColumn key="phone">Telefono</TableColumn>
            <TableColumn key="rfc">RFC</TableColumn>
            <TableColumn key="position">Posición</TableColumn>
            <TableColumn key="salary">Sueldo</TableColumn>
            <TableColumn key="department">Departamento</TableColumn>
            <TableColumn key="accessLevel">Nivel Acceso</TableColumn>
            <TableColumn key="status">Estatus </TableColumn>
            <TableColumn key="createdAt">Creado</TableColumn>
            <TableColumn key="updatedAt">Actualización</TableColumn>
            <TableColumn key="actions">Acciones</TableColumn>
          </TableHeader>
          <TableBody
            items={users}
            loadingContent={<Spinner />}
            loadingState={isLoading ? "loading" : "idle"}
          >
            {(item) => (
              <TableRow key={item._id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {activeTab === "customer" && (
        <Table
          aria-label="Customer table"
          bottomContent={
            totalPages > 1 ? (
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={totalPages}
                onChange={setPage}
              />
            ) : null
          }
        >
          <TableHeader>
            <TableColumn key="name">Name</TableColumn>
            <TableColumn key="phone">Phone</TableColumn>
            <TableColumn key="rfc">RFC</TableColumn>
            <TableColumn key="status">Status</TableColumn>
            <TableColumn key="createdAt">Created At</TableColumn>
            <TableColumn key="actions">Actions</TableColumn>
          </TableHeader>
          <TableBody
            items={users}
            loadingContent={<Spinner />}
            loadingState={isLoading ? "loading" : "idle"}
          >
            {(item) => (
              <TableRow key={item._id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      <AddPersonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        token={token}
      />
      <ResetPasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        user={selectedUser}
        token={token}
        notifyDone={handleSuccess}
      />
    </div>
  );
}

