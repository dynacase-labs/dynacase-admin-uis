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
 * @version $Id: app_update.php,v 1.2 2003/08/18 15:46:41 eric Exp $
 * @license http://www.fsf.org/licensing/licenses/agpl-3.0.html GNU Affero General Public License
 * @package FDL
 * @subpackage APPMNG
 */
/**
 */
// -----------------------------------
function app_update(Action & $action)
{
    // -----------------------------------
    $appsel = $action->getArgument("appsel");
    $application = new Application("", $appsel);
    $action->log->info("Update " . $application->name);
    $application->Set($application->name, $action->parent);
    $application->UpdateApp();
    
    $action->lay->template = json_encode(array(
        "success" => true
    ));
    $action->lay->noparse = true;
    
    header('Content-type: application/json');
}
// -----------------------------------
function app_updateAll(&$action)
{
    // -----------------------------------
    $application = new Application();
    $application->UpdateAllApp();
    
    $action->lay->template = json_encode(array(
        "success" => true
    ));
    $action->lay->noparse = true;
    
    header('Content-type: application/json');
}
?>
