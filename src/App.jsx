import { useEffect, useMemo, useRef, useState } from 'react';
import { CATEGORIES, LINKS } from './data/links.js';

const PIN_KEY = 'uit-hub:favorites';
const THEME_KEY = 'uit-hub:theme';
const SUGGESTIONS = ['học phí', 'rèn luyện', 'tin tức', 'facebook'];

/* ---------- Tiện ích ---------- */

// Đọc / ghi localStorage an toàn (trình duyệt có thể chặn lưu trữ).
function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* bỏ qua */
  }
}

// Bỏ dấu tiếng Việt để gõ "hoc phi" vẫn ra "học phí".
function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd');
}

function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

// Chọn chữ trắng hoặc chữ tối tuỳ độ sáng của màu thẻ.
function pickFg(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  const lin = (c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const L = 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
  return L > 0.4 ? '#0d1735' : '#ffffff';
}

/* ---------- Biểu tượng ---------- */

const Icon = {
  arrow: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  ),
  pin: (filled) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
      <path d="M6 3h12v18l-6-4.5L6 21z" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
  sun: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
      <path d="m12 3 9 5-9 5-9-5zM3 13l9 5 9-5" />
    </svg>
  ),
};

/* ---------- Ứng dụng ---------- */

export default function App() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all | <category id> | pinned
  const [pinned, setPinned] = useState(() => readStorage(PIN_KEY, []));
  const [theme, setTheme] = useState(() => {
    const saved = readStorage(THEME_KEY, null);
    if (saved) return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const searchRef = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writeStorage(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    writeStorage(PIN_KEY, pinned);
  }, [pinned]);

  const togglePin = (id) =>
    setPinned((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const categoryLabel = useMemo(
    () => Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label])),
    []
  );

  const tabs = useMemo(
    () => [
      { id: 'all', label: 'Tất cả', count: LINKS.length },
      ...CATEGORIES.map((c) => ({
        id: c.id,
        label: c.label,
        count: LINKS.filter((l) => l.category === c.id).length,
      })),
      { id: 'pinned', label: 'Đã ghim', count: LINKS.filter((l) => pinned.includes(l.id)).length },
    ],
    [pinned]
  );

  const visible = useMemo(() => {
    const q = normalize(query.trim());
    return LINKS.filter((l) => {
      if (filter === 'pinned' && !pinned.includes(l.id)) return false;
      if (filter !== 'all' && filter !== 'pinned' && l.category !== filter) return false;
      if (!q) return true;
      const haystack = normalize(
        [l.title, l.description, l.word, getDomain(l.url), ...(l.keywords || [])].join(' ')
      );
      return haystack.includes(q);
    });
  }, [query, filter, pinned]);

  const openLink = (link) => window.open(link.url, '_blank', 'noopener,noreferrer');

  // Phím tắt: "/" tìm kiếm · 1-9 mở nhanh · Esc xoá tìm kiếm.
  useEffect(() => {
    const onKey = (e) => {
      const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
      if (e.key === '/' && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }
      if (e.key === 'Escape') {
        setQuery('');
        searchRef.current?.blur();
        return;
      }
      if (!typing && /^[1-9]$/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const link = LINKS[Number(e.key) - 1];
        if (link) openLink(link);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const onSearchKeyDown = (e) => {
    if (e.key === 'Enter' && visible.length > 0) openLink(visible[0]);
  };

  const openAll = () => {
    const ok = window.confirm(
      `Mở tất cả ${LINKS.length} trang trong các tab mới?\nNếu trình duyệt chặn pop-up, hãy chọn cho phép.`
    );
    if (ok) LINKS.forEach(openLink);
  };

  const dateText = useMemo(
    () =>
      new Date().toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }),
    []
  );

  const searching = query.trim() !== '';
  const bento = filter === 'all' && !searching;

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            {LINKS.slice(0, 4).map((l) => (
              <i key={l.id} style={{ background: l.color }} />
            ))}
          </span>
          <span className="brand-name">UIT Hub</span>
        </div>
        <div className="topbar-right">
          <span className="today">{dateText}</span>
          <button className="btn" onClick={openAll}>
            {Icon.layers}
            <span>Mở tất cả</span>
          </button>
          <button
            className="btn icon-only"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            aria-label={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
          >
            {theme === 'dark' ? Icon.sun : Icon.moon}
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <h1>
            Cần vào trang nào
            <br />
            của UIT?
          </h1>
          <p className="hero-sub">{LINKS.length} trang của trường, gom về một chỗ.</p>

          <label className="search">
            {Icon.search}
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onSearchKeyDown}
              placeholder="Tìm trang: học phí, ctsv…"
              aria-label="Tìm trang"
              autoComplete="off"
            />
            <kbd>/</kbd>
          </label>

          <div className="suggest">
            <span>Thử tìm</span>
            {SUGGESTIONS.map((s) => (
              <button key={s} className="chip" onClick={() => setQuery(s)}>
                {s}
              </button>
            ))}
          </div>
        </section>

        <nav className="tabs" aria-label="Lọc theo nhóm">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`tab ${filter === t.id ? 'on' : ''}`}
              aria-pressed={filter === t.id}
              onClick={() => setFilter(t.id)}
            >
              {t.label}
              <span className="tab-count">{t.count}</span>
            </button>
          ))}
        </nav>

        {visible.length > 0 ? (
          <section className={bento ? 'board bento' : 'board flat'} aria-live="polite">
            {visible.map((link, i) => (
              <Tile
                key={link.id}
                link={link}
                index={i}
                shortcut={LINKS.indexOf(link) + 1}
                category={categoryLabel[link.category]}
                isPinned={pinned.includes(link.id)}
                onTogglePin={togglePin}
              />
            ))}
          </section>
        ) : (
          <div className="empty">
            {filter === 'pinned' && !searching ? (
              <>
                <p className="empty-title">Chưa có trang nào được ghim</p>
                <p>Bấm biểu tượng đánh dấu ở góc thẻ để ghim những trang bạn hay dùng.</p>
              </>
            ) : (
              <>
                <p className="empty-title">Không có trang nào khớp “{query}”</p>
                <p>Thử gõ “học phí” hoặc “facebook”, hoặc xoá tìm kiếm để xem tất cả.</p>
                <button
                  className="btn"
                  onClick={() => {
                    setQuery('');
                    setFilter('all');
                  }}
                >
                  Xoá tìm kiếm
                </button>
              </>
            )}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>
          Phím tắt: <kbd>/</kbd> tìm kiếm, <kbd>1</kbd>–<kbd>{Math.min(LINKS.length, 9)}</kbd> mở nhanh,{' '}
          <kbd>Enter</kbd> mở kết quả đầu, <kbd>Esc</kbd> xoá tìm kiếm.
        </p>
        <p>
          Dự án cá nhân, không phải trang chính thức của trường. Sửa danh sách tại{' '}
          <code>src/data/links.js</code>.
        </p>
      </footer>
    </div>
  );
}

