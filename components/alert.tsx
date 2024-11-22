import React from 'react'
import { Card, CardBody, CardHeader } from "@nextui-org/react"
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"

type AlertType = 'error' | 'warning' | 'success'

interface AlertProps {
  type: AlertType
  title: string
  message: string
  onClose?: () => void
}

const Alert: React.FC<AlertProps> = ({ type, title, message, onClose }) => {
  const getAlertStyles = (type: AlertType) => {
    switch (type) {
      case 'error':
        return {
          bgColor: 'bg-red-50 dark:bg-red-900',
          textColor: 'text-red-700 dark:text-red-200',
          borderColor: 'border-red-400 dark:border-red-800',
          icon: <AlertCircle className="w-6 h-6 text-red-700 dark:text-red-200" />
        }
      case 'warning':
        return {
          bgColor: 'bg-yellow-50 dark:bg-yellow-900',
          textColor: 'text-yellow-700 dark:text-yellow-200',
          borderColor: 'border-yellow-400 dark:border-yellow-800',
          icon: <AlertTriangle className="w-6 h-6 text-yellow-700 dark:text-yellow-200" />
        }
      case 'success':
        return {
          bgColor: 'bg-green-50 dark:bg-green-900',
          textColor: 'text-green-700 dark:text-green-200',
          borderColor: 'border-green-400 dark:border-green-800',
          icon: <CheckCircle className="w-6 h-6 text-green-700 dark:text-green-200" />
        }
    }
  }

  const { bgColor, textColor, borderColor, icon } = getAlertStyles(type)

  return (
    <Card className={`${bgColor} ${borderColor} border`}>
      <CardHeader className="flex gap-3 pb-2">
        {icon}
        <h4 className={`font-bold ${textColor}`}>{title}</h4>
        {onClose && (
          <button
            onClick={onClose}
            className={`ml-auto ${textColor} hover:opacity-70 transition-opacity`}
            aria-label="Close alert"
          >
            ×
          </button>
        )}
      </CardHeader>
      <CardBody className={textColor}>
        <p>{message}</p>
      </CardBody>
    </Card>
  )
}

export default Alert
