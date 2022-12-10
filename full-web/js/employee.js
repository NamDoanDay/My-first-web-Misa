loadData();
createEvent();
//Load dữ liệu
/********************************************************
 * Lấy dữ liệu
 * Author: Nam ĐT (9/12/2022)
 * EditBy: Nam ĐT (10/12/2022) - sửa lại api lấy dữ liệu
 */
function loadData(){
    try {
        //gọi api lấy dữ liệu
        $.ajax({
            type: "GET",
            url: "https://amis.manhnv.net/api/v1/Employees",
            // //data là tham số truyền lên cho api, Get thì ko cần tham số
            // data: "data",
            // dataType: "dataType",
            //khi có dữ liệu, response chính là data của chúng ta
            success: function (response){
                //xử lí dữ liệu
                //1. Định dạng ngày tháng -> ngày/tháng/năm
                $("#employeeDetailTable tbody").empty();
                for (const emp of response) {
                    var employeeName = emp.EmployeeName;
                    var employeeEmail =emp.Email;
                    var employeePhone = emp.PhoneNumber;
                    employeePhone =new Intl.NumberFormat('en-US').format(employeePhone);
                    var employeeAddress= emp.Address;
                    //nội suy là truyền value từ bên ngoài vào thẻ html
                    var newTrHtml=`<tr>
                    <td><input type="checkbox"></td>
                    <td>${employeeName||"chịu"}</td>
                    <td>${employeeEmail||"chịu"}</td>
                    <td class="text-align--right">${employeePhone||"chịu"}</td>
                    <td class="text-align--center">${employeeAddress||"chịu"}</td>
                </tr>`
                //2. Định dạng tiền tệ -> 1.000.000 vnđ
                //Hiển thị dữ liệu lên table
                //mỗi lần append thì nó append xuống dưới
                $("#employeeDetailTable tbody").append(newTrHtml);
                }
            },
            error: function (error){
                console.log(error);
                var statusCode = error.status;
                switch (statusCode) {
                    case 400:
                        var errorMsg = error.response.userMsg;
                        alert(errorMsg);
                        break;
                    case 500:
                    case 514:
                        break;
                    default:
                        break;
                }
            }
        })
        //xử lí lỗi từ api (nếu có)
    } catch (error) {
        console.log(error)
    }
}
//Lập trình cho các sự kiện:
function createEvent(){

}