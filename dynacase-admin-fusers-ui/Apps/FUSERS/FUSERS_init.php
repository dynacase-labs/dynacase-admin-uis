<?php
/*
 * @author Anakeen
 * @license http://www.fsf.org/licensing/licenses/agpl-3.0.html GNU Affero General Public License
 * @package FDL
*/
/**
 * @author Anakeen
 * @license http://www.fsf.org/licensing/licenses/agpl-3.0.html GNU Affero General Public License
 */
// ---------------------------------------------------------------
// $Id: FUSERS_init.php,v 1.2 2005/10/27 14:38:15 eric Exp $
// $Source: /home/cvsroot/anakeen/freedom/freedom/App/Fusers/FUSERS_init.php,v $
// ---------------------------------------------------------------
global $app_const;

$app_const = array(
    "INIT" => "yes",
    "VERSION" => "3.2.5-0",
    
    "FUSERS_MAINLINE" => array(
        "kind" => "static",
        "val" => "25",
        "descr" => N_("main view line displayed") ,
        "user" => "Y"
    ) ,
    "FUSERS_MAINCOLS" => array(
        "kind" => "static",
        "val" => "",
        "descr" => N_("main view columns") ,
        "user" => "Y"
    )
);
?>
