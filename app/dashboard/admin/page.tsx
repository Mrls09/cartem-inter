"use client"
import React from 'react'
import { Card, CardBody, CardHeader } from "@nextui-org/react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, Package, TruckIcon, FileText, ArrowUpRight } from 'lucide-react'

const data = [
  { name: 'Ene', ventas: 4000 },
  { name: 'Feb', ventas: 3000 },
  { name: 'Mar', ventas: 5000 },
  { name: 'Abr', ventas: 4500 },
  { name: 'May', ventas: 6000 },
  { name: 'Jun', ventas: 5500 },
]

export default function Dashboard() {
  return (
    <div >
      <h1 className="text-2xl font-bold mb-6">Panel de Control - ADMIN</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Resumen de Ventas */}
        <Card className="col-span-full">
          <CardHeader className="flex justify-between">
            <h2 className="text-lg font-semibold">Resumen de Ventas</h2>
            <button className="text-primary flex items-center">
              Ver detalles <ArrowUpRight className="ml-1 h-4 w-4" />
            </button>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ventas" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Productos */}
        <Card>
          <CardHeader className="flex justify-between">
            <h2 className="text-lg font-semibold">Productos</h2>
            <Package className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold">1,234</p>
            <p className="text-sm text-gray-500">Productos en inventario</p>
          </CardBody>
        </Card>

        {/* Clientes */}
        <Card>
          <CardHeader className="flex justify-between">
            <h2 className="text-lg font-semibold">Clientes</h2>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold">5,678</p>
            <p className="text-sm text-gray-500">Clientes registrados</p>
          </CardBody>
        </Card>

        {/* Envíos */}
        <Card>
          <CardHeader className="flex justify-between">
            <h2 className="text-lg font-semibold">Envíos</h2>
            <TruckIcon className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold">98</p>
            <p className="text-sm text-gray-500">Envíos en proceso</p>
          </CardBody>
        </Card>

        {/* Reportes */}
        <Card>
          <CardHeader className="flex justify-between">
            <h2 className="text-lg font-semibold">Reportes</h2>
            <FileText className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold">12</p>
            <p className="text-sm text-gray-500">Reportes generados este mes</p>
          </CardBody>
        </Card>

        {/* Servicios de Instalación */}
        <Card>
          <CardHeader className="flex justify-between">
            <h2 className="text-lg font-semibold">Instalaciones</h2>
          </CardHeader>
          <CardBody>
            <p className="text-3xl font-bold">45</p>
            <p className="text-sm text-gray-500">Instalaciones programadas</p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}