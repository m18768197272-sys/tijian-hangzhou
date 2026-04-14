// 杭州体检网 - 公共函数

// 渲染医院卡片
function renderHospitalCard(h) {
  const pkgCount = h.packages ? h.packages.length : 0;
  const imgSrc = h.image || 'images/' + h.id + '.jpg';
  const isPublic = h.type === 'public';
  const colorClass = isPublic ? 'teal' : 'blue';
  return `
    <div class="hospital-card bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
      <div class="h-32 overflow-hidden bg-slate-100">
        <img src="${imgSrc}" alt="${h.name}" class="w-full h-full object-cover" loading="lazy" onerror="this.style.display='none'">
      </div>
      <div class="p-4">
        <h3 class="font-semibold text-slate-800 truncate text-sm">${h.name}</h3>
        <div class="flex items-center gap-2 mt-1 flex-wrap">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs bg-${colorClass}-100 text-${colorClass}-700">${h.level}</span>
          <span class="text-xs text-slate-400">${pkgCount}个套餐</span>
        </div>
        <div class="text-xs text-slate-500 mt-2 space-y-1">
          <div class="flex items-center gap-1"><span>📍</span><span class="truncate">${h.address || ''}</span></div>
          <div class="flex items-center gap-1"><span>📞</span><span>${h.tel || ''}</span></div>
        </div>
        <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
          <span class="text-xs text-slate-400">点击查看详情</span>
          <span class="text-${colorClass}-600 text-sm font-medium">→</span>
        </div>
      </div>
    </div>
  `;
}

// 渲染套餐卡片
function renderPackageCard(p) {
  const disc = p.originalPrice ? Math.round((1 - p.price/p.originalPrice) * 100) : 0;
  return `
    <div class="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer" onclick="location.href='hospitals/detail-${p.hospitalId}.html'">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">${p.hospitalName}</span>
      </div>
      <h4 class="font-semibold text-slate-800 text-sm mb-2 line-clamp-2">${p.name}</h4>
      <div class="flex items-end justify-between">
        <div>
          <div class="text-teal-600 font-bold text-lg">¥${p.price}</div>
          ${p.originalPrice ? `<div class="text-slate-400 text-xs line-through">¥${p.originalPrice}</div>` : ''}
        </div>
        ${disc > 0 ? `<span class="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">省${disc}%</span>` : ''}
      </div>
      <div class="mt-2 text-xs text-slate-500">${p.items ? p.items.length : 0}项检查</div>
    </div>
  `;
}

// 获取套餐详情
function getPackageById(pkgId) {
  for (const h of HOSPITALS) {
    if (h.packages) {
      const pkg = h.packages.find(p => p.id === pkgId);
      if (pkg) return { ...pkg, hospital: h };
    }
  }
  return null;
}

// 搜索功能
function searchPackages(keyword) {
  keyword = keyword.toLowerCase();
  const results = [];
  for (const h of HOSPITALS) {
    if (h.packages) {
      for (const p of h.packages) {
        if (p.name.toLowerCase().includes(keyword) || 
            h.name.toLowerCase().includes(keyword) ||
            (p.items && p.items.some(i => i.toLowerCase().includes(keyword)))) {
          results.push({ ...p, hospitalName: h.name, hospitalId: h.id });
        }
      }
    }
  }
  return results;
}

// 对比功能
function getCompareList() {
  return JSON.parse(sessionStorage.getItem('comparePkgs') || '[]');
}

function addToCompare(pkgId) {
  const list = getCompareList();
  if (list.includes(pkgId)) {
    alert('该套餐已在对比列表中');
    return false;
  }
  if (list.length >= 4) {
    alert('最多可同时对比4个套餐');
    return false;
  }
  list.push(pkgId);
  sessionStorage.setItem('comparePkgs', JSON.stringify(list));
  return true;
}

function removeFromCompare(pkgId) {
  const list = getCompareList().filter(id => id !== pkgId);
  sessionStorage.setItem('comparePkgs', JSON.stringify(list));
}

function clearCompare() {
  sessionStorage.removeItem('comparePkgs');
}
