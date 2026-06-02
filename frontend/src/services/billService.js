import axios from "axios";

const API_URL = "http://localhost:5000/api/bills";
const COMPANY_URL = "http://localhost:5000/api/company";

export const getBills = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createBill = async (billData) => {
  const response = await axios.post(
    `${API_URL}/create`,
    billData
  );
  return response.data;
};

export const getBillById = async (id) => {
  const response = await axios.get(
    `${API_URL}/${id}`
  );
  return response.data;
};

export const updateBill = async (id, billData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    billData
  );
  return response.data;
};

export const deleteBill = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`
  );
  return response.data;
};

export const getCompany = async () => {
  const response = await axios.get(COMPANY_URL);
  return response.data;
};

export const getNextBillNo = async () => {
  const response = await axios.get(`${API_URL}/next`);
  return response.data;
};

export const saveCompany = async (companyData) => {
  const response = await axios.post(COMPANY_URL, companyData);
  return response.data;
};
