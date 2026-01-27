"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, User, Phone, Mail, Check, AlertCircle, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { addMonths, subMonths } from "date-fns";
import { showToast } from "@/lib/toast";
import {
    generateMonthCalendar,
    generateTimeSlots,
    formatDateDisplay,
    formatDayShort,
    formatDayNumber,
    formatMonthShort,
    formatMonthYear,
    isWithinBusinessHours
} from "@/lib/calendar";

interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
}

interface DayInfo {
    date: Date;
    isCurrentMonth: boolean;
    isSunday: boolean;
    isPast: boolean;
    hasSlots?: boolean;
}

export default function BookingPage() {
    const [step, setStep] = useState(1);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [services, setServices] = useState<Service[]>([]);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [clientName, setClientName] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [calendarDays, setCalendarDays] = useState<DayInfo[]>([]);

    // Charger les services
    useEffect(() => {
        fetch("/api/services")
            .then((res) => res.json())
            .then((data) => {
                setServices(data);
                // Présélectionner le service si passé en paramètre
                if (typeof window !== 'undefined') {
                    const params = new URLSearchParams(window.location.search);
                    const preselectedServiceId = params.get('service');
                    if (preselectedServiceId) {
                        const service = data.find((s: Service) => s.id === preselectedServiceId);
                        if (service) {
                            setSelectedService(service);
                            setStep(2);
                        }
                    }
                }
            })
            .catch((error) => {
                console.error("Error loading services:", error);
                showToast({
                    type: 'error',
                    description: 'Erreur lors du chargement des services'
                });
            });
    }, []);

    // Générer le calendrier mensuel
    useEffect(() => {
        const days = generateMonthCalendar(currentMonth);
        setCalendarDays(days);
    }, [currentMonth]);

    // Charger les créneaux disponibles quand date et service changent
    useEffect(() => {
        if (selectedDate && selectedService) {
            setLoadingSlots(true);
            setAvailableSlots([]);
            setSelectedTime("");

            fetch(`/api/bookings/available-slots?date=${selectedDate.toISOString()}&serviceId=${selectedService.id}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.availableSlots) {
                        setAvailableSlots(data.availableSlots);
                        if (data.availableSlots.length === 0) {
                            showToast({
                                type: 'warning',
                                description: 'Aucun créneau disponible pour cette date'
                            });
                        }
                    }
                })
                .catch((error) => {
                    console.error("Error loading slots:", error);
                    showToast({
                        type: 'error',
                        description: 'Erreur lors du chargement des créneaux'
                    });
                })
                .finally(() => setLoadingSlots(false));
        }
    }, [selectedDate, selectedService]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!clientName || clientName.length < 2) {
            newErrors.clientName = "Le nom doit contenir au moins 2 caractères";
        }

        const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
        if (!clientPhone || !phoneRegex.test(clientPhone)) {
            newErrors.clientPhone = "Format de téléphone invalide (ex: 06 12 34 56 78)";
        }

        if (clientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
            newErrors.clientEmail = "Format d'email invalide";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!selectedService || !selectedDate || !selectedTime) {
            showToast({
                type: 'error',
                description: 'Veuillez remplir tous les champs'
            });
            return;
        }

        if (!validateForm()) {
            showToast({
                type: 'error',
                title: 'Formulaire invalide',
                description: 'Veuillez corriger les erreurs'
            });
            return;
        }

        setLoading(true);

        try {
            const [hours, minutes] = selectedTime.split(":");
            const bookingDate = new Date(selectedDate);
            bookingDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clientName,
                    clientPhone,
                    clientEmail: clientEmail || undefined,
                    serviceId: selectedService.id,
                    date: bookingDate.toISOString(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.details) {
                    const fieldErrors: Record<string, string> = {};
                    data.details.forEach((err: any) => {
                        fieldErrors[err.field] = err.message;
                    });
                    setErrors(fieldErrors);
                    showToast({
                        type: 'error',
                        title: 'Formulaire invalide',
                        description: 'Veuillez corriger les erreurs'
                    });
                } else {
                    throw new Error(data.error || "Erreur lors de la réservation");
                }
                return;
            }

            setSuccess(true);
            showToast({
                type: 'success',
                title: 'Réservation confirmée !',
                description: 'Vous recevrez une confirmation par SMS'
            });
        } catch (error: any) {
            showToast({
                type: 'error',
                title: 'Erreur',
                description: error.message || 'Une erreur est survenue'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDateSelect = (day: DayInfo) => {
        if (day.isPast || day.isSunday || !day.isCurrentMonth) {
            return;
        }
        setSelectedDate(day.date);
        setSelectedTime("");
    };

    const handlePreviousMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
        setSelectedDate(null);
        setSelectedTime("");
    };

    const handleNextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
        setSelectedDate(null);
        setSelectedTime("");
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary-50">
                <div className="card max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="font-serif text-3xl font-bold mb-4">Réservation confirmée !</h2>
                    <p className="text-primary-600 mb-6">
                        Votre rendez-vous a été enregistré. Vous recevrez une confirmation par SMS.
                    </p>
                    <button onClick={() => window.location.href = "/"} className="btn-primary">
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary-50 py-12">
            <div className="container-custom max-w-4xl">
                <h1 className="font-serif text-4xl font-bold text-center mb-8">Réserver un rendez-vous</h1>

                {/* Progress Bar */}
                <div className="flex justify-center mb-12">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= s ? "bg-primary-900 text-white" : "bg-white text-primary-400"
                                    }`}
                            >
                                {s}
                            </div>
                            {s < 3 && (
                                <div
                                    className={`w-20 h-1 transition-colors ${step > s ? "bg-primary-900" : "bg-white"}`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="card">
                    {/* Step 1: Service Selection */}
                    {step === 1 && (
                        <div>
                            <h2 className="font-serif text-2xl font-bold mb-6">Choisissez votre prestation</h2>
                            <div className="space-y-4">
                                {services.map((service) => (
                                    <div
                                        key={service.id}
                                        onClick={() => {
                                            setSelectedService(service);
                                            setStep(2);
                                        }}
                                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedService?.id === service.id
                                                ? "border-primary-900 bg-primary-50"
                                                : "border-primary-200 hover:border-primary-400"
                                            }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-lg">{service.name}</h3>
                                                <p className="text-primary-600 text-sm">{service.description}</p>
                                                <p className="text-sm text-primary-500 mt-1">
                                                    <Clock className="w-4 h-4 inline mr-1" />
                                                    {service.duration} min
                                                </p>
                                            </div>
                                            <div className="text-2xl font-bold text-accent">{service.price}€</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Date & Time Selection */}
                    {step === 2 && selectedService && (
                        <div>
                            <button
                                onClick={() => {
                                    setStep(1);
                                    setSelectedDate(null);
                                    setSelectedTime("");
                                }}
                                className="text-primary-600 mb-4 hover:text-primary-900 flex items-center gap-2"
                            >
                                ← Retour
                            </button>
                            <h2 className="font-serif text-2xl font-bold mb-6">Choisissez la date et l'heure</h2>

                            {/* Calendar Header */}
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={handlePreviousMonth}
                                    className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <h3 className="font-bold text-lg capitalize">{formatMonthYear(currentMonth)}</h3>
                                <button
                                    onClick={handleNextMonth}
                                    className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Calendar Grid */}
                            <div className="mb-8">
                                <h3 className="font-bold mb-4">Date</h3>

                                {/* Day headers */}
                                <div className="grid grid-cols-7 gap-2 mb-2">
                                    {['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'].map((day) => (
                                        <div key={day} className="text-center text-sm font-medium text-primary-600">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar days */}
                                <div className="grid grid-cols-7 gap-2">
                                    {calendarDays.map((day, index) => {
                                        const isSelected = selectedDate?.toDateString() === day.date.toDateString();
                                        const isDisabled = day.isPast || day.isSunday || !day.isCurrentMonth;

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => handleDateSelect(day)}
                                                disabled={isDisabled}
                                                className={`
                                                    p-3 rounded-lg border-2 text-center transition-all
                                                    ${!day.isCurrentMonth ? 'opacity-30' : ''}
                                                    ${day.isSunday ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-400' : ''}
                                                    ${day.isPast && !day.isSunday ? 'bg-gray-50 border-gray-200 cursor-not-allowed text-gray-400' : ''}
                                                    ${!isDisabled && !isSelected ? 'border-primary-200 hover:border-primary-400 hover:bg-primary-50' : ''}
                                                    ${isSelected ? 'border-primary-900 bg-primary-900 text-white' : ''}
                                                `}
                                            >
                                                <div className="text-xs">{formatDayShort(day.date)}</div>
                                                <div className="font-bold">{formatDayNumber(day.date)}</div>
                                                <div className="text-xs">{formatMonthShort(day.date)}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Time Selection */}
                            {selectedDate && (
                                <div>
                                    <h3 className="font-bold mb-4">Heure</h3>

                                    {loadingSlots ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="w-8 h-8 animate-spin text-accent" />
                                            <span className="ml-3 text-primary-600">Chargement des créneaux...</span>
                                        </div>
                                    ) : availableSlots.length === 0 ? (
                                        <div className="text-center py-8 bg-yellow-50 rounded-lg border border-yellow-200">
                                            <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                                            <p className="text-yellow-800 font-medium">Aucun créneau disponible</p>
                                            <p className="text-yellow-600 text-sm mt-1">Veuillez choisir une autre date</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                                            {availableSlots.map((time) => (
                                                <button
                                                    key={time}
                                                    onClick={() => {
                                                        setSelectedTime(time);
                                                        setStep(3);
                                                    }}
                                                    className={`p-3 rounded-lg border-2 transition-colors ${selectedTime === time
                                                            ? "border-primary-900 bg-primary-900 text-white"
                                                            : "border-green-200 bg-green-50 hover:border-green-400 hover:bg-green-100 text-green-800"
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Client Information */}
                    {step === 3 && (
                        <div>
                            <button
                                onClick={() => setStep(2)}
                                className="text-primary-600 mb-4 hover:text-primary-900 flex items-center gap-2"
                            >
                                ← Retour
                            </button>
                            <h2 className="font-serif text-2xl font-bold mb-6">Vos informations</h2>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block font-medium mb-2">
                                        <User className="w-4 h-4 inline mr-2" />
                                        Nom complet *
                                    </label>
                                    <input
                                        type="text"
                                        value={clientName}
                                        onChange={(e) => {
                                            setClientName(e.target.value);
                                            if (errors.clientName) {
                                                setErrors({ ...errors, clientName: "" });
                                            }
                                        }}
                                        className={`input ${errors.clientName ? 'border-red-500' : ''}`}
                                        placeholder="Jean Dupont"
                                    />
                                    {errors.clientName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block font-medium mb-2">
                                        <Phone className="w-4 h-4 inline mr-2" />
                                        Téléphone *
                                    </label>
                                    <input
                                        type="tel"
                                        value={clientPhone}
                                        onChange={(e) => {
                                            setClientPhone(e.target.value);
                                            if (errors.clientPhone) {
                                                setErrors({ ...errors, clientPhone: "" });
                                            }
                                        }}
                                        className={`input ${errors.clientPhone ? 'border-red-500' : ''}`}
                                        placeholder="06 12 34 56 78"
                                    />
                                    {errors.clientPhone && (
                                        <p className="text-red-500 text-sm mt-1">{errors.clientPhone}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block font-medium mb-2">
                                        <Mail className="w-4 h-4 inline mr-2" />
                                        Email (optionnel)
                                    </label>
                                    <input
                                        type="email"
                                        value={clientEmail}
                                        onChange={(e) => {
                                            setClientEmail(e.target.value);
                                            if (errors.clientEmail) {
                                                setErrors({ ...errors, clientEmail: "" });
                                            }
                                        }}
                                        className={`input ${errors.clientEmail ? 'border-red-500' : ''}`}
                                        placeholder="jean.dupont@email.com"
                                    />
                                    {errors.clientEmail && (
                                        <p className="text-red-500 text-sm mt-1">{errors.clientEmail}</p>
                                    )}
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="bg-primary-50 p-4 rounded-lg mb-6">
                                <h3 className="font-bold mb-2">Récapitulatif</h3>
                                <div className="space-y-1 text-sm">
                                    <p><strong>Service:</strong> {selectedService?.name}</p>
                                    <p><strong>Date:</strong> {selectedDate && formatDateDisplay(selectedDate)}</p>
                                    <p><strong>Heure:</strong> {selectedTime}</p>
                                    <p><strong>Durée:</strong> {selectedService?.duration} min</p>
                                    <p><strong>Prix:</strong> {selectedService?.price}€</p>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="btn-accent w-full flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                                {loading ? "Réservation en cours..." : "Confirmer la réservation"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
