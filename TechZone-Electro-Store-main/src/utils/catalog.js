export const CATEGORY_OPTIONS = [
  {
    value: 'Smartphones',
    label: 'Telephones',
    aliases: ['phone', 'phones', 'smartphone', 'smartphones', 'telephone', 'telephones', 'mobile', 'mobiles']
  },
  {
    value: 'Laptops',
    label: 'Ordinateurs',
    aliases: ['laptop', 'laptops', 'pc', 'pcs', 'computer', 'computers', 'ordinateur', 'ordinateurs']
  },
  {
    value: 'Tablets',
    label: 'Tablettes',
    aliases: ['tablet', 'tablets', 'tablette', 'tablettes', 'ipad', 'ipads', 'pad']
  },
  {
    value: 'Audio',
    label: 'Audio',
    aliases: ['audio', 'headphone', 'headphones', 'earbuds', 'buds', 'ecouteurs', 'casque', 'casques']
  }
];

export const DEFAULT_CATEGORY = 'Smartphones';

const normalizeText = (value = '') =>
  value
    .toString()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export const normalizeCategory = (value) => {
  if (value == null) return null;

  const raw = value.toString().trim();
  if (!raw || raw === 'All') return raw || null;

  const key = normalizeText(raw);
  const match = CATEGORY_OPTIONS.find((option) => {
    const keys = [option.value, option.label, ...option.aliases].map(normalizeText);
    return keys.includes(key);
  });

  return match?.value || raw;
};

export const isFixedCategory = (value) => {
  const normalized = normalizeCategory(value);
  return CATEGORY_OPTIONS.some((option) => option.value === normalized);
};

export const toFixedCategory = (value, fallback = DEFAULT_CATEGORY) => {
  const normalized = normalizeCategory(value);
  return isFixedCategory(normalized) ? normalized : fallback;
};

export const categoryMatches = (category, selectedCategory) => {
  const selected = normalizeCategory(selectedCategory);
  if (!selected || selected === 'All') return true;

  return normalizeCategory(category) === selected;
};

export const categoryDisplayLabel = (category) => {
  const normalized = normalizeCategory(category);
  return CATEGORY_OPTIONS.find((option) => option.value === normalized)?.label || normalized || '';
};

const inferRules = [
  {
    value: 'Tablets',
    terms: ['ipad', 'galaxy tab', 'tablet', 'tablette', 'xiaomi pad', 'pad 6', 'tab s']
  },
  {
    value: 'Laptops',
    terms: ['macbook', 'thinkpad', 'dell xps', 'hp spectre', 'lenovo yoga', 'asus zenbook', 'rog zephyrus', 'msi stealth', 'acer swift', 'laptop', 'ordinateur', 'pc portable']
  },
  {
    value: 'Audio',
    terms: ['airpods', 'bose', 'sony wh', 'buds', 'headphone', 'headphones', 'casque', 'ecouteurs']
  },
  {
    value: 'Smartphones',
    terms: ['iphone', 'galaxy', 'pixel', 'redmi', 'xiaomi', 'oneplus', 'nothing phone', 'oppo', 'honor', 'huawei', 'poco', 'realme', 'motorola', 'nubia', 'infinix', 'xperia', 'zenfone', 'smartphone', 'phone']
  }
];

export const inferCategoryFromProduct = (product = {}) => {
  const explicit = normalizeCategory(product.categoryName || product.category);
  if (explicit) return explicit;

  const text = normalizeText(`${product.title || ''} ${product.brand || product.brandName || ''}`);
  const match = inferRules.find((rule) => rule.terms.some((term) => text.includes(normalizeText(term))));

  return match?.value || null;
};
