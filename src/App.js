import React, { useState, useEffect, useRef, useCallback } from "react";
import Papa from "papaparse";
import "./App.css";
import { EventDetailModal } from "./components/EventDetailModal";

// === IMPORT LOGO ===
import logoLn from './LogoUnit/ln.png';
import logoVs from './LogoUnit/vs.png';
import logoMmj from './LogoUnit/mmj.png';
import logoNiigo from './LogoUnit/niigo.png';
import logoVbs from './LogoUnit/vbs.png';
import logoWxs from './LogoUnit/wxs.png';
import logoVideo from './LogoUnit/Logo video.png';

// === BACKGROUND (dynamic wallpaper) ===
import bgDefault from "./bg/655065811_941741794924969_5766578969985938936_n.jpg";
import bgVs from "./bg/vs_bg.png";
import bgLn from "./bg/ln_bg.png";
import bgMmj from "./bg/mmj_bg.png";
import bgNiigo from "./bg/n25_bg.png";
import bgVbs from "./bg/vbs_bg.png";
import bgWxs from "./bg/wxs_bg.png";

// === BẢN ĐỒ LOGO ===
const unitLogos = {
  vs: logoVs,
  ln: logoLn,
  mmj: logoMmj,
  wxs: logoWxs,
  vbs: logoVbs,
  niigo: logoNiigo,
  // "All" và "mix" KHÔNG có logo → sẽ hiển thị trống
};

// ⭐ THỨ TỰ CỐ ĐỊNH: All đầu tiên, mix cuối cùng
const UNIT_ORDER = ["All", "vs", "ln", "mmj", "vbs", "wxs", "niigo","Mix"];

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQZCwUxhLR9bE6QOK1g2tXQKzDeB1SqoqH95QDqBS5cbeY9_WQuGn8SfdWVibOa2CzrVkNYLkIiXCZ7/pub?gid=0&single=true&output=tsv";

