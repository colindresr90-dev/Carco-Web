'use client';

import { useState } from 'react';
import { deleteVehicle } from './actions';
import { VehicleRecord } from './VehiclesTable';
import { Loader2 } from 'lucide-react';

export default function DeleteConfirmModal({
    vehicle,
    onClose,
    onSuccess,
}: {
    vehicle: VehicleRecord | null;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [isDeleting, setIsDeleting] = useState(false);

    if (!vehicle) return null;

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteVehicle(vehicle.id);
            onSuccess();
        } catch (error) {
            console.error('Failed to delete vehicle', error);
            alert('Failed to delete vehicle. Check console for details.');
        } finally {
            setIsDeleting(false);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                <h3 className="text-xl font-serif italic text-white mb-2">Delete Vehicle</h3>
                <p className="text-sm text-[#a0a0a0] mb-6">
                    Are you sure you want to delete <span className="text-[#ece8e1] font-semibold">{vehicle.brand} {vehicle.model}</span>? This action cannot be undone and will completely remove it from the database.
                </p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="px-4 py-2 rounded-lg border border-white/10 text-xs font-medium uppercase tracking-wider text-[#d8cfc4] hover:bg-white/5 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-medium uppercase tracking-wider text-red-400 hover:bg-red-500/20 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isDeleting && <Loader2 className="w-3 h-3 animate-spin" />}
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
