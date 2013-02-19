$(function () {
    $.ui.dialog.prototype._makeDraggable = function () {
        this.uiDialog.draggable({
            containment:false
        });
    };
});

function focuskey(expand) {
    var o = document.getElementById("kid");
    if (o) {
        o.focus();
        o.select();
    }
    if (expand) {
        expandTree('gtree');
        expandTree('gtreeeall')
    }
}

function refreshRightSide(action, grp) {
    $.post("?app=FUSERS", {
        "action":"FUSERS_DATATABLES_LAYOUT",
        "type":action,
        "group":grp
    }, function (data) {
        $("#finfo").html(data);
        var searchCols = [];
        var columnDefs = [];
        switch (action) {
            case "user":
                columnDefs = [
                    {
                        "aTargets":['us_login'],
                        "mDataProp":"us_login",
                        fnRender:function (data) {
                            return '<a href="[CORE_STANDURL]&app=FDL&action=FDL_CARD&id=' + data.aData.id + '"><img src="' + data.aData.icon + '">' + data.aData.us_login + '</a>';
                        }
                    },
                    {
                        "aTargets":['us_lname'],
                        "mDataProp":"us_lname",
                        fnRender:function (data) {
                            return data.aData.us_lname ? data.aData.us_lname : "";
                        }
                    },
                    {
                        "aTargets":['us_fname'],
                        "mDataProp":"us_fname",
                        fnRender:function (data) {
                            return data.aData.us_fname ? data.aData.us_fname : "";
                        }
                    },
                    {
                        "aTargets":['us_mail'],
                        "mDataProp":"us_mail",
                        fnRender:function (data) {
                            return  data.aData.us_mail ? data.aData.us_mail : "";
                        }
                    }
                ];
                searchCols = ["us_login", "us_lname", "us_fname", "us_mail"];
                break;
            case "role":
                columnDefs = [
                    {
                        "aTargets":['title'],
                        "mDataProp":"title",
                        fnRender:function (data) {
                            return'<a href="[CORE_STANDURL]&app=FDL&action=FDL_CARD&id=' + data.aData.id + '"><img src="' + data.aData.icon + '">' + data.aData.title + '</a>';
                        }
                    }
                ];
                searchCols = ["title"];
                break;
            case "group":
                columnDefs = [
                    {
                        "aTargets":['us_login'],
                        "mDataProp":"us_login",
                        fnRender:function (data) {
                            return '<a href="[CORE_STANDURL]&app=FDL&action=FDL_CARD&id=' + data.aData.id + '"><img src="' + data.aData.icon + '">' + data.aData.us_login + '</a>';
                        }
                    },
                    {
                        "aTargets":['grp_name'],
                        "mDataProp":"grp_name"
                    }
                ];
                searchCols = ["title"];
                break;
        }
        window.datatable = setDatatable(columnDefs, action);

        findSearchString($("#header").find("input"), searchCols, datatable);
        $("#menu").hide().menu().children().each(function () {
            var parent = $(this);
            parent.on("click", function () {
                displayWindow(400, 600, parent.find("a").attr("href"), action);
                $("#menu").hide();
                return false;
            });
        });
        $("#mainaction").button().on("click", function () {
            displayWindow(400, 600, $(this).attr("href"), action);
            return false;
        });
        $("#otheraction").button({
            text:false,
            icons:{
                primary:"ui-icon-triangle-1-s"
            }
        }).on("click", function () {
                var menu = $("#menu");
                if (menu.css("display") != "none") {
                    menu.hide();
                    return false;
                }
                menu.show().position({
                    my:"left top",
                    at:"left bottom",
                    of:this
                });
                $(window).one("click", function () {
                    menu.hide();
                });
                return false;
            });
        $("#buttonset").buttonset();
    });
    return false;
}

function addFieldToData(aoData, fieldName, fieldValue) {
    $.each(aoData, function (c) {
        if (aoData[c].name == fieldName && fieldValue != undefined) {
            aoData[c].value = fieldValue;
            return false;
        }
        return true;
    });
    return aoData;
}

function setDatatable(columnDef, type) {
    return $(".dataTable").dataTable({
        bServerSide:true,
        bJQueryUI:true,
        bProcessing:true,
        bPaginate:true,
        iDisplayLength:$("#fusersDisplayLength").val(),
        sAjaxSource:"?app=FUSERS&action=FUSERS_GET_DATATABLE_INFO",
        bDeferRender:true,
        sDom:'rt<"F"ip>l',
        fnRowCallback:function (nRow, aData, iDisplayIndex) {
            $(nRow).addClass("tableRow").on("click", function () {
                displayWindow(400, 600, '[CORE_STANDURL]&app=FDL&action=FDL_CARD&id=' + aData["id"], type);
                return false;
            });
            return nRow;
        },
        fnServerParams:function (aoData) {
            var oSettings = this.fnSettings();
            $("#header").find("th").each(function (i) {
                var value = $(this).find("input").val();
                aoData = addFieldToData(aoData, 'sSearch_' + i, value);
            });
            aoData.push({ "name":"totalRow", "value":oSettings._iRecordsTotal },
                {"name":"totalSearch", "value":oSettings._iRecordsDisplay},
                {"name":"type", "value":$("#fusersType").val()},
                {"name":"group", "value":$("#fusersGroup").val()});
        },
        "oLanguage":{
            "sZeroRecords":"[TEXT:No matching record found]",
            "sInfo":"[TEXT:Showing _START_ to _END_ of _TOTAL_ ]",
            "sInfoEmpty":"[TEXT:No result]",
            "sInfoFiltered":"",
            "sLengthMenu":"[TEXT:show _MENU_ per page]"
        },
        aoColumnDefs:columnDef
    });
}

function findSearchString($elements, fields, dataTable) {
    $elements.each(function (index, element) {
        $(element).on({
            "keypress":function (e) {
                if (e.keyCode == 13) {
                    var index = $.inArray(this.name, fields);
                    if (index == -1) {
                        /* Filter on all columns  of this element */
                        dataTable.fnFilter(this.value);
                    } else {
                        /* Filter on column (index) of this element */
                        dataTable.fnFilter(this.value, index);
                    }
                    return false;
                }
                return true;
            },
            "click":function (e) {
                //Prevent bubbling event
                return false;
            }
        });
    });
}

function displayWindow(height, width, ref, type) {
    var dialog = $("#dialogmodal");
    if (dialog.length <= 0) {
        dialog = $('<div id="dialogmodal"><iframe src="' + ref + '" frameborder="0" style="width: 100%; height: 100%;"></iframe></div>').appendTo('body');
    }
    dialog.dialog({
        modal:true,
        draggable:true,
        resizable:true,
        height:height,
        width:width,
        position:"center",
        close:function (event, ui) {
            $("#dialogmodal").remove();
            datatable.fnDraw();
            if (type == "group") refreshLeftSide();
        }
    });
}

function refreshLeftSide() {
    $.post("?app=FUSERS&action=FUSERS_LIST", function (data) {
        $("#flist").html(data);
        focuskey(true);
        convertTrees();
    });
}
$(window).on("load", focuskey);
$(window).on("load", convertTrees);