import { useEffect, useMemo, useRef, useState } from 'react';
import { CATEGORIES, LINKS } from './data/links.js';

const FAV_KEY = 'uit-hub:favorites';
const THEME_KEY = 'uit-hub:theme';

// Đọc / ghi localStorage an toàn (tránh lỗi khi trình duyệt chặn lưu trữ).
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

// Bỏ dấu tiếng Việt để tìm kiếm "hoc phi" vẫn ra "học phí".
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

function getGreeting(date) {
  const h = date.getHours();
  if (h < 11) return 'Chào buổi sáng';
  if (h < 14) return 'Chào buổi trưa';
  if (h < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
}

function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);
  return now;
}

export default function App() {
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState(() => readStorage(FAV_KEY, []));
  const [theme, setTheme] = useState(() => {
    const saved = readStorage(THEME_KEY, null);
    if (saved) return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const searchRef = useRef(null);
  const now = useNow();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writeStorage(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    writeStorage(FAV_KEY, favorites);
  }, [favorites]);

  const toggleFavorite = (id) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return LINKS;
    return LINKS.filter((l) => {
      const haystack = normalize(
        [l.title, l.description, getDomain(l.url), ...(l.keywords || [])].join(' ')
      );
      return haystack.includes(q);
    });
  }, [query]);

  const openLink = (link) => window.open(link.url, '_blank', 'noopener,noreferrer');

  // Phím tắt: "/" để tìm kiếm, 1-9 để mở link theo thứ tự, Enter trong ô tìm để mở kết quả đầu tiên.
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
    if (e.key === 'Enter' && filtered.length > 0) openLink(filtered[0]);
  };

  const openAll = () => {
    const ok = window.confirm(
      `Mở tất cả ${LINKS.length} trang trong các tab mới?\n(Trình duyệt có thể chặn pop-up — hãy cho phép nếu được hỏi.)`
    );
    if (ok) LINKS.forEach(openLink);
  };

  const favLinks = LINKS.filter((l) => favorites.includes(l.id));
  const showFavorites = !query.trim() && favLinks.length > 0;

  const dateText = now.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const timeText = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">UIT</span>
          <span className="brand-name">Hub</span>
        </div>
        <div className="topbar-actions">
          <button className="btn ghost" onClick={openAll} title="Mở tất cả các trang">
            Mở tất cả
          </button>
          <button
            className="btn ghost icon"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            aria-label="Đổi giao diện sáng/tối"
            title="Đổi giao diện sáng/tối"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <p className="hero-date">
            {dateText} · {timeText}
          </p>
          <h1>{getGreeting(now)}, sinh viên UIT 👋</h1>
          <p className="hero-sub">
            Tất cả trang web của trường, gom về một chỗ. Trường Đại học Công nghệ Thông tin – ĐHQG-HCM.
          </p>

          <div className="search">
            <span className="search-icon" aria-hidden="true">🔎</span>
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onSearchKeyDown}
              placeholder="Tìm trang… (ví dụ: học phí, ctsv, facebook)"
              aria-label="Tìm kiếm liên kết"
            />
            <kbd>/</kbd>
          </div>
        </section>

        {showFavorites && (
          <section className="group">
            <h2>⭐ Yêu thích</h2>
            <div className="grid">
              {favLinks.map((l) => (
                <LinkCard
                  key={l.id}
                  link={l}
                  isFav
                  onToggleFav={toggleFavorite}
                />
              ))}
            </div>
          </section>
        )}

        {filtered.length === 0 && (
          <p className="empty">Không tìm thấy trang nào khớp với “{query}”.</p>
        )}

        {CATEGORIES.map((cat) => {
          const items = filtered.filter((l) => l.category === cat.id);
          if (items.length === 0) return null;
          return (
            <section className="group" key={cat.id}>
              <h2>{cat.label}</h2>
              <div className="grid">
                {items.map((l) => (
                  <LinkCard
                    key={l.id}
                    link={l}
                    shortcut={LINKS.indexOf(l) + 1}
                    isFav={favorites.includes(l.id)}
                    onToggleFav={toggleFavorite}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <footer className="footer">
        <p>
          Phím tắt: <kbd>/</kbd> tìm kiếm · <kbd>1</kbd>–<kbd>{Math.min(LINKS.length, 9)}</kbd> mở nhanh ·{' '}
          <kbd>Enter</kbd> mở kết quả đầu · <kbd>Esc</kbd> xoá tìm kiếm
        </p>
        <p className="muted">
          Dự án cá nhân, không phải trang chính thức của trường. Chỉnh danh sách link tại{' '}
          <code>src/data/links.js</code>.
        </p>
      </footer>
    </div>
  );
}

function LinkCard({ link, shortcut, isFav, onToggleFav }) {
  return (
    <article className="card">
      <a className="card-link" href={link.url} target="_blank" rel="noopener noreferrer">
        <span className="card-icon" aria-hidden="true">{link.icon}</span>
        <span className="card-body">
          <span className="card-title">
            {link.title}
            {shortcut && shortcut <= 9 && <kbd className="card-key">{shortcut}</kbd>}
          </span>
          <span className="card-desc">{link.description}</span>
          <span className="card-domain">{getDomain(link.url)} ↗</span>
        </span>
      </a>
      <button
        className={`star ${isFav ? 'on' : ''}`}
        onClick={() => onToggleFav(link.id)}
        aria-pressed={isFav}
        aria-label={isFav ? `Bỏ yêu thích ${link.title}` : `Thêm ${link.title} vào yêu thích`}
        title={isFav ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
      >
        {isFav ? '★' : '☆'}
      </button>
    </article>
  );
}
