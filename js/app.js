/**
 * File JavaScript chính
 * Kết nối các module và xử lý sự kiện
 */

document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const khungMang = document.getElementById("arrayContainer");
  const nutSapXepNoiBot = document.getElementById("bubbleSortBtn");
  const nutSapXepChen = document.getElementById("insertionSortBtn");
  const nutSapXepTron = document.getElementById("mergeSortBtn");
  const nutSapXepNhanh = document.getElementById("quickSortBtn");
  const nutTaoMang = document.getElementById("generateArrayBtn");
  const nutBatDau = document.getElementById("sortBtn");
  const nutTamDung = document.getElementById("pauseBtn");
  const nutDatLai = document.getElementById("resetBtn");
  const kichThuocMang = document.getElementById("arraySize");
  const hienThiKichThuoc = document.getElementById("arraySizeValue");
  const tocDoSapXep = document.getElementById("sortingSpeed");
  const hienThiTocDo = document.getElementById("sortingSpeedValue");
  const moTaThuatToan = document.getElementById("algorithmDescription");
  const nhapThuCong = document.getElementById("manualArrayInput");
  const nutApDungThuCong = document.getElementById("applyManualArrayBtn");

  // Biến trạng thái
  let mangHienTai = [];
  let thuatToanHienTai = null;
  let dangSapXep = false;
  let daDung = false;
  let thoiGianBatDau = 0;
  let thoiGianKetThuc = 0;

  // Khởi tạo ứng dụng
  function khoiTao() {
    // Thiết lập sự kiện
    nutSapXepNoiBot.addEventListener("click", () =>
      chonThuatToan(SapXepNoiBot)
    );
    nutSapXepChen.addEventListener("click", () => chonThuatToan(SapXepChen));
    nutSapXepTron.addEventListener("click", () => chonThuatToan(SapXepTron));
    nutSapXepNhanh.addEventListener("click", () => chonThuatToan(SapXepNhanh));

    nutTaoMang.addEventListener("click", taoMangNgauNhien);
    nutBatDau.addEventListener("click", batDauSapXep);
    nutTamDung.addEventListener("click", tamDungTiepTuc);
    nutDatLai.addEventListener("click", datLai);
    nutApDungThuCong.addEventListener("click", apDungMangThuCong);

    kichThuocMang.addEventListener("input", capNhatHienThiKichThuoc);
    kichThuocMang.addEventListener("change", taoMangNgauNhien);

    tocDoSapXep.addEventListener("input", capNhatHienThiTocDo);
    tocDoSapXep.addEventListener("change", capNhatTocDo);

    // Khởi tạo giá trị ban đầu
    capNhatHienThiKichThuoc();
    capNhatHienThiTocDo();
    taoMangNgauNhien();
    chonThuatToan(SapXepNoiBot); // Chọn Bubble Sort làm mặc định
  }

  // Cập nhật hiển thị kích thước mảng
  function capNhatHienThiKichThuoc() {
    hienThiKichThuoc.textContent = kichThuocMang.value;
  }

  // Cập nhật hiển thị tốc độ sắp xếp
  function capNhatHienThiTocDo() {
    hienThiTocDo.textContent = tocDoSapXep.value;
  }

  // Cập nhật tốc độ sắp xếp
  function capNhatTocDo() {
    HienThi.datTocDo(parseInt(tocDoSapXep.value));
  }

  // Xử lý nhập mảng thủ công
  function apDungMangThuCong() {
    // Lấy giá trị input và xử lý
    const dauVao = nhapThuCong.value.trim();
    if (!dauVao) {
      alert("Vui lòng nhập các số ngăn cách bởi dấu phẩy!");
      return;
    }

    // Chuyển đổi chuỗi input thành mảng số
    try {
      const mangMoi = dauVao.split(",").map(item => {
        const so = parseInt(item.trim());
        if (isNaN(so)) {
          throw new Error("Dữ liệu không hợp lệ");
        }
        return so;
      });

      if (mangMoi.length < 2) {
        alert("Vui lòng nhập ít nhất 2 số!");
        return;
      }

      if (mangMoi.length > 100) {
        alert("Số lượng phần tử không được vượt quá 100!");
        return;
      }

      // Cập nhật mảng hiện tại
      mangHienTai = mangMoi;
      kichThuocMang.value = mangHienTai.length;
      hienThiKichThuoc.textContent = mangHienTai.length;

      // Hiển thị mảng
      HienThi.khoiTaoMang(mangHienTai);
      HienThi.hienThiDemPhanTu();

      kichHoatNutSapXep();
    } catch (e) {
      alert(
        "Dữ liệu không hợp lệ. Vui lòng nhập các số ngăn cách bởi dấu phẩy!"
      );
    }
  }

  // Tạo mảng ngẫu nhiên
  function taoMangNgauNhien() {
    const kichThuoc = parseInt(kichThuocMang.value);
    mangHienTai = Array.from(
      { length: kichThuoc },
      () => Math.floor(Math.random() * 100) + 1
    );
    HienThi.khoiTaoMang(mangHienTai);
    HienThi.hienThiDemPhanTu();

    kichHoatNutSapXep();
  }

  // Chọn thuật toán
  function chonThuatToan(thuatToan) {
    // Bỏ chọn tất cả các nút thuật toán
    const cacNutThuatToan = document.querySelectorAll(".algorithm-btn");
    cacNutThuatToan.forEach(nut => nut.classList.remove("active"));

    // Xác định nút đang được chọn
    switch (thuatToan) {
      case SapXepNoiBot:
        nutSapXepNoiBot.classList.add("active");
        break;
      case SapXepChen:
        nutSapXepChen.classList.add("active");
        break;
      case SapXepTron:
        nutSapXepTron.classList.add("active");
        break;
      case SapXepNhanh:
        nutSapXepNhanh.classList.add("active");
        break;
    }

    thuatToanHienTai = thuatToan;
    moTaThuatToan.innerHTML = thuatToan.info.description;

    kichHoatNutSapXep();
  }

  // Bắt đầu sắp xếp
  async function batDauSapXep() {
    if (!thuatToanHienTai || dangSapXep) return;

    dangSapXep = true;
    daDung = false;
    thoiGianBatDau = new Date().getTime();
    capNhatDieuKhien();

    HienThi.batDauHienThi();

    try {
      await thuatToanHienTai.sort([...mangHienTai]);

      // Kết thúc sắp xếp
      thoiGianKetThuc = new Date().getTime();
      dangSapXep = false;

      // Dừng bộ đếm thời gian
      HienThi.dungHienThi();

      // Cập nhật thời gian cuối cùng
      const thoiGianThucHien = (thoiGianKetThuc - thoiGianBatDau) / 1000;
      document.getElementById("timeElapsed").textContent =
        thoiGianThucHien.toFixed(2) + "s";

      capNhatDieuKhien();
    } catch (error) {
      console.error("Lỗi trong quá trình sắp xếp:", error);
      dangSapXep = false;
      // Dừng bộ đếm thời gian nếu có lỗi
      HienThi.dungHienThi();
      capNhatDieuKhien();
    }
  }

  // Tạm dừng/tiếp tục sắp xếp
  function tamDungTiepTuc() {
    if (!dangSapXep) return;

    daDung = !daDung;

    if (daDung) {
      HienThi.dungHienThi();
      nutTamDung.textContent = "Tiếp tục";
    } else {
      batDauSapXep();
      nutTamDung.textContent = "Tạm dừng";
    }
  }

  // Đặt lại ứng dụng
  function datLai() {
    if (dangSapXep) {
      HienThi.dungHienThi();
      dangSapXep = false;
      daDung = false;
    }

    taoMangNgauNhien();
    HienThi.hienThiDemPhanTu();
    capNhatDieuKhien();
  }

  // Cập nhật trạng thái các điều khiển
  function capNhatDieuKhien() {
    const cacNutThuatToan = document.querySelectorAll(".algorithm-btn");

    if (dangSapXep) {
      // Đang sắp xếp
      nutTaoMang.disabled = true;
      nutBatDau.disabled = true;
      nutTamDung.disabled = false;
      nutDatLai.disabled = false;
      kichThuocMang.disabled = true;
      nhapThuCong.disabled = true;
      nutApDungThuCong.disabled = true;
      cacNutThuatToan.forEach(nut => (nut.disabled = true));
    } else {
      // Không sắp xếp
      nutTaoMang.disabled = false;
      nutBatDau.disabled = false;
      nutTamDung.disabled = true;
      nutDatLai.disabled = false;
      kichThuocMang.disabled = false;
      nhapThuCong.disabled = false;
      nutApDungThuCong.disabled = false;
      cacNutThuatToan.forEach(nut => (nut.disabled = false));
    }
  }

  // Kích hoạt nút sắp xếp
  function kichHoatNutSapXep() {
    if (thuatToanHienTai && mangHienTai.length > 0 && !dangSapXep) {
      nutBatDau.disabled = false;
    }
  }

  // Khởi tạo ứng dụng
  khoiTao();
});
