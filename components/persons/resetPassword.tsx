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
    User,
} from "@nextui-org/react";
import axios from "axios";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { EyeSlashFilledIcon } from "@/app/login/EyeSlashFilledIcon";
import { EyeFilledIcon } from "@/app/login/EyeFilledIcon";
import { autoGeneratePassword } from "@/utils/utils";

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    token: string | null;
    notifyDone: () => void;
}

export function ResetPasswordModal({ isOpen, onClose, user, token, notifyDone }: ChangePasswordModalProps) {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const onSubmit = async (email: string, newPassword: string) => {
        try {
            setIsLoading(true);
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password-admin`,
                JSON.stringify({ email, newPassword }),
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            if (response.status === 200) {
                notifyDone();
                handleCloseModal();
            }
        } catch (error) {

        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }
        if (newPassword.length < 8) {
            setError("La contraseña debe ser mayor a 8 digitos");
            return;
        }
        onSubmit(user.email, newPassword);

    };
    const handleGeneratePassword = () => {
        let password = autoGeneratePassword(12);
        setNewPassword(password)
    };
    const handleCloseModal = () => {
        setNewPassword("");
        setConfirmPassword("");
        setError("");
        onClose();
    }
    return (
        <Modal isOpen={isOpen} onClose={handleCloseModal}>
            <ModalContent>
                <form onSubmit={handleSubmit}>
                    <ModalHeader className="flex flex-col gap-1">Cambiar Contraseña</ModalHeader>
                    <ModalBody>
                        <User
                            name={`${user.name} ${user.surname} ${user.lastname}`}
                            description={user.email}
                        >
                            {user.email}
                        </User>
                        <Input
                            label="Contraseña nueva"
                            value={newPassword}
                            type={showPassword ? "text" : "password"}
                            onChange={(e) => setNewPassword(e.target.value)}
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
                                </div>}
                        />
                        <Input
                            type={showPassword ? "text" : "password"}
                            label="Confirm Password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {error && <p className="text-danger">{error}</p>}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                            Cancelar
                        </Button>
                        <Button color="primary" isLoading={isLoading} type="submit">
                            Cambiar
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}

