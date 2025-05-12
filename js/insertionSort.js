/**
 * Thuật toán Insertion Sort (Sắp xếp chèn)
 * Mô tả: Xây dựng mảng đã sắp xếp từng phần tử một
 * Độ phức tạp: O(n²) - trường hợp trung bình và xấu nhất, O(n) - trường hợp tốt nhất
 */

const SapXepChen = (function () {
  // Thông tin về thuật toán - được hiển thị trong phần mô tả thuật toán
  const thongTin = {
    name: "Insertion Sort",
    description: `
            <p>Insertion Sort là một thuật toán sắp xếp đơn giản, hoạt động bằng cách xây dựng mảng đã sắp xếp từng phần tử một.</p>
            <h3>Nguyên lý hoạt động:</h3>
            <ol>
                <li>Bắt đầu từ phần tử thứ hai (index = 1)</li>
                <li>So sánh phần tử hiện tại với phần tử bên trái</li>
                <li>Nếu phần tử hiện tại nhỏ hơn, di chuyển phần tử bên trái sang phải và tiếp tục so sánh với các phần tử bên trái khác</li>
                <li>Đặt phần tử hiện tại vào vị trí đúng trong mảng đã sắp xếp</li>
                <li>Lặp lại quá trình cho đến khi toàn bộ mảng được sắp xếp</li>
            </ol>
            <h3>Độ phức tạp:</h3>
            <ul>
                <li>Thời gian: O(n²) - trường hợp trung bình và xấu nhất, O(n) - trường hợp tốt nhất</li>
                <li>Không gian: O(1) - sắp xếp tại chỗ</li>
            </ul>
            <h3>Ưu điểm:</h3>
            <ul>
                <li>Đơn giản và dễ triển khai</li>
                <li>Hiệu quả với các mảng nhỏ</li>
                <li>Hiệu quả khi mảng gần như đã sắp xếp</li>
                <li>Ổn định (không thay đổi thứ tự các phần tử có giá trị bằng nhau)</li>
                <li>Có thể sắp xếp mảng theo thời gian thực (khi mảng đang được xây dựng)</li>
            </ul>
            <h3>Nhược điểm:</h3>
            <ul>
                <li>Không hiệu quả với các mảng lớn</li>
                <li>Hiệu suất kém hơn so với các thuật toán sắp xếp tiên tiến</li>
            </ul>
        `,
  };

  // Triển khai thuật toán Insertion Sort với mô phỏng trực quan
  // Hàm này nhận vào một mảng và trả về mảng đã sắp xếp
  const sapXep = async function (mang) {
    // Lấy độ dài của mảng - cần thiết cho vòng lặp
    const n = mang.length;

    // Khởi tạo biến đếm số lần so sánh và hoán đổi - dùng để hiển thị thống kê
    let soLanSoSanh = 0;
    let soLanHoanDoi = 0;

    // Độ trễ tích lũy cho các hiệu ứng animation - đảm bảo các hiệu ứng diễn ra tuần tự
    let doTre = 0;

    // Đánh dấu phần tử đầu tiên là đã sắp xếp
    // Thuật toán bắt đầu với giả định phần tử đầu tiên đã sắp xếp (mảng 1 phần tử luôn sắp xếp)
    await HienThi.danhDauDaSapXep([0], doTre);
    HienThi.hienThiBuoc("Coi phần tử đầu tiên đã được sắp xếp");

    // Vòng lặp chính - bắt đầu từ phần tử thứ 2 (index 1)
    // Với mỗi vòng lặp, chúng ta chèn phần tử hiện tại vào vị trí đúng trong mảng đã sắp xếp
    for (let i = 1; i < n; i++) {
      // Lưu giá trị hiện tại cần chèn - được gọi là "key" trong thuật toán
      const giaTri = mang[i];
      // j là chỉ số phần tử đang xét trong phần mảng đã sắp xếp (bên trái)
      let j = i - 1;

      // Hiển thị thông báo về việc chèn phần tử hiện tại
      HienThi.hienThiBuoc(`Chèn phần tử ${giaTri} vào vị trí thích hợp`);

      // Đánh dấu phần tử hiện tại đang xét (đổi màu)
      await HienThi.danhDauHienTai(i, doTre);
      doTre += HienThi.layDoTre ? HienThi.layDoTre() : 0;

      // Duyệt từ phải qua trái trong mảng đã sắp xếp
      // So sánh và dịch các phần tử lớn hơn key sang phải để tạo chỗ cho key
      while (j >= 0) {
        // So sánh phần tử trong mảng đã sắp xếp với key
        await HienThi.danhDauSoSanh([j, j + 1], doTre);
        soLanSoSanh++;
        HienThi.capNhatThongKe(soLanSoSanh, soLanHoanDoi);
        doTre += HienThi.layDoTre ? HienThi.layDoTre() : 0;

        // Nếu phần tử hiện tại lớn hơn key, dịch nó sang phải 1 vị trí
        if (mang[j] > giaTri) {
          // Hiển thị thông báo về việc dịch chuyển
          HienThi.hienThiBuoc(
            `${mang[j]} > ${giaTri}, di chuyển ${mang[j]} sang phải`
          );

          // Di chuyển phần tử sang phải - tạo khoảng trống cho key
          mang[j + 1] = mang[j];

          // Cập nhật hiển thị sau khi di chuyển
          await HienThi.capNhatGiaTri(j + 1, mang[j], doTre);

          // Tăng biến đếm số lần hoán đổi/di chuyển
          soLanHoanDoi++;
          HienThi.capNhatThongKe(soLanSoSanh, soLanHoanDoi);

          // Bỏ đánh dấu so sánh và di chuyển j sang trái để tiếp tục so sánh
          await HienThi.boDanhDauSoSanh([j, j + 1], doTre);
          j--;
        } else {
          // Nếu tìm thấy vị trí đúng (phần tử bên trái <= key), dừng vòng lặp
          HienThi.hienThiBuoc(`${mang[j]} <= ${giaTri}, dừng di chuyển`);
          await HienThi.boDanhDauSoSanh([j, j + 1], doTre);
          break;
        }
      }

      // Đặt key vào vị trí đúng - vị trí sau phần tử cuối cùng nhỏ hơn hoặc bằng key
      mang[j + 1] = giaTri;
      await HienThi.capNhatGiaTri(j + 1, giaTri, doTre);

      // Đánh dấu tất cả các phần tử từ 0 đến i là đã sắp xếp
      // Sau mỗi vòng lặp, phần đã sắp xếp tăng lên 1 phần tử
      const danhSachDaSapXep = Array.from({ length: i + 1 }, (_, idx) => idx);
      await HienThi.danhDauDaSapXep(danhSachDaSapXep, doTre);

      // Hiển thị thông báo về việc đã chèn xong phần tử
      HienThi.hienThiBuoc(`Đã chèn ${giaTri} vào vị trí ${j + 1}`);
    }

    // Trả về mảng đã sắp xếp
    return mang;
  };

  // Khai báo API công khai của module SapXepChen
  // Cho phép các module khác truy cập vào thông tin và hàm sắp xếp
  return {
    info: thongTin, // Thông tin mô tả thuật toán
    sort: sapXep, // Hàm thực hiện thuật toán sắp xếp
  };
})();
