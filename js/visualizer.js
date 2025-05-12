/**
 * Module hiển thị mô phỏng
 * Cung cấp các hàm để hiển thị và cập nhật quá trình sắp xếp
 */

const HienThi = (function () {
  // Biến private
  let khungMang = document.getElementById("arrayContainer");
  let khungBuoc = document.getElementById("stepsDisplay");
  let hienThiSoSanh = document.getElementById("comparisons");
  let hienThiHoanDoi = document.getElementById("swaps");
  let hienThiThoiGian = document.getElementById("timeElapsed");

  let mang = [];
  let thanhHienThi = [];
  let tocDoHoatHoa = 50;
  let danhSachThoiGian = [];
  let thoiGianBatDau = 0;
  let khoangThoiGian = null;

  // Chuyển đổi tốc độ slider (1-100) thành thời gian trễ (ms)
  const layDoTre = () => {
    return Math.max(500 - tocDoHoatHoa * 5, 5);
  };

  // Cập nhật số liệu thống kê
  const capNhatThongKe = (soSanh, hoanDoi) => {
    hienThiSoSanh.textContent = soSanh;
    hienThiHoanDoi.textContent = hoanDoi;
  };

  // Cập nhật thời gian
  const capNhatThoiGian = () => {
    const thoiGianHienTai = (new Date().getTime() - thoiGianBatDau) / 1000;
    hienThiThoiGian.textContent = thoiGianHienTai.toFixed(2) + "s";
  };

  // Xóa các hiệu ứng đã lên lịch
  const xoaHieuUng = () => {
    danhSachThoiGian.forEach(id => clearTimeout(id));
    danhSachThoiGian = [];

    if (khoangThoiGian) {
      clearInterval(khoangThoiGian);
      khoangThoiGian = null;
    }
  };

  // Tạo thanh hiển thị cho mảng
  const taoThanhHienThi = () => {
    khungMang.innerHTML = "";
    thanhHienThi = [];

    const giaTriLonNhat = Math.max(...mang);
    const doRongThanh = Math.max(5, Math.min(20, 500 / mang.length));

    mang.forEach((giaTri, viTri) => {
      const thanh = document.createElement("div");
      thanh.className = "array-bar";
      thanh.style.height = `${(giaTri / giaTriLonNhat) * 250}px`;
      thanh.style.width = `${doRongThanh}px`;

      khungMang.appendChild(thanh);
      thanhHienThi.push(thanh);
    });
  };

  // Reset hiển thị
  const datLaiHienThi = () => {
    xoaHieuUng();
    capNhatThongKe(0, 0);
    hienThiThoiGian.textContent = "0.00s";

    // Reset màu của các thanh
    if (thanhHienThi.length > 0) {
      thanhHienThi.forEach(thanh => {
        thanh.className = "array-bar";
      });
    }

    // Xóa thông báo bước
    khungBuoc.innerHTML =
      '<p>Chọn thuật toán và nhấn "Bắt Đầu Sắp Xếp" để xem mô phỏng.</p>';
  };

  // Hiển thị thông tin bước
  const hienThiBuoc = thongDiep => {
    const phanTuBuoc = document.createElement("p");
    phanTuBuoc.textContent = thongDiep;
    khungBuoc.appendChild(phanTuBuoc);
    khungBuoc.scrollTop = khungBuoc.scrollHeight;
  };

  // Đánh dấu các phần tử đang so sánh
  const danhDauSoSanh = (danhSachViTri, doTre = 0) => {
    const idThoiGian = setTimeout(() => {
      danhSachViTri.forEach(i => {
        if (i >= 0 && i < thanhHienThi.length) {
          thanhHienThi[i].classList.add("compared");
        }
      });
    }, doTre);

    danhSachThoiGian.push(idThoiGian);

    return new Promise(resolve => {
      const idGiaiQuyet = setTimeout(resolve, doTre + layDoTre());
      danhSachThoiGian.push(idGiaiQuyet);
    });
  };

  // Bỏ đánh dấu các phần tử đang so sánh
  const boDanhDauSoSanh = (danhSachViTri, doTre = 0) => {
    const idThoiGian = setTimeout(() => {
      danhSachViTri.forEach(i => {
        if (i >= 0 && i < thanhHienThi.length) {
          thanhHienThi[i].classList.remove("compared");
        }
      });
    }, doTre);

    danhSachThoiGian.push(idThoiGian);

    return new Promise(resolve => {
      const idGiaiQuyet = setTimeout(resolve, doTre + layDoTre() / 2);
      danhSachThoiGian.push(idGiaiQuyet);
    });
  };

  // Đánh dấu phần tử là đã sắp xếp
  const danhDauDaSapXep = (danhSachViTri, doTre = 0) => {
    const idThoiGian = setTimeout(() => {
      danhSachViTri.forEach(i => {
        if (i >= 0 && i < thanhHienThi.length) {
          thanhHienThi[i].classList.add("sorted");
          thanhHienThi[i].classList.remove("compared", "current", "pivot");
        }
      });
    }, doTre);

    danhSachThoiGian.push(idThoiGian);

    return new Promise(resolve => {
      const idGiaiQuyet = setTimeout(resolve, doTre + layDoTre() / 2);
      danhSachThoiGian.push(idGiaiQuyet);
    });
  };

  // Đánh dấu phần tử trục (pivot) cho Quick Sort
  const danhDauTruc = (viTri, doTre = 0) => {
    const idThoiGian = setTimeout(() => {
      if (viTri >= 0 && viTri < thanhHienThi.length) {
        thanhHienThi[viTri].classList.add("pivot");
      }
    }, doTre);

    danhSachThoiGian.push(idThoiGian);

    return new Promise(resolve => {
      const idGiaiQuyet = setTimeout(resolve, doTre + layDoTre() / 2);
      danhSachThoiGian.push(idGiaiQuyet);
    });
  };

  // Đánh dấu phần tử hiện tại (cho Insertion Sort)
  const danhDauHienTai = (viTri, doTre = 0) => {
    const idThoiGian = setTimeout(() => {
      if (viTri >= 0 && viTri < thanhHienThi.length) {
        thanhHienThi[viTri].classList.add("current");
      }
    }, doTre);

    danhSachThoiGian.push(idThoiGian);

    return new Promise(resolve => {
      const idGiaiQuyet = setTimeout(resolve, doTre + layDoTre() / 2);
      danhSachThoiGian.push(idGiaiQuyet);
    });
  };

  // Hoán đổi hai phần tử
  const hoanDoi = (i, j, doTre = 0) => {
    const idThoiGian = setTimeout(() => {
      if (
        i >= 0 &&
        i < thanhHienThi.length &&
        j >= 0 &&
        j < thanhHienThi.length
      ) {
        // Hoán đổi giá trị trong mảng dữ liệu
        [mang[i], mang[j]] = [mang[j], mang[i]];

        // Hoán đổi chiều cao của các thanh
        const chieuCaoTam = thanhHienThi[i].style.height;
        thanhHienThi[i].style.height = thanhHienThi[j].style.height;
        thanhHienThi[j].style.height = chieuCaoTam;
      }
    }, doTre);

    danhSachThoiGian.push(idThoiGian);

    return new Promise(resolve => {
      const idGiaiQuyet = setTimeout(resolve, doTre + layDoTre());
      danhSachThoiGian.push(idGiaiQuyet);
    });
  };

  // Cập nhật giá trị của một phần tử
  const capNhatGiaTri = (viTri, giaTri, doTre = 0) => {
    const idThoiGian = setTimeout(() => {
      if (viTri >= 0 && viTri < mang.length) {
        mang[viTri] = giaTri;

        const giaTriLonNhat = Math.max(...mang);
        thanhHienThi[viTri].style.height = `${
          (giaTri / giaTriLonNhat) * 250
        }px`;
      }
    }, doTre);

    danhSachThoiGian.push(idThoiGian);

    return new Promise(resolve => {
      const idGiaiQuyet = setTimeout(resolve, doTre + layDoTre());
      danhSachThoiGian.push(idGiaiQuyet);
    });
  };

  // Public API
  return {
    // Khởi tạo mảng mới
    khoiTaoMang: function (mangMoi) {
      mang = [...mangMoi];
      taoThanhHienThi();
      datLaiHienThi();
    },

    // Đặt tốc độ animation
    datTocDo: function (tocDo) {
      tocDoHoatHoa = tocDo;
    },

    // Bắt đầu mô phỏng
    batDauHienThi: function () {
      datLaiHienThi();
      thoiGianBatDau = new Date().getTime();
      khoangThoiGian = setInterval(capNhatThoiGian, 10);
    },

    // Dừng mô phỏng
    dungHienThi: function () {
      xoaHieuUng();
    },

    // Đặt lại trạng thái
    datLai: datLaiHienThi,

    // Hiển thị bước
    hienThiBuoc: hienThiBuoc,

    // Đánh dấu các phần tử đang so sánh
    danhDauSoSanh: danhDauSoSanh,

    // Bỏ đánh dấu các phần tử đang so sánh
    boDanhDauSoSanh: boDanhDauSoSanh,

    // Đánh dấu phần tử là đã sắp xếp
    danhDauDaSapXep: danhDauDaSapXep,

    // Đánh dấu phần tử trục
    danhDauTruc: danhDauTruc,

    // Đánh dấu phần tử hiện tại
    danhDauHienTai: danhDauHienTai,

    // Hoán đổi hai phần tử
    hoanDoi: hoanDoi,

    // Cập nhật giá trị của một phần tử
    capNhatGiaTri: capNhatGiaTri,

    // Cập nhật số liệu thống kê
    capNhatThongKe: capNhatThongKe,

    // Lấy mảng hiện tại
    layMang: function () {
      return [...mang];
    },

    // Lấy thời gian trễ
    layDoTre: layDoTre,
  };
})();
