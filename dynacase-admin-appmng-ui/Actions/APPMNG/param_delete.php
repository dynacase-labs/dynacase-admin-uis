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
 * @version $Id: param_delete.php,v 1.7 2006/06/22 16:19:07 eric Exp $
 * @license http://www.fsf.org/licensing/licenses/agpl-3.0.html GNU Affero General Public License
 * @package FDL
 * @subpackage APPMNG
 */
/**
 */
// -----------------------------------
function param_delete(Action & $action)
{
    // -----------------------------------
    $name = $action->getArgument("id");
    $appid = $action->getArgument("appid");
    $atype = $action->getArgument("atype", PARAM_APP);
    
    $parametre = new Param($action->dbaccess, array(
        $name,
        $atype,
        $appid
    ));
    if ($parametre->isAffected()) {
        $action->log->info(_("Remove parameter") . $parametre->name);
        $err = $parametre->Delete();
    } else {
        $err = sprintf(_("the '%s' parameter cannot be removed") , $name);
        $action->addLogMsg($err);
    }
    // reopen a new session to update parameters cache
    if ($atype[0] == PARAM_USER) {
        $action->parent->session->close();
    } else {
        $action->parent->session->closeAll();
    }
    
    $action->lay->template = json_encode(array(
        "success" => $err ? false : true,
        "error" => $err
    ));
    $action->lay->noparse = true;
    
    header('Content-type: application/json');
}
?>
