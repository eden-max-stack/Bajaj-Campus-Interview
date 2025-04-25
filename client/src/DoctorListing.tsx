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
    Button
} from '@mui/material';
import Grid from '@mui/material/Grid'; 
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FilterPanel, { FilterState } from './components/FilterPanel'; 

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

        if (filters.mode) {
            result = result.filter(doctor => {
                if (filters.mode.includes('video_consult') && doctor.video_consult) return true;
                if (filters.mode.includes('in_clinic') && doctor.in_clinic) return true;
                if (filters.mode.includes('all') && doctor.in_clinic && doctor.video_consult) return true;
                return false;
            });
        } else {
            result = result;
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
        <Grid container spacing={2} sx={{ 
            padding: { xs: '16px', md: '24px' },
            maxWidth: '1600px',
            margin: '0 auto',
            mt: '64px'
          }}>
            <Grid size={{ xs: 4, md: 3}}>
                <FilterPanel onFilterChange={handleFilterChange} />
            </Grid>
            <Grid size={{ xs: 12, md: 9}}>
                {filteredDoctors.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h5">No doctors found matching your criteria</Typography>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            width: '100%',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(900px, 1fr))',
                            gap: 2,
                            padding: 2,
                        }}
                    >
                        {filteredDoctors.map((doc) => (
                            <Card key={doc.id} sx={{ 
                                    align: 'left',
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    height: '100%',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
                                    }
                                }}>
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
                                    <CardContent sx={{ textAlign: 'left' }}>
                                        <Avatar alt={doc.name} src={doc.photo} sx={{ width: 96, height: 96, bgcolor: '#1976d2' }}></Avatar>
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
                                        <Box display="flex" alignItems="left" justifyContent="left" gap={1} sx={{ mt: 1 }}>
                                            <LocationOnIcon sx={{ color: "gray" }} /> 
                                            <Typography variant="body2" color="text.secondary">
                                                {doc.clinic.address.locality}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                                <Box sx={{ p: 2, display: 'flex', justifyContent: 'left' }}>
                                <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleBookAppointment(doc.id)}
                                sx={{
                                    borderRadius: '8px',
                                    padding: '8px 24px',
                                    fontWeight: '600',
                                    textTransform: 'none',
                                    fontSize: '16px'
                                }}
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