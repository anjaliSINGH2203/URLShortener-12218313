import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Collapse,
  Box,
  Tooltip,
  TablePagination
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  ContentCopy,
  CheckCircle,
  Timeline,
  Link as LinkIcon
} from '@mui/icons-material';
import { ShortenedURL } from '../types';
import { useURL } from '../context/URLContext';
import { logger } from '../services/loggerService';

const StatsTable: React.FC = () => {
  const { shortenedURLs } = useURL();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [copiedCodes, setCopiedCodes] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const toggleRowExpansion = (shortcode: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(shortcode)) {
      newExpanded.delete(shortcode);
    } else {
      newExpanded.add(shortcode);
    }
    setExpandedRows(newExpanded);
  };

  const copyToClipboard = async (shortcode: string) => {
    const url = `${window.location.origin}/${shortcode}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedCodes(prev => new Set(prev).add(shortcode));
      setTimeout(() => {
        setCopiedCodes(prev => {
          const newSet = new Set(prev);
          newSet.delete(shortcode);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      logger.logError('Failed to copy to clipboard', error);
    }
  };

  const isExpired = (expiresAt: string): boolean => {
    return new Date(expiresAt) < new Date();
  };

  const sortedURLs = [...shortenedURLs].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const paginatedURLs = sortedURLs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (shortenedURLs.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <LinkIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No shortened URLs yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create your first shortened URL to see statistics here.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={1}>
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h5" gutterBottom>
          URL Statistics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total URLs: {shortenedURLs.length} | 
          Total Clicks: {shortenedURLs.reduce((sum, url) => sum + url.clicks.length, 0)}
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="40px"></TableCell>
              <TableCell>Short URL</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell>Clicks</TableCell>
              <TableCell width="60px">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedURLs.map((url) => (
              <React.Fragment key={url.shortcode}>
                <TableRow hover>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => toggleRowExpansion(url.shortcode)}
                      disabled={url.clicks.length === 0}
                    >
                      {url.clicks.length > 0 ? (
                        expandedRows.has(url.shortcode) ? <ExpandLess /> : <ExpandMore />
                      ) : (
                        <Timeline sx={{ opacity: 0.3 }} />
                      )}
                    </IconButton>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      /{url.shortcode}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                      title={url.longURL}
                    >
                      {url.longURL}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={isExpired(url.expiresAt) ? 'Expired' : 'Active'}
                      color={isExpired(url.expiresAt) ? 'error' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(url.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(url.createdAt).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(url.expiresAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(url.expiresAt).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={url.clicks.length}
                      variant="outlined"
                      size="small"
                      color={url.clicks.length > 0 ? 'primary' : 'default'}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Tooltip title={copiedCodes.has(url.shortcode) ? 'Copied!' : 'Copy URL'}>
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(url.shortcode)}
                        color={copiedCodes.has(url.shortcode) ? 'success' : 'default'}
                      >
                        {copiedCodes.has(url.shortcode) ? <CheckCircle /> : <ContentCopy />}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
                
                {url.clicks.length > 0 && (
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                      <Collapse in={expandedRows.has(url.shortcode)} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                          <Typography variant="h6" gutterBottom component="div">
                            Click History ({url.clicks.length} clicks)
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Timestamp</TableCell>
                                <TableCell>Referrer</TableCell>
                                <TableCell>Location</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {url.clicks
                                .slice()
                                .reverse()
                                .map((click, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {new Date(click.timestamp).toLocaleString()}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        maxWidth: 200,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                      }}
                                      title={click.referrer}
                                    >
                                      {click.referrer || 'Direct'}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {click.location}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={shortenedURLs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default StatsTable;