"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Checkbox,
} from "@nextui-org/react";
import axios from "axios";
import { motion } from "framer-motion";
import { EyeSlashFilledIcon } from "@/app/login/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@/app/login/EyeFilledIcon";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { autoGeneratePassword } from "@/utils/utils"

interface AddPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string | null;
}

interface FormData {
  name: string;
  surname: string;
  lastname: string;
  email: string;
  phone: string;
  rfc: string;
  role: "ROLE_ADMIN" | "ROLE_EMPLOYEE";
  password: string;
  responsibleArea?: string;
  accessLevel?: string;
  position?: string;
  salary?: number;
  department?: string;
}

export function AddPersonModal({ isOpen, onClose , token}: AddPersonModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    surname: '',
    lastname: '',
    email: '',
    phone: '',
    rfc: '',
    role: 'ROLE_ADMIN',
    password: '',
    responsibleArea: '',
    accessLevel: '',
    position: '',
    salary: 0,
    department: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleAddPerson = async (data: any) => {
    setIsLoading(true);
    var url_create = "";
    if (data?.role == "ROLE_ADMIN") {
      url_create = "admin"
    } else if (data?.role == "ROLE_EMPLOYEE") {
      url_create = "employee"
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/person/${url_create}/create`,
        JSON.stringify(data),
        { headers: { 'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json', } }
      );
      if (response.data.status === 200) {
        handleOnClose();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      //console.error('Error adding person:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      status: true,
      userinfo: {
        username: formData.email,
        password: formData.password,
        roles: formData.role,
        nonLocked: true,
        code_two_steps: 0,
        verify_code: 0,
        person: null,
      },
    };
    delete (formattedData as any).password;
    handleAddPerson(formattedData);
  };

  const handleOnClose = () => {
    onClose();
    setFormData({
      name: '',
      surname: '',
      lastname: '',
      email: '',
      phone: '',
      rfc: '',
      role: 'ROLE_ADMIN',
      password: '',
      responsibleArea: '',
      accessLevel: '',
      position: '',
      salary: 0,
      department: '',
    });
    setError("");

  }
  const handleGeneratePassword = () => {
    let password = autoGeneratePassword(12);
    setFormData((prevData) => ({
      ...prevData,
      password: password,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleOnClose} size="3xl">
      <ModalContent>
        <form onSubmit={onSubmitForm}>
          <ModalHeader className="flex flex-col gap-1">Agregar nueva persona</ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="name"
                label="Nombre"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <Input
                name="surname"
                label="Apellido Materno"
                value={formData.surname}
                onChange={handleInputChange}
                required
              />
              <Input
                name="lastname"
                label="Apellido Paterno"
                value={formData.lastname}
                onChange={handleInputChange}
                required
              />
              <Input
                name="email"
                type="email"
                label="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <Input
                name="phone"
                type="tel"
                label="Telefono"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              <Input
                name="rfc"
                label="RFC"
                value={formData.rfc}
                onChange={handleInputChange}
                required
              />
              <Select
                name="role"
                label="Role"
                placeholder="Selecciona un rol"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                <SelectItem key="ROLE_ADMIN" value="ROLE_ADMIN">ADMIN</SelectItem>
                <SelectItem key="ROLE_EMPLOYEE" value="ROLE_EMPLOYEE">EMPLEADO</SelectItem>
              </Select>
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                label="Contraseña"
                value={formData.password}
                onChange={handleInputChange}
                required
                endContent={
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleGeneratePassword()}
                      className="focus:outline-none"
                      aria-label="Generar contraseña"
                      title="Generar contraseña"
                    >
                      <ArrowPathIcon className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="focus:outline-none"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  </div>
                }
              />

              {formData.role === "ROLE_ADMIN" && (
                <>
                  <Input
                    name="responsibleArea"
                    label="Area responsable"
                    value={formData.responsibleArea}
                    onChange={handleInputChange}
                    required
                  />
                  <Select
                    name="accessLevel"
                    label="Nivel de acceso"
                    value={formData.accessLevel}
                    onChange={handleInputChange}
                    required
                  >
                    <SelectItem key="ALL" value="ALL">COMPLETO</SelectItem>
                    <SelectItem key="LIMITED" value="LIMITED">LIMITADO</SelectItem>
                  </Select>
                </>
              )}
              {formData.role === "ROLE_EMPLOYEE" && (
                <>
                  <Input
                    name="position"
                    label="Posición"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="salary"
                    type="number"
                    label="Sueldo"
                    value={formData.salary?.toString() || ""}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="department"
                    label="Departamento"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  />
                  <Select
                    name="accessLevel"
                    label="Nivel de acceso"
                    value={formData.accessLevel}
                    onChange={handleInputChange}
                    required
                  >
                    <SelectItem key="ALL" value="ALL">COMPLETO</SelectItem>
                    <SelectItem key="LIMITED" value="LIMITED">LIMITADO</SelectItem>
                  </Select>
                </>
              )}
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-red-600"
              >
                {error}
              </motion.p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={handleOnClose}>
              Close
            </Button>
            <Button isLoading={isLoading} disabled={isLoading} color="primary" type="submit">
              {isLoading ? "" : "Guardar"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

