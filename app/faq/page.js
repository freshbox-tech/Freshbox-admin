// app/faq-management/page.js
'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  Card,
  CardContent,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Chip,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  ImportExport as SortIcon,
  DragIndicator as DragIcon,
  Help as HelpIcon,
  QuestionAnswer as FAQIcon,
  Category as CategoryIcon
} from '@mui/icons-material';

// Dummy data for FAQs
const initialFAQs = [
  {
    id: 1,
    question: 'How does FreshBox Laundry service work?',
    answer: 'FreshBox Laundry is an on-demand laundry service. Simply schedule a pickup through our app, leave your clothes at the designated pickup spot, and we\'ll handle the rest. Your clothes will be washed, folded, and delivered back to you within 24-48 hours depending on your service level.',
    category: 'General',
    displayOrder: 1,
    isPublished: true,
    createdAt: '2024-10-15',
    updatedAt: '2025-01-20'
  },
  {
    id: 2,
    question: 'What are your service areas?',
    answer: 'We currently service select zip codes in New York City, including Manhattan (10001, 10002, 10003, 10016, 10022, 10023) and more. Check our app or website for the most up-to-date service area information.',
    category: 'General',
    displayOrder: 2,
    isPublished: true,
    createdAt: '2024-10-15',
    updatedAt: '2025-01-25'
  },
  {
    id: 3,
    question: 'How much does the service cost?',
    answer: 'We offer different membership plans starting at $20/month for biweekly service. We also offer one-time service options. Pricing depends on your location, service type, and volume of laundry. See our Pricing page for more details.',
    category: 'Pricing',
    displayOrder: 1,
    isPublished: true,
    createdAt: '2024-10-16',
    updatedAt: '2025-02-10'
  },
  {
    id: 4,
    question: 'What is the turnaround time for laundry?',
    answer: 'Standard turnaround time is 24-48 hours from pickup to delivery. Premium and Enterprise members get priority service with next-day or same-day options depending on their plan.',
    category: 'Service Details',
    displayOrder: 1,
    isPublished: true,
    createdAt: '2024-10-18',
    updatedAt: '2024-12-05'
  },
  {
    id: 5,
    question: 'How do I sign up for a membership plan?',
    answer: 'You can sign up for a membership plan directly through our app or website. Simply go to the "Membership" section, choose your preferred plan, and follow the prompts to complete your registration.',
    category: 'Membership',
    displayOrder: 1,
    isPublished: true,
    createdAt: '2024-11-01',
    updatedAt: '2025-01-10'
  },
  {
    id: 6,
    question: 'Can I cancel my subscription at any time?',
    answer: 'Yes, you can cancel your subscription at any time through the app or website. Please note that if you\'ve paid for a longer-term subscription (quarterly, annual), refunds are prorated based on your usage.',
    category: 'Membership',
    displayOrder: 2,
    isPublished: true,
    createdAt: '2024-11-05',
    updatedAt: '2025-01-12'
  },
  {
    id: 7,
    question: 'What if my clothes are damaged or lost?',
    answer: 'We take utmost care with your items, but in the rare event that something is damaged or lost, please report it within 48 hours of delivery. We offer compensation based on our item valuation policy which can be found in our Terms of Service.',
    category: 'Policies',
    displayOrder: 1,
    isPublished: true,
    createdAt: '2024-11-10',
    updatedAt: '2025-02-15'
  },
  {
    id: 8,
    question: 'Do you handle delicate or special care items?',
    answer: 'Yes, we can process delicate and special care items. Please make sure to mark these items in the app when scheduling your pickup, and include any specific care instructions.',
    category: 'Service Details',
    displayOrder: 2,
    isPublished: true,
    createdAt: '2024-11-15',
    updatedAt: '2025-01-05'
  },
  {
    id: 9,
    question: 'Is there a minimum order requirement?',
    answer: 'Yes, there is a minimum order value that varies by location, typically $20-30. Membership plans have a set number of included items per month.',
    category: 'Pricing',
    displayOrder: 2,
    isPublished: false,
    createdAt: '2024-12-01',
    updatedAt: '2025-02-20'
  }
];

// FAQ categories
const faqCategories = [
  'General',
  'Service Details',
  'Pricing',
  'Membership',
  'Policies',
  'Technical Support',
  'Other'
];

