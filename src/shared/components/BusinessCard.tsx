import { nafKeywordsMap } from '@entities/Business';

function matchesNafOrActivity(business, selectedNaf) {
  if (!selectedNaf) return true;
  const activity = (business.activity || '').toLowerCase();
  const keywords = nafKeywordsMap[selectedNaf] || [];
  return keywords.some(keyword => activity.includes(keyword));
} 