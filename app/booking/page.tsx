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
        <div className="min-h-screen bg-primary-50 dark:bg-primary-950 py-12">
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
                                <h3 className="font-bold mb-4 font-serif text-xl">Sélectionnez une date</h3>

                                {/* Day headers */}
                                <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
                                    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                                        <div key={day} className="text-center text-xs font-medium text-primary-500 uppercase tracking-wider">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar days */}
                                <div className="grid grid-cols-7 gap-1 md:gap-2">
                                    {calendarDays.map((day, index) => {
                                        const isSelected = selectedDate?.toDateString() === day.date.toDateString();
                                        const isDisabled = day.isPast || day.isSunday || !day.isCurrentMonth;

                                        // Highlight today
                                        const isToday = new Date().toDateString() === day.date.toDateString();

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    handleDateSelect(day);
                                                    // Petit délai pour laisser le temps au state de se mettre à jour
                                                    setTimeout(() => {
                                                        document.getElementById('time-slots')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                    }, 100);
                                                }}
                                                disabled={isDisabled}
                                                className={`
                                                    relative aspect-square flex flex-col items-center justify-center p-1 rounded-xl border transition-all text-sm
                                                    ${!day.isCurrentMonth ? 'opacity-0 pointer-events-none' : ''}
                                                    
                                                    /* Disabled state */
                                                    ${isDisabled && day.isCurrentMonth
                                                        ? 'bg-gray-50 dark:bg-primary-900/50 border-gray-100 dark:border-primary-800 text-gray-300 dark:text-primary-700 cursor-not-allowed'
                                                        : ''}
                                                    
                                                    /* Default available state */
                                                    ${!isDisabled && !isSelected
                                                        ? 'bg-white dark:bg-primary-800 border-primary-100 dark:border-primary-700 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-700 text-primary-700 dark:text-primary-200 shadow-sm'
                                                        : ''}
                                                    
                                                    /* Selected state */
                                                    ${isSelected
                                                        ? 'bg-primary-900 dark:bg-accent border-primary-900 dark:border-accent text-white dark:text-primary-950 shadow-md transform scale-105 z-10'
                                                        : ''}
                                                    
                                                    /* Today highlight */
                                                    ${isToday && !isSelected ? 'ring-2 ring-accent ring-offset-2 dark:ring-offset-primary-900' : ''}
                                                `}
                                            >
                                                <span className={`text-[10px] uppercase font-bold ${isSelected ? 'text-primary-200 dark:text-primary-800' : 'text-primary-400 dark:text-primary-500'}`}>
                                                    {formatDayShort(day.date).replace('.', '')}
                                                </span>
                                                <span className={`text-lg font-bold leading-none mt-1 ${isSelected ? 'text-white dark:text-primary-950' : 'text-primary-900 dark:text-white'}`}>
                                                    {formatDayNumber(day.date)}
                                                </span>
                                                {/* Dots for availability */}
                                                {!isDisabled && !isSelected && (
                                                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                                                        <div className="w-1 h-1 rounded-full bg-green-400 dark:bg-green-500"></div>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Time Selection */}
                            {selectedDate && (
                                <div id="time-slots" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="font-bold mb-4 font-serif text-xl border-t pt-6 mt-6">
                                        Horaires disponibles
                                    </h3>

                                    {loadingSlots ? (
                                        <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-primary-800 rounded-xl border border-primary-100 dark:border-primary-700">
                                            <Loader2 className="w-8 h-8 animate-spin text-accent mb-2" />
                                            <span className="text-primary-500 dark:text-primary-400 text-sm">Recherche des disponibilités...</span>
                                        </div>
                                    ) : availableSlots.length === 0 ? (
                                        <div className="text-center py-8 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800/50 p-6">
                                            <AlertCircle className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                                            <p className="text-orange-800 dark:text-orange-200 font-bold mb-1">Complet</p>
                                            <p className="text-orange-600 dark:text-orange-300 text-sm">Veuillez choisir une autre date.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                            {availableSlots.map((timeStr) => {
                                                // Extract just the time HH:mm from the full ISO string if needed
                                                // L'API renvoie parfois une date complète ou juste l'heure, assurons-nous d'avoir HH:mm
                                                const timeDisplay = timeStr.includes('T') ? timeStr.split('T')[1].substring(0, 5) : timeStr;

                                                return (
                                                    <button
                                                        key={timeStr}
                                                        onClick={() => {
                                                            setSelectedTime(timeDisplay); // On garde le format simple pour l'affichage et l'état
                                                            setStep(3);
                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                        }}
                                                        className={`
                                                        py-3 px-2 rounded-lg border text-sm font-semibold transition-all relative overflow-hidden group
                                                        ${selectedTime === timeDisplay
                                                                ? "border-primary-900 bg-primary-900 dark:bg-accent dark:border-accent text-white dark:text-primary-950 shadow-lg scale-105"
                                                                : "bg-white dark:bg-primary-800 border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-200 hover:border-primary-900 dark:hover:border-accent hover:text-primary-900 dark:hover:text-accent hover:shadow-md"
                                                            }
                                                    `}
                                                    >
                                                        {timeDisplay}
                                                    </button>
                                                )
                                            })}
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
