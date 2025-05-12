/**
 * Thuật toán Quick Sort (Sắp xếp nhanh)
 * Mô tả: Chia để trị dựa trên pivot, sắp xếp các phần tử nhỏ hơn và lớn hơn pivot
 * Độ phức tạp: O(n log n) - trường hợp trung bình, O(n²) - trường hợp xấu nhất
 */

const SapXepNhanh = (function () {
  // Thông tin về thuật toán - được hiển thị trong phần mô tả thuật toán
  const thongTin = {
    name: "Quick Sort",
    description: `
            <p>Quick Sort là một thuật toán sắp xếp hiệu quả dựa trên chiến lược chia để trị (divide and conquer).</p>
            <h3>Nguyên lý hoạt động:</h3>
            <ol>
                <li>Chọn một phần tử làm "pivot" (điểm trụ)</li>
                <li>Phân vùng mảng: đưa các phần tử nhỏ hơn pivot về bên trái và lớn hơn pivot về bên phải</li>
                <li>Gọi đệ quy Quick Sort cho các mảng con bên trái và bên phải pivot</li>
            </ol>
            <h3>Độ phức tạp:</h3>
            <ul>
                <li>Thời gian: O(n log n) - trường hợp trung bình, O(n²) - trường hợp xấu nhất</li>
                <li>Không gian: O(log n) - do đệ quy</li>
            </ul>
            <h3>Ưu điểm:</h3>
            <ul>
                <li>Hiệu quả cao trong thực tế</li>
                <li>Sắp xếp tại chỗ (không cần bộ nhớ phụ trợ lớn)</li>
                <li>Làm việc tốt với bộ nhớ cache</li>
                <li>Dễ triển khai</li>
            </ul>
            <h3>Nhược điểm:</h3>
            <ul>
                <li>Không ổn định (thứ tự của các phần tử có giá trị bằng nhau có thể thay đổi)</li>
                <li>Trường hợp xấu nhất O(n²) nếu chọn pivot không tốt</li>
                <li>Hiệu suất phụ thuộc vào chiến lược chọn pivot</li>
            </ul>
        `,
  };

  // Biến đếm toàn cục cho thống kê
  let soLanSoSanh = 0; // Đếm số lần so sánh giữa các phần tử
  let soLanHoanDoi = 0; // Đếm số lần hoán đổi phần tử
  let doTre = 0; // Độ trễ tích lũy cho các hiệu ứng animation

  // Triển khai thuật toán Quick Sort với mô phỏng trực quan
  // Hàm này nhận vào một mảng và trả về mảng đã sắp xếp
  const sapXep = async function (mang) {
    // Reset biến đếm mỗi khi bắt đầu sắp xếp
    soLanSoSanh = 0;
    soLanHoanDoi = 0;
    doTre = 0;

    // Cập nhật hiển thị thống kê ban đầu
    HienThi.capNhatThongKe(soLanSoSanh, soLanHoanDoi);

    // Gọi hàm sapXepNhanh đệ quy với toàn bộ mảng (từ chỉ số 0 đến n-1)
    await sapXepNhanh(mang, 0, mang.length - 1);

    // Đánh dấu toàn bộ mảng là đã sắp xếp khi hoàn thành
    const danhSachTatCa = Array.from({ length: mang.length }, (_, i) => i);
    await HienThi.danhDauDaSapXep(danhSachTatCa, doTre);

    // Trả về mảng đã sắp xếp
    return mang;
  };

  // Hàm sapXepNhanh đệ quy - triển khai chiến lược chia để trị
  // Tham số: mảng cần sắp xếp, chỉ số thấp nhất, chỉ số cao nhất
  const sapXepNhanh = async function (mang, thapNhat, caoNhat) {
    // Điều kiện dừng đệ quy: đoạn cần sắp xếp có ít nhất 2 phần tử
    if (thapNhat < caoNhat) {
      // Hiển thị thông tin về đoạn đang được sắp xếp
      HienThi.hienThiBuoc(
        `Áp dụng Quick Sort cho đoạn [${thapNhat}...${caoNhat}]`
      );

      // Phân vùng mảng và nhận vị trí cuối cùng của pivot
      // Sau bước này, tất cả phần tử bên trái pivot < pivot và bên phải pivot > pivot
      const viTriTruc = await phanVung(mang, thapNhat, caoNhat);

      // Hiển thị thông báo pivot đã ở đúng vị trí
      HienThi.hienThiBuoc(
        `Pivot ${mang[viTriTruc]} đã ở đúng vị trí ${viTriTruc}`
      );

      // Đánh dấu pivot đã ở đúng vị trí cuối cùng (đã sắp xếp)
      await HienThi.danhDauDaSapXep([viTriTruc], doTre);

      // Gọi đệ quy để sắp xếp mảng con bên trái pivot
      await sapXepNhanh(mang, thapNhat, viTriTruc - 1);

      // Gọi đệ quy để sắp xếp mảng con bên phải pivot
      await sapXepNhanh(mang, viTriTruc + 1, caoNhat);
    } else if (thapNhat === caoNhat) {
      // Trường hợp đặc biệt: mảng chỉ có 1 phần tử - đã tự sắp xếp
      await HienThi.danhDauDaSapXep([thapNhat], doTre);
    }
  };

  // Hàm phân vùng mảng dựa trên pivot
  // Hàm này sắp xếp mảng sao cho các phần tử nhỏ hơn pivot ở bên trái
  // và các phần tử lớn hơn pivot ở bên phải, sau đó trả về vị trí cuối cùng của pivot
  const phanVung = async function (mang, thapNhat, caoNhat) {
    // Chọn phần tử cuối cùng làm pivot
    // Đây là chiến lược chọn pivot đơn giản, nhưng không phải lúc nào cũng tối ưu
    const truc = mang[caoNhat];
    HienThi.hienThiBuoc(`Chọn pivot = ${truc}`);

    // Đánh dấu pivot để hiển thị trực quan
    await HienThi.danhDauTruc(caoNhat, doTre);
    doTre += HienThi.layDoTre ? HienThi.layDoTre() : 0;

    // i là chỉ số của phần tử nhỏ hơn pivot cuối cùng đã tìm thấy
    // ban đầu thiết lập trước vị trí đầu tiên của mảng
    let i = thapNhat - 1;

    // Duyệt qua tất cả các phần tử từ thapNhat đến caoNhat-1 (trừ pivot)
    for (let j = thapNhat; j <= caoNhat - 1; j++) {
      // So sánh phần tử hiện tại với pivot
      await HienThi.danhDauSoSanh([j, caoNhat], doTre);
      soLanSoSanh++;
      HienThi.capNhatThongKe(soLanSoSanh, soLanHoanDoi);
      doTre += HienThi.layDoTre ? HienThi.layDoTre() : 0;

      // Nếu phần tử hiện tại nhỏ hơn pivot
      if (mang[j] < truc) {
        // Tăng i để chỉ đến vị trí tiếp theo trong vùng nhỏ hơn pivot
        i++;

        // Hiển thị thông báo về việc hoán đổi
        HienThi.hienThiBuoc(
          `${mang[j]} < ${truc}, hoán đổi ${mang[i]} và ${mang[j]}`
        );

        // Hoán đổi phần tử thứ i và phần tử thứ j
        // Di chuyển phần tử nhỏ hơn pivot vào vùng bên trái
        [mang[i], mang[j]] = [mang[j], mang[i]];
        await HienThi.hoanDoi(i, j, doTre);

        // Tăng biến đếm số lần hoán đổi và cập nhật thống kê
        soLanHoanDoi++;
        HienThi.capNhatThongKe(soLanSoSanh, soLanHoanDoi);
        doTre += HienThi.layDoTre ? HienThi.layDoTre() : 0;
      } else {
        // Phần tử lớn hơn hoặc bằng pivot - giữ nguyên vị trí
        HienThi.hienThiBuoc(`${mang[j]} >= ${truc}, không hoán đổi`);
      }

      // Bỏ đánh dấu phần tử sau khi so sánh
      await HienThi.boDanhDauSoSanh([j, caoNhat], doTre);
    }

    // Hoán đổi pivot (phần tử ở caoNhat) với phần tử đầu tiên lớn hơn pivot (tại i+1)
    // Sau bước này, pivot sẽ ở đúng vị trí cuối cùng của nó trong mảng đã sắp xếp
    HienThi.hienThiBuoc(
      `Đặt pivot vào đúng vị trí: hoán đổi ${mang[i + 1]} và ${mang[caoNhat]}`
    );
    [mang[i + 1], mang[caoNhat]] = [mang[caoNhat], mang[i + 1]];
    await HienThi.hoanDoi(i + 1, caoNhat, doTre);
    soLanHoanDoi++;
    HienThi.capNhatThongKe(soLanSoSanh, soLanHoanDoi);

    // Trả về vị trí cuối cùng của pivot
    // Tất cả phần tử bên trái i+1 nhỏ hơn pivot
    // Tất cả phần tử bên phải i+1 lớn hơn hoặc bằng pivot
    return i + 1;
  };

  // Khai báo API công khai của module SapXepNhanh
  // Cho phép các module khác truy cập vào thông tin và hàm sắp xếp
  return {
    info: thongTin, // Thông tin mô tả thuật toán
    sort: sapXep, // Hàm thực hiện thuật toán sắp xếp
  };
})();
