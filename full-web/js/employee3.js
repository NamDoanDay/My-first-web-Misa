loadData();
createEvent();
/** xử lí: sau khi thông báo lỗi - những ô bị lỗi phải có border đỏ, thông báo kèm bên dưới 
 * b1: đánh dấu những thông tin/phần tử bị lỗi - khi mà bắt đc lỗi thì mình sẽ lưu trữ các trường bị lỗi vào 1 chỗ nào đó. VD: lưu trước, xử lí sau hoặc xử lí luôn
 * với xử lí luôn: nếu input có lỗi, gán luôn 1 class css cho kiểu lỗi đấy(border đỏ,...)
 * b2: khi có lỗi, tự động focus vào ô đầu tiên
 * Nút cất và nút đồng ý ở 2 sự kiện khác nhau, 2 function khác nhau xử lí cùng 1 đối tượng lưu -> khai báo 1 biến toàn cục
 * b3: Tổng quát: giả sử có nhiều trg, trg đó bắt buộc phải nhập, sau này có thể thêm hoặc bổ sung. Như vậy, do nó có đặc điểm chung là đều cần phải sửa thì mình phải làm như nào để đánh dấu đc nó
 * c1: thêm addtribute hoặc dùng class chung - nên dùng attribute
 * b4: vào html add thêm thuộc tính - đặt tên là m-required vào thẻ input
 * b5: comment phần xử lí cứng ở AddOnClick
 * b6: lấy ra tất cả trg bắt buộc
 * b7: vào html add thêm thuộc tính - đặt tên là field-label vào thẻ input để đặt, chứa giá trị trường
 * b8: thêm attribute property-name="Giá trị từng trường (DateofBirth)" gắn vs thông tin của đối tượng
 */

/********************************************************
 * Lấy dữ liệu
 * Author: Nam ĐT (9/12/2022)
 * EditBy: Nam ĐT (10/12/2022) - sửa lại api lấy dữ liệu
 */
