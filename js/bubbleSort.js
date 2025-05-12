/**
 * Thuật toán Bubble Sort (Sắp xếp nổi bọt)
 * Mô tả: So sánh từng cặp phần tử liền kề và hoán đổi nếu chúng không theo thứ tự
 * Độ phức tạp: O(n²) - trường hợp trung bình và xấu nhất, O(n) - trường hợp tốt nhất
 */

const SapXepNoiBot = (function () {
  // Thông tin về thuật toán - được hiển thị trong phần mô tả thuật toán
  const thongTin = {
    name: "Bubble Sort",
    description: `
            <p>Bubble Sort là thuật toán sắp xếp đơn giản nhất, hoạt động bằng cách so sánh từng cặp phần tử liền kề và hoán đổi chúng nếu chúng không theo thứ tự.</p>
            <h3>Nguyên lý hoạt động:</h3>
            <ol>
                <li>So sánh phần tử đầu tiên với phần tử thứ hai</li>
                <li>Nếu phần tử đầu tiên lớn hơn, hoán đổi chúng</li>
                <li>Tiếp tục so sánh phần tử thứ hai với phần tử thứ ba</li>
                <li>Lặp lại cho đến khi đạt đến cuối mảng</li>
                <li>Lặp lại các bước trên cho đến khi không còn phần tử nào cần hoán đổi</li>
            </ol>
            <h3>Độ phức tạp:</h3>
            <ul>
                <li>Thời gian: O(n²) - trường hợp trung bình và xấu nhất, O(n) - trường hợp tốt nhất</li>
                <li>Không gian: O(1) - sắp xếp tại chỗ</li>
            </ul>
            <h3>Ưu điểm:</h3>
            <ul>
                <li>Đơn giản, dễ hiểu và dễ triển khai</li>
                <li>Không yêu cầu bộ nhớ bổ sung</li>
                <li>Hoạt động tốt với các mảng nhỏ</li>
            </ul>
            <h3>Nhược điểm:</h3>
            <ul>
                <li>Không hiệu quả với các mảng lớn</li>
                <li>Hiệu suất kém hơn so với các thuật toán sắp xếp khác</li>
            </ul>
        `,
  };

  // Triển khai thuật toán Bubble Sort với mô phỏng trực quan
  // Hàm này nhận vào một mảng và trả về mảng đã sắp xếp
  const sapXep = async function (mang) {
    // Lấy độ dài của mảng - cần thiết cho vòng lặp
    const n = mang.length;

    // Khởi tạo biến đếm số lần so sánh và hoán đổi - dùng để hiển thị thống kê
    let soLanSoSanh = 0;
    let soLanHoanDoi = 0;

    // Độ trễ tích lũy cho các hiệu ứng animation - đảm bảo các hiệu ứng diễn ra tuần tự
    let doTre = 0;

    // Cờ đánh dấu có hoán đổi nào được thực hiện trong lần lặp hiện tại
    // Giúp tối ưu thuật toán: nếu không có hoán đổi nào trong một lượt, mảng đã sắp xếp
    let daHoanDoi;

    // Vòng lặp ngoài: thực hiện tối đa n-1 lượt quét
    // Mỗi lượt quét sẽ đưa phần tử lớn nhất còn lại về cuối mảng
    for (let i = 0; i < n - 1; i++) {
      // Reset cờ daHoanDoi cho mỗi lượt quét mới
      daHoanDoi = false;

      // Hiển thị thông báo về lượt lặp hiện tại
      HienThi.hienThiBuoc(`Lần lặp thứ ${i + 1}`);

      // Vòng lặp trong: so sánh từng cặp phần tử liền kề
      // Chỉ cần duyệt đến n-i-1 vì i phần tử cuối đã được sắp xếp
      for (let j = 0; j < n - i - 1; j++) {
        // So sánh phần tử hiện tại với phần tử kế tiếp
        // Đánh dấu hai phần tử đang so sánh (đổi màu) để hiển thị trực quan
        await HienThi.danhDauSoSanh([j, j + 1], doTre);

        // Tăng biến đếm số lần so sánh
        soLanSoSanh++;

        // Cập nhật hiển thị thống kê (số lần so sánh, số lần hoán đổi)
        HienThi.capNhatThongKe(soLanSoSanh, soLanHoanDoi);

        // Tăng độ trễ tích lũy cho các hiệu ứng tiếp theo
        doTre += HienThi.layDoTre ? HienThi.layDoTre() : 0;

        // So sánh giá trị hai phần tử: nếu phần tử hiện tại lớn hơn phần tử kế tiếp, hoán đổi chúng
        if (mang[j] > mang[j + 1]) {
          // Hiển thị thông báo về việc hoán đổi
          HienThi.hienThiBuoc(`Hoán đổi ${mang[j]} và ${mang[j + 1]}`);

          // Hoán đổi hai phần tử trong mảng dữ liệu
          // Sử dụng cú pháp destructuring của ES6 để hoán đổi giá trị
          [mang[j], mang[j + 1]] = [mang[j + 1], mang[j]];

          // Gọi hàm mô phỏng hoán đổi để hiển thị trực quan
          await HienThi.hoanDoi(j, j + 1, doTre);

          // Đánh dấu đã có hoán đổi trong lượt quét này
          daHoanDoi = true;

          // Tăng biến đếm số lần hoán đổi
          soLanHoanDoi++;

          // Cập nhật hiển thị thống kê
          HienThi.capNhatThongKe(soLanSoSanh, soLanHoanDoi);
        }

        // Bỏ đánh dấu hai phần tử sau khi đã so sánh xong (trả về màu ban đầu)
        await HienThi.boDanhDauSoSanh([j, j + 1], doTre);
      }

      // Sau mỗi lượt quét, phần tử lớn nhất còn lại đã được đưa về đúng vị trí cuối cùng chưa sắp xếp
      // Đánh dấu phần tử này là đã sắp xếp (đổi màu)
      await HienThi.danhDauDaSapXep([n - i - 1], doTre);

      // Nếu không có hoán đổi nào trong lượt quét vừa rồi, mảng đã sắp xếp
      // => Tối ưu: không cần thực hiện các lượt quét còn lại
      if (!daHoanDoi) {
        HienThi.hienThiBuoc("Mảng đã sắp xếp, dừng thuật toán");
        break;
      }
    }

    // Sau khi thuật toán hoàn thành, đánh dấu tất cả các phần tử còn lại là đã sắp xếp
    // (Thường là các phần tử đầu mảng nếu thuật toán dừng sớm do tối ưu)
    const danhSachViTriConLai = Array.from({ length: n }, (_, i) => i).filter(
      i => i < n
    );
    await HienThi.danhDauDaSapXep(danhSachViTriConLai, doTre);

    // Trả về mảng đã sắp xếp
    return mang;
  };

  // Khai báo API công khai của module SapXepNoiBot
  // Cho phép các module khác truy cập vào thông tin và hàm sắp xếp
  return {
    info: thongTin, // Thông tin mô tả thuật toán
    sort: sapXep, // Hàm thực hiện thuật toán sắp xếp
  };
})();
