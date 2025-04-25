import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Card, CardActionArea, CardContent, ClickAwayListener, Paper } from '@mui/material';
import axios from 'axios';

// Define the Doctor interface
interface Doctor {
  id: string;
  name: string;
  photo: string;
  specialities: { name: string }[];
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const SearchResultsDropdown = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: 0,
  width: '100%',
  zIndex: 1000,
  maxHeight: '300px',
  overflowY: 'auto',
  marginTop: theme.spacing(1),
}));

const NavBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [allDoctors, setAllDoctors] = React.useState<Doctor[]>([]);
  const [searchResults, setSearchResults] = React.useState<Doctor[]>([]);
  const [showResults, setShowResults] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch all doctors data when component mounts
  React.useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get<Doctor[]>('https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json');
        setAllDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  // Search function to filter doctors by name
  const searchDoctors = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const filteredDoctors = allDoctors.filter(doctor => 
      doctor.name.toLowerCase().includes(query.toLowerCase())
    );
    
    // Get top 3 results only
    setSearchResults(filteredDoctors.slice(0, 3));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchQuery = event.target.value;
    setSearchQuery(newSearchQuery);
    searchDoctors(newSearchQuery);
    setShowResults(true);
    
    // Update the URL search parameters with the search query
    const params = new URLSearchParams(location.search);
    if (newSearchQuery) {
      params.set('search', newSearchQuery);
    } else {
      params.delete('search');
    }
  
    // Update the URL without refreshing the page
    navigate({
      pathname: location.pathname,
      search: params.toString(),
    }, { replace: true });
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
    const params = new URLSearchParams(location.search);
    params.delete('search'); // Remove the 'search' query param
    navigate({
      pathname: location.pathname,
      search: params.toString(),
    }, { replace: true });
  };

  const handleDoctorSelect = (doctorId: string) => {
    // Navigate to doctor details or update filter to show only selected doctor
    navigate(`?doctor=${doctorId}`);
    setShowResults(false);
  };

  const handleClickAway = () => {
    setShowResults(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ backgroundColor: '#1976d2', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <Toolbar sx={{ 
    display: 'flex', 
    justifyContent: 'space-between',
    minHeight: '64px',
    padding: { xs: '0 16px', sm: '0 24px' }
  }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 600,
            letterSpacing: '0.5px' }}
          >
            DOCTOR LISTING PAGE
          </Typography>
          
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <ClickAwayListener onClickAway={handleClickAway}>
              <Box sx={{ position: 'relative', width: '100%', maxWidth: 400 }}>
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search doctors by name..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    inputProps={{ 'aria-label': 'search' }}
                  />
                </Search>
                
                {showResults && searchQuery && (
                  <SearchResultsDropdown>
                    {searchResults.length > 0 ? (
                      searchResults.map((doctor) => (
                        <Card key={doctor.id} sx={{ mb: 1 }}>
                          <CardActionArea onClick={() => handleDoctorSelect(doctor.id)}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar 
                                alt={doctor.name} 
                                src={doctor.photo} 
                                sx={{ width: 40, height: 40, mr: 2 }} 
                              />
                              <Box>
                                <Typography variant="body1">{doctor.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {doctor.specialities?.map(s => s.name).join(', ')}
                                </Typography>
                              </Box>
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      ))
                    ) : (
                      <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="body1">No doctor found</Typography>
                      </Box>
                    )}
                  </SearchResultsDropdown>
                )}
              </Box>
            </ClickAwayListener>
          </Box>
          
          <button onClick={handleClearSearch}>Clear Search</button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;