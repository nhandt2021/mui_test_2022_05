// Third party component
import { useEffect, useState } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AppBar, Container, CssBaseline, Grid, IconButton, Menu, MenuItem, Toolbar } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import { API_URL, DOMAIN_NAME } from '../../constants/common';

const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

const HomePage = () => {
  HomePage.propTypes = {};

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  /**
   * This function will get data when scroll reach bottom
   * @returns {Promise<void>}
   */
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: response } = await axios.get(`${API_URL}/page/${page}`);
      setData(data.concat(response.nodes));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Open page in new tab after clicking Image or Title
   * @param path
   */
  const openNewTab = path => {
    const newWindow = window.open(`${DOMAIN_NAME}/${path}`, '_blank', 'noopener,noreferrer');

    if (newWindow) newWindow.opener = null;
  };

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  /**
   * Fetch data if page is changed
   */
  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <>
      {/*NAV BAR*/}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Photos
            </Typography>
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
      </Box>

      {/*BODY*/}
      <CssBaseline />
      <Container id="scrollableDiv" sx={{ padding: 5 }}>
        <InfiniteScroll
          dataLength={data.length}
          next={() => {
            setPage(page + 1);
          }}
          hasMore={true}
          scrollableTarget="scrollableDiv"
          scrollThreshold={0.7}
        >
          {data?.map(item => (
            <div key={item?.node?.nid} style={{ display: 'flex', justifyContent: 'center' }}>
              <Grid
                container
                sx={{ width: 'calc(100vw - 100px)', cursor: 'pointer' }}
                onClick={() => openNewTab(item?.node?.path)}
              >
                <Grid
                  md={4}
                  xs={12}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 5,
                  }}
                >
                  <Item>
                    <CardMedia
                      component="img"
                      sx={{ width: 250, height: 180, borderRadius: 8 }}
                      image={`${DOMAIN_NAME}/${item?.node?.field_photo_image_section}`}
                      alt="Live from space album cover"
                    />
                  </Item>
                </Grid>
                <Grid md={8} xs={12}>
                  <Item sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Typography component="div" variant="h5">
                        {item.node.title}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" component="div"></Typography>
                    </CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: 2,
                      }}
                    >
                      {new Date().toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Box>
                  </Item>
                </Grid>
              </Grid>
            </div>
          ))}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          )}
        </InfiniteScroll>
      </Container>
    </>
  );
};

export default HomePage;
