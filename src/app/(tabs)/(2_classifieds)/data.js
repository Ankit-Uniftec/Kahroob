let data = {
    vehicles: [
        {
            id: 1,
            manufacturer: 'Audi',
            models: [
                {
                    name: 'e-tron',
                    type: 'SUV',
                    charge_port: 'CCS'
                },
                {
                    name: 'e-tron GT',
                    type: 'Sedan',
                    charge_port: 'CCS'
                },
                {
                    name: 'RS e-tron GT',
                    type: 'Coupe',
                    charge_port: 'CCS'
                },
                {
                    name: 'Q8 Sportback e-tron',
                    type: 'SUV',
                    charge_port: 'CCS'
                },
            ]
        },
        {
            id: 2,
            manufacturer: 'BMW',
            models: [
                {
                    name: 'i3',
                    type: 'Hatchback',
                    charge_port: 'CCS2'
                },
                {
                    name: 'i4',
                    type: 'Sedan',
                    charge_port: 'CCS'
                },
                {
                    name: 'iX3',
                    type: 'SUV',
                    charge_port: 'CCS'
                },
                {
                    name: 'iX5',
                    type: 'SUV',
                    charge_port: 'CCS'
                },
                {
                    name: 'iX6',
                    type: 'SUV',
                    charge_port: 'CCS'
                },
                {
                    name: 'xDrive 7 Series',
                    type: 'SUV',
                    charge_port: 'CCS'
                },
            ]
        },
        {
            id: 3,
            manufacturer: 'Buick',
            models: [
                {
                    name: 'Velite',
                    type: 'SUV',
                    charge_port: 'CCS2'
                }
            ]
        },
        {
            id: 4,
            manufacturer: 'BYD',
            models: [
                {
                    name: 'Tang EV',
                    type: 'SUV',
                    charge_port: 'CSS2'
                },
                {
                    name: 'Qin',
                    type: 'Sedan',
                    charge_port: 'CSS2'
                },
                {
                    name: 'Song',
                    type: 'Hatchback',
                    charge_port: 'CSS2'
                },
                {
                    name: 'Han',
                    type: 'Sedan',
                    charge_port: 'CSS2'
                },
            ]
        },
        {
            id: 5,
            manufacturer: 'Changan',
            models: [
                {
                    name: 'Eado',
                    type: 'Sedan',
                    charge_port: 'CCS'
                }
            ]
        },
        {
            id: 6,
            manufacturer: 'Chevrolet',
            models: [
                {
                    name: 'Bolt EV',
                    type: 'Hatchback',
                    charge_port: 'CCS'
                },
                {
                    name: 'Bolt EUV',
                    type: 'Hatchback',
                    charge_port: 'CCS'
                },
                {
                    name: 'Equinox EV',
                    type: 'SUV',
                    charge_port: 'CCS'
                },
                {
                    name: 'Blazer EV',
                    type: 'SUV',
                    charge_port: 'CCS'
                },
                {
                    name: 'Silverado EV',
                    type: 'Pickup',
                    charge_port: 'CCS'
                },
                {
                    name: 'Menlo',
                    type: 'SUV',
                    charge_port: 'CCS'
                },
            ]
        },
        {
            id: 7,
            manufacturer: 'Ford',
            models: [
                {
                    name: 'Mustang Mach-E',
                    type: 'SUV',
                    charge_port: 'CCS'
                },
                {
                    name: 'F-150 Lightning',
                    type: 'Pickup Truck',
                    charge_port: 'CCS'
                }
            ]
        },
        {
            id: 8,
            manufacturer: 'GMC',
            models: [
                {
                    name: 'Yukon EV',
                    type: 'SUV',
                    charge_port: 'CCS'
                },
                {
                    name: 'Sierra EV',
                    type: 'Pickup',
                    charge_port: 'CCS'
                }
            ]
        },
        {
            id: 9,
            manufacturer: 'Greatwall',
            models: [
                {
                    name: 'Poer',
                    type: 'Sedan',
                    charge_port: 'CCS2'
                }
            ]
        },
        {
            id: 10,
            manufacturer: 'Hingqi',
            models: [
                {
                    name: 'E-HS9',
                    type: 'SUV',
                    charge_port: 'CCS'
                }
            ]
        },
        {
            id: 11,
            manufacturer: 'HiPhi',
            models: [
                {
                    name: 'X',
                    type: 'Crossover',
                    charge_port: 'CCS2'
                },
                {
                    name: 'Z',
                    type: 'Crossover',
                    charge_port: 'CCS2'
                }
            ]
        },
        {
            id: 12,
            manufacturer: 'Honda',
            models: [
                {
                    name: 'ENS1',
                    type: 'SUV',
                    charge_port: 'CCS'
                }
            ]
        },
        {
            id: 13,
            manufacturer: 'Hummer',
            models: [
                {
                    name: 'Hummer EV',
                    type: 'Pickup Truck',
                    charge_port: 'CCS'
                }
            ]
        },
        {
            id: 14,
            manufacturer: 'Hyundai',
            models: [
                {
                    name: 'Kona Electric',
                    type: 'SUV',
                    charge_port: 'CCS'
                },
                {
                    name: 'Kona Electric',
                    type: 'Hatchback',
                    charge_port: 'CCS'
                }
            ]
        },
        {
            id: 15,
            manufacturer: 'Jaguar',
            models: [
                {
                    name: 'I-PACE R-DYNAMIC HSE',
                    type: 'Sedan',
                    charge_port: 'CCS'
                },
                {
                    name: 'I-PACE R-DYNAMIC SE',
                    type: 'Sedan',
                    charge_port: 'CCS'
                },
                {
                    name: 'I-PACE R-DYNAMIC S',
                    type: 'Sedan',
                    charge_port: 'CCS'
                },
            ]
        },
        {
            id: 16,
            manufacturer: 'Kia',
            models: [
                {
                    name: 'Soul EV',
                    type: 'SUV',
                    charge_port: 'CCS'
                },
                {
                    name: 'Niro EV',
                    type: 'SUV',
                    charge_port: 'CCS'
                },
                {
                    name: 'EV6',
                    type: 'Crossover',
                    charge_port: ''
                }
            ]
        },
        {
            id: 17,
            manufacturer: 'Lotus',
            models: [
                {
                    name: 'Eletre R+',
                    type: 'Crossover',
                    charge_port: 'CCS2'
                }
            ]
        },
        {
            id: 18,
            manufacturer: 'Lucid Motors',
            models: [
                {
                    name: 'Lucid Gravity',
                    type: 'SUV',
                    charge_port: 'CCS2'
                },
                {
                    name: 'Lucid Air Pure',
                    type: 'Sedan',
                    charge_port: 'CCS2'
                },
                {
                    name: 'Lucid Air Touring',
                    type: 'Sedan',
                    charge_port: 'CCS2'
                },
                {
                    name: 'Lucid Air Grand Touring',
                    type: 'Sedan',
                    charge_port: 'CCS2'
                },
                {
                    name: 'Lucid Air Sapphire',
                    type: 'Sedan',
                    charge_port: 'CCS2'
                }
            ]
        },
        {
            id: 19,
            manufacturer: 'Mercedes-Benz',
            models: [
                {
                    name: 'EQC',
                    type: 'SUV',
                    charge_port: 'CCS'
                },
                {
                    name: 'EQS',
                    type: 'Sedan',
                    charge_port: 'CCS'
                },
                {
                    name: 'EQA',
                    type: 'SUV',
                    charge_port: 'CCS'
                },
                {
                    name: 'B-Class Electric',
                    type: 'Hatchback',
                    charge_port: 'Other'
                }
            ]
        },
        {
            id: 20,
            manufacturer: 'Morris Garages',
            models: [
                {
                    name: 'MG5',
                    type: 'Hatchback',
                    charge_port: 'CCS'
                },
                {
                    name: 'MG HS',
                    type: 'Hatchback',
                    charge_port: ''
                },
                {
                    name: 'MG HS PHEV',
                    type: 'Hatchback',
                    charge_port: ''
                },
                {
                    name: 'Cyberster',
                    type: 'Coupe',
                    charge_port: ''
                }
            ]
        },
        {
            id: 21,
            manufacturer: 'NIO',
            models: [
                {
                    name: 'ES6',
                    type: 'SUV',
                    charge_port: 'Other'
                },
                {
                    name: 'ES8',
                    type: 'SUV',
                    charge_port: 'Other'
                }
            ]
        },
        {
            id: 22,
            manufacturer: 'Nissan',
            models: [
                {
                    name: 'Leaf',
                    type: 'Hatchback',
                    charge_port: 'Other'
                }
            ]
        },
        {
            id: 23,
            manufacturer: 'Polestar',
            models: [
                {
                    name: 'Polestar 1',
                    type: 'Sedan',
                    charge_port: 'CCS2'
                },
                {
                    name: 'Polestar 2',
                    type: 'Sedan',
                    charge_port: 'CCS2'
                }
            ]
        },
        {
            id: 24,
            manufacturer: 'Porsche',
            models: [
                {
                    name: 'Taycan',
                    type: 'Sedan',
                    charge_port: 'CCS'
                },
                {
                    name: 'Taycan',
                    type: 'Sedan',
                    charge_port: 'CCS'
                },
            ]
        },
        {
            id: 25,
            manufacturer: 'Renault',
            models: [
                {
                    name: 'Zoe',
                    type: 'Hatchback',
                    charge_port: 'CCS2'
                },
                {
                    name: 'Twingo Z.E.',
                    type: 'Hatchback',
                    charge_port: 'CCS2'
                },
                {
                    name: 'Kangoo Z.E.',
                    type: 'Van',
                    charge_port: 'CCS2'
                },
                {
                    name: 'Master Z.E.',
                    type: 'Van',
                    charge_port: 'CCS2'
                }
            ]
        },
        {
            id: 26,
            manufacturer: 'Rivian',
            models: [
                {
                    name: 'R1T (pickup truck)',
                    type: 'Pickup Truck',
                    charge_port: 'CCS'
                },
                {
                    name: 'R1S (SUV)',
                    type: 'SUV',
                    charge_port: 'CCS'
                },
                {
                    name: 'R1T (pickup truck)',
                    type: 'Pickup Truck',
                    charge_port: 'CCS'
                },
                {
                    name: 'R1S (SUV)',
                    type: 'SUV',
                    charge_port: 'CCS'
                },
            ]
        },
        {
            id: 27,
            manufacturer: 'Smart',
            models: [
                {
                    name: '#1',
                    type: 'Hatchback',
                    charge_port: 'CCS2'
                }
            ]
        },
        {
            id: 28,
            manufacturer: 'Tesla',
            models: [
                {
                    name: 'Model 3',
                    type: 'Sedan',
                    charge_port: 'CCS, CCS2'
                },
                {
                    name: 'Model Y',
                    type: 'Crossover',
                    charge_port: 'CCS, CCS2'
                },
                {
                    name: 'Model S',
                    type: 'Sedan',
                    charge_port: 'CCS, CCS2'
                },
                {
                    name: 'Model X',
                    type: 'Crossover',
                    charge_port: 'CCS, CCS2'
                }
            ]
        },
        {
            id: 29,
            manufacturer: 'Toyota',
            models: [
                {
                    name: 'Prius Prime',
                    type: 'Hatchback',
                    charge_port: 'CCS2'
                },
                {
                    name: 'C-HR',
                    type: 'Hatchback',
                    charge_port: 'CCS2'
                },
                {
                    name: 'BZ4X',
                    type: 'Hatchback',
                    charge_port: 'CCS2'
                }
            ]
        },
        {
            id: 30,
            manufacturer: 'Volkswagen',
            models: [
                {
                    name: 'ID.3',
                    type: 'Hatchback',
                    charge_port: 'Type 2 (CCS)'
                },
                {
                    name: 'ID.4',
                    type: 'SUV',
                    charge_port: 'Type 2 (CCS)'
                },
                {
                    name: 'ID. Buzz',
                    type: 'Van',
                    charge_port: 'Other'
                },
                {
                    name: 'ID. Vizzion',
                    type: 'Sedan',
                    charge_port: 'To b'
                }
            ]
        },
        {
            id: 31,
            manufacturer: 'XPeng',
            models: [
                {
                    name: 'G3',
                    type: 'SUV',
                    charge_port: 'CCS2'
                }
            ]
        },
    ],
    bikes: [
        {
            id: 1,
            manufacturer: 'Specialized',
            models: [
                {
                    name: 'Turbo Vado',
                    type: 'Electric Bike (City/Commuter)',
                    charge_port: ''
                },
            ]
        },
        {
            id: 2,
            manufacturer: 'Trek',
            models: [
                {
                    name: 'Powerfly',
                    type: 'Electric Mountain Bike',
                    charge_port: ''
                },
            ]
        },
        {
            id: 3,
            manufacturer: 'Rad Power Bikes',
            models: [
                {
                    name: 'RadRover',
                    type: 'Electric Fat Tire Bike',
                    charge_port: ''
                },
            ]
        },
        {
            id: 4,
            manufacturer: 'Yamaha',
            models: [
                {
                    name: 'Grizzly Electric ATV',
                    type: 'Electric ATV',
                    charge_port: ''
                },
            ]
        },
        {
            id: 5,
            manufacturer: 'Polaris',
            models: [
                {
                    name: 'Sportsman Electric ATV',
                    type: 'Electric ATV',
                    charge_port: ''
                },
            ]
        },
        {
            id: 6,
            manufacturer: 'Giant',
            models: [
                {
                    name: 'Quick-E+',
                    type: 'City/Commuter',
                    charge_port: ''
                },
            ]
        },
        {
            id: 7,
            manufacturer: 'Haibike',
            models: [
                {
                    name: 'SDURO',
                    type: 'Various',
                    charge_port: ''
                },
            ]
        },
        {
            id: 8,
            manufacturer: 'Cannondale',
            models: [
                {
                    name: 'Quick Neo',
                    type: 'City/Commuter',
                    charge_port: ''
                },
            ]
        },
        {
            id: 9,
            manufacturer: 'Riese & Müller',
            models: [
                {
                    name: 'Nevo',
                    type: 'City/Commuter',
                    charge_port: ''
                },
            ]
        },
        {
            id: 10,
            manufacturer: 'Bulls Bikes',
            models: [
                {
                    name: 'Lacuba',
                    type: 'Trekking',
                    charge_port: ''
                },
            ]
        },
        {
            id: 11,
            manufacturer: 'Juiced Bikes',
            models: [
                {
                    name: 'CrossCurrent',
                    type: 'City/Commuter',
                    charge_port: ''
                },
            ]
        },
        {
            id: 12,
            manufacturer: 'e-Scooters',
            models: [
                {
                    name: 'Kick scooter',
                    type: 'Kick scooter',
                    charge_port: ''
                },
            ]
        },
    ],
    watercraft: [
        {
            id: 1,
            manufacturer: 'Duffy',
            models: [
                {
                    name: '22 Sun Cruiser',
                    type: 'Boat',
                    charge_port: ''
                },
            ]
        },
        {
            id: 2,
            manufacturer: 'Rand Boats',
            models: [
                {
                    name: 'Picnic',
                    type: 'Electric Boat',
                    charge_port: ''
                },
            ]
        },
        {
            id: 3,
            manufacturer: 'Quadrofoil',
            models: [
                {
                    name: 'Q2S',
                    type: 'Electric Boat',
                    charge_port: ''
                },
            ]
        },
        {
            id: 4,
            manufacturer: 'Taiga Motors',
            models: [
                {
                    name: 'Orca',
                    type: 'Jet Ski',
                    charge_port: ''
                },
            ]
        },
        {
            id: 5,
            manufacturer: 'Free Form Factory',
            models: [
                {
                    name: 'Gratis X1',
                    type: 'Jetboard',
                    charge_port: ''
                },
            ]
        },
        {
            id: 6,
            manufacturer: 'Candela',
            models: [
                {
                    name: 'C-7',
                    type: 'Foiler',
                    charge_port: ''
                },
            ]
        },
        {
            id: 7,
            manufacturer: 'X Shore',
            models: [
                {
                    name: 'Eelex 8000',
                    type: 'Boat',
                    charge_port: ''
                },
            ]
        },
        {
            id: 8,
            manufacturer: 'Silent Yachts',
            models: [
                {
                    name: 'Silent 60',
                    type: 'Catamaran',
                    charge_port: ''
                },
            ]
        },
        {
            id: 9,
            manufacturer: 'Soel Yachts',
            models: [
                {
                    name: 'SoelCat 12',
                    type: 'Catamaran',
                    charge_port: ''
                },
            ]
        },
        {
            id: 10,
            manufacturer: 'Torqeedo',
            models: [
                {
                    name: 'Deep Blue',
                    type: 'Outboard Motor',
                    charge_port: ''
                },
            ]
        },
    ],
    accessories: [
        {
            id: 1,
            manufacturer: 'Interior',
            models: [
                {
                    name: 'Floor mats',
                    type: '',
                    charge_port: ''
                },
                {
                    name: 'Organizers',
                    type: '',
                    charge_port: ''
                },
                {
                    name: 'Ambiance',
                    type: '',
                    charge_port: ''
                },
                {
                    name: 'Electrical',
                    type: '',
                    charge_port: ''
                },
                {
                    name: 'Infotainment',
                    type: '',
                    charge_port: ''
                },
                {
                    name: 'Dashes & Dash Cams',
                    type: '',
                    charge_port: ''
                },
                {
                    name: 'Decorations',
                    type: '',
                    charge_port: ''
                },
                {
                    name: 'Others',
                    type: '',
                    charge_port: ''
                },
            ]
        },
        {
            id: 2,
            manufacturer: 'Exterior',
            models: [
                {
                    name: 'Bodykit',
                    type: '',
                    charge_port: ''
                },
                {
                    name: 'Lights',
                    type: '',
                    charge_port: ''
                },
                {
                    name: 'Wheels',
                    type: '',
                    charge_port: ''
                },
                {
                    name: 'Others',
                    type: '',
                    charge_port: ''
                },
            ]
        },
        {
            id: 3,
            manufacturer: 'Essensials',
            models: [
                {
                    name: 'Safety Tools',
                    type: '',
                    charge_port: ''
                },
                {
                    name: 'Recovery Tools',
                    type: '',
                    charge_port: ''
                },
                {
                    name: 'Key cards & FOBs',
                    type: '',
                    charge_port: ''
                },
            ]
        },
        {
            id: 4,
            manufacturer: 'Chargers',
            models: [
                {
                    name: 'Wall Chargers',
                    type: '',
                    charge_port: ''
                },
                {
                    name: 'Travel Chargers',
                    type: '',
                    charge_port: ''
                },
                {
                    name: 'Portable Chargers',
                    type: '',
                    charge_port: ''
                },
            ]
        },
        {
            id: 5,
            manufacturer: 'Mechanical',
            models: [
                {
                    name: 'Performance',
                    type: '',
                    charge_port: ''
                },
                {
                    name: 'Battries',
                    type: '',
                    charge_port: ''
                },
                {
                    name: 'Suspensions',
                    type: '',
                    charge_port: ''
                },
                {
                    name: 'Engines & Components',
                    type: '',
                    charge_port: ''
                },
                {
                    name: 'Others',
                    type: '',
                    charge_port: ''
                },
            ]
        }
    ],
    services: [
        {
            id: 1,
            manufacturer: 'Bodywork Repair',
        },
        {
            id: 2,
            manufacturer: 'Mechanical Repair',
        },
        {
            id: 3,
            manufacturer: 'Painting & Polishing',
        },
        {
            id: 4,
            manufacturer: 'Acsessories',
        },
        {
            id: 5,
            manufacturer: 'Rcovery Services',
        },
        {
            id: 6,
            manufacturer: 'Wall Connector Installation',
        },
        {
            id: 7,
            manufacturer: 'Mobile Repair Services',
        },
        {
            id: 8,
            manufacturer: 'Mobile Recharge Services',
        }
    ]
}

