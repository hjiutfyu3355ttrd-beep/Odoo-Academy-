/**
 * Achievements & Gamification
 */
const AchievementsData = [
  {id:'first-step',title:{ar:'الخطوة الأولى',en:'First Step'},description:{ar:'أكملت درسك الأول!',en:'You completed your first lesson!'},icon:'🎯',xp:20,condition:s => s.progress.completedLessons.length >= 1},
  {id:'first-quiz',title:{ar:'أول اختبار',en:'First Quiz'},description:{ar:'أكملت أول اختبار!',en:'You completed your first quiz!'},icon:'📝',xp:30,condition:s => Object.keys(s.progress.quizScores).length >= 1},
  {id:'five-lessons',title:{ar:'5 دروس',en:'5 Lessons'},description:{ar:'أكملت 5 دروس',en:'You completed 5 lessons'},icon:'⭐',xp:40,condition:s => s.progress.completedLessons.length >= 5},
  {id:'ten-lessons',title:{ar:'10 دروس',en:'10 Lessons'},description:{ar:'أكملت 10 دروس',en:'You completed 10 lessons'},icon:'🌟',xp:50,condition:s => s.progress.completedLessons.length >= 10},
  {id:'quiz-master',title:{ar:'سيد الاختبارات',en:'Quiz Master'},description:{ar:'أكملت 3 اختبارات',en:'You completed 3 quizzes'},icon:'🏆',xp:50,condition:s => Object.keys(s.progress.quizScores).length >= 3},
  {id:'sales-explorer',title:{ar:'مستكشف المبيعات',en:'Sales Explorer'},description:{ar:'أكملت 5 دروس في المبيعات',en:'Completed 5 sales lessons'},icon:'💼',xp:40,condition:s => s.progress.completedLessons.filter(id => id.startsWith('sales-')).length >= 5},
  {id:'inventory-explorer',title:{ar:'مستكشف المخزون',en:'Inventory Explorer'},description:{ar:'أكملت 5 دروس في المخزون',en:'Completed 5 inventory lessons'},icon:'📦',xp:40,condition:s => s.progress.completedLessons.filter(id => id.startsWith('inventory-')).length >= 5},
  {id:'practice-champion',title:{ar:'بطل التدريب',en:'Practice Champion'},description:{ar:'أكملت مختبر تدريب',en:'You completed a practice lab'},icon:'🔬',xp:50,condition:s => Object.values(s.progress.labs).some(l => l.completed) || (s.progress.simulator.sales && s.progress.simulator.sales.completed) || (s.progress.simulator.inventory && s.progress.simulator.inventory.completed)},
  {id:'xp-500',title:{ar:'500 نقطة',en:'500 XP'},description:{ar:'وصلت إلى 500 نقطة خبرة',en:'You reached 500 XP'},icon:'⚡',xp:0,condition:s => s.user.xp >= 500},
  {id:'odoo-explorer',title:{ar:'مستكشف أودو',en:'Odoo Explorer'},description:{ar:'أكملت مسارًا كاملًا',en:'You completed a full learning path'},icon:'🚀',xp:100,condition:s => s.pathProgress.fundamentals >= 100 || s.pathProgress.sales >= 100 || s.pathProgress.inventory >= 100 || s.pathProgress.purchase >= 100 || s.pathProgress.accounting >= 100},
  {id:'purchase-explorer',title:{ar:'مستكشف المشتريات',en:'Purchase Explorer'},description:{ar:'أكملت 3 دروس في المشتريات',en:'Completed 3 purchase lessons'},icon:'🛒',xp:40,condition:s => s.progress.completedLessons.filter(id => id.startsWith('purchase-')).length >= 3},
  {id:'path-graduate',title:{ar:'خريج مسار',en:'Path Graduate'},description:{ar:'حصلت على شهادة مسار',en:'You earned a path certificate'},icon:'🎓',xp:50,condition:s => Object.keys(s.certificates || {}).length >= 1},
  {id:'full-stack-learner',title:{ar:'متعلم متكامل',en:'Full-Stack Learner'},description:{ar:'أكملت مسارين كاملين',en:'Completed two full paths'},icon:'🏅',xp:80,condition:s => Object.values(s.pathProgress || {}).filter(v => v >= 100).length >= 2},
  {id:'accounting-explorer',title:{ar:'مستكشف المحاسبة',en:'Accounting Explorer'},description:{ar:'أكملت 3 دروس في المحاسبة',en:'Completed 3 accounting lessons'},icon:'📒',xp:40,condition:s => s.progress.completedLessons.filter(id => id.startsWith('accounting-')).length >= 3},
  {id:'purchase-lab',title:{ar:'مختبر المشتريات',en:'Purchase Lab'},description:{ar:'أكملت محاكي المشتريات',en:'Completed the purchase simulator'},icon:'🧾',xp:40,condition:s => !!(s.progress.simulator && s.progress.simulator.purchase && s.progress.simulator.purchase.completed)},
,
  {id:'path-manufacturing',title:{ar:'مُصنّع أودو',en:'Odoo Manufacturer'},description:{ar:'أكملت مسار التصنيع',en:'You completed the Manufacturing path'},icon:'🏭',xp:80,condition:s => (s.pathProgress && s.pathProgress.manufacturing) >= 100},
  {id:'path-hr',title:{ar:'مستكشف الموارد البشرية',en:'HR Explorer'},description:{ar:'أكملت مسار الموارد البشرية',en:'You completed the HR path'},icon:'👥',xp:80,condition:s => (s.pathProgress && s.pathProgress.hr) >= 100}
,
  {id:'path-technical',title:{ar:'مهندس أودو مبتدئ',en:'Junior Odoo Engineer'},description:{ar:'أكملت الأسس التقنية',en:'Completed Technical Foundations'},icon:'⚙️',xp:100,condition:s => (s.pathProgress && s.pathProgress.technical) >= 100}
,
  {id:'path-pos',title:{ar:'كاشير أودو',en:'Odoo Cashier'},description:{ar:'أكمل مسار نقاط البيع',en:'Completed POS path'},icon:'🧾',xp:60,condition:s => (s.pathProgress&&s.pathProgress.pos)>=100},
  {id:'path-project',title:{ar:'مدير مهام',en:'Task Manager'},description:{ar:'أكمل مسار المشاريع',en:'Completed Projects path'},icon:'📋',xp:60,condition:s => (s.pathProgress&&s.pathProgress.project)>=100},
  {id:'lab-starter',title:{ar:'مختبر أول',en:'First Lab'},description:{ar:'أكملت مختبراً عملياً',en:'Completed a hands-on lab'},icon:'🔬',xp:40,condition:s => (s.progress.completedLessons || []).some(id => String(id).indexOf('lab-') === 0)},
  {id:'path-integrations',title:{ar:'رابط الأنظمة',en:'Systems Linker'},description:{ar:'أكمل مسار التكاملات',en:'Completed Integrations path'},icon:'🔗',xp:60,condition:s => (s.pathProgress&&s.pathProgress.integrations)>=100},
];