const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeUnit, setActiveUnit] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showMiniLogo, setShowMiniLogo] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [hoverUnit, setHoverUnit] = useState(null);

  // 2 lớp nền để cross-fade mượt khi đổi wallpaper
  const [bg0, setBg0] = useState(bgDefault);
  const [bg1, setBg1] = useState(bgDefault);
  const [bgTop, setBgTop] = useState(0);
  const visibleBgUrlRef = useRef(bgDefault);
  const topBannerRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const closeEventModal = useCallback(() => setSelectedEvent(null), []);

  const getBgUrl = useCallback((unitRaw) => {
    const key = unitRaw == null ? "" : String(unitRaw).trim().toLowerCase();

    // mapping theo yêu cầu:
    // - i / n25 => niigo
    // - vs / all / mix => dùng nền mặc định
    if (!key) return bgDefault;
    if (key === "all" || key === "mix") return bgDefault;
    if (key === "vs") return bgVs;
    if (key === "ln") return bgLn;
    if (key === "mmj") return bgMmj;
    if (key === "vbs") return bgVbs;
    if (key === "wxs") return bgWxs;
    if (key === "niigo" || key === "n25" || key === "i") return bgNiigo;
    return bgDefault;
  }, []);

  const fetchData = useCallback(() => {
    console.log("Đang kiểm tra dữ liệu mới...");
    Papa.parse(SHEET_CSV_URL, {
      download: true,
      header: true,
      complete: (results) => {
        const sheetData = results.data;
        const validData = sheetData.filter(
          (item) => item.EventName && item.ImageLink
        );

        setData(validData);
        if (activeUnit === "All") {
          setFilteredData(validData);
        } else {
          setFilteredData(
            validData.filter(
              (item) =>
                item.Unit &&
                item.Unit.toLowerCase() === activeUnit.toLowerCase()
            )
          );
        }

        setLoading(false);
      },
      error: (error) => {
        console.error("Lỗi khi tải dữ liệu: ", error);
      },
    });
  }, [activeUnit]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 300000);
    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth <= 768;
      if (!isMobile) {
        setShowMiniLogo(false);
        return;
      }

      const el = topBannerRef.current;
      if (!el) return;

      // Khi đáy banner lớn đã đi lên đủ cao thì hiện logo nhỏ
      const shouldShow = el.getBoundingClientRect().bottom <= 120;
      setShowMiniLogo((prev) => (prev === shouldShow ? prev : shouldShow));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const onPointerDown = (e) => {
      if (!mobileMenuOpen) return;
      const panel = mobileMenuRef.current;
      if (!panel) return;
      if (!panel.contains(e.target)) setMobileMenuOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [mobileMenuOpen]);

  const handleFilter = (unit) => {
    // Khi click toolbar, bỏ trạng thái hover để nền trở về “base” của toolbar ngay lập tức
    setHoverUnit(null);
    setActiveUnit(unit);
    if (unit === "All") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) => item.Unit && item.Unit.toLowerCase() === unit.toLowerCase());
      setFilteredData(filtered);
    }
  };

  const resultCount = filteredData.length;

  const baseBgUrl = getBgUrl(activeUnit);
  const selectedBgUrl = selectedEvent ? getBgUrl(selectedEvent.Unit) : null;
  const hoverBgUrl = hoverUnit ? getBgUrl(hoverUnit) : null;
  const desiredBgUrl = selectedBgUrl || hoverBgUrl || baseBgUrl;

  const preloadImage = useCallback((url) => {
    // preload để tránh flash khi ảnh chưa kịp tải xong
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }, []);

  // Sync giá trị đang hiển thị vào ref để tránh effect bị kích do setBg0/setBg1
  useEffect(() => {
    visibleBgUrlRef.current = bgTop === 0 ? bg0 : bg1;
  }, [bgTop, bg0, bg1]);

  useEffect(() => {
    if (!desiredBgUrl) return;
    if (visibleBgUrlRef.current === desiredBgUrl) return;

    let cancelled = false;

    (async () => {
      await preloadImage(desiredBgUrl);
      if (cancelled) return;

      if (bgTop === 0) {
        setBg1(desiredBgUrl);
        requestAnimationFrame(() => setBgTop(1));
      } else {
        setBg0(desiredBgUrl);
        requestAnimationFrame(() => setBgTop(0));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [desiredBgUrl, bgTop, preloadImage]);

  return (
    <div className="page-root" onContextMenu={(e) => e.preventDefault()}>
      <div className="bg-root" aria-hidden="true">
        <div
          className={`bg-layer ${bgTop === 0 ? "bg-layer--top" : ""}`}
          style={{ backgroundImage: `url(${bg0})` }}
        />
        <div
          className={`bg-layer ${bgTop === 1 ? "bg-layer--top" : ""}`}
          style={{ backgroundImage: `url(${bg1})` }}
        />
        <div className="bg-overlay" />
      </div>

      <div className="content-panel">
        <header className="site-top">
          <div className="top-banner" ref={topBannerRef}>
            <img
              className="top-banner-img"
              src={logoVideo}
              alt="Project Sekai Vietsub — logo gallery"
              draggable={false}
            />
          </div>
        </header>

        <div className="app">
        <div className="toolbar-shell">
          <img
            className={showMiniLogo ? "mini-logo mini-logo--show" : "mini-logo"}
            src={logoVideo}
            alt="Mini logo"
            draggable={false}
          />

          <nav className="unit-toolbar unit-toolbar--desktop">
            {UNIT_ORDER.map((unit) => (
              <button
                key={unit}
                className={activeUnit === unit ? "active" : ""}
                onClick={() => handleFilter(unit)}
              >
                {unit === "All" ? (
                  "All"
                ) : unitLogos[unit] ? (
                  <img src={unitLogos[unit]} alt={unit} className="unit-logo" />
                ) : (
                  <span className="unit-blank">{unit}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="mobile-menu-area" ref={mobileMenuRef}>
            <button
              type="button"
              className="mobile-menu-btn"
              aria-label="Open unit list"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              <span className="burger" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>

            <div
              className={mobileMenuOpen ? "mobile-menu-panel mobile-menu-panel--open" : "mobile-menu-panel"}
            >
              <nav className="unit-toolbar unit-toolbar--mobile">
                {UNIT_ORDER.map((unit) => (
                  <button
                    key={unit}
                    className={activeUnit === unit ? "active" : ""}
                    onClick={() => {
                      handleFilter(unit);
                      setMobileMenuOpen(false);
                    }}
                  >
                    {unit === "All" ? (
                      "All"
                    ) : unitLogos[unit] ? (
                      <img src={unitLogos[unit]} alt={unit} className="unit-logo" />
                    ) : (
                      <span className="unit-blank">{unit}</span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <main className="gallery-main">
          <div className="gallery-head">
            <p className="gallery-meta" aria-live="polite">
              {loading ? "Đang tải…" : `${resultCount} mục`}
            </p>
          </div>

          {loading ? (
            <div className="loading-block" role="status" aria-busy="true">
              <span className="loading-spinner" aria-hidden="true" />
              <p className="loading-text">Đang tải dữ liệu ...</p>
            </div>
          ) : resultCount === 0 ? (
            <p className="empty-state">Không có logo trong bộ lọc này.</p>
          ) : (
            <div className="collection-grid" key={activeUnit}>
              {filteredData.map((item, index) => (
                <button
                  type="button"
                  className="collection-card"
                  key={
                    item.STT != null && String(item.STT).trim() !== ""
                      ? String(item.STT)
                      : `${item.ImageLink}-${index}`
                  }
                  onClick={() => {
                    // Khi chọn logo mở popup, nền theo unit logo đó và khi tắt popup sẽ quay về nền “base” của toolbar
                    setHoverUnit(null);
                    setSelectedEvent(item);
                  }}
                  aria-label={`${item.EventName} — xem chi tiết`}
                  onMouseEnter={() => {
                    if (selectedEvent) return;
                    setHoverUnit(item.Unit);
                  }}
                  onMouseLeave={() => {
                    if (selectedEvent) return;
                    setHoverUnit(null);
                  }}
                  onFocus={() => {
                    if (selectedEvent) return;
                    setHoverUnit(item.Unit);
                  }}
                  onBlur={() => {
                    if (selectedEvent) return;
                    setHoverUnit(null);
                  }}
                >
                  <div className="image-container">
                    <img
                      src={item.ImageLink}
                      alt=""
                      draggable={false}
                      loading="lazy"
                    />
                  </div>
                  <div className="card-info">
                    <h3 className="card-title">{item.EventName}</h3>
                  </div>
                </button>
              ))}
            </div>
          )}
        </main>
        </div>
      </div>

      {selectedEvent ? (
        <EventDetailModal event={selectedEvent} onClose={closeEventModal} />
      ) : null}
    </div>
  );
};

export default App;