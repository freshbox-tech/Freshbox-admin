import axios from "axios";
import { API_BASE_URI } from "./constants";

const api = axios.create({
  baseURL: API_BASE_URI,
  headers: {
    "Content-Type": "application/json",
  },
});

class ApiServices {
  //ServicesArea
  addServicesArea(data) {
    return api.post(`/serviceArea`, data);
  }
  allServicesArea() {
    return api.get(`/serviceArea`);
  }
  deleteServicesArea(id) {
    return api.delete(`/serviceArea/${id}`);
  }
  updateServicesArea(id, data) {
    return api.put(`/serviceArea/${id}`, data);
  }
  toggleServicesAreaStatus(id, status) {
    return api.put(`/serviceArea/${id}/toggle/${status}`);
  }
  //Services
  addServices(data) {
    return api.post(`/service`, data);
  }
  allServices() {
    return api.get(`/service`);
  }
  deleteServices(id) {
    return api.delete(`/service/${id}`);
  }
  updateServices(id, data) {
    return api.put(`/service/${id}`, data);
  }
  toggleServicesStatus(id, status) {
    return api.put(`/service/${id}/toggle/${status}`);
  }
  //users
  allUsers() {
    return api.get(`/auth`);
  }
  updateUserStatus(id, status) {
    return api.put(`/auth/status/${id}/${status}`);
  }
  //allRiders
  allRiders() {
    return api.get(`/rider`);
  }
  updateOnlineStatus(id, online) {
    return api.put(`/rider/online/${id}/${online}`);
  }
  updateRider(id, data) {
    return api.put(`/rider/update/${id}`, data);
  }
  //orders
  allOrders() {
    return api.get(`/orders`);
  }
  assignOrderToRider(riderId, orderId) {
    return api.put(`/orders/assign-order/${riderId}/${orderId}`);
  }
  updateStepStatus(id, data) {
    return api.put(`/orders/update-step/${id}`, data);
  }
  //chat
  createChat(data) {
    return api.post(`/chat/create`, data);
  }
  //support
  getAllTickets() {
    return api.get(`/support`);
  }
  sendSupportReply(id, data) {
    return api.put(`/support/send/${id}`, data);
  }
  updateSupportTicket(id, data) {
    return api.put(`/support/${id}`, data);
  }
  //admin
  login(data) {
    return api.post(`/admin/Login`, data);
  }
  sendCode(data) {
    return api.post(`/admin/send-reset-code`, data);
  }
  confirmCode(data) {
    return api.post(`/admin/confirm-reset-code`, data);
  }
  changePasword(data) {
    return api.put(`/admin/change-password`, data);
  }
  updateUser(data) {
    return api.put(`/admin/update`, data);
  }
}

export default new ApiServices();
