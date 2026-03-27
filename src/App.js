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

import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import "./App.css";

// === IMPORT LOGO ===
import logoLn from './LogoUnit/ln.png';
import logoVs from './LogoUnit/vs.png';
import logoMmj from './LogoUnit/mmj.png';
import logoNiigo from './LogoUnit/niigo.png';
import logoVbs from './LogoUnit/vbs.png';
import logoWxs from './LogoUnit/wxs.png';

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
      <div className="toolbar-shell">
        <nav className="unit-toolbar">
          {/* ⭐ DÙNG UNIT_ORDER CỐ ĐỊNH THAY VÌ DYNAMIC */}
          {UNIT_ORDER.map((unit) => (
            <button
              key={unit}
              className={activeUnit === unit ? "active" : ""}
              onClick={() => handleFilter(unit)}
            >
              {unit === "All" ? (
                // "All" → hiện chữ
                "All"
              ) : unitLogos[unit] ? (
                // Có logo → hiện ảnh
                <img src={unitLogos[unit]} alt={unit} className="unit-logo" />
              ) : (
                // Không có logo (mix) → hiện trống, chỉ có khoảng trắng
                <span className="unit-blank">{unit}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="app">
        <main>
          {loading ? (
            <p className="loading-text">Đang tải dữ liệu từ Google Sheet...</p>
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