export default function FAQManagementPage() {
  const [faqs, setFaqs] = useState([]);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('category'); // 'category', 'order', 'newest'
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    // Simulate fetching FAQs from API
    setFaqs(initialFAQs);
  }, []);

  const handleAddFAQ = () => {
    setSelectedFAQ({
      id: null,
      question: '',
      answer: '',
      category: 'General',
      displayOrder: faqs.length + 1,
      isPublished: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    });
    setValidationErrors({});
    setOpenDialog(true);
  };

  const handleEditFAQ = (faq) => {
    setSelectedFAQ({...faq});
    setValidationErrors({});
    setOpenDialog(true);
  };

  const handleDeleteFAQ = (faq) => {
    setSelectedFAQ(faq);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFAQ(null);
    setValidationErrors({});
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedFAQ(null);
  };

  const validateFAQ = (faq) => {
    const errors = {};
    if (!faq.question.trim()) errors.question = 'Question is required';
    if (!faq.answer.trim()) errors.answer = 'Answer is required';
    if (!faq.category) errors.category = 'Category is required';
    
    return errors;
  };

  const handleSaveFAQ = () => {
    const errors = validateFAQ(selectedFAQ);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    if (selectedFAQ.id) {
      // Update existing FAQ
      setFaqs(faqs.map(f => 
        f.id === selectedFAQ.id ? 
        { ...selectedFAQ, updatedAt: new Date().toISOString().split('T')[0] } : 
        f
      ));
    } else {
      // Add new FAQ
      const newFAQ = {
        ...selectedFAQ,
        id: Math.max(...faqs.map(f => f.id)) + 1,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      setFaqs([...faqs, newFAQ]);
    }
    
    setOpenDialog(false);
    setSelectedFAQ(null);
    setValidationErrors({});
  };

  const handleConfirmDelete = () => {
    setFaqs(faqs.filter(f => f.id !== selectedFAQ.id));
    setOpenDeleteDialog(false);
    setSelectedFAQ(null);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryFilterChange = (event) => {
    setCategoryFilter(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleTogglePublish = (id) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, isPublished: !faq.isPublished } : faq
    ));
  };

  // Filter and sort FAQs
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === 'all' || 
      faq.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const sortedFAQs = [...filteredFAQs].sort((a, b) => {
    if (sortOrder === 'category') {
      // Sort by category, then by display order within each category
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.displayOrder - b.displayOrder;
    } else if (sortOrder === 'order') {
      // Sort by display order only
      return a.displayOrder - b.displayOrder;
    } else if (sortOrder === 'newest') {
      // Sort by updated date, newest first
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    }
    return 0;
  });

  // Group FAQs by category
  const faqsByCategory = sortedFAQs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {});

  return (
    <>
     <Box sx={{ mb: 4 }}>
       <Typography variant="h4"  color="text.secondary" component="h1" gutterBottom>
       Development in Progress
       </Typography>
    
     </Box>
    </>
    // <>
    //   <Box sx={{ mb: 4 }}>
    //     <Typography variant="h4" component="h1" gutterBottom>
    //       FAQ Management
    //     </Typography>
    //     <Typography variant="body1" color="text.secondary">
    //       Manage frequently asked questions for your customers
    //     </Typography>
    //   </Box>

    //   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
    //     <Box sx={{ display: 'flex', gap: 2 }}>
    //       <TextField
    //         placeholder="Search FAQs..."
    //         size="small"
    //         value={searchTerm}
    //         onChange={handleSearch}
    //         InputProps={{
    //           startAdornment: (
    //             <InputAdornment position="start">
    //               <SearchIcon />
    //             </InputAdornment>
    //           ),
    //         }}
    //         sx={{ width: 250 }}
    //       />
    //       <FormControl size="small" sx={{ minWidth: 150 }}>
    //         <InputLabel id="category-filter-label">Category</InputLabel>
    //         <Select
    //           labelId="category-filter-label"
    //           value={categoryFilter}
    //           label="Category"
    //           onChange={handleCategoryFilterChange}
    //         >
    //           <MenuItem value="all">All Categories</MenuItem>
    //           {faqCategories.map((category) => (
    //             <MenuItem key={category} value={category}>{category}</MenuItem>
    //           ))}
    //         </Select>
    //       </FormControl>
    //       <FormControl size="small" sx={{ minWidth: 150 }}>
    //         <InputLabel id="sort-order-label">Sort By</InputLabel>
    //         <Select
    //           labelId="sort-order-label"
    //           value={sortOrder}
    //           label="Sort By"
    //           onChange={handleSortOrderChange}
    //         >
    //           <MenuItem value="category">Category & Order</MenuItem>
    //           <MenuItem value="order">Display Order</MenuItem>
    //           <MenuItem value="newest">Last Updated</MenuItem>
    //         </Select>
    //       </FormControl>
    //     </Box>
    //     <Button
    //       variant="contained"
    //       startIcon={<AddIcon />}
    //       onClick={handleAddFAQ}
    //     >
    //       Add New FAQ
    //     </Button>
    //   </Box>

    //   {sortOrder === 'category' ? (
    //     // Display FAQs grouped by category
    //     <>
    //       {Object.keys(faqsByCategory).length > 0 ? (
    //         Object.keys(faqsByCategory).sort().map((category) => (
    //           <Paper key={category} sx={{ mb: 3, overflow: 'hidden' }}>
    //             <Box sx={{ 
    //               p: 2, 
    //               bgcolor: 'primary.main', 
    //               color: 'white',
    //               display: 'flex',
    //               alignItems: 'center'
    //             }}>
    //               <CategoryIcon sx={{ mr: 1 }} />
    //               <Typography variant="h6">{category}</Typography>
    //             </Box>
    //             <TableContainer>
    //               <Table>
    //                 <TableHead>
    //                   <TableRow>
    //                     <TableCell width="50">Order</TableCell>
    //                     <TableCell>Question</TableCell>
    //                     <TableCell width="120">Status</TableCell>
    //                     <TableCell width="150">Last Updated</TableCell>
    //                     <TableCell width="150" align="center">Actions</TableCell>
    //                   </TableRow>
    //                 </TableHead>
    //                 <TableBody>
    //                   {faqsByCategory[category].map((faq) => (
    //                     <TableRow key={faq.id} hover>
    //                       <TableCell>{faq.displayOrder}</TableCell>
    //                       <TableCell>
    //                         <Typography variant="body2" fontWeight="medium">
    //                           {faq.question}
    //                         </Typography>
    //                       </TableCell>
    //                       <TableCell>
    //                         <Chip 
    //                           label={faq.isPublished ? 'Published' : 'Draft'} 
    //                           color={faq.isPublished ? 'success' : 'default'} 
    //                           size="small"
    //                           onClick={() => handleTogglePublish(faq.id)}
    //                         />
    //                       </TableCell>
    //                       <TableCell>
    //                         {new Date(faq.updatedAt).toLocaleDateString()}
    //                       </TableCell>
    //                       <TableCell align="center">
    //                         <Tooltip title="Edit FAQ">
    //                           <IconButton 
    //                             size="small" 
    //                             color="primary"
    //                             onClick={() => handleEditFAQ(faq)}
    //                           >
    //                             <EditIcon fontSize="small" />
    //                           </IconButton>
    //                         </Tooltip>
    //                         <Tooltip title="Delete FAQ">
    //                           <IconButton 
    //                             size="small" 
    //                             color="error"
    //                             onClick={() => handleDeleteFAQ(faq)}
    //                           >
    //                             <DeleteIcon fontSize="small" />
    //                           </IconButton>
    //                         </Tooltip>
    //                       </TableCell>
    //                     </TableRow>
    //                   ))}
    //                 </TableBody>
    //               </Table>
    //             </TableContainer>
    //           </Paper>
    //         ))
    //       ) : (
    //         <Paper sx={{ p: 3, textAlign: 'center' }}>
    //           <Typography variant="body1" color="text.secondary">
    //             No FAQs found matching your criteria.
    //           </Typography>
    //         </Paper>
    //       )}
    //     </>
    //   ) : (
    //     // Display FAQs in a unified table
    //     <TableContainer component={Paper}>
    //       <Table>
    //         <TableHead>
    //           <TableRow>
    //             {sortOrder === 'order' && <TableCell width="50">Order</TableCell>}
    //             <TableCell>Question</TableCell>
    //             <TableCell width="120">Category</TableCell>
    //             <TableCell width="120">Status</TableCell>
    //             {sortOrder === 'newest' && <TableCell width="150">Last Updated</TableCell>}
    //             <TableCell width="150" align="center">Actions</TableCell>
    //           </TableRow>
    //         </TableHead>
    //         <TableBody>
    //           {sortedFAQs.length > 0 ? (
    //             sortedFAQs.map((faq) => (
    //               <TableRow key={faq.id} hover>
    //                 {sortOrder === 'order' && <TableCell>{faq.displayOrder}</TableCell>}
    //                 <TableCell>
    //                   <Typography variant="body2" fontWeight="medium">
    //                     {faq.question}
    //                   </Typography>
    //                 </TableCell>
    //                 <TableCell>
    //                   <Chip label={faq.category} size="small" />
    //                 </TableCell>
    //                 <TableCell>
    //                   <Chip 
    //                     label={faq.isPublished ? 'Published' : 'Draft'} 
    //                     color={faq.isPublished ? 'success' : 'default'} 
    //                     size="small"
    //                     onClick={() => handleTogglePublish(faq.id)}
    //                   />
    //                 </TableCell>
    //                 {sortOrder === 'newest' && (
    //                   <TableCell>
    //                     {new Date(faq.updatedAt).toLocaleDateString()}
    //                   </TableCell>
    //                 )}
    //                 <TableCell align="center">
    //                   <Tooltip title="Edit FAQ">
    //                     <IconButton 
    //                       size="small" 
    //                       color="primary"
    //                       onClick={() => handleEditFAQ(faq)}
    //                     >
    //                       <EditIcon fontSize="small" />
    //                     </IconButton>
    //                   </Tooltip>
    //                   <Tooltip title="Delete FAQ">
    //                     <IconButton 
    //                       size="small" 
    //                       color="error"
    //                       onClick={() => handleDeleteFAQ(faq)}
    //                     >
    //                       <DeleteIcon fontSize="small" />
    //                     </IconButton>
    //                   </Tooltip>
    //                 </TableCell>
    //               </TableRow>
    //             ))
    //           ) : (
    //             <TableRow>
    //               <TableCell colSpan={6} align="center">
    //                 No FAQs found matching your criteria.
    //               </TableCell>
    //             </TableRow>
    //           )}
    //         </TableBody>
    //       </Table>
    //     </TableContainer>
    //   )}

    //   {/* FAQ Preview Section */}
    //   <Box sx={{ mt: 4 }}>
    //     <Typography variant="h6" gutterBottom>
    //       FAQ Preview (Published Only)
    //     </Typography>
    //     <Paper sx={{ p: 2 }}>
    //       {Object.keys(faqsByCategory).length > 0 ? (
    //         Object.keys(faqsByCategory).sort().map((category) => {
    //           const publishedFAQs = faqsByCategory[category].filter(faq => faq.isPublished);
              
    //           if (publishedFAQs.length === 0) return null;
              
    //           return (
    //             <Accordion key={category} sx={{ mb: 1 }}>
    //               <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    //                 <Typography variant="subtitle1">{category}</Typography>
    //               </AccordionSummary>
    //               <AccordionDetails>
    //                 <List disablePadding>
    //                   {publishedFAQs.map((faq) => (
    //                     <Accordion key={faq.id} sx={{ mb: 1 }}>
    //                       <AccordionSummary expandIcon={<ExpandMoreIcon />}>
    //                         <Typography fontWeight="medium">{faq.question}</Typography>
    //                       </AccordionSummary>
    //                       <AccordionDetails>
    //                         <Typography variant="body2">
    //                           {faq.answer}
    //                         </Typography>
    //                       </AccordionDetails>
    //                     </Accordion>
    //                   ))}
    //                 </List>
    //               </AccordionDetails>
    //             </Accordion>
    //           );
    //         })
    //       ) : (
    //         <Box sx={{ textAlign: 'center', py: 2 }}>
    //           <Typography variant="body1" color="text.secondary">
    //             No published FAQs to preview.
    //           </Typography>
    //         </Box>
    //       )}
    //     </Paper>
    //   </Box>

    //   {/* Add/Edit FAQ Dialog */}
    //   <Dialog 
    //     open={openDialog} 
    //     onClose={handleCloseDialog}
    //     maxWidth="md"
    //     fullWidth
    //   >
    //     <DialogTitle>
    //       {selectedFAQ?.id ? 'Edit FAQ' : 'Add New FAQ'}
    //     </DialogTitle>
    //     <DialogContent dividers>
    //       {selectedFAQ && (
    //         <Grid container spacing={2}>
    //           <Grid item xs={12}>
    //             <TextField
    //               label="Question"
    //               fullWidth
    //               multiline
    //               rows={2}
    //               value={selectedFAQ.question}
    //               onChange={(e) => setSelectedFAQ({...selectedFAQ, question: e.target.value})}
    //               required
    //               error={!!validationErrors.question}
    //               helperText={validationErrors.question}
    //               margin="normal"
    //             />
    //           </Grid>
    //           <Grid item xs={12}>
    //             <TextField
    //               label="Answer"
    //               fullWidth
    //               multiline
    //               rows={6}
    //               value={selectedFAQ.answer}
    //               onChange={(e) => setSelectedFAQ({...selectedFAQ, answer: e.target.value})}
    //               required
    //               error={!!validationErrors.answer}
    //               helperText={validationErrors.answer}
    //               margin="normal"
    //             />
    //           </Grid>
    //           <Grid item xs={12} sm={6}>
    //             <FormControl fullWidth margin="normal" error={!!validationErrors.category}>
    //               <InputLabel id="category-label">Category</InputLabel>
    //               <Select
    //                 labelId="category-label"
    //                 value={selectedFAQ.category}
    //                 label="Category"
    //                 onChange={(e) => setSelectedFAQ({...selectedFAQ, category: e.target.value})}
    //               >
    //                 {faqCategories.map((category) => (
    //                   <MenuItem key={category} value={category}>{category}</MenuItem>
    //                 ))}
    //               </Select>
    //               {validationErrors.category && (
    //                 <FormHelperText>{validationErrors.category}</FormHelperText>
    //               )}
    //             </FormControl>
    //           </Grid>
    //           <Grid item xs={12} sm={6}>
    //             <TextField
    //               label="Display Order"
    //               fullWidth
    //               type="number"
    //               value={selectedFAQ.displayOrder}
    //               onChange={(e) => setSelectedFAQ({...selectedFAQ, displayOrder: parseInt(e.target.value)})}
    //               margin="normal"
    //             />
    //           </Grid>
    //           <Grid item xs={12}>
    //             <FormControlLabel
    //               control={
    //                 <Chip 
    //                   label={selectedFAQ.isPublished ? 'Published' : 'Draft'} 
    //                   color={selectedFAQ.isPublished ? 'success' : 'default'} 
    //                   onClick={() => setSelectedFAQ({...selectedFAQ, isPublished: !selectedFAQ.isPublished})}
    //                   sx={{ cursor: 'pointer' }}
    //                 />
    //               }
    //               label="Status"
    //               labelPlacement="start"
    //               sx={{ ml: 0 }}
    //             />
    //           </Grid>
    //           {selectedFAQ.id && (
    //             <>
    //               <Grid item xs={12} sm={6}>
    //                 <TextField
    //                   label="Created At"
    //                   fullWidth
    //                   value={selectedFAQ.createdAt}
    //                   disabled
    //                   margin="normal"
    //                 />
    //               </Grid>
    //               <Grid item xs={12} sm={6}>
    //                 <TextField
    //                   label="Last Updated"
    //                   fullWidth
    //                   value={selectedFAQ.updatedAt}
    //                   disabled
    //                   margin="normal"
    //                 />
    //               </Grid>
    //             </>
    //           )}
    //         </Grid>
    //       )}
    //     </DialogContent>
    //     <DialogActions>
    //       <Button onClick={handleCloseDialog}>Cancel</Button>
    //       <Button 
    //         onClick={handleSaveFAQ} 
    //         variant="contained"
    //         disabled={!selectedFAQ?.question || !selectedFAQ?.answer}
    //       >
    //         {selectedFAQ?.id ? 'Update FAQ' : 'Add FAQ'}
    //       </Button>
    //     </DialogActions>
    //   </Dialog>

    //   {/* Delete Confirmation Dialog */}
    //   <Dialog
    //     open={openDeleteDialog}
    //     onClose={handleCloseDeleteDialog}
    //   >
    //     <DialogTitle>Confirm Delete</DialogTitle>
    //     <DialogContent>
    //       <Alert severity="warning" sx={{ mb: 2 }}>
    //         This action cannot be undone!
    //       </Alert>
    //       <Typography>
    //         Are you sure you want to delete this FAQ?
    //       </Typography>
    //       {selectedFAQ && (
    //         <Paper sx={{ p: 2, mt: 2, bgcolor: 'grey.100' }}>
    //           <Typography variant="subtitle2" gutterBottom>
    //             {selectedFAQ.question}
    //           </Typography>
    //           <Typography variant="body2" color="text.secondary">
    //             Category: {selectedFAQ.category}
    //           </Typography>
    //         </Paper>
    //       )}
    //     </DialogContent>
    //     <DialogActions>
    //       <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
    //       <Button onClick={handleConfirmDelete} color="error" variant="contained">
    //         Delete
    //       </Button>
    //     </DialogActions>
    //   </Dialog>
    // </>
  );
}