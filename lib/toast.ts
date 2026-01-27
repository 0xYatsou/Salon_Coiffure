/**
 * Toast notification system
 */
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
    title?: string;
    description: string;
    type: ToastType;
    duration?: number;
}

export function showToast({ title, description, type, duration = 5000 }: ToastOptions) {
    // Créer le container si n'existe pas
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2';
        document.body.appendChild(container);
    }

    // Créer le toast
    const toast = document.createElement('div');
    toast.className = `
        max-w-md w-full bg-white rounded-lg shadow-lg border-l-4 p-4
        transform transition-all duration-300 ease-in-out
        ${type === 'success' ? 'border-green-500' : ''}
        ${type === 'error' ? 'border-red-500' : ''}
        ${type === 'warning' ? 'border-yellow-500' : ''}
        ${type === 'info' ? 'border-blue-500' : ''}
    `;

    const icon = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    }[type];

    const iconColor = {
        success: 'text-green-500',
        error: 'text-red-500',
        warning: 'text-yellow-500',
        info: 'text-blue-500'
    }[type];

    toast.innerHTML = `
        <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${iconColor} font-bold text-lg">
                ${icon}
            </div>
            <div class="flex-1">
                ${title ? `<div class="font-semibold text-gray-900 mb-1">${title}</div>` : ''}
                <div class="text-sm text-gray-600">${description}</div>
            </div>
            <button class="flex-shrink-0 text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;

    container.appendChild(toast);

    // Animation d'entrée
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 10);

    // Auto-suppression
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}
