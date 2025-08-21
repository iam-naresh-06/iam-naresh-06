// src/utils/helpers.js
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const sortArray = (array, key, direction = 'asc') => {
  return array.sort((a, b) => {
    let aValue = a[key];
    let bValue = b[key];

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const filterArray = (array, filters) => {
  return array.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      
      const itemValue = item[key]?.toString().toLowerCase();
      const filterValue = value.toString().toLowerCase();
      
      return itemValue.includes(filterValue);
    });
  });
};

export const paginate = (array, page, pageSize) => {
  const startIndex = (page - 1) * pageSize;
  return array.slice(startIndex, startIndex + pageSize);
};

export const calculateDueDate = (borrowDate, loanPeriodDays = 14) => {
  const dueDate = new Date(borrowDate);
  dueDate.setDate(dueDate.getDate() + loanPeriodDays);
  return dueDate;
};

export const calculateOverdueDays = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = today - due;
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
};

export const calculateFine = (overdueDays, dailyFee = 0.50) => {
  return overdueDays * dailyFee;
};