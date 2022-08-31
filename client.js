$(document).ready(function () {
  $("#search").keyup(function () {
    var d = $(this).val();
    $.ajax({
      url: "http://localhost:3000/search",
      data: {
        keydown: d,
      },
      type: "POST",
      cache: false,
      success: function (data) {
        console.log(data);
        let dataSql = JSON.parse(data);
        handleSearch(dataSql);
      },
    });
  });
});

function handleSearch(data) {
  let html = "";
  console.log(data);
  data.forEach((element) => {
    let classicfy = "";
    if (element.avg <= 5) {
      classicfy = "Kém";
    } else if (element.avg >= 5 && element.avg <= 7) {
      classicfy = "Khá";
    } else {
      classicfy = "Giỏi";
    }
    html += `
            <tr>
            <td>${element.id}</td>
            <td>${element.name}</td>
            <td>${element.age}</td>
            <td>${element.address}</td>
            <td>${classicfy}</td>
            <td><a href="/details?${element.id}"><button class="btn-fromManager" type="submit">Xem chi tiết</button></a></td>
            <td><a href="/delete?${element.id}"><button class="btn-fromManager" type="submit">Xóa</button></a></td>
            <td><a href="/edit-details?${element.id}"><button class="btn-fromManager" type="submit">Sửa</button></a></td>
            </tr>
            `;
  });
  document.querySelector(".details").innerHTML = html;
}
