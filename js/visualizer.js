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
  let khungDemPhanTu = document.getElementById("elementCounts");

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

  // Đếm số phần tử trong các cột giá trị
  const demPhanTu = () => {
    // Tạo một đối tượng để đếm số lượng phần tử cho mỗi giá trị
    const demGiaTri = {};

    // Đếm số lượng phần tử cho mỗi giá trị
    mang.forEach(giaTri => {
      if (demGiaTri[giaTri]) {
        demGiaTri[giaTri]++;
      } else {
        demGiaTri[giaTri] = 1;
      }
    });

    return demGiaTri;
  };

  // Hiển thị số lượng phần tử trong các cột
  const hienThiDemPhanTu = () => {
    // Đếm số lượng phần tử cho mỗi giá trị
    const demGiaTri = demPhanTu();

    // Xóa nội dung hiện tại
    khungDemPhanTu.innerHTML = "";

    // Tạo danh sách các giá trị được sắp xếp
    const danhSachGiaTri = Object.keys(demGiaTri).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );

    // Hiển thị số lượng phần tử cho mỗi giá trị
    danhSachGiaTri.forEach(giaTri => {
      const phanTuDem = document.createElement("div");
      phanTuDem.className = "count-item";
      phanTuDem.textContent = `Giá trị ${giaTri}: ${demGiaTri[giaTri]} phần tử`;
      khungDemPhanTu.appendChild(phanTuDem);
    });
  };

  // Tạo thanh hiển thị cho mảng
  const taoThanhHienThi = () => {
    khungMang.innerHTML = "";
    thanhHienThi = [];

    const giaTriLonNhat = Math.max(...mang);
    const doRongThanh = Math.max(5, Math.min(20, 500 / mang.length));

    // Thêm class để ẩn giá trị khi có quá nhiều phần tử
    if (mang.length > 50) {
      khungMang.classList.add("large-array");
    } else {
      khungMang.classList.remove("large-array");
    }

    mang.forEach((giaTri, viTri) => {
      const khungThanh = document.createElement("div");
      khungThanh.className = "bar-wrapper";
      khungThanh.style.width = `${doRongThanh}px`;

      const thanh = document.createElement("div");
      thanh.className = "array-bar";
      thanh.style.height = `${(giaTri / giaTriLonNhat) * 250}px`;
      thanh.style.width = `100%`;

      const giaTriHienThi = document.createElement("div");
      giaTriHienThi.className = "bar-value";
      giaTriHienThi.textContent = giaTri;

      khungThanh.appendChild(thanh);
      khungThanh.appendChild(giaTriHienThi);

      khungMang.appendChild(khungThanh);
      thanhHienThi.push(thanh);
    });

    // Hiển thị số lượng phần tử trong các cột
    hienThiDemPhanTu();
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

    // Cập nhật hiển thị số lượng phần tử
    hienThiDemPhanTu();
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

        // Lấy các wrapper chứa thanh và giá trị
        const wrapperI = thanhHienThi[i].parentElement;
        const wrapperJ = thanhHienThi[j].parentElement;

        // Cập nhật giá trị hiển thị
        wrapperI.querySelector(".bar-value").textContent = mang[i];
        wrapperJ.querySelector(".bar-value").textContent = mang[j];

        // Hoán đổi chiều cao của các thanh
        const chieuCaoTam = thanhHienThi[i].style.height;
        thanhHienThi[i].style.height = thanhHienThi[j].style.height;
        thanhHienThi[j].style.height = chieuCaoTam;

        // Cập nhật hiển thị số lượng phần tử
        hienThiDemPhanTu();
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

        // Cập nhật giá trị hiển thị
        const wrapper = thanhHienThi[viTri].parentElement;
        wrapper.querySelector(".bar-value").textContent = giaTri;

        // Cập nhật hiển thị số lượng phần tử
        hienThiDemPhanTu();
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

    // Hiển thị đếm phần tử
    hienThiDemPhanTu: hienThiDemPhanTu,
  };
})();
