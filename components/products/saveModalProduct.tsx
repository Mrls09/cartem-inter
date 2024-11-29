import React, { useState, useEffect } from "react";
import { Button, Input, Textarea, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Image, CircularProgress } from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { Product, Subcategory, Image as ProductImage } from "@/interfaces/Product";
import { TrashIcon } from '@heroicons/react/24/solid';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Alert from "../alert";

interface ProductModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    token: string | null;
    getProduct: () => void;
}

interface DraggableImageProps {
    image: ProductImage;
    index: number;
    onRemove: (index: number) => void;
}

const DraggableImage: React.FC<DraggableImageProps> = ({ image, index, onRemove }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'IMAGE',
        item: { index },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={drag as unknown as React.RefObject<HTMLDivElement>}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            className="relative group"
        >
            <Image
                src={image.url}
                alt={`Additional ${index + 1}`}
                className="w-20 h-20 object-cover rounded"
            />
        </div>
    );
};

interface TrashBinProps {
    onDrop: (index: number) => void;
}

const TrashBin: React.FC<TrashBinProps> = ({ onDrop }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'IMAGE',
        drop: (item: { index: number }) => onDrop(item.index),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    return (
        <div
            ref={drop as unknown as React.RefObject<HTMLDivElement>}
            className={`p-4 mt-4 border-2 border-dashed rounded-lg flex items-center justify-center transition-colors ${isOver ? 'bg-red-100 border-red-500' : 'border-gray-300'
                }`}
        >
            <TrashIcon className={`w-8 h-8 ${isOver ? 'text-red-500' : 'text-gray-400'}`} />
        </div>
    );
};

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onOpenChange, token, getProduct }) => {
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [additionalImages, setAdditionalImages] = useState<ProductImage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [alert, setAlert] = useState<{ type: 'error' | 'success' | 'warning', title: string, message: string } | null>(null);
    const [disableButtom , setDisableButtom ] = useState(false);
    useEffect(() => {
        const fetchSubcategories = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subcategory/get-all`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (Array.isArray(data.data)) {
                    setSubcategories(data.data);
                } else {
                    console.error("Invalid subcategories data", data);
                }
            } catch (error) {
                console.error("Error fetching subcategories:", error);
            }
        };

        fetchSubcategories();
    }, [token]);

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert(null);
            }, 5000); // La alerta desaparecerá después de 5 segundos

            return () => clearTimeout(timer);
        }
    }, [alert]);

    const validationSchema = Yup.object({
        name: Yup.string().required('El nombre es requerido'),
        description: Yup.string().required('La descripción es requerida'),
        purchasePrice: Yup.number().min(0, 'El precio debe ser positivo').required('El precio de compra es requerido'),
        retailPrice: Yup.number().min(0, 'El precio debe ser positivo').required('El precio de venta es requerido'),
        wholesalePrice: Yup.number().min(0, 'El precio debe ser positivo').required('El precio al por mayor es requerido'),
        bulkWholesalePrice: Yup.number().min(0, 'El precio debe ser positivo').required('El precio al por mayor en volumen es requerido'),
        stock: Yup.number().integer('El stock debe ser un número entero').min(0, 'El stock no puede ser negativo').required('El stock es requerido'),
        technicalData: Yup.string().required('Los datos técnicos son requeridos'),
        subcategory: Yup.object().shape({ _id: Yup.string().required('La subcategoría es requerida'), }),
        sku: Yup.string().required('El SKU es requerido')
    });

    const form = useFormik({
        initialValues: {
            name: "",
            description: "",
            purchasePrice: 0,
            retailPrice: 0,
            wholesalePrice: 0,
            bulkWholesalePrice: 0,
            stock: 0,
            technicalData: "",
            subcategory: { _id: "" } as Subcategory,
            preview: {
                fileBase64: "",
                uid: "",
                url: "",
                title: "",
                mimeType: ""
            },
            status: true,
            images: [],
            rating: 0,
            sku: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            setAlert(null);
            const productData = {
                ...values,
                subcategory: { _id: values.subcategory._id },
                preview: { fileBase64: previewImage?.split(',')[1] || '' },
                images: additionalImages.map(img => ({ fileBase64: img.fileBase64 }))
            };

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/save`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(productData),
                });

                if (response.status === 200) {
                    setDisableButtom(true);
                    setAlert({
                        type: 'success',
                        title: 'Éxito',
                        message: 'Producto creado correctamente'
                    });
                    setTimeout(() => {
                        onOpenChange();
                        getProduct();
                        form.resetForm();
                        setPreviewImage(null);
                        setAdditionalImages([]);
                        setStep(1);
                        setDisableButtom(false);
                    }, 3000);

                } else {
                    const errorData = await response.json();
                    setAlert({
                        type: 'error',
                        title: 'Error',
                        message: errorData.message || 'Ha ocurrido un error al crear el producto'
                    });
                }
            } catch (error) {
                setAlert({
                    type: 'error',
                    title: 'Error',
                    message: 'Ha ocurrido un error al hacer la petición'
                });
            } finally {
                setIsLoading(false);
            }
        }
    });

    const handlePreviewImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setPreviewImage(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAdditionalImagesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                if (additionalImages.length < 10) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64String = reader.result as string;
                        setAdditionalImages(prev => [
                            ...prev,
                            {
                                fileBase64: base64String.split(',')[1],
                                uid: Math.random().toString(36).substr(2, 9),
                                url: base64String,
                                title: file.name,
                                mimeType: file.type
                            }
                        ]);
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    };

    const handleRemoveImage = (index: number) => {
        setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    };

    const renderStep1 = () => (
        <>
            <ModalHeader className="flex flex-col gap-1">
                Agregar Nuevo Producto - Información
            </ModalHeader>
            <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Nombre"
                        placeholder="Nombre del producto"
                        name="name"
                        value={form.values.name}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        isInvalid={form.touched.name && !!form.errors.name}
                        errorMessage={form.touched.name && form.errors.name}
                    />
                    <Textarea
                        label="Descripción"
                        placeholder="Descripción del producto"
                        name="description"
                        value={form.values.description}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        isInvalid={form.touched.description && !!form.errors.description}
                        errorMessage={form.touched.description && form.errors.description}
                    />
                    <Input
                        type="number"
                        label="Precio de Compra"
                        name="purchasePrice"
                        placeholder="0.00"
                        value={form.values.purchasePrice.toString()}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        isInvalid={form.touched.purchasePrice && !!form.errors.purchasePrice}
                        errorMessage={form.touched.purchasePrice && form.errors.purchasePrice}
                    />
                    <Input
                        type="number"
                        label="Precio de Venta al Por Menor"
                        name="retailPrice"
                        placeholder="0.00"
                        value={form.values.retailPrice.toString()}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        isInvalid={form.touched.retailPrice && !!form.errors.retailPrice}
                        errorMessage={form.touched.retailPrice && form.errors.retailPrice}
                    />
                    <Input
                        type="number"
                        label="Precio de Venta al Por Mayor"
                        name="wholesalePrice"
                        placeholder="0.00"
                        value={form.values.wholesalePrice.toString()}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        isInvalid={form.touched.wholesalePrice && !!form.errors.wholesalePrice}
                        errorMessage={form.touched.wholesalePrice && form.errors.wholesalePrice}
                    />
                    <Input
                        type="number"
                        label="Precio de Venta al Por Mayor en Volumen"
                        name="bulkWholesalePrice"
                        placeholder="0.00"
                        value={form.values.bulkWholesalePrice.toString()}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        isInvalid={form.touched.bulkWholesalePrice && !!form.errors.bulkWholesalePrice}
                        errorMessage={form.touched.bulkWholesalePrice && form.errors.bulkWholesalePrice}
                    />
                    <Input
                        type="number"
                        label="Stock"
                        name="stock"
                        placeholder="0"
                        value={form.values.stock.toString()}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        isInvalid={form.touched.stock && !!form.errors.stock}
                        errorMessage={form.touched.stock && form.errors.stock}
                    />
                    <Textarea
                        label="Datos Técnicos"
                        name="technicalData"
                        placeholder="Datos técnicos del producto"
                        value={form.values.technicalData}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        isInvalid={form.touched.technicalData && !!form.errors.technicalData}
                        errorMessage={form.touched.technicalData && form.errors.technicalData}
                    />
                    <Select
                        label="Subcategoría"
                        placeholder="Selecciona una subcategoría"
                        name="subcategory._id"
                        selectedKeys={form.values.subcategory._id ? [form.values.subcategory._id] : []}
                        onChange={(e) => form.setFieldValue("subcategory._id", e.target.value)}
                        onBlur={form.handleBlur}
                        isInvalid={form.touched.subcategory && !!form.errors.subcategory}
                    >
                        {subcategories.map((sub) => (
                            <SelectItem key={sub._id} value={sub._id}>
                                {sub.name}
                            </SelectItem>
                        ))}
                    </Select>
                    <Input
                        label="SKU"
                        placeholder="SKU del producto"
                        name="sku"
                        value={form.values.sku}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        isInvalid={form.touched.sku && !!form.errors.sku}
                        errorMessage={form.touched.sku && form.errors.sku}
                    />
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="danger" variant="light" onPress={closeModal}>
                    Cancelar
                </Button>
                <Button color="primary" onPress={() => setStep(2)}>
                    Siguiente
                </Button>
            </ModalFooter>
        </>
    );

    const renderStep2 = () => (
        <>
            <ModalHeader className="flex flex-col gap-1">
                Agregar Nuevo Producto - Imágenes
            </ModalHeader>
            <ModalBody>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vista Previa (Solo 1 imagen)</label>
                        <input
                            type="file"
                            onChange={handlePreviewImageUpload}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                        />
                        {previewImage && (
                            <Image
                                src={previewImage}
                                alt="Preview"
                                className="mt-2 w-20 h-20 object-cover rounded"
                            />
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes Adicionales (Máximo 10)</label>
                        <input
                            type="file"
                            onChange={handleAdditionalImagesUpload}
                            multiple
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                        />
                        <DndProvider backend={HTML5Backend}>
                            <div className="mt-2 flex flex-wrap gap-2 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded">
                                {additionalImages.map((img, index) => (
                                    <DraggableImage key={index} image={img} index={index} onRemove={handleRemoveImage} />
                                ))}
                            </div>
                            <TrashBin onDrop={handleRemoveImage} />
                        </DndProvider>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="danger" variant="light" onPress={() => setStep(1)} isDisabled={disableButtom}>
                    Atrás
                </Button>
                <Button color="primary" onPress={() => form.handleSubmit()} isDisabled={disableButtom}>
                    {isLoading ? <CircularProgress size="sm" aria-label="Loading..." />
                        : 'Crear producto'}
                </Button>
            </ModalFooter>
        </>
    );

    const closeModal = () => {
        setPreviewImage("");
        setAdditionalImages([]);
        form.handleReset("");
        onOpenChange();
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="3xl"
            scrollBehavior="inside"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        {alert && (
                            <div className="absolute top-4 right-4 z-50 transition-opacity duration-300 ease-in-out">
                                <Alert
                                    type={alert.type}
                                    title={alert.title}
                                    message={alert.message}
                                    onClose={() => setAlert(null)}
                                />
                            </div>
                        )}
                        {step === 1 ? renderStep1() : renderStep2()}
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export default ProductModal;