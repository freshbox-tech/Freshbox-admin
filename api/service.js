// api/serviceApi.js - Create this file in your frontend project

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5023/api';

// Service APIs
export const serviceApi = {
  // Get all services
  getAllServices: async (active = null) => {
    let url = `${API_BASE_URL}/service`;
    if (active !== null) {
      url += `?active=${active}`;
    }
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return response.json();
  },
  
  // Get service by ID
  getServiceById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/service/${id}`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return response.json();
  },
  
  // Get services by category
  getServicesByCategory: async (category) => {
    const response = await fetch(`${API_BASE_URL}/service/category/${category}`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return response.json();
  },
  
  // Get services by zip code
  getServicesByZipCode: async (zipCode) => {
    const response = await fetch(`${API_BASE_URL}/service/zipcode/${zipCode}`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return response.json();
  },
  
  // Search services
  searchServices: async (term) => {
    const response = await fetch(`${API_BASE_URL}/service/search/${term}`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return response.json();
  },
  
  // Create a new service
  createService: async (serviceData) => {
    const response = await fetch(`${API_BASE_URL}/service`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(serviceData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    
    return response.json();
  },
  
  // Update a service
  updateService: async (id, serviceData) => {
    const response = await fetch(`${API_BASE_URL}/service/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(serviceData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    
    return response.json();
  },
  
  // Update service status
  updateServiceStatus: async (id, isActive) => {
    const response = await fetch(`${API_BASE_URL}/service/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ isActive }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    
    return response.json();
  },
  
  // Delete a service
  deleteService: async (id) => {
    const response = await fetch(`${API_BASE_URL}/service/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    
    return response.json();
  }
};

// Service Area APIs
export const serviceAreaApi = {
  // Get all service areas
  getAllServiceAreas: async (active = null) => {
    let url = `${API_BASE_URL}/serviceArea`;
    if (active !== null) {
      url += `?active=${active}`;
    }
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return response.json();
  },
  
  // Get service area by zip code
  getServiceAreaByZipCode: async (zipCode) => {
    const response = await fetch(`${API_BASE_URL}/serviceArea/${zipCode}`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return response.json();
  },
  
  // Get service areas by city
  getServiceAreasByCity: async (city) => {
    const response = await fetch(`${API_BASE_URL}/serviceArea/city/${city}`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return response.json();
  },
  
  // Get service areas by state
  getServiceAreasByState: async (state) => {
    const response = await fetch(`${API_BASE_URL}/serviceArea/state/${state}`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return response.json();
  },
  
  // Create a new service area
  createServiceArea: async (areaData) => {
    const response = await fetch(`${API_BASE_URL}/serviceArea`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(areaData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    
    return response.json();
  },
  
  // Update a service area
  updateServiceArea: async (zipCode, areaData) => {
    const response = await fetch(`${API_BASE_URL}/serviceArea/${zipCode}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(areaData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    
    return response.json();
  },
  
  // Update service area status
  updateServiceAreaStatus: async (zipCode, isActive) => {
    const response = await fetch(`${API_BASE_URL}/serviceArea/${zipCode}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ isActive }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    
    return response.json();
  },
  
  // Delete a service area
  deleteServiceArea: async (zipCode) => {
    const response = await fetch(`${API_BASE_URL}/serviceArea/${zipCode}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    
    return response.json();
  }
};