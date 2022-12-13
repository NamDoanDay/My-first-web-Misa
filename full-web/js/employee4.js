loadData();
createEvent();
/**
 * Tải dữ liệu từ api lên bảng
 * Author: Nam ĐT 12/12/2022
 * EditBy: Nam ĐT 
 */

function loadData(){
    try{
        //gọi api
        $.ajax({
            type: "GET",
            url: "https://amis.manhnv.net/api/v1/Employees",
            success: function(response){
                for (const element of response) {
                const empName=element.EmployeeName;
                const phoneNum=element.PhoneNumber;
                const email = element.Email;
                const tele = element.TelephoneNumber;
                const departmentName=element.DepartmentName;
                const gender =element.GenderName;
                const place = element.IdentityPlace;
                let tdHTML = `<tr>
                            <td><input type="checkbox"></td>
                            <td class="text-align--left">${empName||"trống"}</td>
                            <td class="text-align--left">${phoneNum||"trống"}</td>
                            <td class="text-align--left">${email||"trống"}</td>
                            <td class="text-align--left">${tele||"trống"}</td>
                            <td class="text-align--left">${departmentName||"trống"}</td>
                            <td class="text-align--left">${gender||"trống"}</td>
                            <td class="text-align--left">${place||"trống"}</td>
                            </tr>`
                    $("#employeeDetailTable tbody").append(tdHTML);
                }
            },
            error: function(error){
                console.log(error);
                var statusCode = error.status;
            }
        })
    }
    catch(error){
        console.log(error);
    }
}

/**
 * Tạo các sự kiện trong trang
 * Author: Nam ĐT (12/12/2022)
 * EditBy: Nam ĐT
 */
function createEvent(){
    //hiện form Thêm mới
    $("#buttonAddOnClick").click(buttonAddOnClick);
    //đóng form Thêm mới
    $("#clickOnCancel").click(clickOnCancel);
    //đóng thông báo error sau khi cất
    $("#accept-error").click(function(){
        $("#main-error").hide();
        // if(fieldErrors.length>0){
        //     fieldErrors[0].focus();
        //     for (const field of fieldErrors) {
        //         //add style lỗi
        //         field.classList.add("field-error");
        //         //bổ sung element thông tin lỗi sau input
        //         var fieldLabel = $(field).attr("field-label");
        //         var errorElHTML = `<div class="error-text" hidden> ${fieldLabel} không được để trống</div>`;
        //         $(field).after(errorElHTML);
        //     }
        // }
    })
    //Cất và validate dữ liệu
    $("#btn-save").click(buttonSaveDialog);
    //đóng thông báo error sau khi cất
    //
    $("m-required").blur(onValidateFieldRequired);
}
/**
 * Hiện dialog nhập thông tin - lấy Mã và focus vào trường Mã
 * Author: Nam ĐT (12/12/2022)
 * EditBy: Nam ĐT
 */
function buttonAddOnClick(){
    try {
        $("#main-add-new").show();
        //lấy mã từ api và focus vào ô mã
        $.ajax({
            type: "GET",
            url: "https://amis.manhnv.net/api/v1/Employees/NewEmployeeCode",
            success: function(response){
                let newId = response;
                $("#id-text").val(response);
                $("#id-text").focus();
            },
            error: function(error){
                console.log(error);
            }
        })
    } catch (error) {
        console.log(error)
    }
}
/**
 * Đóng dialog nhập thông tin
 * Author: Nam ĐT (12/12/2022)
 * EditBy: Nam ĐT
 */
function clickOnCancel(){
    $("#main-add-new").hide();
}
/**
 * Lưu và Đóng dialog nhập thông tin
 * Author: Nam ĐT (12/12/2022)
 * EditBy: Nam ĐT
 */
