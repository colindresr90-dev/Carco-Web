'use client';

import { useState, useEffect } from 'react';
import { Loader2, X, UploadCloud } from 'lucide-react';
import { VehicleRecord } from './VehiclesTable';
import { saveVehicle } from './actions';

const FEATURES_LIST = [
    "Interior Premium",
    "Transmisión Automática",
    "Aire Acondicionado",
    "Bluetooth y Navegación",
    "Opciones de Seguro Completo",
    "Asistencia en Carretera 24/7"
];

export default function VehicleModal({
    isOpen,
    onClose,
    vehicle,
    onSuccess,
}: {
    isOpen: boolean;
    onClose: () => void;
    vehicle: VehicleRecord | null;
    onSuccess: (data: any) => void;
}) {
    const isEditing = !!vehicle;
    const [isSaving, setIsSaving] = useState(false);

    const [features, setFeatures] = useState<string[]>([]);
    const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
    const [heroImagePreview, setHeroImagePreview] = useState<string>('');

    // Pre-fill form on edit
    useEffect(() => {
        if (isOpen) {
            if (vehicle) {
                setFeatures(vehicle.features || []);
                setHeroImagePreview(vehicle.hero_image || '');
            } else {
                setFeatures([]);
                setHeroImagePreview('');
            }
            setHeroImageFile(null);
        }
    }, [isOpen, vehicle]);

    if (!isOpen) return null;

    const toggleFeature = (feature: string) => {
        if (features.includes(feature)) {
            setFeatures(features.filter(f => f !== feature));
        } else {
            setFeatures([...features, feature]);
        }
    };

    const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setHeroImageFile(file);
            const objectUrl = URL.createObjectURL(file);
            setHeroImagePreview(objectUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);

        const formData = new FormData(e.currentTarget);

        // Append extra logic fields
        formData.append('features', JSON.stringify(features));

        if (isEditing) {
            formData.append('id', vehicle.id);
            formData.append('existing_hero_image', vehicle.hero_image || '');
            formData.append('existing_gallery', JSON.stringify(vehicle.gallery || []));
        }

        if (heroImageFile) {
            formData.append('hero_image', heroImageFile);
        }

        try {
            await saveVehicle(formData, isEditing);
            onSuccess(null);
            onClose();
        } catch (error: any) {
            console.error('Save failed:', error);
            alert(`Failed to save: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
            <div className="bg-[#141414] border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-full">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
                    <div>
                        <h2 className="text-xl font-serif italic text-[#ece8e1]">
                            {isEditing ? 'Edit Vehicle' : 'Create New Vehicle'}
                        </h2>
                        <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mt-1">
                            {isEditing ? `ID: ${vehicle.id}` : 'Fill in the details below'}
                        </p>
                    </div>
                    <button onClick={onClose} type="button" className="p-2 text-[#6b6b6b] hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form id="vehicle-form" onSubmit={handleSubmit} className="overflow-y-auto p-6 flex-1 text-sm section-scrollable">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* LEFT COLUMN */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#A68966] border-b border-[#A68966]/20 pb-2">Basic Info</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <LabelInput label="Brand *" name="brand" defaultValue={vehicle?.brand} required />
                                <LabelInput label="Model *" name="model" defaultValue={vehicle?.model} required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <LabelInput label="Slug (unique ID) *" name="slug" defaultValue={vehicle?.slug} readOnly={isEditing} validateSlug required />
                                <LabelInput label="Year *" name="year" type="number" defaultValue={vehicle?.year?.toString()} required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <LabelSelect label="Category *" name="category" defaultValue={vehicle?.category}>
                                    <option value="sedan">Sedan</option>
                                    <option value="suv">SUV</option>
                                </LabelSelect>
                                <LabelSelect label="Transmission *" name="transmission" defaultValue={vehicle?.transmission}>
                                    <option value="automatico">Automático</option>
                                    <option value="manual">Manual</option>
                                </LabelSelect>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <LabelSelect label="Fuel Type *" name="fuel" defaultValue={vehicle?.fuel}>
                                    <option value="gasolina">Gasolina</option>
                                    <option value="diesel">Diesel</option>
                                    <option value="hibrido">Híbrido</option>
                                </LabelSelect>
                                <LabelInput label="Seats *" name="seats" type="number" defaultValue={vehicle?.seats?.toString()} required />
                            </div>

                            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#A68966] border-b border-[#A68966]/20 pb-2 pt-4">Pricing</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <LabelInput label="Price / Day ($) *" name="price_per_day" type="number" defaultValue={vehicle?.price_per_day?.toString()} required />
                                <LabelInput label="Security Deposit ($) *" name="security_deposit" type="number" defaultValue={vehicle?.security_deposit?.toString()} required />
                            </div>

                            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#A68966] border-b border-[#A68966]/20 pb-2 pt-4">Status & Visibility</h3>

                            <div className="flex gap-6 mt-2">
                                <LabelCheckbox label="Active" name="is_active" defaultChecked={isEditing ? vehicle.is_active : true} />
                                <LabelCheckbox label="Available" name="available" defaultChecked={isEditing ? vehicle.available : true} />
                                <LabelCheckbox label="Featured" name="featured" defaultChecked={isEditing ? vehicle.featured : false} />
                            </div>

                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#A68966] border-b border-[#A68966]/20 pb-2">Performance Specs</h3>

                            <LabelInput label="Engine *" name="engine" defaultValue={vehicle?.engine} required />

                            <div className="grid grid-cols-3 gap-4">
                                <LabelInput label="Horsepower" name="horsepower" type="number" defaultValue={vehicle?.horsepower?.toString()} />
                                <LabelInput label="Torque (Nm)" name="torque_nm" type="number" defaultValue={vehicle?.torque_nm?.toString()} />
                                <LabelSelect label="Drivetrain" name="drivetrain" defaultValue={vehicle?.drivetrain}>
                                    <option value="fwd">FWD</option>
                                    <option value="rwd">RWD</option>
                                    <option value="awd">AWD</option>
                                    <option value="4wd">4WD</option>
                                </LabelSelect>
                            </div>

                            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#A68966] border-b border-[#A68966]/20 pb-2 pt-4">Features</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/[0.02] p-4 rounded-xl border border-white/[0.05]">
                                {FEATURES_LIST.map(feature => (
                                    <label key={feature} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleFeature(feature); }}>
                                        <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${features.includes(feature) ? 'bg-[#A68966] border-[#A68966]' : 'border-white/20 group-hover:border-[#A68966]/50 bg-[#1c1c1c]'}`}>
                                            {features.includes(feature) && (
                                                <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className={`text-xs transition-colors ${features.includes(feature) ? 'text-[#ece8e1]' : 'text-[#888]'}`}>{feature}</span>
                                    </label>
                                ))}
                            </div>

                            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#A68966] border-b border-[#A68966]/20 pb-2 pt-4">Images</h3>

                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-2">Hero Image</p>
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-[#A68966]/50 hover:bg-[#A68966]/5 transition-all relative overflow-hidden group">
                                    <input type="file" accept="image/*" className="hidden" onChange={handleHeroImageChange} />
                                    {heroImagePreview ? (
                                        <>
                                            <img src={heroImagePreview} alt="Preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-30 transition-opacity" />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-xs font-semibold text-white tracking-widest uppercase bg-black/50 px-3 py-1.5 rounded-md backdrop-blur-md">Change Image</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-[#6b6b6b] group-hover:text-[#A68966] transition-colors">
                                            <UploadCloud className="w-8 h-8 mb-2" />
                                            <span className="text-xs font-medium">Click to upload image</span>
                                        </div>
                                    )}
                                </label>
                            </div>

                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/10 shrink-0 bg-[#0e0e0e]/50 flex justify-end gap-3 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="px-5 py-2.5 rounded-lg border border-white/10 text-xs font-medium uppercase tracking-wider text-[#d8cfc4] hover:bg-white/5 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="vehicle-form"
                        disabled={isSaving}
                        className="px-6 py-2.5 rounded-lg bg-[#A68966] text-[#0e0e0e] hover:bg-[#d4af6e] transition-colors text-xs font-bold uppercase tracking-widest disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSaving && <Loader2 className="w-4 h-4 animate-spin text-black" />}
                        {isSaving ? 'Saving...' : 'Save Vehicle'}
                    </button>
                </div>

            </div>

            <style>{`
            .section-scrollable::-webkit-scrollbar {
                width: 6px;
            }
            .section-scrollable::-webkit-scrollbar-track {
                background: transparent;
            }
            .section-scrollable::-webkit-scrollbar-thumb {
                background-color: rgba(255, 255, 255, 0.1);
                border-radius: 20px;
            }
            `}</style>
        </div>
    );
}

// Helpers
function LabelInput({ label, name, type = 'text', defaultValue, required = false, readOnly = false, validateSlug = false }: any) {
    return (
        <label className="block">
            <span className="block text-[10px] uppercase tracking-widest text-[#888] mb-1.5">{label}</span>
            <input
                type={type}
                name={name}
                defaultValue={defaultValue}
                required={required}
                readOnly={readOnly}
                step={type === 'number' ? 'any' : undefined}
                className={`w-full px-3 py-2 bg-[#1c1c1c] border border-white/10 rounded-lg text-xs text-[#ece8e1] focus:outline-none focus:border-[#A68966]/50 focus:ring-1 focus:ring-[#A68966]/20 transition-all ${readOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                onInput={validateSlug ? (e) => (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.toLowerCase().replace(/[^a-z0-9-]/g, '-') : undefined}
            />
        </label>
    );
}

function LabelSelect({ label, name, defaultValue, children }: any) {
    return (
        <label className="block">
            <span className="block text-[10px] uppercase tracking-widest text-[#888] mb-1.5">{label}</span>
            <select
                name={name}
                defaultValue={defaultValue}
                className="w-full px-3 py-2 bg-[#1c1c1c] border border-white/10 rounded-lg text-xs text-[#ece8e1] focus:outline-none focus:border-[#A68966]/50 focus:ring-1 focus:ring-[#A68966]/20 transition-all appearance-none cursor-pointer"
            >
                {children}
            </select>
        </label>
    );
}

function LabelCheckbox({ label, name, defaultChecked }: any) {
    return (
        <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" name={name} value="true" defaultChecked={defaultChecked} className="w-4 h-4 rounded border-white/20 bg-[#1c1c1c] text-[#A68966] focus:ring-[#A68966]/20 focus:ring-offset-0 cursor-pointer accent-[#A68966]" />
            <span className="text-xs text-[#ece8e1] group-hover:text-white transition-colors">{label}</span>
        </label>
    );
}
