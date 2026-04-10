// Authentication utility functions

export const AUTH_STORAGE_KEY = 'patientAuth';

export interface AuthData {
  patientId: string;
  name: string;
  email: string;
  phone: string;
  documentId: string;
}

export const authUtils = {
  saveAuthData: (data: AuthData) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
    }
  },

  getAuthData: (): AuthData | null => {
    if (typeof window !== 'undefined') {
      const data = sessionStorage.getItem(AUTH_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    }
    return null;
  },

  clearAuthData: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
  },

  isAuthenticated: (): boolean => {
    if (typeof window !== 'undefined') {
      return !!sessionStorage.getItem(AUTH_STORAGE_KEY);
    }
    return false;
  },

  getPatientId: (): string | null => {
    const data = authUtils.getAuthData();
    return data?.patientId || null;
  },
};
