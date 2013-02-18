$(function () {
    var $datatable = $(".datatable");
    window.datatable = $datatable.dataTable({
        bServerSide:true,
        bJQueryUI:true,
        bProcessing:true,
        bPaginate:false,
        iDisplayLength:0,
        bSort:false,
        sAjaxSource:"?app=APPMNG&action=GET_PARAM_LIST_DATATABLE_INFO",
        bDeferRender:true,
        sDom:'rt',
        fnServerParams:function (aoData) {
            $(this).find("th").each(function (i) {
                var value = $(this).find("input").val();
                aoData = addFieldToData(aoData, 'sSearch_' + i, value);
            });

            aoData.push(
                {
                    "name":"userid", "value":$(this).attr("data-userid")
                },
                {
                    "name":"pview", "value":$(this).attr("data-pview")
                },
                {
                    "name":"type", "value":$(this).attr("data-type")
                });
        },
        "oLanguage":{
            "sZeroRecords":"[TEXT:No matching record found]",
            "sInfo":"[TEXT:Showing _TOTAL_ result]",
            "sInfoEmpty":"[TEXT:No result]",
            "sInfoFiltered":""
        },
        fnDrawCallback:function () {
            $(".deletebutton").button({
                icons:{
                    primary:"ui-icon-trash"
                },
                text:false
            }).on("click", function () {
                var $parent = $(this);
                $("<div><span style='height:230px;'>[TEXT:delconfirmparam] "+$parent.attr("data-id")+" ?</span></div>").dialog({
                    resizable:false,
                    height:140,
                    title: "[TEXT:delete]",
                    modal:true,
                    buttons:{
                        "[TEXT:delete]":function () {
                            $.post("?app=APPMNG", {
                                "action":$("#actiondel").val(),
                                "id":$parent.attr("data-id"),
                                "appid":$parent.attr("data-appid"),
                                "atype":$parent.attr("data-type")
                            }, function () {
                                delete modified[$parent.attr("data-id")];
                                datatable.fnDraw();
                            });
                            $(this).dialog("close");
                        },
                        "[TEXT:Cancel]":function () {
                            $(this).dialog("close");
                        }
                    },
                    close:function () {
                        $(this).dialog("destroy");
                    }
                });
                return false;
            });
        },
        aoColumnDefs:[
            {
                "aTargets":['description'],
                "mDataProp":"descr",
                "sWidth":"15%",
                bUseRendered:false,
                fnRender:function (data) {
                    return '<div class="' + data.aData.classtype + ' column">' + data.aData.descr + '</div>';
                }
            },
            {
                "aTargets":['groupby'],
                "bSearchable":true,
                "mDataProp":"appname",
                "sWidth":"5%",
                bUseRendered:false,
                fnRender:function (data) {
                    var elem = data.aData.appname;
                    if (data.aData.appicon) {
                        elem = '<img border="0" class="imgApp" src="' + data.aData.appicon + '"/>' + elem;
                    } else {
                        elem = '<a data-id="' + data.aData.name + '" data-appid="' + data.aData.appid + '" data-type="' + data.aData.type + '" class="' + data.aData.classtype + ' deletebutton" border="0" title="[TEXT:delete]"></a>';
                    }
                    return elem;
                }
            },
            {
                "aTargets":['name'],
                "sWidth":"15%",
                "bSearchable":true,
                "mDataProp":"name",
                bUseRendered:false,
                fnRender:function (data) {
                    return '<div class="' + data.aData.classtype + ' column">' + data.aData.name + '</div>';
                }
            },
            {
                "aTargets":['valeur'],
                "mDataProp":"val",
                "sClass": "values",
                bUseRendered:false,
                fnRender:function (data) {
                    var onclick = "movediv(this,'" + data.aData.name + "','" + data.aData.type + "','" + data.aData.appid + "','" + data.aData.kind + "',this.getAttribute('avalue'))";
                    var id = data.aData["DT_RowId"];
                    var val = (data.aData.val ? data.aData.val : "");
                    var rowclass = data.aData.classtype;
                    if (modified[id]) {
                        val = modified[id]["value"];
                        rowclass += " " + modified[id]["class"];
                    }
                    return '<div id="v' + data.aData.name + '" avalue="' + data.aData.sval + '" class="' + rowclass + ' column" onclick="' + onclick + '">' + val + '</div>';
                }
            }
        ]
    });
    $("#tabs").tabs({
        select:function (event, ui) {
            $.fn.dataTableExt.iApiIndex = ui.index;
            datatable.fnDraw();
        }
    });

    findSearchString($datatable.find("thead").find("input"), ["appname", "name"], datatable);

    /**
     * Combox for accountype
     */
    $("#userid").combobox({
        autocomplete:{
            minLength:0,
            source:function (request, response) {
                $.getJSON("?app=APPMNG&action=GET_USERS", {
                    "filterName":request.term
                }, function (data) {
                    response(data);
                });
            },
            focus:function (event, ui) {
                $(this).val(ui.item.label);
                $("#searchId").val(ui.item.value);
                return false;
            },
            select:function (event, ui) {
                $(this).val(ui.item.label);
                $("#searchId").val(ui.item.value);
                $(".datatable").attr("data-userid", ui.item.value);
                datatable.fnFilter("");
                return false;
            }
        }
    });

    $("#fedit").on("submit", function () {
        var form = $(this).serialize();
        form += "&action=" + $(this).attr("data-action");
        $.post("?app=APPMNG", form, function (data) {
            if (!data.success) {
                displayWarningMsg(data.error);
            } else {
                if (editedParam) {
                    editedParam.setAttribute('avalue', data.data.value);
                    editedParam.style.display = 'inline';
                    if (editedParam.tagName == 'DIV') {
                        if (data.data.value == null) {
                            data.data.value = '';
                        }
                        modified[data.data.id] = {
                            "value":data.data.value + " <i>(" + data.data.textModify + ")</i>",
                            "class":'changed'
                        };
                        editedParam.innerHTML = modified[data.data.id]["value"];
                        editedParam.className += ' changed';
                    }
                }
                editedParam = '';
                var pedit = document.getElementById('dedit');
                if (pedit) {
                    pedit.style.display = 'none';
                }
                if (colorPick2) {
                    colorPick2.hidePopup();
                }
                submiting = false;
                document.getElementById("editdefault").appendChild(pedit);
                datatable.fnDraw();
            }
        });
        return false;
    })
});

