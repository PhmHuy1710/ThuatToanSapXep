/**
 * Thuật toán Merge Sort (Sắp xếp trộn)
 * Mô tả: Chia mảng thành các mảng con, sắp xếp và gộp lại
 * Độ phức tạp: O(n log n) - mọi trường hợp
 */

const SapXepTron = (function () {
  // Thông tin về thuật toán - được hiển thị trong phần mô tả thuật toán
  const thongTin = {
    name: "Merge Sort",
    description: `
            <p>Merge Sort là một thuật toán sắp xếp dựa trên nguyên lý chia để trị (divide and conquer).</p>
            <h3>Nguyên lý hoạt động:</h3>
            <ol>
                <li>Chia mảng thành hai nửa (cho đến khi mỗi mảng con chỉ còn một phần tử)</li>
                <li>Gọi đệ quy Merge Sort cho hai nửa</li>
                <li>Gộp hai nửa đã sắp xếp thành một mảng đã sắp xếp</li>
            </ol>
            <h3>Độ phức tạp:</h3>
            <ul>
                <li>Thời gian: O(n log n) - mọi trường hợp</li>
                <li>Không gian: O(n) - cần bộ nhớ phụ trợ</li>
            </ul>
            <h3>Ưu điểm:</h3>
            <ul>
                <li>Độ phức tạp thời gian ổn định O(n log n)</li>
                <li>Ổn định (các phần tử có giá trị bằng nhau giữ nguyên thứ tự)</li>
                <li>Phù hợp với các tập dữ liệu lớn</li>
            </ul>
            <h3>Nhược điểm:</h3>
            <ul>
                <li>Yêu cầu bộ nhớ bổ sung O(n)</li>
                <li>Chậm hơn Insertion Sort cho các mảng nhỏ</li>
            </ul>
        `,
  };

  // Biến đếm toàn cục cho thống kê
  let soLanSoSanh = 0; // Đếm số lần so sánh giữa các phần tử
  let soLanTruyXuat = 0; // Đếm số lần đọc/ghi mảng (phản ánh chi phí không gian)
  let doTre = 0; // Độ trễ tích lũy cho các hiệu ứng animation

  // Triển khai thuật toán Merge Sort với mô phỏng trực quan
  // Hàm này nhận vào một mảng và trả về mảng đã sắp xếp
  const sapXep = async function (mang) {
    // Reset biến đếm mỗi khi bắt đầu sắp xếp
    soLanSoSanh = 0;
    soLanTruyXuat = 0;
    doTre = 0;

    // Cập nhật hiển thị thống kê ban đầu
    HienThi.capNhatThongKe(soLanSoSanh, soLanTruyXuat);

    // Gọi hàm sapXepTron đệ quy với toàn bộ mảng (từ chỉ số 0 đến n-1)
    await sapXepTron(mang, 0, mang.length - 1);

    // Đánh dấu toàn bộ mảng là đã sắp xếp khi hoàn thành
    const danhSachTatCa = Array.from({ length: mang.length }, (_, i) => i);
    await HienThi.danhDauDaSapXep(danhSachTatCa, doTre);

    // Trả về mảng đã sắp xếp
    return mang;
  };

  // Hàm sapXepTron đệ quy - triển khai chiến lược chia để trị
  // Tham số: mảng cần sắp xếp, chỉ số trái, chỉ số phải
  const sapXepTron = async function (mang, trai, phai) {
    // Điều kiện dừng đệ quy: mảng chỉ có 1 phần tử hoặc không có phần tử nào
    if (trai < phai) {
      // Tìm điểm giữa để chia mảng thành hai nửa
      const giua = Math.floor((trai + phai) / 2);

      // Hiển thị thông tin về phần mảng đang được chia
      HienThi.hienThiBuoc(
        `Chia mảng: [${trai}...${giua}] và [${giua + 1}...${phai}]`
      );

      // Đánh dấu phần mảng đang xử lý để hiển thị trực quan
      const phanDangXuLy = Array.from(
        { length: phai - trai + 1 },
        (_, i) => trai + i
      );
      await HienThi.danhDauSoSanh(phanDangXuLy, doTre);
      doTre += HienThi.layDoTre ? HienThi.layDoTre() : 0;
      await HienThi.boDanhDauSoSanh(phanDangXuLy, doTre);

      // Gọi đệ quy để sắp xếp nửa đầu của mảng
      await sapXepTron(mang, trai, giua);

      // Gọi đệ quy để sắp xếp nửa sau của mảng
      await sapXepTron(mang, giua + 1, phai);

      // Gộp hai nửa đã sắp xếp lại với nhau
      await tron(mang, trai, giua, phai);
    }
  };

  // Hàm gộp hai mảng con đã sắp xếp lại với nhau
  // Tham số: mảng, chỉ số trái, chỉ số giữa, chỉ số phải
  const tron = async function (mang, trai, giua, phai) {
    // Tính kích thước của hai mảng con cần gộp
    const n1 = giua - trai + 1; // Số phần tử của mảng con bên trái
    const n2 = phai - giua; // Số phần tử của mảng con bên phải

    // Hiển thị thông tin về hai mảng con đang được gộp
    HienThi.hienThiBuoc(
      `Gộp các mảng con: [${trai}...${giua}] và [${giua + 1}...${phai}]`
    );

    // Tạo hai mảng tạm để lưu hai mảng con
    const mangTrai = new Array(n1);
    const mangPhai = new Array(n2);

    // Sao chép dữ liệu vào mảng tạm bên trái
    for (let i = 0; i < n1; i++) {
      mangTrai[i] = mang[trai + i];
      soLanTruyXuat += 2; // Đọc và ghi - tăng biến đếm truy xuất
    }

    // Sao chép dữ liệu vào mảng tạm bên phải
    for (let j = 0; j < n2; j++) {
      mangPhai[j] = mang[giua + 1 + j];
      soLanTruyXuat += 2; // Đọc và ghi - tăng biến đếm truy xuất
    }

    // Khai báo chỉ số cho quá trình gộp mảng
    let i = 0; // Chỉ số cho mangTrai
    let j = 0; // Chỉ số cho mangPhai
    let k = trai; // Chỉ số cho mảng kết quả (mảng ban đầu)

    // Gộp hai mảng tạm vào mảng kết quả theo thứ tự tăng dần
    while (i < n1 && j < n2) {
      // So sánh phần tử của hai mảng con
      soLanSoSanh++;
      HienThi.capNhatThongKe(soLanSoSanh, soLanTruyXuat);

      // Đánh dấu phần tử đang so sánh của cả hai mảng con
      await HienThi.danhDauSoSanh([trai + i, giua + 1 + j], doTre);
      doTre += HienThi.layDoTre ? HienThi.layDoTre() : 0;

      // So sánh và chọn phần tử nhỏ hơn để đưa vào mảng kết quả
      if (mangTrai[i] <= mangPhai[j]) {
        // Nếu phần tử bên trái nhỏ hơn hoặc bằng, chọn phần tử bên trái
        HienThi.hienThiBuoc(
          `${mangTrai[i]} <= ${mangPhai[j]}, chọn từ mảng bên trái`
        );
        mang[k] = mangTrai[i];
        await HienThi.capNhatGiaTri(k, mangTrai[i], doTre);
        i++; // Di chuyển chỉ số mảng trái
      } else {
        // Nếu phần tử bên phải nhỏ hơn, chọn phần tử bên phải
        HienThi.hienThiBuoc(
          `${mangTrai[i]} > ${mangPhai[j]}, chọn từ mảng bên phải`
        );
        mang[k] = mangPhai[j];
        await HienThi.capNhatGiaTri(k, mangPhai[j], doTre);
        j++; // Di chuyển chỉ số mảng phải
      }

      // Tăng biến đếm truy xuất và cập nhật thống kê
      soLanTruyXuat++;
      HienThi.capNhatThongKe(soLanSoSanh, soLanTruyXuat);

      // Bỏ đánh dấu phần tử đã so sánh
      await HienThi.boDanhDauSoSanh([trai + i - 1, giua + 1 + j - 1], doTre);
      k++; // Di chuyển chỉ số mảng kết quả
    }

    // Sao chép các phần tử còn lại của mangTrai (nếu có)
    // Trường hợp này xảy ra khi đã duyệt hết mangPhai nhưng mangTrai vẫn còn phần tử
    while (i < n1) {
      HienThi.hienThiBuoc(
        `Sao chép phần tử còn lại từ mảng bên trái: ${mangTrai[i]}`
      );
      mang[k] = mangTrai[i];
      await HienThi.capNhatGiaTri(k, mangTrai[i], doTre);

      soLanTruyXuat++;
      HienThi.capNhatThongKe(soLanSoSanh, soLanTruyXuat);

      i++;
      k++;
    }

    // Sao chép các phần tử còn lại của mangPhai (nếu có)
    // Trường hợp này xảy ra khi đã duyệt hết mangTrai nhưng mangPhai vẫn còn phần tử
    while (j < n2) {
      HienThi.hienThiBuoc(
        `Sao chép phần tử còn lại từ mảng bên phải: ${mangPhai[j]}`
      );
      mang[k] = mangPhai[j];
      await HienThi.capNhatGiaTri(k, mangPhai[j], doTre);

      soLanTruyXuat++;
      HienThi.capNhatThongKe(soLanSoSanh, soLanTruyXuat);

      j++;
      k++;
    }

    // Đánh dấu phần đã gộp là đã sắp xếp
    // Sau khi gộp xong, đoạn từ trai đến phai đã được sắp xếp
    const phanDaGop = Array.from(
      { length: phai - trai + 1 },
      (_, i) => trai + i
    );
    await HienThi.danhDauDaSapXep(phanDaGop, doTre);
    doTre += HienThi.layDoTre ? HienThi.layDoTre() : 0;
  };

  // Khai báo API công khai của module SapXepTron
  // Cho phép các module khác truy cập vào thông tin và hàm sắp xếp
  return {
    info: thongTin, // Thông tin mô tả thuật toán
    sort: sapXep, // Hàm thực hiện thuật toán sắp xếp
  };
})();
