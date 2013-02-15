<?php
/*
 * @author Anakeen
 * @license http://www.fsf.org/licensing/licenses/agpl-3.0.html GNU Affero General Public License
 * @package FDL
*/
/**
 * Display parameters
 *
 * @author Anakeen
 * @version $Id: param_list.php,v 1.10 2005/06/16 12:23:07 eric Exp $
 * @license http://www.fsf.org/licensing/licenses/agpl-3.0.html GNU Affero General Public License
 * @package FDL
 * @subpackage APPMNG
 */
/**
 */
// -----------------------------------
function param_list(Action & $action)
{
    // -----------------------------------
    // Get Param
    $userid = $action->getArgument("userid");
    $pview = $action->getArgument("pview"); // set to "all" or "single" if user parameters
    // can chg action because of acl USER/ADMIN
    $action->lay->Set("ACTIONDEL", "PARAM_DELETE");
    $action->lay->Set("ACTIONMOD", "PARAM_MOD");
    
    $action->lay->set("userid", $userid);
    $action->lay->set("pview", $pview);
}

function appmngGetParamListDatatableInfo(Action & $action)
{
    $withStatic = false;
    $sEcho = intval($action->getArgument('sEcho'));
    $out = array(
        "sEcho" => $sEcho
    );
    $filter = 0;
    
    $userid = $action->getArgument("userid");
    $pview = $action->getArgument("pview"); // set to "all" or "single" if user parameters
    $type = $action->getArgument("type");
    $tparam = array();
    $userParams = array();
    $paramType = "";
    
    $type = ($type == "system") ? "~" : "!~";
    $filterQuery = "";
    for ($index = 0; $index < $action->getArgument('iColumns'); $index++) {
        $search = $action->getArgument('sSearch_' . $index);
        if ($search) {
            $field = $action->getArgument('mDataProp_' . $index);
            if ($field == "appname") {
                $filterQuery.= sprintf(" and application.name ~* '%s'", pg_escape_string($search));
            } else if ($field == "name") {
                $filterQuery.= sprintf(" and paramv.name ~* '%s'", pg_escape_string($search));
            }
        }
        $filter++;
    }
    $withStatic = $withStatic ? "" : "and kind!='static' and kind!='readonly'";
    
    if ($pview == "alluser") {
        if ($userid != "") simpleQuery($action->dbaccess, sprintf("select paramv.*, paramdef.descr, paramdef.kind, application.name as appname from paramv,paramdef,application where paramv.name = paramdef.name and paramv.name != 'APPNAME' and paramv.name != 'INIT' and paramv.name!= 'VERSION' and paramdef.isuser='Y' and type='%s' %s and application.id=paramv.appid and application.tag%sE'\\\\ySYSTEM\\\\y' %s order by application.name, paramv.name, paramv.type desc", PARAM_USER . $userid, $withStatic, $type, $filterQuery) , $userParams);
        $paramType.= "and paramdef.isuser='Y'";
    }
    
    if ($pview != "alluser" || $userid) {
        /**
         * Getting all parameters
         */
        simpleQuery($action->dbaccess, sprintf("SELECT paramv.*, paramdef.descr, paramdef.kind, application.name as appname from paramv,paramdef,application where paramv.name = paramdef.name and paramv.name != 'APPNAME' and paramv.name != 'INIT' and paramv.name!= 'VERSION' and  ((type = '%s') OR (type='%s')) %s and application.id=paramv.appid and application.tag%sE'\\\\ySYSTEM\\\\y' %s %s order by application.name, paramv.name, paramv.type desc", PARAM_GLB, PARAM_APP, $withStatic, $type, $filterQuery, $paramType) , $tparam);
    }
    
    $vsection = "appid";
    
    $precApp = 0;
    $data = array();
    $appName = "";
    foreach ($tparam as $v) {
        if (isset($v[$vsection])) {
            $tincparam = array();
            if ($v[$vsection] != $precApp) {
                $precApp = $v[$vsection];
                $appinc = array(
                    "name" => "",
                    "val" => ""
                );
                
                $app1 = new Application($action->dbaccess, $precApp);
                $appinc["appname"] = $app1->name;
                $appinc["appicon"] = $action->parent->getImageLink($app1->icon, true, 25);
                $appinc["descr"] = $action->text($app1->short_name);
                $appinc["DT_RowClass"] = "ui-widget-header";
                $appinc["DT_RowId"] = $app1->name;
                $data[] = $appinc;
                $appName = $app1->name;
            }
            if ($pview == "alluser" && !empty($userParams)) {
                foreach ($userParams as $uparams) {
                    if ($uparams["name"] === $v["name"]) {
                        $tincparam = $uparams;
                        break;
                    }
                }
            }
            if (empty($tincparam)) {
                $tincparam = $v;
            }
            // to show difference between global, user and application parameters
            if ($tincparam["type"][0] == PARAM_APP) $tincparam["classtype"] = "aparam";
            else if ($tincparam["type"][0] == PARAM_USER) $tincparam["classtype"] = "uparam";
            else $tincparam["classtype"] = "gparam";
            if ($tincparam["kind"] == "password") {
                if ($tincparam["val"] != "") $tincparam["val"] = "*****";
            }
            $tincparam["sval"] = str_replace(array(
                '"'
            ) , array(
                "&quot;"
            ) , $tincparam["val"]);
            
            $tincparam["colorstatic"] = ($tincparam["kind"] == "static" || $tincparam["kind"] == "readonly") ? "#666666" : "";
            // force type user if user mode
            if ($userid > 0) $tincparam["type"] = PARAM_USER . $userid;
            
            if ($tincparam["descr"] == "") $tincparam["descr"] = $tincparam["name"];
            else $tincparam["descr"] = _($tincparam["descr"]);
            $tincparam["tooltip"] = $tincparam["name"] . " : " . $tincparam["descr"];
            $tincparam["appname"] = $appName;
            $tincparam["DT_RowId"] = $tincparam["name"];
            $data[] = $tincparam;
        }
    }
    $out["aaData"] = $data;
    $out["iTotalRecords"] = count($data);
    $out["iTotalDisplayRecords"] = $out["iTotalRecords"];
    $action->lay->template = json_encode($out);
    $action->lay->noparse = true;
    
    header('Content-type: application/json');
}

function cmpappid($a, $b)
{
    if ($a["appid"] == $b["appid"]) return 0;
    if ($a["appid"] > $b["appid"]) return 1;
    return -1;
}

function cmpappname($a, $b)
{
    if ($a["appname"] == $b["appname"]) return 0;
    if ($a["appname"] > $b["appname"]) return 1;
    return -1;
}
?>
