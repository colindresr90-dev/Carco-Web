const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const vehiclesData = [
    {
        slug: "kia-forte",
        brand: "Kia",
        model: "Forte",
        year: 2023,
        category: "sedan",
        transmission: "automatico",
        fuel: "gasolina",
        seats: 5,
        price_per_day: 60,
        security_deposit: 300,
        engine: "2.0L Inline-4",
        horsepower: 147,
        torque_nm: 179,
        drivetrain: "fwd",
        features: JSON.stringify([
            "Transmisión Automática",
            "Aire Acondicionado",
            "Bluetooth y Navegación"
        ]),
        hero_image: "/img/vehicles/kia-forte.jpg",
        gallery: JSON.stringify([
            "/img/vehicles/kia-forte.jpg"
        ]),
        featured: true,
        available: true,
        is_active: true
    },
    {
        slug: "hyundai-santa-fe",
        brand: "Hyundai",
        model: "Santa Fe",
        year: 2024,
        category: "suv",
        transmission: "automatico",
        fuel: "diesel",
        seats: 7,
        price_per_day: 120,
        security_deposit: 500,
        engine: "2.5L Turbocharged Engine",
        horsepower: 277,
        torque_nm: 421,
        drivetrain: "awd",
        features: JSON.stringify([
            "Interior Premium",
            "Transmisión Automática",
            "Bluetooth y Navegación"
        ]),
        hero_image: "/img/vehicles/hyundai-santa-fe.jpg",
        gallery: JSON.stringify([
            "/img/vehicles/hyundai-santa-fe.jpg"
        ]),
        featured: true,
        available: true,
        is_active: true
    },
    {
        slug: "nissan-sentra",
        brand: "Nissan",
        model: "Sentra",
        year: 2023,
        category: "sedan",
        transmission: "automatico",
        fuel: "gasolina",
        seats: 5,
        price_per_day: 55,
        security_deposit: 300,
        engine: "2.0L Inline-4",
        horsepower: 149,
        torque_nm: 198,
        drivetrain: "fwd",
        features: JSON.stringify([
            "Transmisión Automática",
            "Aire Acondicionado"
        ]),
        hero_image: "/img/vehicles/nissan-sentra.jpg",
        gallery: JSON.stringify([
            "/img/vehicles/nissan-sentra.jpg"
        ]),
        featured: true,
        available: true,
        is_active: true
    },
    {
        slug: "kia-rio",
        brand: "Kia",
        model: "Rio",
        year: 2023,
        category: "sedan",
        transmission: "automatico",
        fuel: "gasolina",
        seats: 5,
        price_per_day: 45,
        security_deposit: 250,
        engine: "1.6L Inline-4",
        horsepower: 120,
        torque_nm: 152,
        drivetrain: "fwd",
        features: JSON.stringify([
            "Aire Acondicionado",
            "Transmisión Automática"
        ]),
        hero_image: "/img/vehicles/kia-rio.jpg",
        gallery: JSON.stringify([
            "/img/vehicles/kia-rio.jpg"
        ]),
        featured: false,
        available: true,
        is_active: true
    },
    {
        slug: "hyundai-elantra",
        brand: "Hyundai",
        model: "Elantra",
        year: 2023,
        category: "sedan",
        transmission: "automatico",
        fuel: "hibrido",
        seats: 5,
        price_per_day: 65,
        security_deposit: 350,
        engine: "1.6L Hybrid",
        horsepower: 139,
        torque_nm: 264,
        drivetrain: "fwd",
        features: JSON.stringify([
            "Transmisión Automática",
            "Bluetooth y Navegación"
        ]),
        hero_image: "/img/vehicles/hyundai-elantra.jpg",
        gallery: JSON.stringify([
            "/img/vehicles/hyundai-elantra.jpg"
        ]),
        featured: false,
        available: true,
        is_active: true
    },
    {
        slug: "toyota-prado",
        brand: "Toyota",
        model: "Prado",
        year: 2023,
        category: "suv",
        transmission: "automatico",
        fuel: "diesel",
        seats: 7,
        price_per_day: 180,
        security_deposit: 800,
        engine: "2.8L Turbo Diesel",
        horsepower: 201,
        torque_nm: 500,
        drivetrain: "awd",
        features: JSON.stringify([
            "Interior Premium",
            "Transmisión Automática"
        ]),
        hero_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZG23LkUmcJiBdTvRb-6jrYxIf4-2yKmq8p5DyKcrLk3YILASpbB6XOJ5TJ4yV9YNDTaJdXsh_fDR-rmWjyYL7JbGjBbyqlqeZ9i66sQR0NDgokCxSKE0vz64fjRpg5FVgLdlz31s6ebSW6dNbsoxpyWcdnVTQVY8iecRoFqTago75d5tr64a5wY6cQoFiNa7hLRuWv8IIAQvW2NZqtBlSmuVTgfbf_ZKvg2eRgxyzYfkCWux8QOzo9q80zkzoagBdI5nu_H5-swk",
        gallery: JSON.stringify([
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBZG23LkUmcJiBdTvRb-6jrYxIf4-2yKmq8p5DyKcrLk3YILASpbB6XOJ5TJ4yV9YNDTaJdXsh_fDR-rmWjyYL7JbGjBbyqlqeZ9i66sQR0NDgokCxSKE0vz64fjRpg5FVgLdlz31s6ebSW6dNbsoxpyWcdnVTQVY8iecRoFqTago75d5tr64a5wY6cQoFiNa7hLRuWv8IIAQvW2NZqtBlSmuVTgfbf_ZKvg2eRgxyzYfkCWux8QOzo9q80zkzoagBdI5nu_H5-swk"
        ]),
        featured: false,
        available: true,
        is_active: true
    }
];

async function seed() {
    console.log('Seeding data...');
    const { data, error } = await supabase.from('vehicles').insert(vehiclesData);
    if (error) {
        console.error('Error inserting:', error);
    } else {
        console.log('Successfully seeded database!');
    }
}

seed();