function loadData(){
    try {
        $.ajax({
            type: "GET",
            url: "https://amis.manhnv.net/api/v1/Employees",
            success: function (response){
                $("#employeeDetailTable tbody").empty();
                for (const emp of response) {
                    var employeeName = emp.EmployeeName;
                    var employeeEmail =emp.Email;
                    var employeePhone = emp.PhoneNumber;
                    employeePhone =new Intl.NumberFormat('en-US').format(employeePhone);
                    var employeeAddress= emp.Address;
                    var newTrHtml=`<tr>
                    <td><input type="checkbox"></td>
                    <td>${employeeName||"chịu"}</td>
                    <td>${employeeEmail||"chịu"}</td>
                    <td class="text-align--right">${employeePhone||"chịu"}</td>
                    <td class="text-align--center">${employeeAddress||"chịu"}</td>
                </tr>`
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
        $("#btn-add").click(btnAddOnClick);
        $("#btn-close").click(btnCloseOnClick);
        $("#btn-save").click(btnSaveOnClick);
        //từ hàm này || input này nhảy sang hàm khác||input khác, || từ trường này || từ element này nhảy sang element khác
        $("m-required").blur(onValidateFieldRequired);
        $("#dialog-notice button.dialog__button--accept").click(btnConfirmDialog);

        //ẩn thông báo
        $("#dialog-notice button.dialog__button--accept").click(function(){
            $("#dialog-notice").hide();
            if(inputErrors.length>0){
                //set focus vào ô lỗi đầu tiên
                fieldErrors[0].focus();
                // for (const field of fieldErrors) {
                //     field.addClass("field--error");
                // }
                for (const field of fieldErrors) {
                    //add style lỗi
                    field.classList.add("field--error");
                    //bổ sung element thông tin lỗi sau input
                    var fieldLabel = $(field).attr("field-label");
                    var errorElHTML = `<div class="error-text" hidden> ${fieldLabel} không được để trống</div>`;
                    $(field).after(errorElHTML);
                }
            }
        })
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
function btnAddOnClick(){
    try {
        document.getElementById("popup-employee-detail").style.display = "block";
        $("#popup-employee-detail").show();
        $.ajax({
            type: "GET",
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
/***************************
 * Author: Nam ĐT 9/12/2022
 * EditBy: Nam ĐT
 */
function btnSaveOnClick(){
    try {
        // lấy ra tất cả các field có attribute có property-name
        let fields =$("[property-name]");
        let employee = {};
        //duyệt fields
        for (const field of fields) {
            //lấy ra value
            const value = field.value;//hoặc $(field).val()
            const propertyName = $(field).attr("property-name");
            employee[propertyName] = value;
        }

        //fix cứng
        // const employeeCode = $("#txtEmployeeCode").val(); 
        // const employeeName = $("#txtEmployeeName").val(); 
        // const gender = $("input[name='gender']:checked").val();
        // const dob = $("#dtDateofBirth").val();
        // const departmentId = $("#cbxDepartment").val();
        // const positionName = $("#txtPositionName").val(); 
        // const email = $("#txtEmail").val(); 
        // const mobile = $("#txtPhoneNumber").val();
        // const txtTelephoneNumber = $("#txtTelephoneNumber").val();
        let errorMsgs =[];
        //c2: lưu vào mảng
        // let fieldErrors=[];
        //bỏ let - tương đương với global static
        fieldErrors=[];
        //lấy ra tất cả trg bắt buộc
        var fieldRequireds = $("[m-required]");
        for (const field of fieldRequireds) {
            const value = $(field).val();
            //hoặc const value = field.value;
            //lấy ra value của 1 attribute
            const fieldLabel = field.getAttribute("field-label");
            //hoặc const fieldLabel = $(field).attr("field-label");
            if(value==null||value==undefined||value.trim()==""){
                errorMsgs.push(`${fieldLabel} không được để trống`);
                fieldErrors.push(field);
            }
        }

        //bỏ xử lí cứng
        // if(employeeCode==null||employeeCode==undefined||employeeCode.trim()==""){
        //     errorMsgs.push("Mã nhân viên ko đc để trống");
        //     //c1 xử lí luôn
        //     $("#txtEmployeeCode").addClass("input-error");//cho border màu đỏ
        //     //hiện thẻ div chứa thông báo "Mã nhân viên ko đc phép để trống" với thuộc tính hidden
        //     $("#error-text").show();
        //     //hoặc dùng css để định nghĩa - trường hợp trong 1 hàng
        //     /**
        //      * .input--eror+.error-text,
        //      * .feild--eror+.error-text{
        //      * display:block
        //      * }
        //      */
        //     //c2: lưu vào mảng
        //     fieldErrors.push($("#txtEmployeeCode"));
        // }else{
        //     $("#txtEmployeeCode").removeClass("input-error");
        // }
        // if(employeeName==null||employeeCode==undefined||employeeCode.trim()==""){
        //     errorMsgs.push("Họ và tên ko đc để trống");
        //     //xử lí luôn
        //     $("#txtEmployeeName").addClass("input-error");
        //     fieldErrors.push($("#txtEmployeeName"));
        // }
        // else{
        //     $("#txtEmployeeName").removeClass("input-error");
        // }
        // if(departmentId==null||employeeCode==undefined||employeeCode.trim()==""){
        //     errorMsgs.push("Phòng ban ko đc để trống");
        //     //xử lí luôn
        //     $("#cbxDepartment").addClass("field-error");
        //     fieldErrors.push($("#cbxDepartment"));
        // }else{
        //     $("#cbxDepartment").removeClass("field-error");
        // }
        if(errorMsgs.length>0){
            let dialogNotice =$("#dialog-notice");
            $("#dialog-notice .dialog-content").empty();
            for (const msg of errorMsgs) {
                $("#dialog-notice .dialog-content").append(<li>${msg}</li>);
            }
            dialogNotice.show();
        } 
        //bỏ vì bên trên đã có object employee
        // var employee = {
        //     EmployeeCode:employeeCode,
        //     EmployeeName:employeeName,
        //     DepartmentId:departmentId
        // }

        //3.gọi api cất dữ liệu
        $.ajax({
            type: "POST",
            url: "https://amis.manhnv.net/api/v1/Employees",
            data: JSON.stringify(employee),
            dataType: "json",
            contentType: "application/json",
            success: function (response){
                alert("Thêm oke");
            },
            error: function (error){
                alert("Lỗi");
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
//
function btnConfirmDialog(){
    try {
        $("#dialog-notice").hide();
            if(inputErrors.length>0){
                //set focus vào ô lỗi đầu tiên
                fieldErrors[0].focus();
                // for (const field of fieldErrors) {
                //     field.addClass("field--error");
                // }
                for (const field of fieldErrors) {
                    //add style lỗi
                    field.classList.add("field--error");
                    //bổ sung element thông tin lỗi sau input
                    var fieldLabel = $(field).attr("field-label");
                    var errorElHTML = `<div class="error-text" hidden> ${fieldLabel} không được để trống</div>`;
                    $(field).after(errorElHTML);
                }
                
            }
    } catch (error) {
        console.log("Lỗi");
    }
}
//
function onValidateFieldRequired(){
    try {
        let value = this.value;
        let label = $(this).attr("field-label");

        if(value.trim()==""||value==null||value==undefined){
            this.classList.add("field-error");
            var errorTextEls = $this.siblings(".error-text");
            if (errorTextEls.length==0){
                var fieldLabel = $(field).attr("field-label");
                    var errorElHTML = `<div class="error-text" hidden> ${label} không được để trống</div>`;
                    $(this).after(errorElHTML);
            }
        }else{
            this.classList.remove("field--error");
            $this.siblings(".error-text").remove();
        }
    } catch (error) {
        console.log(error)
    }
}