$(document).ready(function () {
    var firstSearch = $($("a.searchIcon").get(0));

    $('#systemTable').dataTable({
            "bProcessing": true,
            "bServerSide": true,
            "sScrollY": "200px",
            "sDom": '<"ui-state-default systemHeader"i<"searchTitle">pf>rt',
            "iDisplayLength": 50,
            "sAjaxSource": '?app=DOCADMIN&action=SYSTEM_GETDATA&id=' +
                firstSearch.attr('data-searchid'),
            "oLanguage": {
                "oPaginate": {
                    "sNext": "",
                    "sPrevious": ""
                },
                "sInfo": "_START_ - _END_ /  _TOTAL_",
                "sInfoEmpty": "",
                "sSearch": "",
                "sEmptyTable": "no matches documents"
            },
            aoColumnDefs: [
                {
                    "aTargets": [0],
                    "mDataProp": "docicon",
                    "bSearchable": false,
                    "bSortable": false,
                    "bUseRendered": false,
                    "fnRender": function (data) {
                        return '<img src="' + (data.aData.docicon || "") + '">';
                    },
                    "sWidth": "20px",
                    "sClass": " familyIconList"
                },
                {
                    "aTargets": [1],
                    "mDataProp": "docid",
                    "bVisible": false
                },
                {
                    "aTargets": [2],
                    "bSortable": false,
                    "mDataProp": "doctitle",
                    "bUseRendered": false,
                    "fnRender": function (data) {
                        return '<a class="doc-relation" data-docid="' + data.aData.docid + '">' + data.aData.doctitle + '</a>';
                    },
                    "sClass": " familyTitleList",
                    "sWidth": "auto"
                }
            ]

        }
    ).on("click", "tbody tr",function () {
            var aDoc = $(this).find('a.doc-relation');
            if (aDoc.length > 0) {
                $('#frameDoc').attr("src", "?app=FDL&action=FDL_CARD&id=" + aDoc.attr("data-docid"));
            }
            $(this).parent().find('tr').removeClass("ui-state-highlight");
            $(this).addClass("ui-state-highlight");

        }).on("mouseout", "tbody tr",function () {
            $(this).removeClass("ui-state-hover");
        }).on("mouseover", "tbody tr", function () {
            $(this).addClass("ui-state-hover");
        });


    $(".filterButton")
        .button()
        .click(function () {
            var lastFam = $(this).parent().parent().find(".familyList a.ui-state-highlight");
            if (lastFam.length > 0) {
                lastFam.trigger('click');
            } else {
                lastFam = $(this).parent().parent().find(".familyList a");
                if (lastFam.length > 0) {
                    $(lastFam[0]).trigger('click');
                }
                return false;
            }
            return true;
        })
        .next()
        .button({
            text: false,
            icons: {
                primary: "ui-icon-triangle-1-s"
            }
        })
        .click(function () {
            var menu = $(this).parent().next().show().position({
                my: "left top",
                at: "left bottom",
                of: this
            });
            $(document).one("click", function () {
                menu.hide();
            });
            return false;
        })
        .parent()
        .buttonset()
        .next()
        .hide()
        .menu();

    $('.selfamily').on("click", function () {
        $(".searchIcon").removeClass("ui-state-highlight");

        var familyId = $(this).attr('data-familyid') || '';
        var searchId = $(this).attr('data-searchid') || '';
        $(this).parent().parent().find("a.selfamily").removeClass("ui-state-highlight");
        $(this).addClass("ui-state-highlight");
        var oTable = $("#systemTable").dataTable();
        var oSettings = oTable.fnSettings();
        oSettings.sAjaxSource = '?app=DOCADMIN&action=SYSTEM_GETDATA&famid=' + familyId + '&id=' + searchId;

        var newTitle = $(this).text();
        $(".searchTitle").html(newTitle);

        var filterButton = $(this).parent().parent().parent().find('.filterButton');
        filterButton.find('img').attr('src', $(this).find('img').attr('src'));
        filterButton.attr('title', newTitle).addClass("ui-state-highlight");
        oTable.fnDraw();
        resizeSysDoc();
    });

    $('.searchButton').button().on("click", function () {
        var searchId = $(this).attr('data-searchid');
        $(".searchIcon").removeClass("ui-state-highlight");
        $(this).addClass("ui-state-highlight");
        var oTable = $("#systemTable").dataTable();
        var oSettings = oTable.fnSettings();
        oSettings.sAjaxSource = '?app=DOCADMIN&action=SYSTEM_GETDATA&id=' + searchId;

        var newTitle = $(this).attr('original-title');
        if (!newTitle) {
            newTitle = $(this).attr('title');
        }
        $(".searchTitle").html(newTitle);

        oTable.fnDraw();
        resizeSysDoc();
    });

    function resizeSysDoc() {
        // first iframe height

        //$(".systemRight").height($(window).height - 2 * ($(".systemRight").offset().top));
        var tdsystemRight = $(".systemRight");
        tdsystemRight.height($(window).height() - 2 * (tdsystemRight.offset().top) - 11);

        var tListbody = $(".dataTables_scrollBody");

        var windowHeight = $(window).height();

        if (tListbody.offset()) {
            var offY = tListbody.offset().top;

            tListbody.height(windowHeight - offY - 16);
        }
    }

    $(window).resize(function () {
            resizeSysDoc();
        }
    );
    resizeSysDoc();
    $(".searchTitle").html(firstSearch.attr('title'));
    firstSearch.addClass("ui-state-highlight");
    $(".searchIcon").tipsy();


})
;