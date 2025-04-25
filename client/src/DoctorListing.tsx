// DoctorListing.tsx
import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
    Card,
    Box,
    Typography,
    CardActionArea,
    CardContent,
    Avatar,
    Button,
    Grid
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FilterPanel, { FilterState } from './FilterPanel'; 

interface Doctor {
    id: string;
    name: string;
    photo: string;
    doctor_introduction: string;
    specialities: { name: string }[];
    fees: string;
    experience: string;
    languages: string[];
    clinic: {
      name: string;
      address: {
        locality: string;
        city: string;
        address_line1: string;
      };
    };
    video_consult: boolean;
    in_clinic: boolean;
}

const DoctorListing: React.FC = () => {
    const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
    const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
    const [selectedCard, setSelectedCard] = useState("");
    const location = useLocation();

    useEffect(() => {
        const fetchDoctors = async () => {
          try {
            const response = await axios.get<Doctor[]>('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json');
            setAllDoctors(response.data);
            setFilteredDoctors(response.data);
          } catch (error) {
            console.error('Error fetching doctors:', error);
          }
        };
    
        fetchDoctors();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get('search');
        const doctorId = params.get('doctor');
        
        if (searchQuery) {
            const filtered = allDoctors.filter(doctor => 
                doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredDoctors(filtered);
        } else if (doctorId) {
            const filtered = allDoctors.filter(doctor => doctor.id === doctorId);
            setFilteredDoctors(filtered);
        } else {
            applyFilters(currentFilters);
        }
    }, [location.search, allDoctors]);

    const [currentFilters, setCurrentFilters] = useState<FilterState>({
        mode: '',
        specialties: [],
        sortBy: ''
    });

    const applyFilters = (filters: FilterState) => {

        setCurrentFilters(filters);

        const params = new URLSearchParams(location.search);
        const searchQuery = params.get('search');
        const doctorId = params.get('doctor');

        let result = [...allDoctors];
        
        if (searchQuery) {
            result = result.filter(doctor => 
                doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        } else if (doctorId) {
            result = result.filter(doctor => doctor.id === doctorId);
        }

        if (filters.mode.length > 0) {
            result = result.filter(doctor => {
                if (filters.mode.includes('video_consult') && doctor.video_consult) return true;
                if (filters.mode.includes('in_clinic') && doctor.in_clinic) return true;
                return false;
            });
        }

        if (filters.specialties.length > 0) {
            result = result.filter(doctor => {
                return doctor.specialities.some(specialty => 
                    filters.specialties.includes(specialty.name)
                );
            });
        }

        if (filters.sortBy === 'fees') {
            result.sort((a, b) => {
                const aFees = parseInt(a.fees.replace(/[^0-9]/g, ''));
                const bFees = parseInt(b.fees.replace(/[^0-9]/g, ''));
                return aFees - bFees;
            });
        } else if (filters.sortBy === 'experience') {
            result.sort((a, b) => {
                const aExp = parseInt(a.experience.replace(/[^0-9]/g, ''));
                const bExp = parseInt(b.experience.replace(/[^0-9]/g, ''));
                return bExp - aExp; 
            });
        }

        setFilteredDoctors(result);
    };

    const handleFilterChange = (filters: FilterState) => {
        applyFilters(filters);
    };

    const handleBookAppointment = async (doctorId: string) => {
        console.log("Booking appointment for:", doctorId);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
                <FilterPanel onFilterChange={handleFilterChange} />
            </Grid>
            <Grid item xs={12} md={9}>
                {filteredDoctors.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h5">No doctors found matching your criteria</Typography>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            width: '100%',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: 2,
                            padding: 2,
                        }}
                    >
                        {filteredDoctors.map((doc) => (
                            <Card key={doc.id} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <CardActionArea
                                    onClick={() => setSelectedCard(doc.id)}
                                    data-active={selectedCard === doc.id ? '' : undefined}
                                    sx={{
                                        flexGrow: 1,
                                        '&[data-active]': {
                                            backgroundColor: 'action.selected',
                                            '&:hover': {
                                                backgroundColor: 'action.selectedHover',
                                            },
                                        },
                                    }}
                                >
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Avatar alt={doc.name} src={doc.photo} sx={{ width: 96, height: 96, mx: 'auto' }} />
                                        <Typography data-testid="doctor-name" variant="h5" component="div" sx={{ mt: 2 }}>
                                            {doc.name}
                                        </Typography>
                                        <Typography data-testid="doctor-specialty" variant="body2" color="text.secondary">
                                            {doc.specialities.map(s => s.name).join(', ')}
                                        </Typography>
                                        <Typography data-testid="doctor-experience" variant="body2" color="text.secondary">
                                            {doc.experience}
                                        </Typography>
                                        <Typography data-testid="doctor-fee" variant="body2" color="text.secondary">
                                            {doc.fees}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {doc.clinic.name}
                                        </Typography>
                                        <Box display="flex" alignItems="center" justifyContent="center" gap={1} sx={{ mt: 1 }}>
                                            <LocationOnIcon sx={{ color: "gray" }} /> 
                                            <Typography variant="body2" color="text.secondary">
                                                {doc.clinic.address.locality}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                                <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleBookAppointment(doc.id)}
                                    >
                                        Book Appointment
                                    </Button>
                                </Box>
                            </Card>
                        ))}
                    </Box>
                )}
            </Grid>
        </Grid>
    );
};

export default DoctorListing;