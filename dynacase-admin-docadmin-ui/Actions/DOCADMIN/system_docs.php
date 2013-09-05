<?php
/*
 * @author Anakeen
 * @license http://www.fsf.org/licensing/licenses/agpl-3.0.html GNU Affero General Public License
 * @package FDL
*/
/**
 * Timer management
 *
 * @author Anakeen
 * @version $Id: admin_timers.php,v 1.2 2009/01/02 17:43:50 eric Exp $
 * @license http://www.fsf.org/licensing/licenses/agpl-3.0.html GNU Affero General Public License
 * @package FDL
 * @subpackage
 */
/**
 */

include_once ("FDL/Class.Doc.php");
include_once ("FDL/Class.DocTimer.php");
/**
 * Timers management
 * @param Action &$action current action
 */
function system_docs(&$action)
{
    $action->parent->addJsRef("lib/jquery/jquery.js");
    $action->parent->addJsRef("lib/jquery-ui/js/jquery-ui.js");
    $action->parent->addJsRef("lib/jquery-dataTables/js/jquery.dataTables.js");
    $action->parent->addJsRef("lib/tipsy/src/javascripts/jquery.tipsy.js");
    $action->parent->addJsRef("DOCADMIN/Layout/system_docs.js");
    
    $action->parent->AddCssRef("css/dcp/jquery-ui.css");
    $action->parent->AddCssRef("lib/jquery-dataTables/css/jquery.dataTables.css");
    // $action->parent->AddCssRef("APPMNG:param_list.css", true);
    // $action->parent->AddCssRef("APPMNG:appmng.css", true);
    $action->parent->AddCssRef("WHAT/Layout/size-normal.css");
    $action->parent->addCssRef("lib/tipsy/src/stylesheets/tipsy.css");
    $searchList = array();
    $s = new SearchDoc();
    $s->useCollection("DOCADMIN_SYSSEARCHES");
    $s->setObjectReturn();
    $s->setOrder("initid");
    $dl = $s->search()->getDocumentList();
    /**
     * @var DocCollection $search
     */
    foreach ($dl as $search) {
        $searchList[] = array(
            "searchTitle" => $search->getHtmlTitle() ,
            "searchId" => $search->initid,
            "searchIcon" => $search->getIcon('', 25)
        );
    }
    $action->lay->setBlockData("systemSearch", $searchList);
    // show only basic system families
    $s = new SearchDoc($action->dbaccess, -1);
    $s->setObjectReturn();
    $s->addFilter("usefor ~ 'S'");
    $s->addFilter("usefor !~ 'W'");
    $s->addFilter("usefor !~ 'P'");
    $s->addFilter("fromid = 0 or fromid = 1 or fromid = 2");
    
    $dl = $s->search()->getDocumentList();
    $famList = $searchFamList= array();
    /**
     * @var DocFam $fam
     */
    foreach ($dl as $fam) {
        $famList[] = array(
            "familyTitle" => $fam->getHtmlTitle() ,
            "familyId" => $fam->initid,
            "familyIcon" => $fam->getIcon('', 25)
        );


    }
    $action->lay->setBlockData("FAMLIST", $famList);

    $searchFam=new_doc($action->dbaccess, 5);
    $searchFamList[] = array(
            "familyTitle" => $searchFam->getHtmlTitle() ,
            "familyId" => $searchFam->initid,
            "familyIcon" => $searchFam->getIcon('', 25)
        );
    $childFam=($searchFam->getChildFam());
    foreach ($childFam as $rawFam) {
         $searchFamList[] = array(
            "familyTitle" => $searchFam->getHtmlTitle($rawFam["initid"]) ,
            "familyId" => $rawFam["initid"],
            "familyIcon" => $searchFam->getIcon($rawFam["icon"], 25)
        );
    }

    $action->lay->setBlockData("SEARCHFAMLIST", $searchFamList);
}
?>