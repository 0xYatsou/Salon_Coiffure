"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Scissors } from "lucide-react";

interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    isActive: boolean;
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        duration: "",
        active: true,
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await fetch("/api/services");
            if (response.ok) {
                const data = await response.json();
                setServices(data);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("adminToken");
        const url = editingService
            ? `/api/services/${editingService.id}`
            : "/api/services";
        const method = editingService ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    duration: parseInt(formData.duration),
                }),
            });

            if (response.ok) {
                fetchServices();
                handleCloseModal();
            } else {
                alert("Erreur lors de l'enregistrement");
            }
        } catch (error) {
            console.error("Error saving service:", error);
            alert("Erreur lors de l'enregistrement");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
            return;
        }

        try {
            const token = localStorage.getItem("adminToken");
            const response = await fetch(`/api/services/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                fetchServices();
            } else {
                alert("Erreur lors de la suppression");
            }
        } catch (error) {
            console.error("Error deleting service:", error);
            alert("Erreur lors de la suppression");
        }
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            description: service.description,
            price: service.price.toString(),
            duration: service.duration.toString(),
            active: service.isActive,
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingService(null);
        setFormData({
            name: "",
            description: "",
            price: "",
            duration: "",
            active: true,
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-primary-900">Services</h1>
                    <p className="text-primary-600 mt-1">
                        Gérez les services proposés par votre salon
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center space-x-2 bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-lg transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nouveau service</span>
                </button>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div
                        key={service.id}
                        className="bg-white rounded-xl shadow-sm border border-primary-100 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center">
                                <Scissors className="w-6 h-6 text-accent" />
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(service)}
                                    className="text-primary-600 hover:text-primary-900"
                                >
                                    <Edit2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-primary-900 mb-2">
                            {service.name}
                        </h3>
                        <p className="text-primary-600 text-sm mb-4 line-clamp-2">
                            {service.description}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-primary-100">
                            <div>
                                <p className="text-2xl font-bold text-accent">
                                    {service.price}€
                                </p>
                                <p className="text-sm text-primary-500">
                                    {service.duration} minutes
                                </p>
                            </div>
                            <span
                                className={`
                                    px-3 py-1 text-xs font-semibold rounded-full
                                    ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                                `}
                            >
                                {service.isActive ? 'Actif' : 'Inactif'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-8">
                        <h3 className="text-2xl font-bold text-primary-900 mb-6">
                            {editingService ? "Modifier le service" : "Nouveau service"}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-primary-900 mb-2">
                                    Nom du service
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-primary-900 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-primary-900 mb-2">
                                        Prix (€)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-primary-900 mb-2">
                                        Durée (min)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                    className="w-4 h-4 text-accent border-primary-300 rounded focus:ring-accent"
                                />
                                <label htmlFor="isActive" className="ml-2 text-sm text-primary-900">
                                    Service actif
                                </label>
                            </div>

                            <div className="flex space-x-4 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 bg-primary-100 text-primary-900 py-3 rounded-lg hover:bg-primary-200 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-accent text-white py-3 rounded-lg hover:bg-accent-dark transition-colors"
                                >
                                    {editingService ? "Modifier" : "Créer"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
