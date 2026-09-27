import test from 'node:test';
import assert from 'node:assert';
import { SAAS_PLANS, calculateEstimatedRevenue } from '../server.js';

test('SaaS Landing - SAAS_PLANS has 3 distinct tiers with features', () => {
  assert.strictEqual(SAAS_PLANS.length, 3);
  const ids = SAAS_PLANS.map(p => p.id);
  assert.deepStrictEqual(ids, ['creator', 'studio', 'enterprise']);
  SAAS_PLANS.forEach(plan => {
    assert.ok(plan.priceMonthly > 0);
    assert.ok(plan.features.length >= 5);
  });
});

test('SaaS Landing - calculateEstimatedRevenue computes realistic conversion ROI', () => {
  const result = calculateEstimatedRevenue(1000000, 0.02, 35);
  assert.strictEqual(result.monthlyViews, 1000000);
  assert.strictEqual(result.visitorsEstimated, 50000);
  assert.strictEqual(result.estimatedBuyers, 1000);
  assert.strictEqual(result.estimatedRevenueEuros, 35000);
  assert.ok(result.timeSavedHours >= 40);
});
