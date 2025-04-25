// FilterPanel.tsx
import React from 'react'
import { 
    Typography,
    Box,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
    FormLabel,
    Checkbox,
    FormGroup
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Changed useHistory to useNavigate for React Router v6

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  mode: string;
  specialties: string[];
  sortBy: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange }) => {
    const location = useLocation();
    const navigate = useNavigate(); 
    
    const [filterState, setFilterState] = useState<FilterState>(() => {
        const params = new URLSearchParams(location.search);
        return {
            mode: params.get('mode') || 'all',
            specialties: params.getAll('specialty'),
            sortBy: params.get('sortBy') || ''
        };
    });

    useEffect(() => {
        const params = new URLSearchParams();

        if (filterState.mode != 'all') {
            params.set('mode', filterState.mode) 
        } 

        
        filterState.specialties.forEach(specialty => {
            params.append('specialty', specialty);
        });
        
        if (filterState.sortBy) {
            params.set('sortBy', filterState.sortBy);
        }
        
        // make sure page doesn't refresh while updating url
        navigate({
            pathname: location.pathname,
            search: params.toString()
        }, { replace: true });
        
        
        onFilterChange(filterState);
    }, [filterState, navigate, location.pathname, onFilterChange]);

    
    const handleSpecialtyChange = (specialty: string) => {
        setFilterState(prevState => {
            const specialties = prevState.specialties.includes(specialty)
                ? prevState.specialties.filter(s => s !== specialty)
                : [...prevState.specialties, specialty];
            
            return { ...prevState, specialties };
        });
    };

    
    const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterState(prevState => ({
            ...prevState,
            mode: event.target.value
        }));
    };

    
    const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterState(prevState => ({
            ...prevState,
            sortBy: event.target.value
        }));
    };

    return (
        <div style={{ 
            padding: '8px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            margin: '8px',
            width: '100%',
            position: 'relative',
            alignSelf: 'flex-start'
          }}>
            <Box  sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Sort By
                </Typography>

                <FormControl fullWidth>
                    <FormLabel id="demo-radio-buttons-group-label">Sort By</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="radio-buttons-group"
                        value={filterState.sortBy}
                        onChange={handleSortChange}
                    >
                        <FormControlLabel 
                            data-testid="sort-fees" 
                            value="fees" 
                            control={<Radio />} 
                            label="Price: Low to High" 
                            sx={{ '& .MuiTypography-root': { fontSize: '14px' } }}

                        />
                        <FormControlLabel 
                            data-testid="sort-experience" 
                            value="experience" 
                            control={<Radio />} 
                            label="Experience: Most Experience First" 
                            sx={{ '& .MuiTypography-root': { fontSize: '14px' } }}
                        />
                    </RadioGroup>
                </FormControl>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Filters
                </Typography>

                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                    Specialties
                </Typography>

                <FormGroup data-testid="filter-header-speciality"
                sx={{ 
                    maxHeight: '300px',
                    overflowY: 'auto',
                    mb: 2,
                    '& .MuiFormControlLabel-root': {
                      mr: 0,
                      ml: 0,
                      mb: 0.5
                    }
                  }}>
                    {[
                        "General Physician", "Dentist", "Dermatologist", "Paediatrician",
                        "Gynaecologist", "ENT", "Diabetologist", "Cardiologist",
                        "Physiotherapist", "Endocrinologist", "Orthopaedic", "Opthalmologist",
                        "Gastroenterologist", "Pulmonologist", "Psychiatrist", "Urologist",
                        "Dietitian/Nutritionist", "Psychologist", "Sexologist", "Nephrologist",
                        "Neurologist", "Oncologist", "Ayurveda", "Homeopath"
                    ].map(specialty => (
                        <FormControlLabel 
                            key={specialty}
                            data-testid={`filter-specialty-${specialty.replace('/', '-')}`} 
                            control={
                                <Checkbox 
                                    checked={filterState.specialties.includes(specialty)}
                                    onChange={() => handleSpecialtyChange(specialty)}
                                />
                            } 
                            label={specialty} 
                        />
                    ))}
                </FormGroup>

                <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                    Mode of Consultation
                </Typography>

                <FormControl fullWidth data-testid="filter-header-moc">
                    <RadioGroup
                        aria-labelledby="mode-radio-buttons-group"
                        name="mode-radio-group"
                        value={filterState.mode}
                        onChange={handleModeChange}
                    >
                        <FormControlLabel 
                            data-testid="filter-video-consult" 
                            value="video_consult" 
                            control={<Radio />} 
                            label="Video Consultation" 
                            sx={{ '& .MuiTypography-root': { fontSize: '14px' } }}
                        />
                        <FormControlLabel 
                            data-testid="filter-in-clinic" 
                            value="in_clinic" 
                            control={<Radio />} 
                            label="In-Clinic Consultation" 
                            sx={{ '& .MuiTypography-root': { fontSize: '14px' } }}

                        />
                        <FormControlLabel 
                            value="all" 
                            control={<Radio />} 
                            label="All" 
                            sx={{ '& .MuiTypography-root': { fontSize: '14px' } }}
                        />
                    </RadioGroup>
                </FormControl>
            </Box>
        </div>
    );
};

export default FilterPanel;