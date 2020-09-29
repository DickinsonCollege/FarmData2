<?php
/**
 * @file
 * farm_material.features.inc
 */

/**
 * Implements hook_ctools_plugin_api().
 */
function farm_material_ctools_plugin_api($module = NULL, $api = NULL) {
  if ($module == "field_group" && $api == "field_group") {
    return array("version" => "1");
  }
}

/**
 * Implements hook_views_api().
 */
function farm_material_views_api($module = NULL, $api = NULL) {
  return array("api" => "3.0");
}

/**
 * Implements hook_default_farm_asset_type().
 */
function farm_material_default_farm_asset_type() {
  $items = array();
  $items['material'] = entity_import('farm_asset_type', '{
    "type" : "material",
    "label" : "Material",
    "weight" : 0,
    "inventory" : { "enabled" : "1", "individual" : "0" },
    "rdf_mapping" : []
  }');
  return $items;
}
