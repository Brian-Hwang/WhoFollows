'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

export type Locale = 'ko' | 'en' | 'zh';
export type Theme = 'dark' | 'light';

const translations = {
  // Header
  'header.subtitle': { ko: '누가 누구를 팔로우할까?', en: 'Who follows who?', zh: '谁关注了谁？' },

  // Legend
  'legend.title': { ko: '범례', en: 'Legend', zh: '图例' },
  'legend.follow': { ko: '팔로우', en: 'Follow', zh: '关注' },
  'legend.oneWayFollow': { ko: '일방 팔로우', en: 'One-way Follow', zh: '单向关注' },
  'legend.mutualFollow': { ko: '맞팔로우', en: 'Mutual Follow', zh: '互相关注' },
  'legend.exCouple': { ko: '전 연인', en: 'Ex-Couple', zh: '前任' },
  'legend.dating': { ko: '연애 중', en: 'Dating', zh: '恋爱中' },
  'legend.brokenUp': { ko: '결별', en: 'Broken Up', zh: '分手' },
  'legend.nonFollow': { ko: '언팔로우', en: 'Not Following', zh: '未关注' },

  // Profile Panel
  'profile.occupation': { ko: '직업', en: 'Occupation', zh: '职业' },
  'profile.age': { ko: '나이', en: 'Age', zh: '年龄' },
  'profile.ageSuffix': { ko: '세', en: '', zh: '岁' },
  'profile.relationships': { ko: '관계', en: 'Relationships', zh: '关系' },
  'profile.follows': { ko: '팔로우', en: 'Follows', zh: '关注' },
  'profile.following': { ko: '팔로잉', en: 'Following', zh: '正在关注' },
  'profile.followers': { ko: '팔로워', en: 'Followers', zh: '粉丝' },
  'profile.mutual': { ko: '맞팔', en: 'Mutual', zh: '互关' },
  'profile.followerOnly': { ko: '팔로워만', en: 'Follower only', zh: '仅粉丝' },
  'profile.none': { ko: '없음', en: 'None', zh: '无' },
  'profile.close': { ko: '닫기', en: 'Close', zh: '关闭' },

  // Relationship types
  'rel.exCouple': { ko: '전 연인', en: 'Ex-Couple', zh: '前任' },
  'rel.finalCouple': { ko: '최종 커플', en: 'Final Couple', zh: '最终情侣' },
  'rel.confirmedCouple': { ko: '연애 중 ♥', en: 'Dating ♥', zh: '恋爱中 ♥' },
  'rel.notTogether': { ko: '결별', en: 'Broken Up', zh: '分手' },

  // Show Selector
  'show.select': { ko: '프로그램 선택', en: 'Select Show', zh: '选择节目' },
  'show.label': { ko: '프로그램', en: 'Shows', zh: '节目' },
  'show.castSuffix': { ko: '명', en: ' cast', zh: '人' },

  // Filter
  'filter.title': { ko: '필터', en: 'Filter', zh: '筛选' },
  'filter.follows': { ko: '팔로우', en: 'Follows', zh: '关注' },
  'filter.nonFollows': { ko: '언팔로우', en: 'Non-Follows', zh: '未关注' },
  'filter.relationships': { ko: '관계', en: 'Relationships', zh: '关系' },

  // Loading
  'loading.graph': { ko: '그래프 로딩 중...', en: 'Loading graph...', zh: '加载中...' },

  // Verified badge
  'verified.label': { ko: '데이터 확인일', en: 'Data verified', zh: '数据验证日期' },

  // Tooltip
  'tooltip.clickForDetails': { ko: '클릭하여 상세보기', en: 'Click for details', zh: '点击查看详情' },
  'tooltip.clickToFocus': { ko: '클릭하여 포커스', en: 'Click to focus', zh: '点击聚焦' },
  'tooltip.clickToUnfocus': { ko: '클릭하여 해제', en: 'Click to unfocus', zh: '点击取消聚焦' },
  'tooltip.following': { ko: '팔로잉', en: 'Following', zh: '正在关注' },
  'tooltip.followers': { ko: '팔로워', en: 'Followers', zh: '粉丝' },

  // Occupations — Transit Love 4
  'occ.배우': { ko: '배우', en: 'Actor', zh: '演员' },
  'occ.패션 브랜드 직원': { ko: '패션 브랜드 직원', en: 'Fashion Brand Employee', zh: '时尚品牌员工' },
  'occ.레스토랑 사장': { ko: '레스토랑 사장', en: 'Restaurateur', zh: '餐厅老板' },
  'occ.웹 디자이너': { ko: '웹 디자이너', en: 'Web Designer', zh: '网页设计师' },
  'occ.댄서/인플루언서': { ko: '댄서/인플루언서', en: 'Dancer/Influencer', zh: '舞者/网红' },
  'occ.한의사': { ko: '한의사', en: 'Oriental Medicine Doctor', zh: '中医师' },
  'occ.연기 강사': { ko: '연기 강사', en: 'Acting Instructor', zh: '表演讲师' },
  'occ.댄서': { ko: '댄서', en: 'Dancer', zh: '舞者' },
  'occ.승무원': { ko: '승무원', en: 'Flight Attendant', zh: '空乘' },
  'occ.바리스타': { ko: '바리스타', en: 'Barista', zh: '咖啡师' },
  'occ.의사': { ko: '의사', en: 'Doctor', zh: '医生' },

  // Occupations — Singles' Inferno 4
  'occ.모델/DJ': { ko: '모델/DJ', en: 'Model/DJ', zh: '模特/DJ' },
  'occ.회계사': { ko: '회계사', en: 'Accountant', zh: '会计师' },
  'occ.베이커리 대표': { ko: '베이커리 대표', en: 'Bakery CEO', zh: '烘焙店老板' },
  'occ.아티스트/배우': { ko: '아티스트/배우', en: 'Artist/Actor', zh: '艺术家/演员' },
  'occ.레스토랑 대표': { ko: '레스토랑 대표', en: 'Restaurant CEO', zh: '餐厅老板' },
  'occ.모델': { ko: '모델', en: 'Model', zh: '模特' },
  'occ.스포츠 캐스터': { ko: '스포츠 캐스터', en: 'Sports Caster', zh: '体育主播' },
  'occ.공간 디자이너': { ko: '공간 디자이너', en: 'Spatial Designer', zh: '空间设计师' },
  'occ.카페 대표': { ko: '카페 대표', en: 'Café CEO', zh: '咖啡店老板' },
  'occ.모델/인플루언서': { ko: '모델/인플루언서', en: 'Model/Influencer', zh: '模特/网红' },
  'occ.영화학과 학생': { ko: '영화학과 학생', en: 'Film Student', zh: '电影系学生' },

  // Occupations — Love Is Blind 8
  'occ.Sales Executive': { ko: '영업 임원', en: 'Sales Executive', zh: '销售主管' },
  'occ.Nurse': { ko: '간호사', en: 'Nurse', zh: '护士' },
  'occ.Medical Device Sales': { ko: '의료기기 영업', en: 'Medical Device Sales', zh: '医疗器械销售' },
  'occ.Educational Sales': { ko: '교육 영업', en: 'Educational Sales', zh: '教育销售' },
  'occ.Developer': { ko: '개발자', en: 'Developer', zh: '开发者' },
  'occ.Oncology Nurse': { ko: '종양학 간호사', en: 'Oncology Nurse', zh: '肿瘤科护士' },
  'occ.Cinematographer': { ko: '촬영감독', en: 'Cinematographer', zh: '摄影师' },
  'occ.Physician Associate': { ko: '전문의 보조', en: 'Physician Associate', zh: '医师助理' },
  'occ.Digital Marketing': { ko: '디지털 마케팅', en: 'Digital Marketing', zh: '数字营销' },
  'occ.Real Estate Broker': { ko: '부동산 중개인', en: 'Real Estate Broker', zh: '房产经纪人' },
  'occ.Partnership Executive': { ko: '파트너십 임원', en: 'Partnership Executive', zh: '合作关系主管' },
  'occ.Youth Director': { ko: '청소년 지도사', en: 'Youth Director', zh: '青年主任' },
  'occ.Artist': { ko: '아티스트', en: 'Artist', zh: '艺术家' },
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
    if (savedLocale === 'ko' || savedLocale === 'en' || savedLocale === 'zh') setLocaleState(savedLocale);
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
