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
        "name"       => "DOCADMIN",
        "acl"        => "DOCADMIN",
        "short_name" => N_("docadmin:main ihm"),
        "script"     => "docadmin.php",
        "function"   => "docadmin",
        "layout"     => "docadmin.html",
        "root"       => "Y"
    )
);

?>
