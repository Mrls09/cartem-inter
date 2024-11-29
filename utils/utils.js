export const autoGeneratePassword = (length) => {
    const numbers = '0123456789';
    const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const specialChars = '!@#$%^&*()_+{}[]<>?';
    const allChars = numbers + upperCaseLetters + specialChars + upperCaseLetters.toLowerCase();
    let password = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      password += allChars[randomIndex];
    }
  
    return password;
  };
  

