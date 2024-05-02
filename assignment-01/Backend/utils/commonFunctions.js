const isValidEmail = (email) => {
    // Regular expression for basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^\+947\d{9}$/; //  phone number starts with country code +947 and is followed by 9 digits
    return phoneRegex.test(phone);
};


const isValidPassword = (password) => {
  // Regular expression for basic password format validation
  // Requires at least 10 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;
  return passwordRegex.test(password);
};

  
  module.exports ={isValidEmail, isValidPassword, isValidPhoneNumber}  ;