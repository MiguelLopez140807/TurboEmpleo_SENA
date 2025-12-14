// Utilidades de validación para TurboEmpleo

export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push("Debe tener al menos 8 caracteres");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Debe incluir al menos una letra mayúscula");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Debe incluir al menos una letra minúscula");
  }
  
  if (!/\d/.test(password)) {
    errors.push("Debe incluir al menos un número");
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Debe incluir al menos un símbolo especial");
  }
  
  return errors;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateNIT = (nit) => {
  // Formato básico NIT colombiano: 123456789-0
  const nitRegex = /^\d{8,10}-\d$/;
  return nitRegex.test(nit);
};

export const validateCedula = (cedula) => {
  // Solo números, entre 6 y 10 dígitos
  const cedulaRegex = /^\d{6,10}$/;
  return cedulaRegex.test(cedula);
};