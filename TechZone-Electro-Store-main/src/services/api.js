import { DEFAULT_CATEGORY, inferCategoryFromProduct, toFixedCategory } from '../utils/catalog';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const LOCAL_PREVIEW_HOSTS = new Set(['localhost', '127.0.0.1']);

const useLocalPreviewData = () => (
  import.meta.env.PROD &&
  typeof window !== 'undefined' &&
  LOCAL_PREVIEW_HOSTS.has(window.location.hostname) &&
  API_BASE_URL.includes('techzone-api.gt.tc')
);

const localPreviewSettings = {
  name: 'TechZone Electro',
  storeName: 'TechZone Electro',
  email: 'contact@techzone.ma',
  phone: '+212 600 000 000',
  address: 'Twin Center, Casablanca',
  deliveryFee: 25,
  freeDeliveryThreshold: 2000,
  currency: 'MAD',
  maintenanceMode: false
};

const readToken = () => {
  try {
    const raw = localStorage.getItem('tz_token');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const money = (value) => Number(value || 0);

const slugify = (value = '') =>
  value
    .toString()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\+/g, 'plus')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const catalogCache = {
  categories: null,
  brands: null
};

export const normalizeCatalogCategory = (category = {}) => ({
  ...category,
  id: category.id,
  name: category.name,
  slug: category.slug || slugify(category.name),
  isActive: category.isActive ?? true,
  sortOrder: Number(category.sortOrder || 0)
});

export const normalizeCatalogBrand = (brand = {}) => ({
  ...brand,
  id: brand.id,
  name: brand.name,
  logoUrl: brand.logoUrl || null,
  isActive: brand.isActive ?? true
});

const clearCatalogCache = (type) => {
  catalogCache[type] = null;
};

const mapCartItemPayload = (item = {}) => ({
  productId: item.productId || item.id,
  quantity: item.quantity || 1,
  variant: item.selectedStorage || item.variant || null
});

const isPersistableImageUrl = (value) =>
  typeof value === 'string' &&
  value.trim().length > 0 &&
  value.length <= 500 &&
  !value.startsWith('data:');

const dataUrlToFile = (dataUrl, filename = 'product-image') => {
  if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) return null;

  const [header = '', body = ''] = dataUrl.split(',');
  const mime = header.match(/data:(.*?);base64/)?.[1] || 'image/png';
  const extension = mime.split('/')[1]?.split('+')[0] || 'png';
  const binary = atob(body);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  const blob = new Blob([bytes], { type: mime });
  if (typeof File === 'undefined') return blob;

  return new File([blob], `${filename}.${extension}`, { type: mime });
};

const uploadImageFile = async (file, folder = 'techzone/products') => {
  const formData = new FormData();
  formData.append('file', file, file.name || 'product-image');
  if (folder) formData.append('folder', folder);

  return apiRequest('/images/upload', {
    method: 'POST',
    body: formData
  });
};

const parseResponse = async (response) => {
  if (response.status === 204) return null;
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const validationError = data?.errors
      ? Object.values(data.errors).flat().join(' ')
      : null;
    throw new Error(validationError || data?.message || data?.error || data?.detail || `Request failed with ${response.status}`);
  }
  return data;
};

export const apiRequest = async (path, options = {}) => {
  const token = readToken();
  const headers = {
    Accept: 'application/json',
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body instanceof FormData ? options.body : options.body ? JSON.stringify(options.body) : undefined
  });

  return parseResponse(response);
};

const roleFromUser = (user = {}) => {
  const roles = user.roles || [];
  return roles.includes('ROLE_ADMIN') ? 'admin' : 'user';
};

