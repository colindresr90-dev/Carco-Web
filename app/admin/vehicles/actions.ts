'use server';

import { createClient } from '@supabase/supabase-js';
import { auth, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function isAdmin() {
    const { userId } = await auth();
    if (!userId) return false;
    const user = await currentUser();
    return (user?.publicMetadata as { role?: string })?.role === 'admin';
}

export async function toggleVehicleField(id: string, field: string, value: boolean) {
    if (!await isAdmin()) throw new Error('Unauthorized');

    const { error } = await supabaseAdmin
        .from('vehicles')
        .update({ [field]: value })
        .eq('id', id);

    if (error) {
        console.error(`[toggleVehicleField] Error updating ${field}:`, error.message);
        throw new Error(error.message);
    }

    revalidatePath('/', 'layout');
}

export async function deleteVehicle(id: string) {
    if (!await isAdmin()) throw new Error('Unauthorized');

    const { error } = await supabaseAdmin
        .from('vehicles')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('[deleteVehicle] Error deleting vehicle:', error.message);
        throw new Error(error.message);
    }

    revalidatePath('/', 'layout');
}

export async function saveVehicle(formData: FormData, isEditing: boolean) {
    if (!await isAdmin()) throw new Error('Unauthorized');

    const id = formData.get('id') as string;

    // Base data
    const data = {
        brand: formData.get('brand') as string,
        model: formData.get('model') as string,
        slug: formData.get('slug') as string,
        year: Number(formData.get('year')),
        category: formData.get('category') as string,
        transmission: formData.get('transmission') as string,
        fuel: formData.get('fuel') as string,
        seats: Number(formData.get('seats')),
        price_per_day: Number(formData.get('price_per_day')),
        security_deposit: Number(formData.get('security_deposit')),
        engine: formData.get('engine') as string,
        horsepower: Number(formData.get('horsepower')),
        torque_nm: Number(formData.get('torque_nm')),
        drivetrain: formData.get('drivetrain') as string,
        features: JSON.parse((formData.get('features') as string) || '[]'),
        is_active: formData.get('is_active') === 'true',
        available: formData.get('available') === 'true',
        featured: formData.get('featured') === 'true',
    } as any;

    const heroImageFile = formData.get('hero_image') as File | null;
    const galleryFiles = formData.getAll('gallery') as File[]; // Should be parsed beforehand or sent correctly

    let hero_image = formData.get('existing_hero_image') as string;
    if (heroImageFile && heroImageFile.size > 0 && heroImageFile.name !== 'undefined') {
        const fileExt = heroImageFile.name.split('.').pop();
        const fileName = `${data.slug}-hero-${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from('vehicle-images')
            .upload(fileName, heroImageFile, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error('[saveVehicle] Failed to upload hero image:', uploadError.message);
            throw new Error(`Hero image upload failed: ${uploadError.message}`);
        }
        const { data: publicUrl } = supabaseAdmin.storage.from('vehicle-images').getPublicUrl(fileName);
        hero_image = publicUrl.publicUrl;
    }
    data.hero_image = hero_image;

    let gallery: string[] = JSON.parse((formData.get('existing_gallery') as string) || '[]');

    // We expect gallery to be handled via directly uploading, but let's implement the server part
    const newGalleryUploads = [];
    for (let i = 0; i < galleryFiles.length; i++) {
        const file = galleryFiles[i];
        if (file && file.size > 0 && file.name !== 'undefined') {
            const fileExt = file.name.split('.').pop();
            const fileName = `${data.slug}-gallery-${i}-${Date.now()}.${fileExt}`;
            const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
                .from('vehicle-images')
                .upload(fileName, file);

            if (uploadError) {
                console.error('[saveVehicle] Failed to upload gallery image:', uploadError.message);
                continue; // skip on error for gallery entries or throw.
            }

            const { data: publicUrl } = supabaseAdmin.storage.from('vehicle-images').getPublicUrl(fileName);
            newGalleryUploads.push(publicUrl.publicUrl);
        }
    }

    if (newGalleryUploads.length > 0) {
        gallery = [...gallery, ...newGalleryUploads];
    }
    data.gallery = gallery;

    if (isEditing) {
        const { data: updatedData, error } = await supabaseAdmin.from('vehicles').update(data).eq('id', id).select().single();
        if (error) {
            console.error('[saveVehicle] Error updating:', error.message);
            throw new Error(error.message);
        }
        if (!updatedData) {
            throw new Error("Update silent failure: No data returned.");
        }
    } else {
        const { data: insertedData, error } = await supabaseAdmin.from('vehicles').insert([data]).select().single();
        if (error) {
            console.error('[saveVehicle] Error inserting:', error.message);
            throw new Error(error.message);
        }
        if (!insertedData) {
            throw new Error("Insert silent failure: No data returned.");
        }
    }

    revalidatePath('/', 'layout');
}