function Tile({ link, index, shortcut, category, isPinned, onTogglePin }) {
  const word = link.word || getDomain(link.url).split('.')[0];
  const style = {
    '--tile': link.color,
    '--fg': pickFg(link.color),
    '--n': Math.max(word.length, 4),
    '--i': index,
  };
  return (
    <article className="tile" style={style} data-size={link.size || 'md'}>
      <a
        className="tile-link"
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${link.title}, mở ${getDomain(link.url)} trong tab mới`}
      >
        <span className="tile-top">
          <span className="tile-cat">{category}</span>
          {shortcut <= 9 && <kbd className="tile-key">{shortcut}</kbd>}
        </span>
        <span className="tile-word" aria-hidden="true">
          {word}
        </span>
        <span className="tile-foot">
          <span className="tile-text">
            <strong className="tile-title">{link.title}</strong>
            <span className="tile-desc">{link.description}</span>
          </span>
          <span className="tile-go">{Icon.arrow}</span>
        </span>
      </a>
      <button
        className={`pin ${isPinned ? 'on' : ''}`}
        onClick={() => onTogglePin(link.id)}
        aria-pressed={isPinned}
        aria-label={isPinned ? `Bỏ ghim ${link.title}` : `Ghim ${link.title}`}
        title={isPinned ? 'Bỏ ghim' : 'Ghim trang này'}
      >
        {Icon.pin(isPinned)}
      </button>
    </article>
  );
}
