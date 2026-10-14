/**
 * Odoo Simulator - Sales & Inventory
 */
const Simulator = {
  state: {
    currentModule: null,
    currentView: 'list',
    selectedCustomer: null,
    selectedProduct: null,
    quantity: 1,
    unitPrice: 3000,
    orderCreated: false,
    orderConfirmed: false,
    warehouse: 'Main Warehouse',
    receiptQty: 10,
    receiptValidated: false,
    posCart: [],
    posPaid: false,
    posSessionOpen: false,
    posTotal: 0,
    posMissionComplete: false,
    selectedVendor: null,
    rfqCreated: false,
    rfqConfirmed: false,
    purchaseQty: 5,
    mfgProduct: null,
    mfgQty: 1,
    mfgBomReady: false,
    mfgMoCreated: false,
    mfgMoConfirmed: false,
    mfgDone: false
  },

  customers: [
    { id: 'c1', name: 'ABC Company' },
    { id: 'c2', name: 'Tech Solutions' },
    { id: 'c3', name: 'Global Trade' }
  ],

  products: [
    { id: 'p1', name: 'Laptop', price: 3000 },
    { id: 'p2', name: 'Mouse', price: 50 },
    { id: 'p3', name: 'Keyboard', price: 120 }
  ],

  warehouses: ['Main Warehouse', 'Secondary Warehouse'],

  vendors: [
    { id: 'v1', name: 'ABC Supplier' },
    { id: 'v2', name: 'Global Parts' },
    { id: 'v3', name: 'Tech Distributors' }
  ],

  reset() {
    this.state.posCart = [];
    this.state.posPaid = false;
    this.state.posSessionOpen = false;
    this.state.posTotal = 0;
    this.state = {
      currentModule: null,
      currentView: 'list',
      selectedCustomer: null,
      selectedProduct: null,
      quantity: 1,
      unitPrice: 3000,
      orderCreated: false,
      orderConfirmed: false,
      warehouse: 'Main Warehouse',
      receiptQty: 10,
      receiptValidated: false,
    posCart: [],
    posPaid: false,
    posSessionOpen: false,
    posTotal: 0,
    posMissionComplete: false,
      selectedVendor: null,
      rfqCreated: false,
      rfqConfirmed: false,
      purchaseQty: 5,
      mfgProduct: null,
      mfgQty: 1,
      mfgBomReady: false,
      mfgMoCreated: false,
      mfgMoConfirmed: false,
      mfgDone: false
    };
  },

  setModule(mod) {
    this.state.currentModule = mod;
    this.state.currentView = 'list';
  },

  selectCustomer(id) {
    this.state.selectedCustomer = this.customers.find(c => c.id === id) || null;
  },

  selectProduct(id) {
    const p = this.products.find(pr => pr.id === id);
    this.state.selectedProduct = p || null;
    if (p) this.state.unitPrice = p.price;
  },

  setQuantity(q) {
    this.state.quantity = Math.max(1, parseInt(q, 10) || 1);
  },

  setReceiptQty(q) {
    this.state.receiptQty = Math.max(1, parseInt(q, 10) || 1);
  },

  setWarehouse(w) {
    this.state.warehouse = w;
  },

  saveOrder() {
    if (!this.state.selectedCustomer || !this.state.selectedProduct) return false;
    this.state.orderCreated = true;
    return true;
  },

  confirmOrder() {
    if (!this.state.orderCreated) return false;
    this.state.orderConfirmed = true;
    return true;
  },

  validateReceipt() {
    if (!this.state.selectedProduct || this.state.receiptQty < 1) return false;
    this.state.receiptValidated = true;
    return true;
  },

  validateSalesChallenge() {
    const s = this.state;
    const errors = [];
    if (!s.selectedCustomer || s.selectedCustomer.name !== 'ABC Company') {
      errors.push({ ar: 'على شاشة العرض: حقل Customer يجب أن يكون ABC Company (اختر من القائمة لا تكتب نصاً حراً).', en: 'On the quotation screen: Customer field must be ABC Company (pick from the list, do not type free text).' });
    }
    if (!s.selectedProduct || s.selectedProduct.name !== 'Laptop') {
      errors.push({ ar: 'في جدول البنود: اختر المنتج Laptop كما في Order Lines على شاشة Quotation.', en: 'In the lines table: select product Laptop as on the Quotation Order Lines.' });
    }
    if (s.quantity !== 3) {
      errors.push({ ar: 'عمود Quantity في البنود يجب أن يساوي 3 (راجع الكمية على الشاشة قبل الحفظ).', en: 'Quantity column on the lines must equal 3 (check quantity on screen before saving).' });
    }
    if (!s.orderCreated) {
      errors.push({ ar: 'اضغط Save أولاً — في أودو لا يمكن Confirm لمسودة غير محفوظة.', en: 'Click Save first — in Odoo you cannot Confirm an unsaved draft.' });
    }
    if (!s.orderConfirmed) {
      errors.push({ ar: 'اضغط Confirm ليتحول العرض إلى Sales Order (تتغير الحالة على الشاشة).', en: 'Click Confirm so the quotation becomes a Sales Order (status changes on screen).' });
    }
    return { valid: errors.length === 0, errors };
  },

  validateInventoryChallenge() {
    const s = this.state;
    const errors = [];
    if (!s.selectedProduct || s.selectedProduct.name !== 'Laptop') {
      errors.push({ ar: 'على شاشة Receipt: اختر المنتج Laptop في سطر العملية (مثل Order Lines).', en: 'On the Receipt screen: select product Laptop on the operation line (like Order Lines).' });
    }
    if (s.receiptQty !== 10) {
      errors.push({ ar: 'ضع 10 في عمود Done (الكمية الفعلية المستلمة) وليس فقط في Demand.', en: 'Put 10 in the Done column (actual received qty), not only in Demand.' });
    }
    if (s.warehouse !== 'Main Warehouse') {
      errors.push({ ar: 'تحقق من المستودع/الموقع على رأس شاشة الاستلام: Main Warehouse.', en: 'Check warehouse/location on the receipt header: Main Warehouse.' });
    }
    if (!s.receiptValidated) {
      errors.push({ ar: 'اضغط Validate — بعدها تصبح الحالة Done ويزداد On Hand على بطاقة المنتج.', en: 'Click Validate — then status becomes Done and On Hand increases on the product form.' });
    }
    return { valid: errors.length === 0, errors };
  },

  selectVendor(id) {
    this.state.selectedVendor = this.vendors.find(v => v.id === id) || null;
  },

  setPurchaseQty(q) {
    this.state.purchaseQty = Math.max(1, parseInt(q, 10) || 1);
  },

  saveRfq() {
    if (!this.state.selectedVendor || !this.state.selectedProduct) return false;
    this.state.rfqCreated = true;
    return true;
  },

  confirmRfq() {
    if (!this.state.rfqCreated) return false;
    this.state.rfqConfirmed = true;
    return true;
  },

  validatePurchaseChallenge() {
    const s = this.state;
    const errors = [];
    if (!s.selectedVendor || s.selectedVendor.name !== 'ABC Supplier') {
      errors.push({ ar: 'على شاشة RFQ: حقل Vendor = ABC Supplier (Partner من القائمة المنسدلة).', en: 'On the RFQ screen: Vendor field = ABC Supplier (Partner from the dropdown).' });
    }
    if (!s.selectedProduct || s.selectedProduct.name !== 'Laptop') {
      errors.push({ ar: 'في بنود RFQ اختر المنتج Laptop كما في Order Lines.', en: 'On RFQ lines select product Laptop as in Order Lines.' });
    }
    if (s.purchaseQty !== 5) {
      errors.push({ ar: 'Quantity في سطر المنتج يجب أن تكون 5 — راجع العمود على الشاشة.', en: 'Quantity on the product line must be 5 — check the column on screen.' });
    }
    if (!s.rfqCreated) {
      errors.push({ ar: 'احفظ RFQ أولاً (Save) قبل Confirm — نفس سلوك أودو الحقيقي.', en: 'Save the RFQ first before Confirm — same behavior as real Odoo.' });
    }
    if (!s.rfqConfirmed) {
      errors.push({ ar: 'اضغط Confirm Order لتتحول الحالة من RFQ إلى Purchase Order على الشاشة.', en: 'Click Confirm Order so status changes from RFQ to Purchase Order on screen.' });
    }
    return { valid: errors.length === 0, errors };
  },

  openPosSession() {
    this.state.posSessionOpen = true;
    this.state.posCart = [];
    this.state.posPaid = false;
    this.state.posTotal = 0;
    this.state.posMissionComplete = false;
  },
  addPosProduct(id) {
    if (!this.state.posSessionOpen || this.state.posPaid) return;
    const p = this.products.find(x => x.id === id);
    if (!p) return;
    const line = this.state.posCart.find(l => l.id === id);
    if (line) line.qty += 1;
    else this.state.posCart.push({ id: p.id, name: p.name, price: p.price, qty: 1 });
    this.state.posTotal = this.state.posCart.reduce((s, l) => s + l.price * l.qty, 0);
  },
  payPos() {
    if (!this.state.posSessionOpen || !this.state.posCart.length) return false;
    this.state.posPaid = true;
    return true;
  },
  closePosSession() {
    if (!this.state.posPaid && this.state.posCart.length) return false;
    if (this.state.posPaid) this.state.posMissionComplete = true;
    this.state.posSessionOpen = false;
    this.state.posCart = [];
    this.state.posTotal = 0;
    this.state.posPaid = false;
    return true;
  },

  // Manufacturing: BOM → MO → Confirm → Mark as Done
  selectMfgProduct(id) {
    const p = this.products.find(x => x.id === id);
    this.state.mfgProduct = p || null;
  },
  setMfgQty(q) {
    this.state.mfgQty = Math.max(1, parseInt(q, 10) || 1);
  },
  saveBom() {
    if (!this.state.mfgProduct) return false;
    this.state.mfgBomReady = true;
    return true;
  },
  createMo() {
    if (!this.state.mfgBomReady) return false;
    this.state.mfgMoCreated = true;
    return true;
  },
  confirmMo() {
    if (!this.state.mfgMoCreated) return false;
    this.state.mfgMoConfirmed = true;
    return true;
  },
  markMoDone() {
    if (!this.state.mfgMoConfirmed) return false;
    this.state.mfgDone = true;
    return true;
  },
  validateManufacturingChallenge() {
    const s = this.state;
    const errors = [];
    if (!s.mfgProduct || s.mfgProduct.name !== 'Laptop') {
      errors.push({ ar: 'على شاشة BOM / MO: المنتج النهائي يجب أن يكون Laptop (Finished Product).', en: 'On BOM/MO screen: finished product must be Laptop.' });
    }
    if (s.mfgQty !== 2) {
      errors.push({ ar: 'الكمية على أمر التصنيع يجب أن تكون 2 — راجع Quantity على رأس الشاشة.', en: 'Quantity on the Manufacturing Order must be 2 — check header Quantity.' });
    }
    if (!s.mfgBomReady) {
      errors.push({ ar: 'احفظ BOM أولاً (مكونات المنتج) قبل إنشاء أمر التصنيع — كما في أودو.', en: 'Save the BOM first (components) before creating the MO — as in Odoo.' });
    }
    if (!s.mfgMoCreated) {
      errors.push({ ar: 'أنشئ Manufacturing Order من المنتج/BOM (New على قائمة MO).', en: 'Create a Manufacturing Order from the product/BOM (New on MO list).' });
    }
    if (!s.mfgMoConfirmed) {
      errors.push({ ar: 'اضغط Confirm على أمر التصنيع لتثبيت المكونات والحالة Confirmed.', en: 'Click Confirm on the MO to lock components and set Confirmed.' });
    }
    if (!s.mfgDone) {
      errors.push({ ar: 'اضغط Mark as Done — بعدها يزداد On Hand للمنتج النهائي وتنقص المكونات.', en: 'Click Mark as Done — then finished-product On Hand rises and components decrease.' });
    }
    return { valid: errors.length === 0, errors };
  },

  validatePosChallenge() {
    const s = this.state;
    if (s.posMissionComplete) return { valid: true, errors: [] };
    const errors = [];
    if (!s.posSessionOpen && !s.posPaid) {
      errors.push({ ar: 'افتح جلسة POS أولاً (Open Session) كما على شاشة نقطة البيع.', en: 'Open a POS session first (Open Session) as on the Point of Sale screen.' });
    }
    if (s.posSessionOpen && s.posCart.length === 0) {
      errors.push({ ar: 'أضف منتجاً واحداً على الأقل إلى العربة من كتالوج POS.', en: 'Add at least one product to the cart from the POS catalog.' });
    }
    if (s.posCart.length > 0 && !s.posPaid) {
      errors.push({ ar: 'اضغط Pay بعد إضافة المنتجات — قبل إغلاق الجلسة.', en: 'Click Pay after adding products — before closing the session.' });
    }
    if (s.posPaid && s.posSessionOpen) {
      errors.push({ ar: 'أغلق الجلسة (Close Session) بعد الدفع لإكمال المسار على الشاشة.', en: 'Close Session after payment to complete the on-screen flow.' });
    }
    if (!errors.length) {
      errors.push({ ar: 'أكمل: فتح جلسة → منتج → دفع → إغلاق.', en: 'Complete: open session → product → pay → close.' });
    }
    return { valid: false, errors };
  },
};
