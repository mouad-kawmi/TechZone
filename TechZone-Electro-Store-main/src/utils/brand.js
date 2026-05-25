export const getStoreName = (settings = {}) => {
  const name = settings.name || settings.storeName || 'TechZone Electro';
  return String(name).trim() || 'TechZone Electro';
};

export const getBrandInitials = (settings = {}) => {
  const storeName = getStoreName(settings);
  const words = storeName.match(/[A-Za-z0-9À-ÿ]+/g) || [];

  if (words.length <= 1) {
    return storeName.slice(0, 2).toUpperCase();
  }

  return words.slice(0, 2).map((word) => word[0]).join('').toUpperCase();
};