// Recents
let recents = {
    vehicles: [
        {
            id: 1,
            manufacturer: 'Audi',
            model: 'e-tron',
            body: 'SUV',
            image: require('../../../../assets/car.png')
        },
        {
            id: 2,
            manufacturer: 'BMW',
            model: 'i4',
            body: 'Sedan',
            image: require('../../../../assets/car_2.png')
        },
        {
            id: 3,
            manufacturer: 'BYD',
            model: 'Qin',
            body: 'Sedan',
            image: require('../../../../assets/car.png')
        },
        {
            id: 4,
            manufacturer: 'Chevrolet',
            model: 'Bolt EUV',
            body: 'Hatchback',
            image: require('../../../../assets/car_2.png')
        },
        {
            id: 1,
            manufacturer: 'Mercedes-Benz',
            model: 'B-Class Electric',
            body: 'Sedan',
            image: require('../../../../assets/car.png')
        },
        {
            id: 1,
            manufacturer: 'Tesla',
            model: 'Model 3',
            body: 'Sedan',
            image: require('../../../../assets/car_2.png')
        },
    ],
    bikes: [
        {
            id: 1,
            manufacturer: 'Specialized',
            model: 'Turbo Vado',
            body: 'Electric Bike',
            image: require('../../../../assets/bike_1.jpeg')
        },
        {
            id: 2,
            manufacturer: 'Trek',
            model: 'Powerfly',
            body: 'Electric Mountain Bike',
            image: require('../../../../assets/bike_2.jpeg')
        },
        {
            id: 3,
            manufacturer: 'Giant',
            model: 'Quick-E+',
            body: 'City/Commuter',
            image: require('../../../../assets/bike_3.jpeg')
        },
        {
            id: 4,
            manufacturer: 'Bulls Bikes',
            model: 'Lacuba',
            body: 'Trekking',
            image: require('../../../../assets/bike_4.jpeg')
        },
    ],
    watercraft: [
        {
            id: 1,
            manufacturer: 'Duffy',
            model: '22 Sun Cruiser',
            body: 'Boat',
            image: require('../../../../assets/watercraft_1.jpeg')
        },
        {
            id: 2,
            manufacturer: 'Quadrofoil',
            model: 'Q2S',
            body: 'Electric Boat',
            image: require('../../../../assets/watercraft_2.jpeg')
        },
        {
            id: 3,
            manufacturer: 'Free Form Factory',
            model: 'Gratis X1',
            body: 'Jetboard',
            image: require('../../../../assets/watercraft_3.jpeg')
        },
    ],
    accessories: [
        {
            id: 1,
            manufacturer: 'Essensials',
            model: 'Safety Tools',
            body: '',
            image: require('../../../../assets/accessories_1.jpeg')
        },
        {
            id: 2,
            manufacturer: 'Exterior',
            model: 'Lights',
            body: '',
            image: require('../../../../assets/accessories_2.jpeg')
        },
    ]
}

export {
    data,
    recents
}