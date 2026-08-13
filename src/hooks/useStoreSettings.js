import { doc, onSnapshot } from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { db } from '../lib/firebaseClient';

const currencyLocales = { USD: 'en-US', KHR: 'km-KH', EUR: 'de-DE', CNY: 'zh-CN' };

export function useStoreSettings() {
  const [settings, setSettings] = useState({ storeName: 'ten11', currency: 'USD' });
  useEffect(() => onSnapshot(doc(db, 'settings', 'store'), (snapshot) => {
    if (snapshot.exists()) setSettings((current) => ({ ...current, ...snapshot.data() }));
  }), []);
  const formatPrice = useCallback((value) => new Intl.NumberFormat(
    currencyLocales[settings.currency] || 'en-US',
    { style: 'currency', currency: settings.currency || 'USD' },
  ).format(Number(value || 0)), [settings.currency]);
  return useMemo(() => ({ ...settings, formatPrice }), [settings, formatPrice]);
}
