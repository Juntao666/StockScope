import React, { useState } from 'react';
import { 
  AppBar, 
  Container, 
  Toolbar, 
  Typography, 
  Button, 
  Menu, 
  MenuItem,
  Box 
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function NavText({ href, text, isMain }) {
  return (
    <Typography
      variant={isMain ? 'h5' : 'h7'}
      noWrap
      style={{
        marginRight: '20px',
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.2rem',
      }}
    >
      <NavLink
        to={href}
        style={{
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        {text}
      </NavLink>
    </Typography>
  )
}

export default function NavBar() {
  const [marketAnchor, setMarketAnchor] = useState(null);
  const [newsAnchor, setNewsAnchor] = useState(null);
  const [analysisAnchor, setAnalysisAnchor] = useState(null);

  const handleMarketOpen = (event) => setMarketAnchor(event.currentTarget);
  const handleMarketClose = () => setMarketAnchor(null);

  const handleNewsOpen = (event) => setNewsAnchor(event.currentTarget);
  const handleNewsClose = () => setNewsAnchor(null);

  const handleAnalysisOpen = (event) => setAnalysisAnchor(event.currentTarget);
  const handleAnalysisClose = () => setAnalysisAnchor(null);

  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          {/* Logo/Home */}
          <Box display="flex" alignItems="center" marginRight="30px">
            <HomeIcon style={{ marginRight: '8px' }} />
            <NavText href='/' text='STOCKSCOPE' isMain />
          </Box>

          {/* Market Data Dropdown */}
          <Box>
            <Button
              color="inherit"
              onClick={handleMarketOpen}
              endIcon={<ArrowDropDownIcon />}
              style={{ fontWeight: 700, marginRight: '10px' }}
            >
              <TrendingUpIcon style={{ marginRight: '4px', fontSize: '1.2rem' }} />
              MARKET
            </Button>
            <Menu
              anchorEl={marketAnchor}
              open={Boolean(marketAnchor)}
              onClose={handleMarketClose}
            >
              <MenuItem onClick={handleMarketClose}>
                <NavLink to="/random-stocks" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                  🎲 Random Stocks
                </NavLink>
              </MenuItem>
              <MenuItem onClick={handleMarketClose}>
                <NavLink to="/sentiment-ranking" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                  📊 Sentiment Ranking
                </NavLink>
              </MenuItem>
              <MenuItem onClick={handleMarketClose}>
                <NavLink to="/revenue-growth" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                  📈 Revenue Growth
                </NavLink>
              </MenuItem>
              <MenuItem onClick={handleMarketClose}>
                <NavLink to="/stock-detail" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                  📉 Stock Chart
                </NavLink>
              </MenuItem>
            </Menu>
          </Box>

          {/* News Analysis Dropdown */}
          <Box>
            <Button
              color="inherit"
              onClick={handleNewsOpen}
              endIcon={<ArrowDropDownIcon />}
              style={{ fontWeight: 700, marginRight: '10px' }}
            >
              <NewspaperIcon style={{ marginRight: '4px', fontSize: '1.2rem' }} />
              NEWS
            </Button>
            <Menu
              anchorEl={newsAnchor}
              open={Boolean(newsAnchor)}
              onClose={handleNewsClose}
            >
              <MenuItem onClick={handleNewsClose}>
                <NavLink to="/news-impact" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                  📰 News Impact
                </NavLink>
              </MenuItem>
              <MenuItem onClick={handleNewsClose}>
                <NavLink to="/news-volume-spike" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                  📊 Volume Spike
                </NavLink>
              </MenuItem>
              <MenuItem onClick={handleNewsClose}>
                <NavLink to="/negative-news-impact" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                  ⚠️ Negative Impact
                </NavLink>
              </MenuItem>
            </Menu>
          </Box>

          {/* Search/Analysis Dropdown */}
          <Box>
            <Button
              color="inherit"
              onClick={handleAnalysisOpen}
              endIcon={<ArrowDropDownIcon />}
              style={{ fontWeight: 700 }}
            >
              <SearchIcon style={{ marginRight: '4px', fontSize: '1.2rem' }} />
              SEARCH
            </Button>
            <Menu
              anchorEl={analysisAnchor}
              open={Boolean(analysisAnchor)}
              onClose={handleAnalysisClose}
            >
              <MenuItem onClick={handleAnalysisClose}>
                <NavLink to="/page2" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                  🔍 Search Page 2
                </NavLink>
              </MenuItem>
              <MenuItem onClick={handleAnalysisClose}>
                <NavLink to="/page3" style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                  🔎 Search Page 3
                </NavLink>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