export const normalizeUser = (user = {}) => ({
  ...user,
  username: user.fullName || user.username || user.email,
  name: user.fullName || user.username || user.email,
  avatar: user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email || 'techzone')}`,
  role: roleFromUser(user),
  paymentMethods: user.paymentMethods || []
});

const buildProductVariations = (product = {}) => {
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const backendVariations = product.variations || {};
  const storageVariants = variants
    .filter(variant => variant.type === 'STORAGE')
    .map(variant => ({
      id: variant.id,
      name: variant.value,
      value: variant.value,
      stock: Number(variant.stock || 0),
      priceDelta: money(variant.priceDelta)
    }))
    .filter(variant => variant.name);
  const colorVariants = variants
    .filter(variant => variant.type === 'COLOR')
    .map(variant => variant.colorHex || variant.value)
    .filter(Boolean);
  const sizeVariants = variants
    .filter(variant => variant.type === 'SIZE')
    .map(variant => variant.value)
    .filter(Boolean);

  return {
    colors: colorVariants.length ? [...new Set(colorVariants)] : (backendVariations.colors || []),
    storage: storageVariants.length ? storageVariants : (backendVariations.storage || []),
    sizes: sizeVariants.length ? [...new Set(sizeVariants)] : (backendVariations.sizes || [])
  };
};

export const normalizeProduct = (product = {}) => {
  const backendImages = [
    product.mainImage,
    product.image,
    ...(Array.isArray(product.images) ? product.images : []),
    ...(Array.isArray(product.imageDetails) ? product.imageDetails.map(image => image.imageUrl) : [])
  ].filter(Boolean);
  const images = [...new Set(backendImages)];
  const image = images[0] || null;
  const reviewsList = product.reviewsList || product.reviews_list || [];
  const category = inferCategoryFromProduct(product);
  const brand = product.brandName || product.brand || null;
  const variations = buildProductVariations(product);

  return {
    ...product,
    category,
    brand,
    image,
    images,
    price: money(product.price),
    oldPrice: product.oldPrice == null ? null : money(product.oldPrice),
    rating: money(product.rating),
    reviews: product.reviewsCount ?? product.reviews ?? reviewsList.length,
    reviews_list: reviewsList,
    variations,
    isOutOfStock: product.isOutOfStock ?? (Number(product.stock || 0) <= 0)
  };
};

export const normalizeCart = (cart = {}) => ({
  ...cart,
  subtotal: money(cart.subtotal),
  items: (cart.items || []).map((item) => ({
    id: item.productId,
    cartItemId: item.id,
    title: item.productTitle,
    name: item.productTitle,
    image: item.productImage,
    price: money(item.unitPrice),
    unitPrice: money(item.unitPrice),
    quantity: item.quantity,
    stock: item.stock,
    variant: item.variant,
    selectedStorage: item.variant,
    isOutOfStock: item.isAvailable === false
  }))
});

const normalizeOrderStatusKey = (status) => String(status || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toUpperCase()
  .replace(/[^A-Z]+/g, '_')
  .replace(/^_+|_+$/g, '');

const orderStatusToUi = {
  EN_ATTENTE: 'En Attente',
  EN_COURS: 'En Cours',
  EXPEDIE: 'Exp\u00e9di\u00e9',
  LIVRE: 'Livr\u00e9',
  ANNULE: 'Annul\u00e9'
};

const orderStatusToBackend = {
  EN_ATTENTE: 'EN_ATTENTE',
  EN_COURS: 'EN_COURS',
  EXPEDIE: 'EXPEDIE',
  LIVRE: 'LIVRE',
  ANNULE: 'ANNULE'
};

const toUiOrderStatus = (status) => orderStatusToUi[normalizeOrderStatusKey(status)] || status || 'En Attente';
const toBackendOrderStatus = (status) => orderStatusToBackend[normalizeOrderStatusKey(status)] || status;

const paymentMethodToBackend = {
  cod: 'COD',
  card: 'CARD',
  paypal: 'PAYPAL',
  COD: 'COD',
  CARD: 'CARD',
  PAYPAL: 'PAYPAL'
};

const paymentMethodToUi = {
  COD: 'cod',
  CARD: 'card',
  PAYPAL: 'paypal'
};

export const normalizeOrder = (order = {}) => {
  const items = (order.items || []).map((item) => ({
    ...item,
    id: item.productId || item.id,
    orderItemId: item.id,
    title: item.productTitle || item.title || item.name,
    name: item.productTitle || item.title || item.name,
    image: item.productImage || item.image,
    price: money(item.unitPrice || item.price),
    quantity: item.quantity || 1
  }));

  return {
    ...order,
    backendId: order.id || order.orderId,
    id: order.orderNumber || order.id || order.orderId,
    orderNumber: order.orderNumber || order.id || order.orderId,
    name: order.shippingName || order.customerName,
    customerName: order.shippingName || order.customerName,
    email: order.shippingEmail || order.email,
    phone: order.shippingPhone || order.phone,
    address: order.shippingStreet || order.address,
    city: order.shippingCity || order.city,
    postal: order.shippingPostal || order.postal,
    status: toUiOrderStatus(order.status),
    backendStatus: order.status,
    paymentMethod: paymentMethodToUi[order.paymentMethod] || order.paymentMethod,
    paymentStatus: order.paymentStatus,
    finalTotal: money(order.finalTotal),
    amount: money(order.finalTotal || order.amount),
    subtotal: money(order.subtotal),
    shippingCost: money(order.shippingCost),
    discount: money(order.discount),
    date: order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : order.date,
    items
  };
};

export const normalizeMessage = (message = {}) => ({
  ...message,
  name: message.fullName || message.name,
  read: message.status && message.status !== 'NEW',
  date: message.createdAt || message.date
});

export const normalizeNotification = (notification = {}) => ({
  ...notification,
  backendId: notification.id,
  read: Boolean(notification.read ?? notification.isRead),
  timestamp: notification.timestamp || (notification.createdAt ? new Date(notification.createdAt).getTime() : Date.now()),
  link: notification.link === '/admin/support' ? '/admin/messages' : notification.link
});

export const normalizeSettings = (settings = {}) => ({
  ...settings,
  name: settings.name || settings.storeName || 'TechZone Electro',
  storeName: settings.name || settings.storeName || 'TechZone Electro',
  deliveryFee: money(settings.deliveryFee),
  freeDeliveryThreshold: money(settings.freeDeliveryThreshold),
  maintenanceMode: Boolean(settings.maintenanceMode)
});

export const toProductPayload = (product = {}) => ({
  title: product.title,
  slug: product.slug || slugify(product.title),
  description: product.description || '',
  price: money(product.price),
  oldPrice: product.oldPrice ? money(product.oldPrice) : null,
  stock: Number(product.stock || 0),
  sku: product.sku || null,
  categoryId: product.categoryId || null,
  brandId: product.brandId || null,
  isNew: Boolean(product.isNew),
  isFeatured: Boolean(product.isFeatured),
  isActive: product.isActive ?? true,
  promoExpiresAt: product.promoExpiresAt || null,
  rating: money(product.rating),
  reviewsCount: Number(product.reviews || product.reviewsCount || 0)
});

const findCatalogId = async (type, name) => {
  if (!name) return null;
  if (!catalogCache[type]) {
    catalogCache[type] = await apiRequest(type === 'categories' ? '/categories' : '/brands');
  }
  const normalizedName = name.toString().trim().toLowerCase();
  const match = (catalogCache[type] || []).find((item) =>
    item.name?.toLowerCase() === normalizedName ||
    item.slug?.toLowerCase() === slugify(name)
  );
  return match?.id || null;
};

const ensureCatalogId = async (type, name) => {
  const existingId = await findCatalogId(type, name);
  if (existingId || !name || name === 'All') return existingId;

  const endpoint = type === 'categories' ? '/categories' : '/brands';
  const payload = type === 'categories'
    ? { name, slug: slugify(name), isActive: true, sortOrder: 0 }
    : { name, isActive: true };
  const created = await apiRequest(endpoint, { method: 'POST', body: payload });

  catalogCache[type] = [...(catalogCache[type] || []), created];
  return created.id;
};

const categoryPayload = (category = {}) => ({
  name: category.name,
  slug: category.slug || slugify(category.name),
  description: category.description || '',
  icon: category.icon || null,
  imageUrl: category.imageUrl || null,
  parentId: category.parentId || null,
  isActive: category.isActive ?? true,
  sortOrder: Number(category.sortOrder || 0)
});

const brandPayload = (brand = {}) => ({
  name: brand.name,
  logoUrl: brand.logoUrl || null,
  isActive: brand.isActive ?? true
});

const resolveImageSource = async (source, sourceProduct = {}) => {
  const imageSource = typeof source === 'string'
    ? source
    : source?.imageUrl || source?.url || source?.src || null;
  const filename = slugify(sourceProduct.title || 'product-image') || 'product-image';

  if (typeof File !== 'undefined' && source instanceof File) {
    const uploaded = await uploadImageFile(source);
    return {
      imageUrl: uploaded.secureUrl || uploaded.imageUrl,
      publicId: uploaded.publicId || null
    };
  }

  if (typeof imageSource === 'string' && imageSource.startsWith('data:')) {
    const file = dataUrlToFile(imageSource, filename);
    if (!file) return null;
    const uploaded = await uploadImageFile(file);
    return {
      imageUrl: uploaded.secureUrl || uploaded.imageUrl,
      publicId: uploaded.publicId || null
    };
  }

  if (!isPersistableImageUrl(imageSource)) return null;

  return {
    imageUrl: imageSource.trim(),
    publicId: source?.publicId || sourceProduct.imagePublicId || sourceProduct.publicId || null
  };
};

const collectProductImageSources = (sourceProduct = {}) => {
  const hasManagedImages = Array.isArray(sourceProduct.images);
  const fallbackImages = (!sourceProduct.image && !hasManagedImages)
    ? [
        sourceProduct.mainImage,
        ...(Array.isArray(sourceProduct.imageDetails) ? sourceProduct.imageDetails : [])
      ]
    : [];
  const sources = [
    sourceProduct.imageFile,
    sourceProduct.image,
    ...(hasManagedImages ? sourceProduct.images : []),
    ...fallbackImages
  ].filter(Boolean);

  const seen = new Set();
  return sources.filter((source) => {
    const key = typeof source === 'string'
      ? source
      : source.publicId || source.imageUrl || source.url || source.name;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 4);
};

const imagesMatch = (left = {}, right = {}) =>
  left.imageUrl === right.imageUrl ||
  (left.publicId && right.publicId && left.publicId === right.publicId);

const syncProductImages = async (productId, sourceProduct = {}, savedProduct = {}) => {
  const existingImages = savedProduct.imageDetails || sourceProduct.imageDetails || [];
  const resolvedImages = (await Promise.all(
    collectProductImageSources(sourceProduct).map(source => resolveImageSource(source, sourceProduct))
  )).reduce((images, resolvedImage) => {
    if (resolvedImage?.imageUrl && !images.some(image => imagesMatch(image, resolvedImage))) {
      images.push(resolvedImage);
    }
    return images;
  }, []);

  if (!resolvedImages.length) {
    await Promise.all(existingImages
      .filter(existingImage => existingImage?.id)
      .map(existingImage => apiRequest(`/product-images/${existingImage.id}`, { method: 'DELETE' })));
    return;
  }

  await Promise.all(resolvedImages.map((resolvedImage, index) => {
    const existingImage = existingImages.find(image => imagesMatch(image, resolvedImage));
    const payload = {
      imageUrl: resolvedImage.imageUrl,
      publicId: resolvedImage.publicId,
      altText: sourceProduct.title || savedProduct.title || 'Product image',
      isPrimary: index === 0,
      sortOrder: index
    };

    if (existingImage?.id) {
      return apiRequest(`/product-images/${existingImage.id}`, {
        method: 'PUT',
        body: payload
      });
    }

    return apiRequest(`/products/${productId}/images`, {
      method: 'POST',
      body: payload
    });
  }));

  await Promise.all(existingImages
    .filter(existingImage => existingImage?.id && !resolvedImages.some(image => imagesMatch(existingImage, image)))
    .map(existingImage => apiRequest(`/product-images/${existingImage.id}`, { method: 'DELETE' })));
};

const syncProductSpecs = async (productId, sourceProduct = {}, savedProduct = {}) => {
  const specs = sourceProduct.specs || {};
  const existingKeys = new Set((savedProduct.specDetails || sourceProduct.specDetails || [])
    .map(spec => spec.specKey));

  const specsToCreate = Object.entries(specs)
    .filter(([specKey, specValue]) => specKey && specValue && !existingKeys.has(specKey));

  await Promise.all(specsToCreate.map(([specKey, specValue], index) =>
    apiRequest(`/products/${productId}/specs`, {
      method: 'POST',
      body: {
        specKey,
        specValue: String(specValue),
        sortOrder: existingKeys.size + index
      }
    })));
};

const syncProductVariants = async (productId, sourceProduct = {}, savedProduct = {}) => {
  const variations = sourceProduct.variations || {};
  const existingVariants = savedProduct.variants || sourceProduct.variants || [];
  const existingByKey = new Map(existingVariants.map(variant => [`${variant.type}:${variant.value}`, variant]));
  const desiredKeys = new Set();

  const upsertVariant = async (payload) => {
    const key = `${payload.type}:${payload.value}`;
    desiredKeys.add(key);
    const existingVariant = existingByKey.get(key);
    if (existingVariant?.id) {
      await apiRequest(`/product-variants/${existingVariant.id}`, {
        method: 'PUT',
        body: payload
      });
      return;
    }

    await apiRequest(`/products/${productId}/variants`, {
      method: 'POST',
      body: payload
    });
  };

  const variantTasks = [];

  for (const storage of variations.storage || []) {
    const value = typeof storage === 'object' ? storage.name || storage.value : storage;
    if (!value) continue;
    variantTasks.push(upsertVariant({
      type: 'STORAGE',
      value,
      stock: Number(typeof storage === 'object' ? storage.stock || 0 : sourceProduct.stock || 0),
      priceDelta: Number(typeof storage === 'object' ? storage.priceDelta || 0 : 0)
    }));
  }

  for (const color of variations.colors || []) {
    const value = typeof color === 'object' ? color.value || color.name || color.colorHex || color.hex : color;
    const colorHex = typeof color === 'object' ? color.colorHex || color.hex || value : value;
    if (!value || !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/.test(colorHex || '')) continue;
    variantTasks.push(upsertVariant({
      type: 'COLOR',
      value,
      colorHex,
      stock: Number(sourceProduct.stock || 0),
      priceDelta: 0
    }));
  }

  await Promise.all(variantTasks);

  await Promise.all(existingVariants
    .filter(variant => variant?.id && (variant.type === 'STORAGE' || variant.type === 'COLOR') && !desiredKeys.has(`${variant.type}:${variant.value}`))
    .map(variant => apiRequest(`/product-variants/${variant.id}`, { method: 'DELETE' })));
};

export const toOrderStatusPayload = (order = {}, status) => ({
  userId: order.userId || null,
  status: toBackendOrderStatus(status),
  paymentMethod: paymentMethodToBackend[order.paymentMethod] || 'COD',
  paymentStatus: order.paymentStatus || 'PENDING',
  subtotal: money(order.subtotal || order.finalTotal || order.amount),
  shippingCost: money(order.shippingCost),
  discount: money(order.discount),
  couponCode: order.couponCode || null,
  finalTotal: money(order.finalTotal || order.amount),
  shippingName: order.name || order.customerName || 'Client',
  shippingPhone: order.phone || '+212 600000000',
  shippingEmail: order.email || null,
  shippingStreet: order.address || 'Adresse non precisee',
  shippingCity: order.city || 'Casablanca',
  shippingPostal: order.postal || null,
  notes: order.notes || null,
  shippedAt: order.shippedAt || null,
  deliveredAt: order.deliveredAt || null
});

export const api = {
  login: async (email, password) => {
    const data = await apiRequest('/auth/login', { method: 'POST', body: { email, password } });
    return { ...data, user: normalizeUser(data.user) };
  },
  register: async ({ fullName, email, password, phone }) => {
    const data = await apiRequest('/auth/register', { method: 'POST', body: { fullName, email, password, phone } });
    return { ...data, user: normalizeUser(data.user) };
  },
  me: async () => normalizeUser(await apiRequest('/auth/me')),

  getProducts: async () => {
    if (useLocalPreviewData()) return [];

    const data = await apiRequest('/products');
    const list = Array.isArray(data) ? data : data.content || [];
    return list.map(normalizeProduct);
  },
  getProduct: async (id) => normalizeProduct(await apiRequest(`/products/${id}`)),
  uploadImage: (file, folder) => uploadImageFile(file, folder),
  getCategories: async () => {
    if (useLocalPreviewData()) {
      catalogCache.categories = [];
      return [];
    }

    const data = await apiRequest('/categories');
    const categories = (data || []).map(normalizeCatalogCategory);
    catalogCache.categories = categories;
    return categories;
  },
  getBrands: async () => {
    if (useLocalPreviewData()) {
      catalogCache.brands = [];
      return [];
    }

    const data = await apiRequest('/brands');
    const brands = (data || []).map(normalizeCatalogBrand);
    catalogCache.brands = brands;
    return brands;
  },
  getCatalog: async () => {
    if (useLocalPreviewData()) return { categories: [], brands: [] };

    const [categories, brands] = await Promise.all([api.getCategories(), api.getBrands()]);
    return { categories, brands };
  },
  saveCategory: async (category) => {
    const data = category.id
      ? await apiRequest(`/categories/${category.id}`, { method: 'PUT', body: categoryPayload(category) })
      : await apiRequest('/categories', { method: 'POST', body: categoryPayload(category) });
    clearCatalogCache('categories');
    return normalizeCatalogCategory(data);
  },
  deleteCategory: async (id) => {
    await apiRequest(`/categories/${id}`, { method: 'DELETE' });
    clearCatalogCache('categories');
    return id;
  },
  saveBrand: async (brand) => {
    const data = brand.id
      ? await apiRequest(`/brands/${brand.id}`, { method: 'PUT', body: brandPayload(brand) })
      : await apiRequest('/brands', { method: 'POST', body: brandPayload(brand) });
    clearCatalogCache('brands');
    return normalizeCatalogBrand(data);
  },
  deleteBrand: async (id) => {
    await apiRequest(`/brands/${id}`, { method: 'DELETE' });
    clearCatalogCache('brands');
    return id;
  },
  saveProduct: async (product) => {
    const productCategory = toFixedCategory(product.category || inferCategoryFromProduct(product), DEFAULT_CATEGORY);
    const normalizedProduct = { ...product, category: productCategory };
    const payload = toProductPayload(normalizedProduct);
    if (!payload.categoryId && normalizedProduct.category) {
      payload.categoryId = await ensureCatalogId('categories', normalizedProduct.category);
    }
    if (!payload.brandId && normalizedProduct.brand) {
      payload.brandId = await ensureCatalogId('brands', normalizedProduct.brand);
    }
    const data = normalizedProduct.id
      ? await apiRequest(`/products/${normalizedProduct.id}`, { method: 'PUT', body: payload })
      : await apiRequest('/products', { method: 'POST', body: payload });
    const savedProduct = normalizeProduct(data);

    await Promise.all([
      syncProductImages(savedProduct.id, normalizedProduct, savedProduct),
      syncProductSpecs(savedProduct.id, normalizedProduct, savedProduct),
      syncProductVariants(savedProduct.id, normalizedProduct, savedProduct)
    ]);

    return api.getProduct(savedProduct.id);
  },
  deleteProduct: (id) => apiRequest(`/products/${id}`, { method: 'DELETE' }),
  addReview: async (productId, review) => {
    await apiRequest(`/products/${productId}/reviews`, {
      method: 'POST',
      body: {
        userId: review.userId,
        rating: review.rating,
        title: review.title || `Avis ${review.rating}/5`,
        body: review.comment || review.body || '',
        isVerified: Boolean(review.isVerified),
        isApproved: true,
        helpfulCount: 0
      }
    });
    return api.getProduct(productId);
  },

  getCart: async (userId) => normalizeCart(await apiRequest(`/users/${userId}/cart`)),
  addCartItem: async (userId, item) => normalizeCart(await apiRequest(`/users/${userId}/cart/items`, {
    method: 'POST',
    body: mapCartItemPayload(item)
  })),
  updateCartItem: async (userId, itemId, quantity) => normalizeCart(await apiRequest(`/users/${userId}/cart/items/${itemId}`, {
    method: 'PATCH',
    body: { quantity }
  })),
  removeCartItem: async (userId, itemId) => normalizeCart(await apiRequest(`/users/${userId}/cart/items/${itemId}`, { method: 'DELETE' })),
  clearCart: async (userId) => normalizeCart(await apiRequest(`/users/${userId}/cart/items`, { method: 'DELETE' })),
  mergeGuestCart: async (userId, items) => normalizeCart(await apiRequest(`/users/${userId}/cart/merge`, {
    method: 'POST',
    body: { items: (items || []).map(mapCartItemPayload) }
  })),

  validateCoupon: (code, subtotal) => apiRequest('/coupons/validate', { method: 'POST', body: { code, subtotal } }),
  checkout: async (userId, payload) => {
    const path = userId ? `/users/${userId}/checkout` : '/checkout';
    return normalizeOrder(await apiRequest(path, {
      method: 'POST',
      body: {
        ...payload,
        paymentMethod: paymentMethodToBackend[payload.paymentMethod] || 'COD'
      }
    }));
  },

  getOrders: async (user) => {
    const isAdmin = user?.role === 'admin';
    const data = await apiRequest(isAdmin ? '/orders' : `/users/${user.id}/orders`);
    return (data || []).map(normalizeOrder);
  },
  trackOrder: async (orderNumber) => normalizeOrder(await apiRequest(`/orders/track/${encodeURIComponent(orderNumber)}`)),
  updateOrderStatus: async (order, status) => {
    const data = await apiRequest(`/orders/${order.backendId || order.id}`, {
      method: 'PUT',
      body: toOrderStatusPayload(order, status)
    });
    return normalizeOrder(data);
  },

  getMessages: async () => (await apiRequest('/support/messages')).map(normalizeMessage),
  sendContactMessage: async (message) => normalizeMessage(await apiRequest('/contact/messages', {
    method: 'POST',
    body: {
      userId: message.userId || null,
      fullName: message.name || message.fullName,
      email: message.email,
      phone: message.phone || null,
      subject: message.subject,
      message: message.message
    }
  })),
  updateMessageStatus: async (id, status = 'READ') => normalizeMessage(await apiRequest(`/support/messages/${id}/status`, {
    method: 'PATCH',
    body: { status }
  })),
  deleteMessage: (id) => apiRequest(`/support/messages/${id}`, { method: 'DELETE' }),
  replyMessage: async (id, reply) => normalizeMessage(await apiRequest(`/support/messages/${id}/reply`, {
    method: 'POST',
    body: { reply }
  })),

  getNotifications: async (user) => {
    const path = user?.id ? `/users/${user.id}/notifications` : '/notifications/global';
    return (await apiRequest(path)).map(normalizeNotification);
  },
  markNotificationRead: async (id) => normalizeNotification(await apiRequest(`/notifications/${id}/read`, {
    method: 'PATCH'
  })),

  getSettings: async () => {
    if (useLocalPreviewData()) return normalizeSettings(localPreviewSettings);
    return normalizeSettings(await apiRequest('/store-settings'));
  },
  updateSettings: async (settings) => normalizeSettings(await apiRequest('/store-settings', {
    method: 'PATCH',
    body: {
      storeName: settings.name || settings.storeName,
      email: settings.email,
      phone: settings.phone,
      address: settings.address,
      deliveryFee: settings.deliveryFee,
      freeDeliveryThreshold: settings.freeDeliveryThreshold,
      currency: settings.currency || 'MAD',
      maintenanceMode: Boolean(settings.maintenanceMode)
    }
  }))
};