var modified = {};
var submiting = false;
var colorPick2 = false;
var op = new OptionPicker();
function pickColor(color) {
    document.fedit.val.value = color;
    document.fedit.val.style.backgroundColor = color;
    document.fedit.val.focus();
}

function pickOption(value) {
    document.fedit.val.value = value;
    document.fedit.val.focus();
}


var editedParam = '';

function bluringInput() {
    if (this.value != this.getAttribute('originvalue')) {
        submiting = true;
        this.form.submit();
    }
}
function movediv(th, Aname, Atype, Appid, Kind, Value) {
    if (submiting) return; // wait return of submit
    if (Kind == 'static' || Kind == 'readonly') {
        alert('[TEXT:unmodifiable parameter]');
        return;
    }

    if ((editedParam != '') && (editedParam.id == th.id)) {
        return;
    }
// undisplay cell containt
    th.style.display = 'none';
    document.getElementById('dedit').style.display = 'block';
    th.parentNode.appendChild(document.getElementById('dedit'));
    var formEdit = document.getElementById('fedit');

    formEdit.appid.value = Appid;
    formEdit.atype.value = Atype;
    formEdit.aname.value = Aname;
    formEdit.val.value = Value;
    if (Kind == 'password') {
        formEdit.val.type = 'password';
    }
    else formEdit.val.type = 'text';
    formEdit.val.focus();
    formEdit.val.select();
    formEdit.val.setAttribute('originvalue', Value);

// redisplay precedent cell
    if (editedParam != '') {
        editedParam.style.display = 'inline';
    }

    editedParam = th;
// show color picker if needed
    if (Kind == 'color') {
        if (!colorPick2) colorPick2 = new ColorPicker();
        colorPick2.show('dedit');
    } else {
        if (colorPick2) colorPick2.hidePopup();
        if (Kind.substr(0, 4) == 'enum') {
            op.show('dedit');
            $("#" + op.divName).css("z-index", 100);
            op.setOptions(Kind.substr(5, Kind.length - 6).split('|'));
        }
    }

}