function buttonSaveDialog(){
    try{
        //lấy ra các trg có thuộc tính property-name
        let fields= $("[property-name]");
        let employee = {};
        //duyệt từng trg lấy thuộc tính và giá trị và gán vào object employee
        for (const field of fields) {
            const value = field.value;//hoặc $(field).val()
            const propertyName = $(field).attr("property-name");
            employee[propertyName] = value;
        }
        debugger
        //lấy ra các field có attribute là property-name

        //lấy dữ liệu từ form
        // const emId=$("#id-text").val();
        // const emName=$("#id-name").val();
        // const emApartment = $("#id-apartment").val();
        // const emPosition = $("#id-position").val();
        // const emGender =$("#gender-radio").val();
        // const emCard = $("#id-person-card").val();

        //kiểm tra, validate dữ liệu
        //nếu dữ liệu lỗi cho vào mảng và hiện dialog thông báo
        let errorMsgs=[];
        //lấy các phần tử validate ko hợp lệ
        fieldErrors=[];
        //lấy ra tất cả các trường bắt buộc
        let fieldRequireds = $("[m-required]");
        // lấy ra các trường bắt buộc, nếu trường nào lỗi validate sẽ cho vào mảng errorMsgs và fieldErrors
        for (const field of fieldRequireds) {
            const val = $(field).val();
            const fieldLabel = field.getAttribute("field-label");
            if(val==""||val==null||val==undefined){
                errorMsgs.push(`${fieldLabel} không được để trống`);
                fieldErrors.push(field);
            }

        }
        if(fieldErrors.length>0){
            fieldErrors[0].focus();
            for (const field of fieldErrors) {
                //add style lỗi
                field.classList.add("input-error");
                //bổ sung element thông tin lỗi sau input
                var fieldLabel = $(field).attr("field-label");
                var errorElHTML = `<div class="error-text" hidden> ${fieldLabel} không được để trống</div>`;
                $(field).after(errorElHTML);
            }
        }

        // if(emId==""||emId==null||emId==undefined){
        //     errorMsgs.push("Mã ko đc trống");
        //     $("#id-text").addClass("input-error");
        //     $("#id-error-text").show();
        // }
        // if(emName==""||emName==null||emName==undefined){
        //     errorMsgs.push("Tên ko đc trống");
        // }
        // if(emApartment==""||emApartment==null||emApartment==undefined){
        //     errorMsgs.push("Đơn vị ko đc trống");
        // }
        // if(emPosition==""||emPosition==null||emPosition==undefined){
        //     errorMsgs.push("Vị trí ko đc trống");
        // }
        // if(emGender==""||emGender==null||emGender==undefined){
        //     errorMsgs.push("Giới tính ko đc trống");
        // }
        // if(emCard==""||emCard==null||emCard==undefined){
        //     errorMsgs.push("Giới tính ko đc trống");
        // }

        //lấy lỗi rồi append vào dialog lỗi
        if(errorMsgs.length>0){
            let dialogNotice = $("#main-error");
            for (const error of errorMsgs) {
                let divHTML = `<div class="detail">${error}</div>`;
                $("#main-error .message-error").append(divHTML);

                // debugger
            }
            //hiển thị dialog lỗi
            dialogNotice.show();
        }

        //gọi api cất dữ liệu
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
                alert("Them ko oke");
                console.log(error);
            }
        })
    }catch(error){
        console.log(error);
    }
}
//
function onValidateFieldRequired(){
    try {
        let value = this.value;
        let label = $(this).attr("field-label");

        if(value.trim()==""||value==null||value==undefined){
            this.classList.add("input-error");
            var errorTextEls = $this.siblings(".error-text");
            if (errorTextEls.length==0){
                var fieldLabel = $(field).attr("field-label");
                    var errorElHTML = `<div class="error-text" hidden> ${label} không được để trống</div>`;
                    $(this).after(errorElHTML);
            }
        }else{
            this.classList.remove("input-error");
            $this.siblings(".error-text").remove();
        }
    } catch (error) {
        console.log(error)
    }
}