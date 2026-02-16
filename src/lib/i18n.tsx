'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

export type Locale = 'ko' | 'en';
export type Theme = 'dark' | 'light';

const translations = {
  // Header
  'header.subtitle': { ko: '누가 누구를 팔로우할까?', en: 'Who follows who?' },

  // Legend
  'legend.title': { ko: '범례', en: 'Legend' },
  'legend.follow': { ko: '팔로우', en: 'Follow' },
  'legend.oneWayFollow': { ko: '일방 팔로우', en: 'One-way Follow' },
  'legend.mutualFollow': { ko: '맞팔로우', en: 'Mutual Follow' },
  'legend.exCouple': { ko: '전 연인', en: 'Ex-Couple' },
  'legend.dating': { ko: '연애 중', en: 'Dating' },
  'legend.brokenUp': { ko: '결별', en: 'Broken Up' },
  'legend.nonFollow': { ko: '언팔로우', en: 'Not Following' },

  // Profile Panel
  'profile.occupation': { ko: '직업', en: 'Occupation' },
  'profile.age': { ko: '나이', en: 'Age' },
  'profile.ageSuffix': { ko: '세', en: '' },
  'profile.relationships': { ko: '관계', en: 'Relationships' },
  'profile.follows': { ko: '팔로우', en: 'Follows' },
  'profile.following': { ko: '팔로잉', en: 'Following' },
  'profile.followers': { ko: '팔로워', en: 'Followers' },
  'profile.mutual': { ko: '맞팔', en: 'Mutual' },
  'profile.followerOnly': { ko: '팔로워만', en: 'Follower only' },
  'profile.none': { ko: '없음', en: 'None' },
  'profile.close': { ko: '닫기', en: 'Close' },

  // Relationship types
  'rel.exCouple': { ko: '전 연인', en: 'Ex-Couple' },
  'rel.finalCouple': { ko: '최종 커플', en: 'Final Couple' },
  'rel.confirmedCouple': { ko: '연애 중 ♥', en: 'Dating ♥' },
  'rel.notTogether': { ko: '결별', en: 'Broken Up' },

  // Show Selector
  'show.select': { ko: '프로그램 선택', en: 'Select Show' },
  'show.label': { ko: '프로그램', en: 'Shows' },
  'show.castSuffix': { ko: '명', en: ' cast' },

  // Filter
  'filter.title': { ko: '필터', en: 'Filter' },
  'filter.follows': { ko: '팔로우', en: 'Follows' },
  'filter.nonFollows': { ko: '언팔로우', en: 'Non-Follows' },
  'filter.relationships': { ko: '관계', en: 'Relationships' },

  // Loading
  'loading.graph': { ko: '그래프 로딩 중...', en: 'Loading graph...' },

  // Verified badge
  'verified.label': { ko: '데이터 확인일', en: 'Data verified' },

  // Tooltip
  'tooltip.clickForDetails': { ko: '클릭하여 상세보기', en: 'Click for details' },
  'tooltip.clickToFocus': { ko: '클릭하여 포커스', en: 'Click to focus' },
  'tooltip.clickToUnfocus': { ko: '클릭하여 해제', en: 'Click to unfocus' },
  'tooltip.following': { ko: '팔로잉', en: 'Following' },
  'tooltip.followers': { ko: '팔로워', en: 'Followers' },

  // Occupations
  'occ.배우': { ko: '배우', en: 'Actor' },
  'occ.패션 브랜드 직원': { ko: '패션 브랜드 직원', en: 'Fashion Brand Employee' },
  'occ.레스토랑 사장': { ko: '레스토랑 사장', en: 'Restaurateur' },
  'occ.웹 디자이너': { ko: '웹 디자이너', en: 'Web Designer' },
  'occ.댄서/인플루언서': { ko: '댄서/인플루언서', en: 'Dancer/Influencer' },
  'occ.한의사': { ko: '한의사', en: 'Oriental Medicine Doctor' },
  'occ.연기 강사': { ko: '연기 강사', en: 'Acting Instructor' },
  'occ.댄서': { ko: '댄서', en: 'Dancer' },
  'occ.승무원': { ko: '승무원', en: 'Flight Attendant' },
  'occ.바리스타': { ko: '바리스타', en: 'Barista' },
  'occ.의사': { ko: '의사', en: 'Doctor' },

  // Singles' Inferno 4 occupations
  'occ.모델/DJ': { ko: '모델/DJ', en: 'Model/DJ' },
  'occ.회계사': { ko: '회계사', en: 'Accountant' },
  'occ.베이커리 대표': { ko: '베이커리 대표', en: 'Bakery CEO' },
  'occ.아티스트/배우': { ko: '아티스트/배우', en: 'Artist/Actor' },
  'occ.레스토랑 대표': { ko: '레스토랑 대표', en: 'Restaurant CEO' },
  'occ.모델': { ko: '모델', en: 'Model' },
  'occ.스포츠 캐스터': { ko: '스포츠 캐스터', en: 'Sports Caster' },
  'occ.공간 디자이너': { ko: '공간 디자이너', en: 'Spatial Designer' },
  'occ.카페 대표': { ko: '카페 대표', en: 'Café CEO' },
  'occ.모델/인플루언서': { ko: '모델/인플루언서', en: 'Model/Influencer' },
  'occ.영화학과 학생': { ko: '영화학과 학생', en: 'Film Student' },

  // Love Is Blind 8 occupations
  'occ.Sales Executive': { ko: '영업 임원', en: 'Sales Executive' },
  'occ.Nurse': { ko: '간호사', en: 'Nurse' },
  'occ.Medical Device Sales': { ko: '의료기기 영업', en: 'Medical Device Sales' },
  'occ.Educational Sales': { ko: '교육 영업', en: 'Educational Sales' },
  'occ.Developer': { ko: '개발자', en: 'Developer' },
  'occ.Oncology Nurse': { ko: '종양학 간호사', en: 'Oncology Nurse' },
  'occ.Cinematographer': { ko: '촬영감독', en: 'Cinematographer' },
  'occ.Physician Associate': { ko: '전문의 보조', en: 'Physician Associate' },
  'occ.Digital Marketing': { ko: '디지털 마케팅', en: 'Digital Marketing' },
  'occ.Real Estate Broker': { ko: '부동산 중개인', en: 'Real Estate Broker' },
  'occ.Partnership Executive': { ko: '파트너십 임원', en: 'Partnership Executive' },
  'occ.Youth Director': { ko: '청소년 지도사', en: 'Youth Director' },
  'occ.Artist': { ko: '아티스트', en: 'Artist' },
} as const;

export type TranslationKey = keyof typeof translations;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ko');
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    const savedLocale = localStorage.getItem('whofollows-locale') as Locale;
    if (savedLocale === 'ko' || savedLocale === 'en') setLocaleState(savedLocale);
    const savedTheme = localStorage.getItem('whofollows-theme') as Theme;
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setThemeState(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('whofollows-locale', l);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem('whofollows-theme', t);
    document.documentElement.setAttribute('data-theme', t);
  }, []);

  const t = useCallback((key: TranslationKey) => {
    return translations[key]?.[locale] ?? key;
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, theme, setTheme }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
