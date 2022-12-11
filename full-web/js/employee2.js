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
/**
 * Lập trình cho tất cả sự kiện của trang web
 * Author: Nam ĐT 9/12/2022
 * EditBy: Nam ĐT
 */
function createEvent(){
    try {
        //Sự kiện là Add - Thêm, mở dialog ra
        //thuần
        document.getElementById("btn-add").addEventListener("click",function(){
            document.getElementById("popup-employee-detail").style.display = "block";
        });
        //hoặc gọi hàm
        document.getElementById("btn-add").addEventListener("click",btnAddOnClick);
        // đặc điểm của hàm trong js: ko quan trọng đến truyền tham số, chỉ quan tâm đến tên hàm, nó tìm đến hàm có tên như vậy r nó chạy.
        // nó ko có overload, nó chỉ quan tâm đến hàm viết sau sẽ đè lên hàm viết trc, và ko quan tâm đến truyền tham số hay ko truyền, thích thì truyền, ko thì thôi
        //hoặc dùng jquery
        $("#btn-add").click(btnAddOnClick);
        //Sự kiện đóng close dialog
        $("#btn-close").click(btnCloseOnClick);
        //Sự kiện Cất dialog
        $("#btn-save").click(btnSaveOnClick);
    } catch (error) {
        console.log(error);
    }
}
//button với thuộc tính add on click đc gán thẳng vào thẻ thêm html
/**
 * Hiển thị form thêm mới khi nhấn add
 * Author: Nam ĐT (9/12/2022)
 * EditBy: Nam ĐT
 */
function btnAddOnClick(a,b,c,d,e,f){
    try {
        //Hiển thị form chi tiết
        //js thuần
        document.getElementById("popup-employee-detail").style.display = "block";
        //jquery
        $("#popup-employee-detail").show();
        //Lấy mã nhân viên mới/ Set các giá trị mặc định (nếu có)
        $.ajax({
            type: "GET",
            // load dữ liệu có 2 trạng thái: tải đồng loạt/ lần lượt
            // nếu muốn chạy hàng loạt thì set async là true - nó sẽ ko quan tâm, cứ quay tròn, load đc thằng nào thì nó hiển thị, ko đợi chờ, chạy cùng nhau luôn
            // set là false thì phải đợi, chạy xong mới đc load tiếp phần tử tiếp
            async: false,
            url: "https://cukcuk.manhnv.net/api/v1/Employees/NewEmployeeCode",
            success: function (response){
                $("#id-text").val(response);
                $("#id-text").focus();
            },
            error: function (error){
                console.log(error);
            }
        })
    }catch(error){
        console.log(error);
    }
}

//button đóng dialog
/**
 * Author: Nam ĐT 9/12/2022
 * EditBy: Nam ĐT
 */
function btnCloseOnClick(){
    try {
        $("#popup-employee-detail").hide();
    } catch (error) {
        console.log(error);
    }
}
//button cất dialog
/**
 * Author: Nam ĐT 9/12/2022
 * EditBy: Nam ĐT
 */
function btnSaveOnClick(){
    try {
        //1.thu thập dữ liệu trên form
        const employeeCode = $("#txtEmployeeCode").val(); //bắt buộc
        const employeeName = $("#txtEmployeeName").val(); //bắt buộc
        const gender = $("input[name='gender']:checked").val();
        const dob = $("#dtDateofBirth").val();
        const departmentId = $("#cbxDepartment").val();
        const positionName = $("#txtPositionName").val(); //bắt buộc
        const email = $("#txtEmail").val(); //đúng định dạng
        const mobile = $("#txtPhoneNumber").val();
        const txtTelephoneNumber = $("#txtTelephoneNumber").val();
        //cho er vào mảng
        let errorMsgs =[];
        //2.kiểm tra dữ liệu - dữ liệu bắt buộc nhập đã nhập hay chưa, đúng định dạng hay chưa,...
        if(employeeCode==null||employeeCode==undefined||employeeCode.trim()==""){
            alert("Mã nhân viên ko đc để trống");
            //nâng cấp
            errorMsgs.push("Mã nhân viên ko đc để trống");
        }
        if(employeeName==null||employeeCode==undefined||employeeCode.trim()==""){
            alert("Họ và tên ko đc để trống");
            errorMsgs.push("Họ và tên ko đc để trống");
        }
        if(departmentId==null||employeeCode==undefined||employeeCode.trim()==""){
            alert("Phòng ban ko đc để trống");
            errorMsgs.push("Phòng ban ko đc để trống");
        }
        //ktra email đúng định dạng - theo regex

        //kiểm tra errorMsgs xem có lỗi ko
        if(errorMsgs.length>0){
            //Hiển thị thông báo lỗi:
            // 1. Build dialog thông báo
            let dialogNotice =$("#dialog-notice");
            // 2. thay đổi nội dung thông báo
            $("#dialog-notice .dialog-content").empty();
            for (const msg of errorMsgs) {
                $("#dialog-notice .dialog-content").append(<li>${msg}</li>);
            }
            dialogNotice.show();
        } 
        //3.gọi api cất dữ liệu
        $.ajax({
            type: "POST",
            url: "https://amis.manhnv.net/api/v1/Employees",
            success: function (response){
                $("#id-text").val(response);
                $("#id-text").focus();
            },
            error: function (error){
                console.log(error);
            }
        })
        //4.xử lí thông tin từ api trả về

    } catch (error) {
        console.log(error);
    }
}
/**
 * Hàm validate email
 * @param {*} emailValue
 * @returns true - hợp lệ, false - ko hợp lệ
 * Author: Nam ĐT
 * 
 */
function validateEmail(emailValue){
    //
    return true;
}