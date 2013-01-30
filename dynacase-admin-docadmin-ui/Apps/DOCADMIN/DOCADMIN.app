<?php

global $app_desc, $action_desc, $app_acl;

$app_desc = array(
    "name" => "DOCADMIN",
    "short_name" => N_("docadmin:manage documents"),
    "description" => N_("docadmin:ihm to access and manage documents"),
    "access_free" => "N",
    "icon" => "docadmin.png",
    "displayable" => "Y",
    "iorder" => 10,
    "tag" => "ADMIN",
    "with_frame" => "Y"
);

$app_acl = array(
    array(
        "name"          => "DOCADMIN",
        "description"   => N_("docadmin:DOCADMIN Access"),
        "admin"         => true
    )
);

$action_desc = array(
    array(
        "name"       => "ADMIN_ACTIONS_LIST",
        "short_name" => N_("docadmin:ADMIN_ACTIONS_LIST short_name"),
    ),
    array(
        "name"       => "DOCS_ADMIN",
        "acl"        => "DOCADMIN",
        "short_name" => N_("docadmin:Documents management"),
        "script"     => "docs_admin.php",
        "function"   => "docs_admin",
        "layout"     => "docs_admin.html",
        "root"       => "Y"
    ),
    array(
        "name"       => "TIMERS_ADMIN",
        "acl" => "DOCADMIN",
        "short_name" => N_("docadmin:Timers management"),
        "script"     => "timers_admin.php",
        "function"   => "timers_admin",
        "layout"     => "timers_admin.xml"
    )
);

?>
