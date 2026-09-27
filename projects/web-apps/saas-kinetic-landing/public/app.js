document.addEventListener('DOMContentLoaded', () => {
  const sliderViews = document.getElementById('sliderViews');
  const sliderPrice = document.getElementById('sliderPrice');
  const viewsValDisplay = document.getElementById('viewsValDisplay');
  const priceValDisplay = document.getElementById('priceValDisplay');
  const resRevenue = document.getElementById('resRevenue');
  const resVisitors = document.getElementById('resVisitors');
  const resTime = document.getElementById('resTime');
  const pricingCardsGrid = document.getElementById('pricingCardsGrid');
  const btnMonthly = document.getElementById('btnMonthly');
  const btnYearly = document.getElementById('btnYearly');
  const toast = document.getElementById('toast');

  let isYearly = false;
  let plansData = [];

  function showToast(msg) {
    toast.textContent = msg;
    toast.hidden = false;
    setTimeout(() => { toast.hidden = true; }, 3000);
  }

  // Update ROI Calculation
  function updateRoi() {
    const views = parseInt(sliderViews.value, 10);
    const price = parseInt(sliderPrice.value, 10);

    viewsValDisplay.textContent = views.toLocaleString('fr-FR') + ' vues';
    priceValDisplay.textContent = price + ' €';

    const visitors = Math.floor(views * 0.05); // 5% click bio link
    const buyers = Math.floor(visitors * 0.02); // 2% conversion
    const revenue = buyers * price;

    resVisitors.textContent = visitors.toLocaleString('fr-FR');
    resRevenue.textContent = revenue.toLocaleString('fr-FR') + ' €';
    resTime.textContent = Math.min(80, Math.floor(25 + (views / 100000) * 4)) + ' heures';
  }

  sliderViews.addEventListener('input', updateRoi);
  sliderPrice.addEventListener('input', updateRoi);

  // Billing Toggle
  btnMonthly.addEventListener('click', () => {
    btnMonthly.classList.add('active');
    btnYearly.classList.remove('active');
    isYearly = false;
    renderPricing();
  });

  btnYearly.addEventListener('click', () => {
    btnYearly.classList.add('active');
    btnMonthly.classList.remove('active');
    isYearly = true;
    renderPricing();
  });

  // Fetch Plans from server
  async function loadPlans() {
    try {
      const res = await fetch('/api/plans');
      const data = await res.json();
      plansData = data.plans;
      renderPricing();
    } catch (err) {
      console.error(err);
    }
  }

  function renderPricing() {
    if (!plansData.length) return;
    pricingCardsGrid.innerHTML = '';

    plansData.forEach(plan => {
      const price = isYearly ? plan.priceYearly : plan.priceMonthly;
      const isFeatured = plan.id === 'studio';

      const card = document.createElement('div');
      card.className = `pricing-card ${isFeatured ? 'featured' : ''}`;
      card.innerHTML = `
        <div class="plan-header">
          <span class="bento-badge">${plan.badge}</span>
          <h3>${plan.name}</h3>
          <p>${plan.description}</p>
        </div>
        <div class="plan-price">
          ${price}€ <span>/mois ${isYearly ? '(facturé annuellement)' : ''}</span>
        </div>
        <ul class="features-list">
          ${plan.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
        <button class="btn ${isFeatured ? 'btn-primary' : 'btn-secondary'} btn-subscribe">
          ${plan.cta}
        </button>
      `;

      card.querySelector('.btn-subscribe').addEventListener('click', () => {
        showToast(`🎉 Redirection vers le paiement sécurisé pour le plan ${plan.name} !`);
      });

      pricingCardsGrid.appendChild(card);
    });
  }

  updateRoi();
  loadPlans();
});
