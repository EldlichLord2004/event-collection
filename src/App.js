// import React, { useState, useEffect } from "react";
// import Papa from "papaparse";
// import "./App.css";

// // === BƯỚC 1: IMPORT CÁC FILE ẢNH LOGO VÀO ĐÂY ===
// // (Đảm bảo đường dẫn './LogoUnit/...' là chính xác)
// import logoLn from './LogoUnit/ln.png';
// import logoVs from './LogoUnit/vs.png';
// import logoMmj from './LogoUnit/mmj.png';
// import logoNiigo from './LogoUnit/niigo.png';
// import logoVbs from './LogoUnit/vbs.png';
// import logoWxs from './LogoUnit/wxs.png';


// // === BƯỚC 2: TẠO "BẢN ĐỒ" KẾT NỐI TÊN UNIT VỚI BIẾN LOGO ===
// const unitLogos = {
//   vs: logoVs,
//   ln: logoLn,
//   mmj: logoMmj,
//   wxs: logoWxs,
//   vbs: logoVbs,
//   niigo: logoNiigo,
// };


// const App = () => {
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [units, setUnits] = useState([]);
//   const [activeUnit, setActiveUnit] = useState("All");
//   const [loading, setLoading] = useState(true);

//   const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQZCwUxhLR9bE6QOK1g2tXQKzDeB1SqoqH95QDqBS5cbeY9_WQuGn8SfdWVibOa2CzrVkNYLkIiXCZ7/pub?gid=0&single=true&output=tsv"; // Nhớ thay link của bạn vào đây

//   // ... (Toàn bộ code xử lý logic useEffect và fetchData giữ nguyên, không cần thay đổi)
//   const fetchData = () => {
//     console.log("Đang kiểm tra dữ liệu mới từ Google Sheet...");
//     Papa.parse(SHEET_CSV_URL, {
//       download: true,
//       header: true,
//       complete: (results) => {
//         const sheetData = results.data;
//         const validData = sheetData.filter(
//           (item) => item.EventName && item.ImageLink
//         );

//         setData(validData);
//         if (activeUnit === "All") {
//           setFilteredData(validData);
//         }

//         const uniqueUnits = [
//           ...new Set(validData.map((item) => item.Unit)),
//         ].filter(Boolean);
//         setUnits(["All", ...uniqueUnits]);
        
//         setLoading(false);
//       },
//       error: (error) => {
//         console.error("Lỗi khi tải dữ liệu từ Google Sheet:", error);
//       },
//     });
//   };

//   useEffect(() => {
//     fetchData();
//     const interval = setInterval(() => {
//       fetchData();
//     }, 300000); 
//     return () => clearInterval(interval);
//   }, [activeUnit]);

//   const handleFilter = (unit) => {
//     setActiveUnit(unit);
//     if (unit === "All") {
//       setFilteredData(data);
//     } else {
//       const filtered = data.filter((item) => item.Unit === unit);
//       setFilteredData(filtered);
//     }
//   };

//   return (
//     <div className="app">
//       <header>
//         <nav>
//           {/* === BƯỚC 3: SỬA LẠI VÒNG LẶP ĐỂ HIỂN THỊ LOGO === */}
//           {units.map((unit) => (
//             <button
//               key={unit}
//               className={activeUnit === unit ? "active" : ""}
//               onClick={() => handleFilter(unit)}
//             >
//               {unitLogos[unit] ? (
//                 // Nếu unit có trong "bản đồ" unitLogos -> hiện ảnh
//                 <img src={unitLogos[unit]} alt={unit} className="unit-logo" />
//               ) : (
//                 // Nếu không (trường hợp là "All") -> hiện chữ
//                 unit
//               )}
//             </button>
//           ))}
//         </nav>
//       </header>

//       <main>
//         {/* ... (Phần main hiển thị ảnh không thay đổi) ... */}
//         {loading ? (
//           <p className="loading-text">Đang tải dữ liệu từ Google Sheet...</p>
//         ) : (
//           <div className="collection-grid">
//             {filteredData.map((item) => (
//               <div className="collection-card" key={item.STT}>
//                 <div className="image-container">
//                   <img src={item.ImageLink} alt={item.EventName} />
//                 </div>
//                 <div className="card-info">
//                   <h3>{item.EventName}</h3>
//                   <p className="creator">cre:</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default App;

import React, { useState, useEffect, useRef } from "react";
import Papa from "papaparse";
import "./App.css";

// === IMPORT LOGO ===
import logoLn from './LogoUnit/ln.png';
import logoVs from './LogoUnit/vs.png';
import logoMmj from './LogoUnit/mmj.png';
import logoNiigo from './LogoUnit/niigo.png';
import logoVbs from './LogoUnit/vbs.png';
import logoWxs from './LogoUnit/wxs.png';
import logoVideo from './LogoUnit/Logo video.png';

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

const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeUnit, setActiveUnit] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showMiniLogo, setShowMiniLogo] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const topBannerRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQZCwUxhLR9bE6QOK1g2tXQKzDeB1SqoqH95QDqBS5cbeY9_WQuGn8SfdWVibOa2CzrVkNYLkIiXCZ7/pub?gid=0&single=true&output=tsv";

  const fetchData = () => {
    console.log("Đang kiểm tra dữ liệu mới từ Google Sheet...");
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
        }

        setLoading(false);
      },
      error: (error) => {
        console.error("Lỗi khi tải dữ liệu từ Google Sheet:", error);
      },
    });
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 300000);
    return () => clearInterval(interval);
  }, [activeUnit]);

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
    setActiveUnit(unit);
    if (unit === "All") {
      setFilteredData(data);
    } else {
      const filtered = data.filter((item) => item.Unit && item.Unit.toLowerCase() === unit.toLowerCase());
      setFilteredData(filtered);
    }
  };

  return (
    <div onContextMenu={(e) => e.preventDefault()}>
      <div className="top-banner" ref={topBannerRef}>
        <img className="top-banner-img" src={logoVideo} alt="Top logo" draggable={false} />
      </div>

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

        <main>
          {loading ? (
            <p className="loading-text">Đang tải dữ liệu...</p>
          ) : (
            <div className="collection-grid">
              {filteredData.map((item) => (
                <div className="collection-card" key={item.STT}>
                  <div className="image-container">
                    {/* THÊM draggable={false} VÀO ĐÂY ĐỂ CHẶN KÉO ẢNH */}
                    <img
                      src={item.ImageLink}
                      alt={item.EventName}
                      draggable={false}
                    />
                  </div>
                  <div className="card-info">
                    <h3>{item.EventName}</h3>
                    <p className="creator">cre:</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;