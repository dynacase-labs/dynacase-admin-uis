<?php
/*
 * @author Anakeen
 * @license http://www.fsf.org/licensing/licenses/agpl-3.0.html GNU Affero General Public License
 * @package FDL
*/
/**
 * Generated Header (not documented yet)
 *
 * @author Anakeen
 * @version $Id: param_ulist.php,v 1.2 2003/08/18 15:46:41 eric Exp $
 * @license http://www.fsf.org/licensing/licenses/agpl-3.0.html GNU Affero General Public License
 * @package FDL
 * @subpackage APPMNG
 */
/**
 */
//  -----------------------------------
function param_ulist(Action & $action)
{
    
    $jslinks = array(
        array(
            "src" => $action->parent->getJsLink("lib/jquery/jquery.js")
        ) ,
        array(
            "src" => $action->parent->getJsLink("lib/jquery-ui/js/jquery-ui.js")
        ) ,
        array(
            "src" => $action->parent->getJsLink("lib/jquery-dataTables/js/jquery.dataTables.js")
        ) ,
        array(
            "src" => $action->parent->getJsLink($action->GetParam("CORE_JSURL") . "/subwindow.js")
        ) ,
        array(
            "src" => $action->parent->getJsLink($action->GetParam("CORE_JSURL") . "/logmsg.js")
        ) ,
        array(
            "src" => $action->parent->getJsLink($action->GetParam("CORE_JSURL") . "/AnchorPosition.js")
        ) ,
        array(
            "src" => $action->parent->getJsLink($action->GetParam("CORE_JSURL") . "/PopupWindow.js")
        ) ,
        array(
            "src" => $action->parent->getJsLink($action->GetParam("CORE_JSURL") . "/ColorPicker2.js")
        ) ,
        array(
            "src" => $action->parent->getJsLink($action->GetParam("CORE_JSURL") . "/OptionPicker.js")
        ) ,
        array(
            "src" => $action->parent->getJsLink("APPMNG:appmng.js", true)
        ) ,
        array(
            "src" => $action->parent->getJsLink("APPMNG:param_list.js", true)
        )
    );
    
    $action->parent->AddCssRef("css/dcp/jquery-ui.css");
    $action->parent->AddCssRef("lib/jquery-dataTables/css/jquery.dataTables.css");
    $action->parent->AddCssRef("APPMNG:param_ulist.css", true);
    $action->parent->AddCssRef("APPMNG:appmng.css", true);
    $action->parent->AddCssRef("WHAT/Layout/size-normal.css");
    
    $action->lay->setBlockData("JS_LINKS", $jslinks);
    
    return;
}
/**
 * Get user list
 *
 * @param Action $action
 */
function appmngGetUsers(Action & $action)
{
    $usage = new ActionUsage($action);
    
    $filterName = $usage->addOptionalParameter("filterName", "filterName");
    
    $usage->verify(true);
    
    $data = array();
    
    $search = new SearchDoc("", "IUSER");
    $search->setObjectReturn(true);
    $search->addFilter("title ~* '%s' or us_login ~* '%s'", $filterName, $filterName);
    $search->setSlice(25);
    
    foreach ($search->getDocumentList() as $currentUser) {
        /* @var $currentUser Doc */
        $data[] = array(
            "label" => trim(sprintf("%s (%s)", $currentUser->getTitle() , $currentUser->getRawValue("us_login"))) ,
            "value" => $currentUser->getRawValue("us_whatid")
        );
    }
    if ((count($data) == 0) && ($filterName != '')) {
        $data[] = array(
            "label" => sprintf(_("no account match '%s'") , $filterName) ,
            "value" => 0
        );
    }
    
    $action->lay->template = json_encode($data);
    $action->lay->noparse = true;
    
    header('Content-type: application/json');
}
?>
