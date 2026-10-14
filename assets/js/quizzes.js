/**
 * Quiz Data
 */
const QuizzesData = {
  'quiz-fundamentals': {
    id: 'quiz-fundamentals',
    title: { ar: 'اختبار أساسيات أودو', en: 'Odoo Fundamentals Quiz' },
    xp: 50,
    questions: [
      {type:'multiple-choice',question:{ar:'شاشة Apps تعكس فكرة ERP لأنها تجمع؟',en:'The Apps screen reflects ERP because it gathers?'},options:{ar:['نظام بريد','Enterprise Resource Planning','برنامج تصميم','نظام ألعاب'],en:['Email system','Enterprise Resource Planning','Design software','Game system']},answer:1,explanation:{ar:'ERP = نظام تخطيط موارد المؤسسة.',en:'ERP = Enterprise Resource Planning.'}},
      {type:'multiple-choice',question:{ar:'بعد تثبيت تطبيق، أين تراه على الشاشة الرئيسية؟',en:'After installing an app, where do you see it on the home screen?'},options:{ar:['الإعدادات','الشاشة الرئيسية','التقارير','البريد'],en:['Settings','Home screen','Reports','Mail']},answer:1,explanation:{ar:'على الشاشة الرئيسية كأيقونات.',en:'On the Home screen as icons.'}},
      {type:'true-false',question:{ar:'من شاشة Apps: عند تثبيت تطبيق يثبت أودو التبعيات تلقائياً.',en:'From the Apps screen: when installing an app Odoo installs dependencies automatically.'},answer:true,explanation:{ar:'نعم، التبعيات تُثبت تلقائيًا.',en:'Yes, dependencies are installed automatically.'}},
      {type:'multiple-choice',question:{ar:'من تبويب Access Rights على المستخدم، تُنظم الصلاحيات عبر؟',en:'From the user Access Rights tab, permissions are organized via?'},options:{ar:['يدويًا فقط','عبر Groups','لا توجد','حسب الوقت'],en:['Manually only','Through Groups','None exist','By time']},answer:1,explanation:{ar:'عبر مجموعات الصلاحيات.',en:'Through access groups.'}},
      {type:'multiple-choice',question:{ar:'لمتابعة مراحل الفرص يومياً على الشاشة أي عرض؟',en:'Which on-screen view for daily opportunity stages?'},options:{ar:['List','Kanban','Form فقط','لا يوجد'],en:['List','Kanban','Form only','None']},answer:1,explanation:{ar:'Kanban يعرض المراحل كأعمدة.',en:'Kanban shows stages as columns.'}},
      {type:'true-false',question:{ar:'على شاشة Form يمكن المغادرة بدون Save دون فقدان التعديلات.',en:'On the Form screen you can leave without Save without losing edits.'},answer:false,explanation:{ar:'التغييرات غير المحفوظة تُفقد.',en:'Unsaved changes are lost.'}},
      {type:'multiple-choice',question:{ar:'على شاشة القائمة، Favorites تُستخدم لـ؟',en:'On the list screen, Favorites are used to?'},options:{ar:['حذف','حفظ عمليات البحث','تغيير الثيم','إنشاء مستخدم'],en:['Delete','Save searches','Change theme','Create user']},answer:1,explanation:{ar:'لحفظ الفلاتر والبحث المتكرر.',en:'To save frequently used filters and searches.'}},
      {type:'multiple-choice',question:{ar:'بيانات الشركة تُضبط عادة من شاشة؟',en:'Company data is usually configured from the?'},options:{ar:['المبيعات','Settings','المخزون','CRM'],en:['Sales','Settings','Inventory','CRM']},answer:1,explanation:{ar:'في قائمة Settings.',en:'In the Settings menu.'}}
    ]
  },
  'quiz-sales': {
    id: 'quiz-sales',
    title: { ar: 'تحدي المبيعات', en: 'Sales Challenge' },
    xp: 80,
    questions: [
      {type:'multiple-choice',question:{ar:'على شاشات CRM: Lead غير مؤهل بينما Opportunity؟',en:'On CRM screens: a Lead is unqualified while an Opportunity is?'},options:{ar:['لا فرق','Lead غير مؤهل، Opportunity مؤهلة','Opportunity أولاً','Lead للفواتير'],en:['No difference','Lead unqualified, Opportunity qualified','Opportunity first','Lead for invoices']},answer:1,explanation:{ar:'Lead غير مؤهل. Opportunity مؤهلة.',en:'Lead is unqualified. Opportunity is qualified.'}},
      {type:'multiple-choice',question:{ar:'شاشة Quotation قبل Confirm تهدف إلى؟',en:'The Quotation screen before Confirm aims to?'},options:{ar:['إنشاء موظف','عرض سعر قبل تأكيد البيع','تعديل مخزون','إنشاء مستودع'],en:['Create employee','Price offer before confirming sale','Adjust stock','Create warehouse']},answer:1,explanation:{ar:'تقديم عرض للعميل قبل التأكيد.',en:'Present an offer before confirmation.'}},
      {type:'true-false',question:{ar:'من شاشة Quotation: Confirm يحوّل الحالة إلى Sales Order.',en:'From the Quotation screen: Confirm changes status to Sales Order.'},answer:true,explanation:{ar:'نعم، يصبح أمر بيع.',en:'Yes, it becomes a Sales Order.'}},
      {type:'multiple-choice',question:{ar:'في حقل Customer على شاشة العرض، السجل المختار هو؟',en:'In the Customer field on the quotation screen, the selected record is a?'},options:{ar:['User','Partner','Product','Lead'],en:['User','Partner','Product','Lead']},answer:1,explanation:{ar:'Partner.',en:'Partner.'}},
      {type:'multiple-choice',question:{ar:'على بطاقة المنتج، أي Type يجعل On Hand يتحرك مع Validate؟',en:'On the product form, which Type makes On Hand move with Validate?'},options:{ar:['Service','Storable','لا يوجد','Consumable فقط'],en:['Service','Storable','None','Consumable only']},answer:1,explanation:{ar:'Storable.',en:'Storable.'}},
      {type:'multiple-choice',question:{ar:'على شاشة الفاتورة، ما تسلسل الحالات؟',en:'On the invoice screen, what is the status sequence?'},options:{ar:['Open','Draft → Posted → Paid','New','لا حالات'],en:['Open','Draft → Posted → Paid','New','No statuses']},answer:1,explanation:{ar:'Draft ثم Posted ثم Paid.',en:'Draft then Posted then Paid.'}},
      {type:'true-false',question:{ar:'من شاشة Sales Order يمكن Create Invoice لكميات جزئية.',en:'From the Sales Order screen you can Create Invoice for partial quantities.'},answer:true,explanation:{ar:'نعم عند تسليم جزء فقط.',en:'Yes when only part is delivered.'}},
      {type:'multiple-choice',question:{ar:'فائدة Pipeline؟',en:'Benefit of Pipeline?'},options:{ar:['فواتير فقط','رؤية الفرص حسب المرحلة','مخزون','رواتب'],en:['Invoices only','See opportunities by stage','Inventory','Payroll']},answer:1,explanation:{ar:'رؤية وتحليل الفرص حسب المرحلة.',en:'View and analyze opportunities by stage.'}}
    ]
  },
  'quiz-inventory': {
    id: 'quiz-inventory',
    title: { ar: 'تحدي المخزون', en: 'Inventory Challenge' },
    xp: 80,
    questions: [
      {type:'multiple-choice',question:{ar:'أي شاشة بعد Validate تزيد On Hand؟',en:'Which screen after Validate increases On Hand?'},options:{ar:['Delivery','Receipt','Sales Order','Invoice'],en:['Delivery','Receipt','Sales Order','Invoice']},answer:1,explanation:{ar:'Receipt يزيد الكمية.',en:'Receipt increases quantity.'}},
      {type:'multiple-choice',question:{ar:'على شاشات المخزون، الموقع/المستودع الشائع؟',en:'On inventory screens, the common warehouse/location is?'},options:{ar:['WH/Output','WH/Stock','Customers','Vendors'],en:['WH/Output','WH/Stock','Customers','Vendors']},answer:1,explanation:{ar:'WH/Stock.',en:'WH/Stock.'}},
      {type:'true-false',question:{ar:'شاشة Internal Transfer تغيّر ملكية المنتج لجهة خارجية.',en:'The Internal Transfer screen changes product ownership to an external party.'},answer:false,explanation:{ar:'ينقل الموقع فقط.',en:'It only moves the location.'}},
      {type:'multiple-choice',question:{ar:'على بطاقة المنتج، Available تقريباً؟',en:'On the product form, Available is roughly?'},options:{ar:['On Hand فقط','On Hand − Reserved','Reserved','السعر'],en:['On Hand only','On Hand − Reserved','Reserved','Price']},answer:1,explanation:{ar:'المتاح = الموجود − المحجوز.',en:'Available = On Hand − Reserved.'}},
      {type:'multiple-choice',question:{ar:'بعد Validate على شاشة Delivery ماذا يحدث لـ On Hand؟',en:'After Validate on the Delivery screen, what happens to On Hand?'},options:{ar:['تزداد الكمية','تنخفض الكمية','لا تتغير','تُصفَّر'],en:['Quantity increases','Quantity decreases','No change','Becomes zero']},answer:1,explanation:{ar:'تنخفض الكمية.',en:'Quantity decreases.'}},
      {type:'multiple-choice',question:{ar:'تفتح عملية/شاشة Adjustment عندما؟',en:'You open an Adjustment operation/screen when?'},options:{ar:['البيع فقط','تصحيح الفرق النظامي والفعلي','إنشاء عميل','بريد'],en:['Selling only','Correct system vs physical difference','Create customer','Email']},answer:1,explanation:{ar:'بعد الجرد لمطابقة الكميات.',en:'After counting to match quantities.'}},
      {type:'true-false',question:{ar:'عند انخفاض On Hand تحت Min على المنتج، قاعدة إعادة الطلب تقترح التجديد.',en:'When On Hand falls below Min on the product, a reordering rule suggests replenishment.'},answer:true,explanation:{ar:'نعم تلقائيًا.',en:'Yes automatically.'}},
      {type:'multiple-choice',question:{ar:'من إعدادات المخزون، المستودع يحتوي عادة على؟',en:'From inventory settings, a warehouse usually contains?'},options:{ar:['موظفين','مواقع فرعية للمنتجات','فواتير','عملاء فقط'],en:['Employees','Sub-locations for products','Invoices','Customers only']},answer:1,explanation:{ar:'مواقع مثل Stock و Input.',en:'Locations such as Stock and Input.'}}
    ]
  },
  'quiz-purchase': {
    id: 'quiz-purchase',
    title: { ar: 'تحدي المشتريات', en: 'Purchase Challenge' },
    xp: 60,
    questions: [
      {type:'multiple-choice',question:{ar:'ترتيب الشاشات في الشراء؟',en:'Screen order in purchasing?'},options:{ar:['فاتورة → RFQ','RFQ → PO → استلام → فاتورة مورد','بيع فقط','مخزون فقط'],en:['Bill → RFQ','RFQ → PO → Receipt → Vendor Bill','Sales only','Inventory only']},answer:1,explanation:{ar:'RFQ ثم أمر الشراء ثم الاستلام ثم فاتورة المورد.',en:'RFQ then PO then receipt then vendor bill.'}},
      {type:'multiple-choice',question:{ar:'حقل Vendor على شاشة RFQ يشير إلى؟',en:'The Vendor field on the RFQ screen refers to a?'},options:{ar:['منتج','Partner مع خيار Vendor','مستودع','فاتورة'],en:['Product','Partner with Vendor option','Warehouse','Invoice']},answer:1,explanation:{ar:'Partner مرن.',en:'A flexible Partner.'}},
      {type:'true-false',question:{ar:'Confirm على RFQ يحوّله إلى Purchase Order.',en:'Confirm on RFQ turns it into a Purchase Order.'},answer:true,explanation:{ar:'نعم.',en:'Yes.'}},
      {type:'multiple-choice',question:{ar:'ماذا عند Validate لاستلام من أمر شراء؟',en:'What on Validate receipt from PO?'},options:{ar:['تنقص On Hand','تزداد On Hand','حذف المنتج','لا شيء'],en:['On Hand decreases','On Hand increases','Delete product','Nothing']},answer:1,explanation:{ar:'الاستلام يزيد المخزون.',en:'Receipt increases stock.'}},
      {type:'multiple-choice',question:{ar:'أفضل شاشة لبدء فاتورة المورد؟',en:'Best screen to start a vendor bill?'},options:{ar:['من الصفر','من أمر الشراء Create Bill','من المبيعات','حذف'],en:['From scratch','From PO Create Bill','From Sales','Delete']},answer:1,explanation:{ar:'من أمر الشراء يحافظ على الربط.',en:'From the PO keeps the link.'}},
      {type:'true-false',question:{ar:'على شاشة Receipt يمكن وضع كمية في Done أقل من Demand (استلام جزئي).',en:'On the Receipt screen you can put Done qty less than Demand (partial receipt).'},answer:true,explanation:{ar:'نعم إذا وصلت كمية أقل.',en:'Yes if less quantity arrived.'}}
    ]
  },
  'quiz-accounting': {
    id: 'quiz-accounting',
    title: { ar: 'تحدي المحاسبة', en: 'Accounting Challenge' },
    xp: 50,
    questions: [
      {type:'multiple-choice',question:{ar:'على شاشة فاتورة العميل، الحالات الرئيسية؟',en:'On the customer invoice screen, main statuses are?'},options:{ar:['Open','Draft → Posted → Paid','New','لا'],en:['Open','Draft → Posted → Paid','New','None']},answer:1,explanation:{ar:'Draft ثم Posted ثم Paid.',en:'Draft then Posted then Paid.'}},
      {type:'multiple-choice',question:{ar:'Create Invoice يظهر عادة على أي شاشة؟',en:'Create Invoice usually appears on which screen?'},options:{ar:['من الصفر','من أمر البيع','المخزون','CRM'],en:['From scratch','From sales order','Inventory','CRM']},answer:1,explanation:{ar:'من أمر البيع.',en:'From the sales order.'}},
      {type:'true-false',question:{ar:'من شاشة الفاتورة: Register Payment يمكن بمبلغ جزئي.',en:'From the invoice screen: Register Payment can be a partial amount.'},answer:true,explanation:{ar:'نعم حتى تكتمل.',en:'Yes until complete.'}},
      {type:'multiple-choice',question:{ar:'حالة Paid على شاشة الفاتورة تعني؟',en:'Paid status on the invoice screen means?'},options:{ar:['عند المسودة','عند اكتمال الدفع','عند الحذف','عند الاستلام فقط'],en:['On draft','When payment is complete','On delete','On receipt only']},answer:1,explanation:{ar:'بعد اكتمال الدفع.',en:'After payment is complete.'}},
      {type:'multiple-choice',question:{ar:'تُعرَّف الضرائب عادة من شاشة Configuration أو بطاقة المنتج؟',en:'Taxes are usually defined from Configuration screens or the product form?'},options:{ar:['CRM','Configuration → Taxes أو المنتج','المستودع','لا'],en:['CRM','Configuration → Taxes or product','Warehouse','Nowhere']},answer:1,explanation:{ar:'الإعدادات أو المنتج.',en:'Settings or product.'}}
    ]
  }

  ,
  'quiz-manufacturing': {
    id: 'quiz-manufacturing',
    title: { ar: 'اختبار التصنيع', en: 'Manufacturing Quiz' },
    xp: 50,
    questions: [
      {type:'multiple-choice',question:{ar:'ما الترتيب الصحيح على الشاشات في التصنيع؟',en:'Correct on-screen manufacturing order?'},options:{ar:['فاتورة → BOM','BOM → أمر تصنيع → Done → On Hand','CRM فقط','بيع → شراء'],en:['Invoice → BOM','BOM → MO → Done → On Hand','CRM only','Sale → Purchase']},answer:1,explanation:{ar:'قائمة المواد ثم الأمر ثم الإتمام.',en:'BOM then order then completion.'}},
      {type:'multiple-choice',question:{ar:'شاشة BOM تحتوي أساساً؟',en:'BOM screen mainly contains?'},options:{ar:['موظفين','منتج نهائي + مكونات','فواتير','فرص'],en:['Employees','Finished product + components','Invoices','Opportunities']},answer:1,explanation:{ar:'وصفة المنتج ومكوناته.',en:'Product recipe and components.'}},
      {type:'true-false',question:{ar:'بعد إتمام MO تنقص المكونات ويزيد المنتج النهائي في On Hand.',en:'After completing an MO, components decrease and finished product On Hand increases.'},options:{ar:['صح','خطأ'],en:['True','False']},answer:0,explanation:{ar:'استهلاك وإنتاج.',en:'Consume and produce.'}},
      {type:'multiple-choice',question:{ar:'قبل Confirm لكميات كبيرة راجع؟',en:'Before Confirm for large quantities review?'},options:{ar:['CRM','On Hand للمكونات','الإجازات','الضريبة فقط'],en:['CRM','Component On Hand','Time off','Tax only']},answer:1,explanation:{ar:'توفر المواد على الشاشة.',en:'Material availability on screen.'}},
      {type:'true-false',question:{ar:'يمكن Mark as Done دون BOM دائماً بلا مشاكل.',en:'You can always Mark as Done without a BOM with no issues.'},options:{ar:['صح','خطأ'],en:['True','False']},answer:1,explanation:{ar:'BOM أساس المكونات.',en:'BOM is the basis for components.'}}
    ]
  },
  'quiz-hr': {
    id: 'quiz-hr',
    title: { ar: 'اختبار الموارد البشرية', en: 'HR Quiz' },
    xp: 50,
    questions: [
      {type:'multiple-choice',question:{ar:'الشاشة المركزية في HR؟',en:'Central screen in HR?'},options:{ar:['RFQ','بطاقة الموظف','BOM','فاتورة'],en:['RFQ','Employee form','BOM','Invoice']},answer:1,explanation:{ar:'مرجع الحضور والإجازات.',en:'Reference for attendance and time off.'}},
      {type:'multiple-choice',question:{ar:'شاشة Attendances لتسجيل؟',en:'Attendances screen records?'},options:{ar:['البيع','الحضور والانصراف','التصنيع','الشراء'],en:['Sales','Check-in and check-out','Manufacturing','Purchase']},answer:1,explanation:{ar:'دخول وخروج.',en:'In and out.'}},
      {type:'true-false',question:{ar:'الموافقة الشفهية على الإجازة دون Approve على الشاشة خطأ شائع.',en:'Verbal time-off approval without Approve on screen is a common mistake.'},options:{ar:['صح','خطأ'],en:['True','False']},answer:0,explanation:{ar:'يجب التسجيل على الشاشة.',en:'Must record on screen.'}},
      {type:'multiple-choice',question:{ar:'Department على بطاقة الموظف يفيد في؟',en:'Department on employee form helps with?'},options:{ar:['التصنيع فقط','التنظيم والتقارير','الفواتير فقط','لا شيء'],en:['Manufacturing only','Organization and reports','Invoices only','Nothing']},answer:1,explanation:{ar:'هيكل وتصفية.',en:'Structure and filtering.'}},
      {type:'multiple-choice',question:{ar:'بعد Submit لطلب إجازة الحالة الشائعة؟',en:'After Submit of time off, common status?'},options:{ar:['Paid','To Approve','Done BOM','RFQ'],en:['Paid','To Approve','Done BOM','RFQ']},answer:1,explanation:{ar:'بانتظار المدير.',en:'Waiting for manager.'}}
    ]
  }


  ,
  'quiz-technical': {
    id: 'quiz-technical',
    title: { ar: 'اختبار الأسس التقنية', en: 'Technical Foundations Quiz' },
    xp: 50,
    questions: [
      {type:'multiple-choice',question:{ar:'سلسلة فتح شاشة قائمة؟',en:'Chain to open a list screen?'},options:{ar:['View فقط','Menu → Action → Model → View','User → Tax','BOM → MO'],en:['View only','Menu → Action → Model → View','User → Tax','BOM → MO']},answer:1,explanation:{ar:'القائمة تستدعي إجراءً على نموذج.',en:'Menu calls action on model.'}},
      {type:'multiple-choice',question:{ar:'جدول بنود الأمر عادة؟',en:'Order lines table is usually?'},options:{ar:['Many2one','One2many','Binary','HTML'],en:['Many2one','One2many','Binary','HTML']},answer:1,explanation:{ar:'One2many.',en:'One2many.'}},
      {type:'true-false',question:{ar:'يُفضَّل وراثة View بدل نسخ الملف الأصلي.',en:'View inheritance is preferred over copying the original file.'},options:{ar:['صح','خطأ'],en:['True','False']},answer:0,explanation:{ar:'الترقية والصيانة.',en:'Upgrades and maintenance.'}},
      {type:'multiple-choice',question:{ar:'اختبار الصلاحيات الصحيح؟',en:'Correct rights test?'},options:{ar:['Admin فقط','دخول بمستخدم الدور','تعطيل الأمن','حذف القواعد'],en:['Admin only','Login as role user','Disable security','Delete rules']},answer:1,explanation:{ar:'Admin لا يكشف القيود.',en:'Admin hides restrictions.'}},
      {type:'multiple-choice',question:{ar:'ir.model.access يتحكم في؟',en:'ir.model.access controls?'},options:{ar:['ألوان الثيم','Read/Write/Create/Unlink على Model','الخطوط','الصور'],en:['Theme colors','Read/Write/Create/Unlink on Model','Fonts','Images']},answer:1,explanation:{ar:'ACL على النموذج.',en:'ACL on the model.'}}
    ]
  }

};
